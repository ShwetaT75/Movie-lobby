import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';

jest.mock('mongoose');

const app = express();

describe('Movie API', () => {
  beforeAll(() => {
    (mongoose as any).connect.mockResolvedValue();
  });

  afterAll(() => {
    mongoose.disconnect();
  });

  it('should get all movies', async () => {
    const response = await request(app).get('/movies');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0); 
  });

  it('should search for movies', async () => {
    const response = await request(app).get('/movies/search?title=example');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0); 
  });

  it('should add a new movie', async () => {
    const newMovie = {
      title: 'Example Movie',
      genre: 'Action',
      rating: 8,
      streamingLink: 'http://example.com',
    };

    const response = await request(app).post('/movies').send(newMovie);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newMovie);
  });
});
