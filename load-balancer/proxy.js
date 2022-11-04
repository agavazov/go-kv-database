/* eslint @typescript-eslint/no-var-requires: "off" */
import http from 'http';

// curl -s --unix-socket /var/run/docker.sock http://dummy/containers/json

const requestListener = function (req, res) {
  console.log(req.url);


  const options = {
    socketPath: '/var/run/docker.sock',
    path: req.url
  };

  const callback = res2 => {
    res.writeHead(res2.statusCode);

    console.log(`STATUS: ${res2.statusCode}`);
    res2.setEncoding('utf8');
    // res2.on('data', data => console.log(data));
    // res.end('hello world');
    // res2.on('data', data => res.end(data));
    res2.on('data', data => res.end(JSON.stringify(JSON.parse(data), null, 2)));
    res2.on('error', data => console.error(data));
  };

  const clientRequest = http.request(options, callback);
  clientRequest.end();

};

const server = http.createServer(requestListener);
server.listen(80);
