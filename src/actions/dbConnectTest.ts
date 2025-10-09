"use server";

import dbConnect from "@/lib/mongodbConnect";
import User from "@/models/User";

export async function dbConnectTest() {
  try {
    await dbConnect();

    const users = await User.find().limit(3).lean();

    // Convert MongoDB ObjectIds to strings for client serialization
    const plainUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      // Don't send password to client!
      // password: user.password,
    }));

    console.log("Users", plainUsers);

    return {
      success: true,
      users: plainUsers,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to connect to database",
    };
  }
}
