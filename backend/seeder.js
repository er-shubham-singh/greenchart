// seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './src/models/User.js';  

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456',  
    role: 'admin',
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'manager123',
    role: 'manager',
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');

    await User.deleteMany({});
    console.log('Existing users deleted');

    for (const userData of users) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);

      const user = new User({
        name: userData.name,
        email: userData.email,
        passwordHash,  // hashed password
        role: userData.role,
      });

      await user.save();
      console.log(`User ${user.email} created`);
    }

    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
