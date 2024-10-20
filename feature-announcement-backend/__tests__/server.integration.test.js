const request = require('supertest');
const { MongoClient } = require('mongodb');
const express = require('express');
const http = require('http');
const cors = require('cors');

let app, server, client, db, featuresCollection;

const startServer = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  db = client.db('feature-announcements');
  featuresCollection = db.collection('features');

  app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/features', async (req, res) => {
    const features = await featuresCollection.find().toArray();
    res.json(features);
  });

  app.post('/add-feature', async (req, res) => {
    const newFeature = req.body;
    const lastFeature = await featuresCollection.find().sort({ id: -1 }).limit(1).toArray();
    const newId = lastFeature.length > 0 ? lastFeature[0].id + 1 : 1;
    newFeature.id = newId;

    await featuresCollection.insertOne(newFeature);
    res.status(201).json({ message: 'Feature added successfully' });
  });

  server = http.createServer(app);
  return server;
};

// Setup for the test suite
describe('Feature Announcement API Integration Tests', () => {
  beforeAll(async () => {
    server = await startServer();
    await server.listen(3001);
  });

  afterAll(async () => {
    if (client) {
      await client.close();  // No need for client.isConnected()
    }
    if (server && server.close) {
      await server.close();
    }
  });

  // Ensure the collection is cleaned before each test
  beforeEach(async () => {
    await featuresCollection.deleteMany({});
  });

  it('GET /features should return an empty array initially', async () => {
    const res = await request(app).get('/features');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);  // Ensure the collection starts empty
  });

  it('POST /add-feature should add a new feature and return status 201', async () => {
    const newFeature = { title: 'Test Feature', description: 'This is a test feature' };
    const res = await request(app).post('/add-feature').send(newFeature);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Feature added successfully');

    const features = await featuresCollection.find().toArray();
    expect(features.length).toBe(1);
    expect(features[0].title).toBe('Test Feature');
    expect(features[0].description).toBe('This is a test feature');
  });

  it('GET /features should return the added feature', async () => {
    const newFeature = { title: 'Test Feature', description: 'This is a test feature' };
    await featuresCollection.insertOne(newFeature);  // Insert feature directly into the collection for the test

    const res = await request(app).get('/features');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Test Feature');
    expect(res.body[0].description).toBe('This is a test feature');
  });
});
