const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Annotation = require('../models/Annotation');
const Asset = require('../models/Asset');
const User = require('../models/User');

beforeAll(async () => {
    const testDbUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/tagmaster_test';
    await mongoose.connect(testDbUri);
});

afterAll(async () => {
    await Annotation.deleteMany({});
    await Asset.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Annotation API Tests', () => {
    let authToken;
    let userId;
    let assetId;
    let annotationId;

    beforeAll(async () => {
        // Create user
        const user = await User.create({
            name: 'Annotation Tester',
            email: 'annotester@example.com',
            password: 'password123',
            role: 'annotator'
        });
        userId = user._id;

        // Login
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'annotester@example.com',
                password: 'password123'
            });
        authToken = loginRes.body.data.token;

        // Create and claim asset
        const asset = await Asset.create({
            title: 'Test for Annotations',
            type: 'image',
            url: 'https://example.com/anno.jpg',
            status: 'claimed',
            claimedBy: userId,
            project: 'Test Project'
        });
        assetId = asset._id;
    });

    describe('POST /api/annotations', () => {
        it('should create a new annotation', async () => {
            const annotationData = {
                asset: assetId.toString(),
                type: 'bounding_box',
                label: 'cat',
                geometry: {
                    x: 100,
                    y: 150,
                    width: 200,
                    height: 180
                }
            };

            const res = await request(app)
                .post('/api/annotations')
                .set('Authorization', `Bearer ${authToken}`)
                .send(annotationData);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data.label).toBe('cat');
            expect(res.body.data.version).toBe(1);

            annotationId = res.body.data._id;
        });

        it('should not create annotation without asset', async () => {
            const res = await request(app)
                .post('/api/annotations')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    type: 'bounding_box',
                    label: 'dog'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/annotations/asset/:assetId', () => {
        it('should get annotations for an asset', async () => {
            const res = await request(app)
                .get(`/api/annotations/asset/${assetId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('PUT /api/annotations/:id - Version Conflict Testing', () => {
        it('should update annotation with correct version', async () => {
            const res = await request(app)
                .put(`/api/annotations/${annotationId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    label: 'persian_cat',
                    version: 1
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.label).toBe('persian_cat');
            expect(res.body.data.version).toBe(2);
        });

        it('should reject update with stale version (conflict)', async () => {
            const res = await request(app)
                .put(`/api/annotations/${annotationId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    label: 'tabby_cat',
                    version: 1 // Stale version
                });

            expect(res.statusCode).toBe(409);
            expect(res.body.conflict).toBe(true);
            expect(res.body.currentVersion).toBe(2);
        });

        it('should update with current version after conflict', async () => {
            const res = await request(app)
                .put(`/api/annotations/${annotationId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    label: 'tabby_cat',
                    version: 2 // Current version
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.label).toBe('tabby_cat');
            expect(res.body.data.version).toBe(3);
        });
    });

    describe('DELETE /api/annotations/:id', () => {
        it('should delete annotation', async () => {
            const res = await request(app)
                .delete(`/api/annotations/${annotationId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 for deleted annotation', async () => {
            const res = await request(app)
                .get(`/api/annotations/${annotationId}`)
                .set('Authorization', `Bearer ${authToken}`);

            // Annotation should be soft deleted
            expect(res.statusCode).toBe(404);
        });
    });
});
