const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const seedActs = require('./seedActs');
const seedLaws = require('./seedLaws');
const User = require('../models/User.models');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedAdmin = async () => {
    try {
        console.log('Seeding Default Admin User...');
        const adminEmail = 'admin@lexindia.com';
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`Admin user with email ${adminEmail} already exists.`);
            return;
        }

        const adminUser = new User({
            name: 'LexIndia Admin',
            email: adminEmail,
            password: 'AdminPassword123!',
            role: 'admin',
            isActive: true
        });

        await adminUser.save();
        console.log(`Default admin user created successfully:`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: AdminPassword123!`);
    } catch (error) {
        console.error('Error seeding default admin user:', error);
        throw error;
    }
};

const runSeeder = async () => {
    try {
        console.log('--- Database Seeding Started ---');
        
        // Connect to Database
        await connectDB();
        console.log('Connected to MongoDB.');

        const args = process.argv.slice(2);
        const isAdminCreate = args.includes('admin') && args.includes('--create');

        if (isAdminCreate) {
            await seedAdmin();
        } else {
            // Step 1: Seed Acts Metadata
            await seedActs();

            // Step 2: Seed Sections/Laws
            await seedLaws();

            // Step 3: Seed Default Admin User as well (automatic)
            await seedAdmin();
        }

        console.log('--- Database Seeding Completed Successfully ---');
        process.exit(0);
    } catch (error) {
        console.error('--- Database Seeding Failed ---');
        console.error(error);
        process.exit(1);
    }
};

runSeeder();

