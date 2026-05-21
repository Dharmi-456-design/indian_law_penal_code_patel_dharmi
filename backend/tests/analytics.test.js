const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User.models');
const Section = require('../src/models/Section.models');
const SearchLog = require('../src/models/SearchLog.models');
const { generateTokens } = require('../src/services/auth.service');

let adminToken;
let userToken;
let adminId;

beforeAll(async () => {
    // 0. Clear existing test data
    await User.deleteMany({});
    await Section.deleteMany({});
    await SearchLog.deleteMany({});

    // 1. Create a test admin
    const admin = await User.create({
        name: 'Test Admin',
        email: 'admin@lexindia.com',
        password: 'AdminPassword123!',
        role: 'admin'
    });
    adminId = admin._id;
    const adminTokens = generateTokens(admin);
    adminToken = adminTokens.accessToken;

    // 2. Create a test regular user
    const user = await User.create({
        name: 'Test User',
        email: 'user@lexindia.com',
        password: 'UserPassword123!',
        role: 'user'
    });
    const userTokens = generateTokens(user);
    userToken = userTokens.accessToken;

    // 3. Seed some dummy sections for analytics
    await Section.create([
        {
            actCode: 'IPC',
            actName: 'Indian Penal Code',
            sectionNumber: '302',
            sectionTitle: 'Punishment for murder',
            sectionDesc: 'Whoever commits murder shall be punished with death...',
            viewCount: 150
        },
        {
            actCode: 'IPC',
            actName: 'Indian Penal Code',
            sectionNumber: '378',
            sectionTitle: 'Theft',
            sectionDesc: 'Whoever, intending to take dishonestly any movable property...',
            viewCount: 80
        },
        {
            actCode: 'IEA',
            actName: 'Indian Evidence Act',
            sectionNumber: '3',
            sectionTitle: 'Interpretation clause',
            sectionDesc: 'In this Act the following words and expressions...',
            viewCount: 45
        }
    ]);

    // 4. Seed search logs
    await SearchLog.create([
        { query: 'murder', resultsCount: 1, userId: adminId },
        { query: 'theft', resultsCount: 1, userId: adminId },
        { query: 'murder', resultsCount: 1, userId: null }
    ]);
});

afterAll(async () => {
    await User.deleteMany({});
    await Section.deleteMany({});
    await SearchLog.deleteMany({});
    await mongoose.connection.close();
});

describe('Admin Analytics API', () => {
    
    // RBAC Security tests
    describe('RBAC Authorization', () => {
        it('should forbid regular users from accessing overview stats', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/overview')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.body.success).toBe(false);
        });

        it('should forbid unauthenticated requests', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/overview');

            expect(res.statusCode).toEqual(401);
        });
    });

    // Endpoint tests for Admin Role
    describe('GET /api/v1/analytics/overview', () => {
        it('should fetch general database counts', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/overview')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('totalUsers');
            expect(res.body.data).toHaveProperty('totalSections');
            expect(res.body.data.totalUsers).toBe(2);
            expect(res.body.data.totalSections).toBe(3);
        });
    });

    describe('GET /api/v1/analytics/acts', () => {
        it('should fetch act-level distribution data', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/acts')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(2); // IPC and IEA
            expect(res.body.data[0]._id).toBe('IPC');
            expect(res.body.data[0].count).toBe(2);
        });
    });

    describe('GET /api/v1/analytics/top-viewed', () => {
        it('should fetch sections sorted by viewCount', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/top-viewed?limit=2')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(2);
            expect(res.body.data[0].sectionNumber).toBe('302');
            expect(res.body.data[0].viewCount).toBe(150);
            expect(res.body.data[1].sectionNumber).toBe('378');
        });
    });

    describe('GET /api/v1/analytics/top-queries', () => {
        it('should fetch grouped search terms with frequency counts', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/top-queries?limit=5')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(2);
            expect(res.body.data[0].query).toBe('murder');
            expect(res.body.data[0].count).toBe(2);
            expect(res.body.data[1].query).toBe('theft');
            expect(res.body.data[1].count).toBe(1);
        });
    });

    describe('GET /api/v1/analytics/search-trends', () => {
        it('should fetch daily search volumes', async () => {
            const res = await request(app)
                .get('/api/v1/analytics/search-trends?days=2')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0]).toHaveProperty('date');
            expect(res.body.data[0]).toHaveProperty('count');
            expect(res.body.data[0].count).toBe(3);
        });
    });
});
