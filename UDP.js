// Required module
var dgram = require('dgram');
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Port and IP
var PORT = 3000;
//var HOST = '192.168.1.141';
var HOST = '192.168.1.131';
var START = false;
var RESET = false;
/*var HOST = server.address().address;
var PORT = server.address().port;
var server = */
/*var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
})*/
var Name = ['Yuhang He', 'Junwei Zhou', 'Jeffrey Carruthers', 'Johannes Becker'];
var Here = [];
var NotHere = Name;
var N = Name.length;
// Create socket
var server = dgram.createSocket('udp4');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var name;
// Create server
server.on('listening', function () {
    var address = server.address();
    //response = 'KKKKK';
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
    //while (1) {    response= response + 'KKKKK';}

    /*var sheet = window.document.getElementById('sheet');
    sheet.appendChild(response);
    var doScroll = sheet.scrollTop > sheet.scrollHeight - sheet.clientHeight - 1;
    log.appendChild(item);
    if (doScroll) {
      sheet.scrollTop = sheet.scrollHeight - sheet.clientHeight;
    }*/
});

// On connection, print out received message
server.on('message', function (message, remote) {
    if (RESET) {
      Here = [];
      NotHere = Name;
    }
    console.log(remote.address + ':' + remote.port +' - ' + message);
    console.log("waiting for message");
    // Send Ok acknowledgement
    name = message.toString('utf8');
    var i = 0;
    var j = 0;
    var k = 0;
    //console.log('i: %s, Here.length: , Here[0]', i, Here.length, Here[i]);
    //console.log('START is : %s', START);
    if (START) {
      while (name != Here[i] && i <= Here.length) {
        i += 1; 
      }
      //console.log("  i: ", i);
      if (i > Here.length) {
        Here.push(name);
      }
      //console.log(Here);
      //console.log(name);
      NotHere = [];
      for (i = 0; i < N; i++) {
        k = 0;
        for (j = 0; j < Here.length; j++) {
          if (Name[i] == Here[j])
            k = 1;
        }
      if (k == 0)
        NotHere.push(Name[i]);
      }
    }
    console.log(name);
    console.log(Here);
    console.log(NotHere);
    //console.log(message);
    server.send("Ok!",remote.port,remote.address,function(error){
      if(error){
        console.log('MEH!');
      }
      else{
        console.log('Sent: Ok!');
      }
    });
    server.send("Ok!",remote.port,remote.address,function(error){
      if(error){
        console.log('MEH!');
      }
      else{
        console.log('Sent: Ok!');
      }
    });
    /*var sheet = window.document.getElementById('sheet');
    sheet.appendChild(response);
    var doScroll = sheet.scrollTop > sheet.scrollHeight - sheet.clientHeight - 1;
    log.appendChild(item);
    if (doScroll) {
      sheet.scrollTop = sheet.scrollHeight - sheet.clientHeight;
    }*/


});
/*server.on('here',function(message, remote) {

});*/
app.use(express.static('public'));
/*app.get('/get', function(req, res){
  res.sendFile(__dirname + '/test_1.html');
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});*/
app.get('/home', function(req, res){
  res.sendFile(__dirname + '/attendance.html');
});
app.get('/start', function(req, res){
  START = true;
  RESET = false;
  res.redirect('http://smartcontrol.ddns.net:3000/home');
});
app.get('/stop', function(req, res){
  START = false;
  RESET = false;
  res.redirect('http://smartcontrol.ddns.net:3000/home');
});
app.get('/reset', function(req, res){
  RESET = true;
  START = false;
  res.redirect('http://smartcontrol.ddns.net:3000/home');
});
/*app.get('/collect',function(req,res) {
  //response = 'Junwei Zhou';
  console.log(response);
  //res.end(JSON.stringify(response));
  //res.redirect('http://google.com');
  res.send(response);
  //res.redirect('http://google.com');
  //res.render('index', response);
});*/

/*app.post('/collect', urlencodedParser, function (req, res) {
  // Prepare output in JSON format
  response = 'posting';
  /*response = {
     first_name:req.body.first_name,
     last_name:req.body.last_name
  };
  console.log(response);
  res.end(JSON.stringify(response));
})*/

io.on('connection', function(socket){
  console.log('a user connected');
  taking();
  /*if (START) {
    socket.emit('here', Here);
  }
  socket.emit('nothere', NotHere);*/
  console.log("Start: %d, Reset: %d", START, RESET);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(PORT, function() {
  console.log('listening on *:%d', PORT);
});
var count = 0;
function taking(){
  //msg = name;
  //console.log('Hello');
  //console.log(msg);
  //console.log('Hi');
  if (RESET) {
    Here = [];
    NotHere = Name;
  }
  io.emit('here', Here);
  //socket.emit('here', Here);
  //socket.emit('nothere',NotHere);
  io.emit('nothere', NotHere);
  //socket.emit('nothere',NotHere);
  count ++;
}

if (count < 41){
    setInterval(taking, 1000);
}

// Bind server to port and IP
server.bind(PORT, HOST);
