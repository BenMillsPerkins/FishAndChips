var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var fs = require('fs');
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/react-jsx/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../build/src/index.js'));
});

app.get('/donotdelete.json', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/donotdelete.json'));
});

app.get('/prices.json', (req, res) => {
  res.sendFile(__dirname + '/prices.json');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
      console.log('user disconnected');
  });
  socket.on('sendOrder', (order) => {
      var newOrder = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/donotdelete.json'), 'utf8'));
      console.log(order);
      newOrder.push(order);
      var fileOrder = JSON.stringify(newOrder);
      fs.writeFile(path.resolve(__dirname + '/donotdelete.json'), fileOrder, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
      });
  })
});



http.listen(80, () => {
  console.log('listening on *:80');
})