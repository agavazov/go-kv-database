import { Server, Socket } from 'node:net';

// . it may be used for round ribbon
type SocketOptions = () => { host: string, port: number }

export function tcpProxy(broadcastPort: number, socketOptionsFn: SocketOptions): Server {
  const proxyServer = new Server((socket) => {
    // Create a new connection to the TCP server
    const clientSocket = new Socket();

    // Connect to the endpoint
    clientSocket.connect({ ...socketOptionsFn() });
    // clientSocket.setKeepAlive(true, 2); // @todo

    // 2-way pipe between client and TCP server
    // socket.pipe(clientSocket).pipe(socket); // @todo
    socket.on('data', (data) => {
      console.log('SOCKET OVERRIE', 'OK')
      socket.write(data);
    });

    // Make sure the socket is closed destroyed on close
    socket.on('close', () => {
      socket.destroy();
    });

    // Make sure the socket is closed destroyed on error
    socket.on('error', () => {
      socket.destroy();
    });

    //
    clientSocket.on('close', (data) => {
      console.log('EVENT.cs.close', data);
    });
    clientSocket.on('connect', () => {
      console.log('EVENT.cs.connect');
    });
    clientSocket.on('data', (data) => {
      console.log('EVENT.cs.data', data);
    });
    clientSocket.on('drain', () => {
      console.log('EVENT.cs.drain');
    });
    clientSocket.on('end', () => {
      console.log('EVENT.cs.end');
    });
    clientSocket.on('error', (data) => {
      console.log('EVENT.cs.error', data);
    });
    clientSocket.on('lookup', (data) => {
      console.log('EVENT.cs.lookup', data);
    });
    clientSocket.on('ready', () => {
      console.log('EVENT.cs.ready');
    });
    clientSocket.on('timeout', () => {
      console.log('EVENT.cs.timeout');
    });

    //
    socket.on('close', (data) => {
      console.log('EVENT.so.close', data);
    });
    socket.on('connect', () => {
      console.log('EVENT.so.connect');
    });
    socket.on('data', (data) => {
      console.log('EVENT.so.data', data);
    });
    socket.on('drain', () => {
      console.log('EVENT.so.drain');
    });
    socket.on('end', () => {
      console.log('EVENT.so.end');
    });
    socket.on('error', (data) => {
      console.log('EVENT.so.error', data);
    });
    socket.on('lookup', (data) => {
      console.log('EVENT.so.lookup', data);
    });
    socket.on('ready', () => {
      console.log('EVENT.so.ready');
    });
    socket.on('timeout', () => {
      console.log('EVENT.so.timeout');
    });
  });

  // Create broadcast
  proxyServer.listen(broadcastPort);

  //
  proxyServer.on('close', () => {
    console.log('EVENT.ps.close');
  });
  proxyServer.on('connect', () => {
    console.log('EVENT.ps.connect');
  });
  proxyServer.on('data', (data) => {
    console.log('EVENT.ps.data', data);
  });
  proxyServer.on('drain', () => {
    console.log('EVENT.ps.drain');
  });
  proxyServer.on('end', () => {
    console.log('EVENT.ps.end');
  });
  proxyServer.on('error', (data) => {
    console.log('EVENT.ps.error', data);
  });
  proxyServer.on('lookup', (data) => {
    console.log('EVENT.ps.lookup', data);
  });
  proxyServer.on('ready', () => {
    console.log('EVENT.ps.ready');
  });
  proxyServer.on('timeout', () => {
    console.log('EVENT.ps.timeout');
  });

  return proxyServer;
}
