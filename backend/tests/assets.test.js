const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Asset = require('../models/Asset');
const User = require('../models/User');

beforeAll(async () => {
    const testDbUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/tagmaster_test';
    await mongoose.connect(testDbUri);
});

afterAll(async () => {
    await Asset.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Asset API Tests', () => {
    let authToken;
    let userId;
    let assetId;

    // Create test user and login
    beforeAll(async () => {
        const user = await User.create({
            name: 'Asset Tester',
            email: 'assettester@example.com',
            password: 'password123',
            role: 'annotator'
        });
        userId = user._id;

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'assettester@example.com',
                password: 'password123'
            });

        authToken = loginRes.body.data.token;

        // Create a test asset
        const asset = await Asset.create({
            title: 'Test Image',
            type: 'image',
            url: 'https://example.com/test.jpg',
            status: 'available',
            project: 'Test Project'
        });
        assetId = asset._id;
    });

    describe('GET /api/assets', () => {
        it('should get all assets', async () => {
            const res = await request(app)
                .get('/api/assets')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('should filter assets by type', async () => {
            const res = await request(app)
                .get('/api/assets?type=image')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.every(asset => asset.type === 'image')).toBe(true);
        });
    });

    describe('GET /api/assets/:id', () => {
        it('should get asset by ID', async () => {
            const res = await request(app)
                .get(`/api/assets/${assetId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data.title).toBe('Test Image');
        });

        it('should return 404 for non-existent asset', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/assets/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PATCH /api/assets/:id/claim', () => {
        it('should claim an available asset', async () => {
            const res = await request(app)
                .patch(`/api/assets/${assetId}/claim`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.asset.status).toBe('claimed');
            expect(res.body.data.asset.claimedBy).toBeTruthy();
        });

        it('should not claim already claimed asset', async () => {
            const res = await request(app)
                .patch(`/api/assets/${assetId}/claim`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PATCH /api/assets/:id/release', () => {
        it('should release a claimed asset', async () => {
            const res = await request(app)
                .patch(`/api/assets/${assetId}/release`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe('available');
        });
    });

    describe('PATCH /api/assets/:id/complete', () => {
        beforeAll(async () => {
            // Claim asset again for completion test
            await request(app)
                .patch(`/api/assets/${assetId}/claim`)
                .set('Authorization', `Bearer ${authToken}`);
        });

        it('should complete a claimed asset', async () => {
            const res = await request(app)
                .patch(`/api/assets/${assetId}/complete`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe('completed');
            expect(res.body.data.completedBy).toBeTruthy();
        });
    });
});
