import { Container, DockerConnect, Event } from './lib/docker-connect';
import { envConfig } from './lib/env-config';
import { tcpProxy } from './lib/tcp-proxy';

// . simplified function to
// Docker event handler
function dockerEventHandler(connector: DockerConnect) {
  connector.on(Event.Disconnect, (err) => {
    console.error(`[!] Docker connection is lost: ${err.message}`);
    process.exit(1);
  });

  connector.on(Event.Connect, (data) => {
    console.log(`[i] All set, now we are using Docker [${data.Name}].`);
  });

  connector.on(Event.ContainerConnect, (container) => {
    console.log(`[+] А new container arrives [${JSON.stringify(container)}].`);
  });

  connector.on(Event.ContainerDisconnect, (container) => {
    console.log(`[-] A container left [${JSON.stringify(container)}].`);
  });
}

// . simplified function to
// Start the load balancer
function loadBalancerStart(connector: DockerConnect) {
  let containers: Container[] = [];

  // Road ribbon index
  let rri = 0;
  const rriGenerator = () => {
    rri = ++rri >= containers.length ? 0 : rri;
    console.log('rrii', rri);

    // return { host: containers[rri].ip, port: envConfig.groupPort };
    return { host: containers[rri].ip, port: envConfig.groupPort };
  };

  // When new container is joined to the network
  const filter = (item: Container) => item.group === envConfig.groupName;

  connector.on(Event.ContainerConnect, () => {
    containers = connector.containers.filter(filter);
  });

  connector.on(Event.ContainerDisconnect, () => {
    containers = connector.containers.filter(filter);
  });

  // Start the TCP server and register
  tcpProxy(envConfig.servicePort, rriGenerator);
}

// Create TCP load balancer
(async () => {
  // Connect to docker
  const connector = new DockerConnect(envConfig.dockerApiLocation);

  connector.connect().catch(err => {
    console.error(`[!] There was a problem connecting to docker: ${err.message}`);
    process.exit(1);
  });

  // Simple event handler showing console messages
  dockerEventHandler(connector);

  // Create TCP load balancer
  loadBalancerStart(connector);
})();
