var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , os = require('os')
  , url = require('url')
  , sys = require("sys")
  , exec = require("child_process").exec
  , child;

app.listen(8765, function() {
  console.log('Server running at http://localhost:8765/');
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

function osInfo (call) {
    return os[call]();
}
function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

io.sockets.on('connection', function (socket) {

  var reqs = [
      'endianness',
      'hostname',
      'type',
      'release',
      'arch',
      'platform',
      'tmpDir'
  ];

  for (i=0; i<reqs.length; i++) {
      socket.on('osInfo'+reqs[i], function (data) {
          socket.emit('osInfo'+data.t, {t:data.t, 'data': osInfo(data.t)});
      });
  }

  // Load Average
  socket.on('osInfoloadavg', function (data) {
      socket.emit('osInfo'+data.t, {t:data.t, 'data': osInfo(data.t)});
  });

  // Uptime
  socket.on('osInfouptime', function (data) {
      socket.emit('osInfo'+data.t, {t:data.t, 'data': osInfo(data.t)});
  });

  // Free memory
  socket.on('osInfofreemem', function (data) {
      socket.emit('osInfo'+data.t, {t:data.t, 'data': osInfo(data.t)/1024/1024});
  });

  // Total memory
  socket.on('osInfototalmem', function (data) {
      socket.emit('osInfo'+data.t, {t:data.t, 'data': osInfo(data.t)/1024/1024});
  });

  /*exec('df -h', function(error, stdout, stderr) {
      console.log(stdout.split("\n"));
  });*/

});
