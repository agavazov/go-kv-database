import * as http from 'http';
import { RequestOptions } from 'node:https';
import { parse } from 'url';
import { IncomeParams } from './http';

// .
export type MeshNode = {
  host: string,
  port: number,
}

export class Mesh {
  // Maximum waiting time for each request
  protected requestTimeoutMs = 1000;

  constructor(currentNode: MeshNode, protected meshNetworkUrl: string) {
  }

  async warmup<R>(): Promise<R[]> {
    // Reducing the chance of collision on initial launch all instances (without exception)
    // are started at the same time and ready at the same time
    await this.sleep(Math.random() * 1000);

    // Try to find new nodes hidden behind the load balancer
    // When there is a load balancer in front of auto scalling group
    for (let i = 1; i <= 10; i++) {
      try {
        console.log('this.meshNetworkUrl', this.meshNetworkUrl);
        const rs = await this.request(`${this.meshNetworkUrl}/status`);
        console.log('warmup.rs', rs);
      } catch (e) {
        //
      }
      await this.sleep(Math.random() * 250 + 250);
    }

    return []; // @todo add records here
  }

  get nodes(): MeshNode[] {
    return [];
  }

  async replicate(path: string, params: IncomeParams): Promise<void> {
    console.log('mesh.replicate', { path, params });
  }

  ping() {
    /*

      // . Observe
      setInterval(() => mesh2.ping(
        nodes,
        (failIndex) => nodes.splice(failIndex, 1),
        (newNode) => nodes.push(newNode)
      ), 500);


    //////////////

    // .
    export const ping = (
      nodes: MeshNode[],
      onFail: (key: number, node: MeshNode) => void,
      onNewNode: (node: MeshNode) => void
    ): void => {
      //


      // unSerializeNodes(String(params?.nodes)).forEach(newNode => {
      //   if (!nodes.find(item => item.host === newNode.host)) {
      //     nodes.push(newNode);
      //   }
      // });

      // // Connect to the other nodes
      // server.on(Event.Connect, () => replicate(nodes, '/join', {
      //   nodes: serializeNodes(nodes)
      // }));

    };

     */
  }

  async request<T>(url: string, params: IncomeParams = {}): Promise<T> {
    const urlParams = {}; // IncomeParams @todo
    const requestUrl = `${url}?${(new URLSearchParams(urlParams)).toString()}`;
    const urlParse = parse(requestUrl);

    return new Promise<T>((resolve, reject) => {
      const options: RequestOptions = {
        ...urlParse,
        timeout: this.requestTimeoutMs
      };

      // Make HTTP or HTTPS request
      const request = http.request(options, (res) => {
        // When there is an error the rejection will be calls
        res.on('error', reject);

        // Collect the response
        let response = '';
        res.on('data', data => response += data);

        // When request timeout reached
        res.on('timeout', () => {
          reject(new Error('Request timeout'));

          // Close the connection
          request.destroy();
        });

        // Resolve the response
        res.on('end', () => {
          // Expected response is JSON
          try {
            resolve(JSON.parse(response) as T);
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });

      // Global request error check
      request.on('error', reject);

      // Nothing else to set, run the request
      request.end();
    });
  }

  protected async sleep(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
  }
}
