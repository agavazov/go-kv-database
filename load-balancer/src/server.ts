import { DockerConnect, Event } from './lib/docker-connect';
import { envConfig } from './lib/env-config';

// Create TCP load balancer
(async () => {
  // Connect to docker
  const connector = new DockerConnect(envConfig.dockerApiLocation);

  // Handle events
  connector.connect().catch(err => {
    console.error(`[!] There was a problem connecting to docker: ${err.message}`);
    process.exit(1);
  });

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

  // Create TCP load balancer
  // @todo do the magic

  // Listen for new connections and append the instance to the proxy
})();
