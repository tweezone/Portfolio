const request = require('supertest');
const app = require('../app');

describe('GET /sports', function(){
  it('respond with GetSportsLeagueSeason_ResponseMsg.json', function(done){
    request(app)
      .get('/sports')
      .set('Accept', 'application/json')
     // .expect('Content-Type', /json/)  //头信息测试
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var text = res.text;
        var json = JSON.parse(text);
       // json.should.have.property('count');
       // json.should.have.property('sports');
        done()
      });
    });      
});

describe('GET /sports/nba/2018-2019', function(){
  it('respond with GetSportsLeagueSeason_ResponseMsg_NBA-2018-2019.json', function(done){
    request(app)
      .get('/sports/nba/2018-2019')
      .set('Accept', 'application/json')
     // .expect('Content-Type', /json/)  //头信息测试
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var text = res.text;
        var json = JSON.parse(text);
       // json.should.have.property('leagueName');
       // json.should.have.property('season');
        done()
      });

    });    
  
});

describe('GET /sports/epl/2018-2019', function(){
  it('respond with GetSportsLeagueSeason_ResponseMsg_EPL-2018-2019.json', function(done){
    request(app)
      .get('/sports/epl/2018-2019')
      .set('Accept', 'application/json')
     // .expect('Content-Type', /json/)  //头信息测试
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var text = res.text;
        var json = JSON.parse(text);
       // json.should.have.property('leagueName');
       // json.should.have.property('season');
        done()
      });

    });    
  
});

describe('GET /sports/nfl/2018-2019', function(){
  it('respond with GetSportsLeagueSeason_ResponseMsg_NFL-2018-2019.json', function(done){
    request(app)
      .get('/sports/nfl/2018-2019')
      .set('Accept', 'application/json')
     // .expect('Content-Type', /json/)  //头信息测试
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var text = res.text;
        var json = JSON.parse(text);
       // json.should.have.property('leagueName');
       // json.should.have.property('season');
        done()
      });

    });    
  
});