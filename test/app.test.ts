import request from 'supertest';
import { app } from '../src/app';
import { setup } from './test.util';

describe('app', () => {

  beforeAll(setup);

  it('should expose API documentation', async () => {
    await request(app)
      .get('/api-docs/')
      .expect(200);
  });
});
