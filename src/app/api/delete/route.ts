import { NextRequest, NextResponse } from 'next/server'
import { deleteObject } from '@/lib/s3'

export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json({ error: '삭제할 파일의 키가 필요합니다.' }, { status: 400 })
    }

    // S3에서 파일 삭제
    await deleteObject('parts-kit', key)

    return NextResponse.json({
      success: true,
      message: '파일이 성공적으로 삭제되었습니다.',
    })
  } catch (error) {
    console.error('파일 삭제 오류:', error)
    return NextResponse.json({ error: '파일 삭제에 실패했습니다.' }, { status: 500 })
  }
}
