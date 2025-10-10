'use server'

import dbConnect from '@/lib/mongodbConnect'
import User from '@/models/User'

export async function dbConnectTest() {
  try {
    await dbConnect()

    const users = await User.find().limit(3)
    const serializedUsers = users.map(user => user.toJSON())

    return {
      success: true,
      users: serializedUsers,
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      error: 'Failed to connect to database',
    }
  }
}
