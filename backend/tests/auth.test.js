const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User.models');

describe('Auth API', () => {
    beforeAll(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Auth User',
                    email: 'authuser@example.com',
                    password: 'Password123!'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('user');
            expect(res.body.data.user.email).toBe('authuser@example.com');
            expect(res.body.data).toHaveProperty('accessToken');
            expect(res.body.data).toHaveProperty('refreshToken');
        });

        it('should reject registration if email already exists', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Another User',
                    email: 'authuser@example.com',
                    password: 'Password123!'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
        });

        it('should reject registration with invalid fields', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: '',
                    email: 'not-an-email',
                    password: 'short'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'authuser@example.com',
                    password: 'Password123!'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('accessToken');
        });

        it('should reject login with wrong password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'authuser@example.com',
                    password: 'WrongPassword'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/refresh-token', () => {
        it('should refresh token successfully with valid refresh token', async () => {
            // First login to get a refresh token
            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'authuser@example.com',
                    password: 'Password123!'
                });
            const refreshToken = loginRes.body.data.refreshToken;

            const res = await request(app)
                .post('/api/v1/auth/refresh-token')
                .send({ refreshToken });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('accessToken');
        });
    });

    describe('GET /api/v1/auth/me', () => {
        it('should return current user profile', async () => {
            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'authuser@example.com',
                    password: 'Password123!'
                });
            const token = loginRes.body.data.accessToken;

            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe('authuser@example.com');
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        it('should logout user successfully', async () => {
            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'authuser@example.com',
                    password: 'Password123!'
                });
            const token = loginRes.body.data.accessToken;

            const res = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
        });
    });
});
