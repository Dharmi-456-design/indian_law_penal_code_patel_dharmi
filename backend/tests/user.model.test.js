const mongoose = require('mongoose');
const User = require('../src/models/User.models');

describe('User Model Test', () => {
    beforeAll(async () => {
        // In a real scenario, use a test DB. For now, I'll just check schema validation.
    });

    it('should create a user successfully', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
        };
        const validUser = new User(userData);
        const err = validUser.validateSync();
        expect(err).toBeUndefined();
        expect(validUser.name).toBe(userData.name);
    });

    it('should fail if email is missing', async () => {
        const userData = {
            name: 'John Doe',
            password: 'password123'
        };
        const invalidUser = new User(userData);
        const err = invalidUser.validateSync();
        expect(err.errors.email).toBeDefined();
    });

    it('should fail if role is invalid', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'superadmin'
        };
        const invalidUser = new User(userData);
        const err = invalidUser.validateSync();
        expect(err.errors.role).toBeDefined();
    });
});
