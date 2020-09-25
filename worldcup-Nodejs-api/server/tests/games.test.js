const expect = require('expect');
const request = require('supertest');

const app = require('./../app');

describe('GET /games', () => {
  it('should get all games', (done) => {
      request(app)            
          .get('/games')
          .expect(200)
          .expect((res) => {
            expect(res.body.games.length).toBe(1);
          })
          .end(done);
  });
});