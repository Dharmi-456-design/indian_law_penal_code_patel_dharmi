const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const seedActs = require('./seedActs');
const seedLaws = require('./seedLaws');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const runSeeder = async () => {
    try {
        console.log('--- Database Seeding Started ---');
        
        // Connect to Database
        await connectDB();
        console.log('Connected to MongoDB.');

        // Step 1: Seed Acts Metadata
        await seedActs();

        // Step 2: Seed Sections/Laws
        await seedLaws();

        console.log('--- Database Seeding Completed Successfully ---');
        process.exit(0);
    } catch (error) {
        console.error('--- Database Seeding Failed ---');
        console.error(error);
        process.exit(1);
    }
};

runSeeder();
