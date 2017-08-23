var express = require('express')
var app = express()
var redis = require("redis")
var client = redis.createClient()

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8081 })

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const key = "likes_count"
const likers = "likers_set"

app.set('view engine', 'pug')
app.use(express.static('public'))

app.post('/like', function(req, res){
  console.log('body: ', req.body);
  const fingerprint = req.body.fingerprint
  checkLikesLimit(fingerprint, function (result){
    if (result){
      client.incr(key, () => {
        console.log('success incr', arguments)
        wss.broadcast('success')
        res.send({success: true});
      });
    }
  });
});


wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};


app.get('/', function (req, res) {
    client.get(key, function (_, likes) {
      console.log('get: ', likes);
      data = {
        title: 'title',
        message: 'LikesDemo',
        likes: likes ? likes : 0
      };
      res.render('index', data);
    })
})

app.listen(8080, function () {
    console.log('Example app listening on port 8080, WebSocket on 8081.')
})

function checkLikesLimit(fingerprint, callback) {
  var expires = new Date();
  expires.setSeconds(expires.getSeconds() - 10);
  client.zremrangebyscore(likers, '-inf', expires.getTime(), function (){
    console.log('zremrangebyscore',arguments)
    client.zscore(likers,fingerprint, function (a1, result) {
      console.log('zscore',arguments)
      if (result == null){
        var now = (new Date).getTime();
        client.zadd(likers, now, fingerprint, function(){
        console.log('zadd',arguments)
        callback(true)
        });
      } else {
        callback(false)
      }
    })
  })
}
