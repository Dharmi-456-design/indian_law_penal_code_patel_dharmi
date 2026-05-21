const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User.models');
const Section = require('../src/models/Section.models');
const { generateTokens } = require('../src/services/auth.service');

let adminToken;
let userToken;
let sectionId;
let archivedSectionId;

beforeAll(async () => {
    await User.deleteMany({});
    await Section.deleteMany({});

    // 1. Create a test admin
    const admin = await User.create({
        name: 'Test Admin',
        email: 'admin@lexindia.com',
        password: 'AdminPassword123!',
        role: 'admin'
    });
    adminToken = generateTokens(admin).accessToken;

    // 2. Create a test regular user
    const user = await User.create({
        name: 'Test User',
        email: 'user@lexindia.com',
        password: 'UserPassword123!',
        role: 'user'
    });
    userToken = generateTokens(user).accessToken;

    // 3. Seed some dummy sections
    const section1 = await Section.create({
        actCode: 'IPC',
        actName: 'Indian Penal Code',
        sectionNumber: '300',
        sectionTitle: 'Murder',
        sectionDesc: 'Except in the cases hereinafter excepted, culpable homicide is murder...',
        viewCount: 10
    });
    sectionId = section1._id;

    const section2 = await Section.create({
        actCode: 'IPC',
        actName: 'Indian Penal Code',
        sectionNumber: '301',
        sectionTitle: 'Culpable homicide by causing death of person other than person whose death was intended',
        sectionDesc: 'If a person, by doing anything which he intends or knows to be likely to cause death...',
        viewCount: 5,
        isArchived: true
    });
    archivedSectionId = section2._id;

    await Section.create({
        actCode: 'IEA',
        actName: 'Indian Evidence Act',
        sectionNumber: '5',
        sectionTitle: 'Evidence may be given of facts in issue and relevant facts',
        sectionDesc: 'Evidence may be given in any suit or proceeding of the existence or non-existence of every fact in issue...'
    });
});

afterAll(async () => {
    await User.deleteMany({});
    await Section.deleteMany({});
    await mongoose.connection.close();
});

describe('Sections API', () => {
    describe('GET /api/v1/sections', () => {
        it('should fetch all sections with pagination and filters', async () => {
            const res = await request(app)
                .get('/api/v1/sections?actCode=IPC&limit=10')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.meta.total).toBe(1); // because IPC section2 is archived
        });
    });

    describe('GET /api/v1/sections/:id', () => {
        it('should fetch a single section and increment viewCount', async () => {
            const res = await request(app)
                .get(`/api/v1/sections/${sectionId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.sectionNumber).toBe('300');
            expect(res.body.data.viewCount).toBe(11);
        });

        it('should return 404 for non-existent section', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/v1/sections/${fakeId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('GET /api/v1/sections/:id/exists', () => {
        it('should return true if section exists', async () => {
            const res = await request(app)
                .get(`/api/v1/sections/${sectionId}/exists`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.exists).toBe(true);
        });
    });

    describe('GET /api/v1/sections/recent', () => {
        it('should fetch recent sections', async () => {
            const res = await request(app)
                .get('/api/v1/sections/recent')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/v1/sections/trending', () => {
        it('should fetch trending sections', async () => {
            const res = await request(app)
                .get('/api/v1/sections/trending')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/v1/sections/random', () => {
        it('should fetch a random section', async () => {
            const res = await request(app)
                .get('/api/v1/sections/random')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('sectionNumber');
        });
    });

    describe('GET /api/v1/sections/act/:actCode', () => {
        it('should fetch sections of a specific act', async () => {
            const res = await request(app)
                .get('/api/v1/sections/act/IEA')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data[0].sectionNumber).toBe('5');
        });
    });

    describe('POST /api/v1/sections', () => {
        it('should allow admin to create a section', async () => {
            const res = await request(app)
                .post('/api/v1/sections')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    actCode: 'MVA',
                    actName: 'Motor Vehicles Act',
                    sectionNumber: '112',
                    sectionTitle: 'Limits of speed',
                    sectionDesc: 'No person shall drive a motor vehicle...'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.sectionNumber).toBe('112');
        });

        it('should forbid regular user from creating a section', async () => {
            const res = await request(app)
                .post('/api/v1/sections')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    actCode: 'MVA',
                    actName: 'Motor Vehicles Act',
                    sectionNumber: '113',
                    sectionTitle: 'Limits of weight',
                    sectionDesc: 'Limits of weight...'
                });

            expect(res.statusCode).toEqual(403);
        });
    });

    describe('GET /api/v1/sections/archived', () => {
        it('should allow admin to view archived sections', async () => {
            const res = await request(app)
                .get('/api/v1/sections/archived')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('PUT /api/v1/sections/:id', () => {
        it('should allow admin to fully replace a section', async () => {
            const res = await request(app)
                .put(`/api/v1/sections/${sectionId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    actCode: 'IPC',
                    actName: 'Indian Penal Code',
                    sectionNumber: '300',
                    sectionTitle: 'Murder Updated',
                    sectionDesc: 'Updated murder description...'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.sectionTitle).toBe('Murder Updated');
        });
    });

    describe('PATCH /api/v1/sections/:id/archive and /restore', () => {
        it('should allow admin to archive a section', async () => {
            const res = await request(app)
                .patch(`/api/v1/sections/${sectionId}/archive`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.isArchived).toBe(true);
        });

        it('should allow admin to restore an archived section', async () => {
            const res = await request(app)
                .patch(`/api/v1/sections/${sectionId}/restore`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.isArchived).toBe(false);
        });
    });

    describe('DELETE /api/v1/sections/:id', () => {
        it('should allow admin to permanently delete a section', async () => {
            const res = await request(app)
                .delete(`/api/v1/sections/${sectionId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeNull();

            // Verify it was deleted from DB
            const check = await Section.findById(sectionId);
            expect(check).toBeNull();
        });
    });
});
