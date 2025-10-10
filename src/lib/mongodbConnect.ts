import mongoose from 'mongoose'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// 전역 캐싱 (싱글톤 패턴)

// Next.js의 개발 모드에서 발생하는 잦은 리로드에도 연결이 계속 유지
// 일반 변수는 코드가 다시 로드될 때마다 초기화되지만, global 객체는 Node.js 프로세스가 유지되는 동안 지속되기 때문
// 따라서 연결 정보를 global.mongoose에 저장함으로써, 코드가 여러 번 다시 로드되어도 연결 정보가 유지됨.
// 정리) global 객체 사용해서 캐싱 -> 애플리케이션 전체에 연결 정보 한 번만 생성하고 캐싱하여서 앱 전체에서 공유해서 사용.
// => Next.js의 개발 모드에서 발생하는 잦은 리로드(Hot Reload)에도 연결이 계속 유지

/* eslint-disable no-var */
declare global {
  var mongoose: MongooseCache | undefined
}

const cached: MongooseCache = globalThis.mongoose || { conn: null, promise: null }

if (!globalThis.mongoose) {
  globalThis.mongoose = cached
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
  }

  if (cached.conn) {
    return cached.conn
  }

  // Promise 캐싱
  // 연결 중인 Promise도 캐싱하여 여러 요청이 동시에 들어와도 하나의 연결 시도만 발생합니다.

  // cached.promise가 없을 때만 새로운 연결 시도를 합니다.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    // 이 Promise를 cached.promise에 저장합니다.

    // MongoDB의 mongoose.connect() 함수
    // 내부적으로 연결 상태를 관리하고 있어서, 이미 연결되어 있는 경우에는 새로운 연결을 만들지 않고 기존 연결을 재사용.
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose
    })
  }

  // 일반적인 경우에는 추가 옵션 없이도 Mongoose의 기본 설정이 대부분의 애플리케이션에 충분합니다. 하지만 애플리케이션의 요구사항에 따라 연결 풀 설정을 조정하는 것이 유용할 수 있습니다.
  // 다음과 같은 상황에서 풀 옵션을 조정하는 것이 좋습니다:

  // 리소스가 제한된 환경(예: 작은 서버나 서버리스 환경)에서 실행 중이라면 maxPoolSize를 낮추는 것이 도움될 수 있습니다.
  // 트래픽이 매우 많거나 데이터베이스 작업이 빈번한 경우 minPoolSize를 설정하여 최소한의 연결을 항상 유지하는 것이 응답 시간을 개선할 수 있습니다.
  // 간헐적인 부하가 있는 애플리케이션에서는 maxIdleTimeMS를 조정하여 사용되지 않는 연결이 적절히 정리되도록 할 수 있습니다.
  // if (!cached.promise) {
  //   const opts = {
  //     bufferCommands: false,
  //     maxPoolSize: 10,    // 기본값은 100
  //     minPoolSize: 5,     // 최소 연결 수 유지
  //     maxIdleTimeMS: 30000 // 사용되지 않는 연결을 닫기 전 대기 시간
  //   };

  //   cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
  //     return mongoose;
  //   });
  // }

  try {
    // await cached.promise로 연결이 완료될 때까지 기다립니다.
    cached.conn = await cached.promise
  } catch (e) {
    // 연결 실패 시 promise 상태를 초기화하여 다음 시도가 가능하게 합니다.
    cached.promise = null
    throw e
  }

  // 만약 여러 요청이 동시에 들어온다면:
  // 첫 번째 요청이 cached.promise를 설정합니다.
  // 두 번째 이후의 요청들은 cached.promise가 이미 존재하므로 새 연결을 시도하지 않고, 동일한 Promise를 기다립니다.
  // 모든 요청은 같은 Promise를 공유하므로, 실제로는 단 하나의 DB 연결만 시도됩니다.
  // 이런 방식으로 동시에 여러 요청이 들어와도 MongoDB에 대한 연결 시도는 한 번만 발생하게 됩니다.

  return cached.conn
}

export default dbConnect
