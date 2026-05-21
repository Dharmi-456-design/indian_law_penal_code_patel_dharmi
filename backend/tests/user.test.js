const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User.models');
const { generateTokens } = require('../src/services/auth.service');

let adminToken;
let userToken;
let userId;

beforeAll(async () => {
    await User.deleteMany({});

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
    userId = user._id;
    userToken = generateTokens(user).accessToken;
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('User Management API', () => {
    describe('PATCH /api/v1/users/me', () => {
        it('should allow user to update their own profile', async () => {
            const res = await request(app)
                .patch('/api/v1/users/me')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Updated User Name'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe('Updated User Name');
        });
    });

    describe('GET /api/v1/users', () => {
        it('should allow admin to list all users', async () => {
            const res = await request(app)
                .get('/api/v1/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(2);
        });

        it('should forbid regular user from listing users', async () => {
            const res = await request(app)
                .get('/api/v1/users')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(403);
        });
    });

    describe('GET /api/v1/users/stats', () => {
        it('should allow admin to retrieve user stats', async () => {
            const res = await request(app)
                .get('/api/v1/users/stats')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('totalUsers');
        });
    });

    describe('GET /api/v1/users/:id', () => {
        it('should allow admin to retrieve a user by ID', async () => {
            const res = await request(app)
                .get(`/api/v1/users/${userId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data._id.toString()).toBe(userId.toString());
        });
    });

    describe('PATCH /api/v1/users/:id/role', () => {
        it('should allow admin to update user role', async () => {
            const res = await request(app)
                .patch(`/api/v1/users/${userId}/role`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    role: 'admin'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.role).toBe('admin');

            // Revert role back for other tests
            await User.findByIdAndUpdate(userId, { role: 'user' });
        });
    });

    describe('PATCH /api/v1/users/:id/status', () => {
        it('should allow admin to toggle user status', async () => {
            const res = await request(app)
                .patch(`/api/v1/users/${userId}/status`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    isActive: false
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.isActive).toBe(false);
        });
    });

    describe('DELETE /api/v1/users/:id', () => {
        it('should allow admin to delete user', async () => {
            const res = await request(app)
                .delete(`/api/v1/users/${userId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);

            // Verify user was soft deleted or removed
            const check = await User.findById(userId);
            expect(check.isActive).toBe(false);
        });
    });
});
