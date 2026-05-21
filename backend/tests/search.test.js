const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User.models');
const Section = require('../src/models/Section.models');
const SearchLog = require('../src/models/SearchLog.models');
const { generateTokens } = require('../src/services/auth.service');

let userToken;
let userId;

beforeAll(async () => {
    await User.deleteMany({});
    await Section.deleteMany({});
    await SearchLog.deleteMany({});

    // 1. Create a test user
    const user = await User.create({
        name: 'Test User',
        email: 'user@lexindia.com',
        password: 'UserPassword123!',
        role: 'user'
    });
    userId = user._id;
    userToken = generateTokens(user).accessToken;

    // 2. Seed some dummy sections with text index
    await Section.create([
        {
            actCode: 'IPC',
            actName: 'Indian Penal Code',
            sectionNumber: '378',
            sectionTitle: 'Theft',
            sectionDesc: 'Whoever, intending to take dishonestly any movable property...'
        },
        {
            actCode: 'IPC',
            actName: 'Indian Penal Code',
            sectionNumber: '379',
            sectionTitle: 'Punishment for theft',
            sectionDesc: 'Whoever commits theft shall be punished with imprisonment...'
        },
        {
            actCode: 'IEA',
            actName: 'Indian Evidence Act',
            sectionNumber: '3',
            sectionTitle: 'Interpretation clause',
            sectionDesc: 'In this Act the following words and expressions are used in the following senses...'
        }
    ]);
    
    // Ensure index is created
    await Section.syncIndexes();
});

afterAll(async () => {
    await User.deleteMany({});
    await Section.deleteMany({});
    await SearchLog.deleteMany({});
    await mongoose.connection.close();
});

describe('Search API', () => {
    describe('GET /api/v1/search/global', () => {
        it('should perform global search across all acts', async () => {
            const res = await request(app)
                .get('/api/v1/search/global?q=theft')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('should perform global search even without authentication (optional auth)', async () => {
            const res = await request(app)
                .get('/api/v1/search/global?q=evidence');

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should reject global search with empty query', async () => {
            const res = await request(app)
                .get('/api/v1/search/global?q=')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(400);
        });
    });

    describe('GET /api/v1/sections/search', () => {
        it('should search within a specific act', async () => {
            const res = await request(app)
                .get('/api/v1/sections/search?q=theft&actCode=IPC')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });
});
