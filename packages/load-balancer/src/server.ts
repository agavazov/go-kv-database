import { envConfig } from './lib/env-config';
import { Container, DockerConnect, Event } from './net/docker-connect';
import { tcpProxy } from './net/tcp-proxy';

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

  // Road ribbon balancer
  let rri = 0;
  const rriGenerator = () => {
    rri = ++rri >= containers.length ? 0 : rri;
    const container = containers[rri];

    if (typeof container?.meta?.hits === 'number') {
      container.meta.hits++;
    }

    return { host: container.ip, port: envConfig.groupPort };
  };

  // When new container is joined to the network
  const filter = (item: Container) => item.group === envConfig.groupName;

  connector.on(Event.ContainerConnect, (container) => {
    // Create metadata to log the load balancer hits
    container.meta = {
      hits: 0
    };

    containers = connector.containers.filter(filter);
  });

  connector.on(Event.ContainerDisconnect, () => {
    containers = connector.containers.filter(filter);
  });

  // Start the TCP server and register
  tcpProxy(envConfig.servicePort, rriGenerator);

  // Show hit report
  let lastReport = '';
  setInterval(() => {
    const report = '[i] Hits -> ' + containers.map(c => `${c.ip} [${c?.meta?.hits}]`).join(' | ');
    if (lastReport !== report) {
      console.log(report);
      lastReport = report;
    }
  }, 10000);
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
