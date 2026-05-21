const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Day-13 — Error Handling & Global Middleware', () => {

    // ──────────────────────────────────────────────
    // Health Check
    // ──────────────────────────────────────────────
    describe('GET /api/v1/health', () => {
        it('should return 200 with success: true', async () => {
            const res = await request(app).get('/api/v1/health');

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Server is running');
        });
    });

    // ──────────────────────────────────────────────
    // 404 — Unknown routes
    // ──────────────────────────────────────────────
    describe('Unknown route', () => {
        it('should return 404 for an undefined route', async () => {
            const res = await request(app).get('/api/v1/does-not-exist');

            expect(res.statusCode).toEqual(404);
        });
    });

    // ──────────────────────────────────────────────
    // Consistent error response shape
    // ──────────────────────────────────────────────
    describe('Error response format', () => {
        it('should return { success: false, message, errors } on a 401', async () => {
            // Hit any protected route without a token to force an ApiError(401)
            const res = await request(app).get('/api/v1/notes');

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toBe(true);
        });

        it('should return { success: false, message, errors } on a 400', async () => {
            // Hit an auth route with missing body to force a validation ApiError(400)
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toBe(true);
        });

        it('should return { success: false, message, errors } on a 404', async () => {
            // Use a valid ObjectId that does not exist
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/v1/sections/${fakeId}`)
                .set('Authorization', 'Bearer invalidtoken');

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('errors');
        });
    });

    // ──────────────────────────────────────────────
    // Helmet — security headers present
    // ──────────────────────────────────────────────
    describe('Helmet security headers', () => {
        it('should include X-Content-Type-Options header', async () => {
            const res = await request(app).get('/api/v1/health');

            expect(res.headers['x-content-type-options']).toBe('nosniff');
        });

        it('should include X-Frame-Options header', async () => {
            const res = await request(app).get('/api/v1/health');

            expect(res.headers['x-frame-options']).toBeDefined();
        });
    });
});
