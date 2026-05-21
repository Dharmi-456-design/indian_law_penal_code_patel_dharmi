const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User.models');
const Act = require('../src/models/Act.models');
const Section = require('../src/models/Section.models');
const { generateTokens } = require('../src/services/auth.service');

let userToken;

beforeAll(async () => {
    await User.deleteMany({});
    await Act.deleteMany({});
    await Section.deleteMany({});

    // 1. Create a test user
    const user = await User.create({
        name: 'Test User',
        email: 'user@lexindia.com',
        password: 'UserPassword123!',
        role: 'user'
    });
    userToken = generateTokens(user).accessToken;

    // 2. Seed Act metadata
    await Act.create([
        {
            actCode: 'IPC',
            actName: 'Indian Penal Code',
            actYear: 1860,
            actNo: '45 of 1860',
            totalSections: 511,
            description: 'The premier penal code of India.'
        },
        {
            actCode: 'IEA',
            actName: 'Indian Evidence Act',
            actYear: 1872,
            actNo: '1 of 1872',
            totalSections: 167,
            description: 'Evidence rules.'
        }
    ]);

    // 3. Seed some sections for chapters/stats tests
    await Section.create([
        {
            actCode: 'IPC',
            actName: 'Indian Penal Code',
            sectionNumber: '302',
            sectionTitle: 'Murder',
            sectionDesc: 'Whoever commits murder...',
            chapter: 16,
            chapterTitle: 'Of Offences Affecting The Human Body'
        },
        {
            actCode: 'IPC',
            actName: 'Indian Penal Code',
            sectionNumber: '378',
            sectionTitle: 'Theft',
            sectionDesc: 'Whoever, intending to take...',
            chapter: 17,
            chapterTitle: 'Of Offences Against Property'
        }
    ]);
});

afterAll(async () => {
    await User.deleteMany({});
    await Act.deleteMany({});
    await Section.deleteMany({});
    await mongoose.connection.close();
});

describe('Acts API', () => {
    describe('GET /api/v1/acts', () => {
        it('should retrieve all acts', async () => {
            const res = await request(app)
                .get('/api/v1/acts')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(2);
        });
    });

    describe('GET /api/v1/acts/:actCode', () => {
        it('should retrieve metadata for a single act', async () => {
            const res = await request(app)
                .get('/api/v1/acts/IPC')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.actName).toBe('Indian Penal Code');
        });

        it('should return 404 for a non-existent act', async () => {
            const res = await request(app)
                .get('/api/v1/acts/NONEXIST')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('GET /api/v1/acts/:actCode/sections', () => {
        it('should retrieve sections for a specific act', async () => {
            const res = await request(app)
                .get('/api/v1/acts/IPC/sections')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/v1/acts/:actCode/chapters', () => {
        it('should retrieve chapter-level summary for an act', async () => {
            const res = await request(app)
                .get('/api/v1/acts/IPC/chapters')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('GET /api/v1/acts/:actCode/stats', () => {
        it('should retrieve statistics for an act', async () => {
            const res = await request(app)
                .get('/api/v1/acts/IPC/stats')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('totalSections');
            expect(res.body.data).toHaveProperty('totalChapters');
        });
    });
});
