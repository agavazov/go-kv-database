const http = require('http');
const url = require('url');
const path = require('path');
const axios = require('axios');

/*******************************************************************/
/* Draft code with duplicated snippets and many non-good practices */

/*******************************************************************/

class Server {
  maxKeyLength = 64;
  maxValueLength = 256;

  waitingMutableQueue = [];

  // All server settings & configurations
  settings = {};

  // The storage
  db = {};

  // Each level covers the previous one
  logLevels = {
    NOTHING: 0,
    SYSTEM_MESSAGES: 1,
    MESH_STATUS: 2,
    MESH_ACTIONS: 3,
    INCOME_REQUESTS: 4
  };

  constructor() {
    // Settings set
    this.settings = {
      version: require(path.join(__dirname, './../package.json')).version,
      nodeId: `DB_${process.env.HOSTNAME}`,
      servicePort: process.env.SERVICE_PORT || 80,
      serviceUrl: process.env.SERVICE_URL,
      serviceLogLevel: parseInt(process.env.LOG_LEVEL) || 0,
      isWarmup: true,
      meshNetworkUrl: process.env.MESH_NETWORK_URL || null,
      meshNodes: [] // List of the joined nodes
    };

    if (!this.settings.serviceUrl) {
      this.settings.serviceUrl = `http://${process.env.HOSTNAME}:${this.settings.servicePort}`;
    }

    this.log(`Settings: ${JSON.stringify(this.settings, null, 2)}`, this.logLevels.SYSTEM_MESSAGES);

    this.joinToMesh().catch(console.error);

    // Start sync worker
    setInterval(() => this.meshSync(), 50);
    this.meshSync();
  }

  // Quick function for the HTTP response
  quickResponse(res, code, data) {
    // When there are requests from queue
    if (!res) {
      return;
    }

    res.writeHead(code, {'Content-Type': 'text/json'});
    res.end(JSON.stringify(data));
  }

  // Output a message
  log(message, level) {
    if (level <= this.settings.serviceLogLevel) {
      console.log(message);
    }
  }

  // Make request
  async request(url, params, retires = 0, waitPerRequest = 500) {
    let loops = retires + 1;

    for (let i = 1; i <= loops; i++) {
      const requestUrl = `${url}?${(new URLSearchParams(params)).toString()}`;
      try {
        let rs = await axios.get(requestUrl, {timeout: 1000});
        return rs;
      } catch (e) {
        // Try one more time
        if (e?.code === 'ECONNREFUSED') {
          if (i < loops) {
            this.log(`Request fail, will try one more time in a sec [${requestUrl}]`, this.logLevels.SYSTEM_MESSAGES);
            await this.sleep(waitPerRequest);
            continue;
          }
        }

        throw e;
      }
    }
  }

  // Join to mesh network and send my nodes to the others
  async joinToMesh() {
    if (!this.settings.meshNetworkUrl) {
      this.log(`There is no defined mesh network URL`, this.logLevels.MESH_STATUS);
      this.settings.isWarmup = false;

      // Run queue (totally not necessary to be done here, but in more complex wogic it will be)
      this.waitingMutableQueue.forEach(queue => {
        this.actionRun(queue.action, queue.params, null);
      });

      return;
    }

    // Warmup
    // @note - this process won`t work if join node with own data
    if (this.settings.isWarmup) {
      // Get other node data
      let serverStatus;

      try {
        let response = await this.request(`${this.settings.meshNetworkUrl}/status`, null, 10, 1000);
        serverStatus = response?.data;
      } catch (e) {
        if (e?.code === 'ECONNREFUSED') {
          console.error(`ERROR CAN'T CONNECT TO MESH NETWORK: ${this.settings.meshNetworkUrl}`);
          process.exit(1);
        }
      }
      // Check the server info
      // @todo validate the server version and compatibility

      // Ask to join in the mesh
      try {
        await this.request(`${this.settings.meshNetworkUrl}/join`, {
          myUrl: this.settings.serviceUrl
        }, 10);

        // Push on success
        this.settings.meshNodes.push(this.settings.meshNetworkUrl);
      } catch (e) {
        // If it`s warming up it`s ok
        if (e?.request?.res?.statusCode === 503) {
          // Push on success (503 is success)
          this.settings.meshNodes.push(this.settings.meshNetworkUrl);
        } else {
          console.warn('joinToMesh.meshNetworkUrl.askToJoin', e);
        }
      }

      // Get other node data - Move on when there is no data
      if (!serverStatus?.availableRecords) {
        this.log(`No data was found in the mesh network`, this.logLevels.MESH_STATUS);
        this.settings.isWarmup = false;

        // Run queue
        this.waitingMutableQueue.forEach(queue => {
          this.actionRun(queue.action, queue.params, null);
        });

        return;
      }

      // Get the other node data
      // @todo if the other node is in warm-up process we have to wait
      try {
        let response = await axios.get(`${this.settings.meshNetworkUrl}/getAll`);

        this.db = response?.data; // @todo validate the data structure
        this.settings.isWarmup = false;

        // Run queue
        this.waitingMutableQueue.forEach(queue => {
          this.actionRun(queue.action, queue.params, null);
        });

        this.log(`Warmup complete with ${Object.keys(this.db).length} records`, this.logLevels.MESH_STATUS);
      } catch (e) {
        this.settings.isWarmup = false;

        // Run queue
        this.waitingMutableQueue.forEach(queue => {
          this.actionRun(queue.action, queue.params, null);
        });

        // If it`s warming up it`s ok
        if (e?.request?.res?.statusCode !== 503) {
          console.warn('joinToMesh.meshNetworkUrl.getAllData', e);
        }
      }
    }
  }

  // Sync & check the mesh network (check each node and remove it when is down or join after warmup)
  meshSync() {
  }

  // Send command to all working nodes
  meshRequest(path, query) {
    // Skip when comes from another node
    if (query.nodeId) {
      this.log(`Request replication skipped: comes from another node [${query.nodeId}]`, this.logLevels.MESH_STATUS);
      return;
    }

    query.nodeId = this.settings.nodeId;

    this.settings.meshNodes.forEach(url => {
      this.request(`${url}${path}`, query).catch(e => {
        // If it`s warming up it`s ok
        if (e?.request?.res?.statusCode !== 503) {
          console.error(`MeshRequest error [${url}${path}]`, e);
        }
      });
    });
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Dispatcher + all in once (this is draft poc script, not something to show on the public)
  actionRun(action, params, serverRes) {
    // Log
    if (params?.nodeId) {
      this.log(`Income request: ${action} from node ${params?.nodeId}:${JSON.stringify(params)}`, this.logLevels.INCOME_REQUESTS);
    } else {
      this.log(`Income request: ${action}:${JSON.stringify(params)}`, this.logLevels.INCOME_REQUESTS);
    }

    // if (action !== '/status' && this.settings.isWarmup) {
    //   this.log(`Request declined: Waiting to warmup`, this.logLevels.MESH_STATUS);
    //
    //   // Save to execute all mutable requests after the warmup is done
    //   if (['/set', '/rm', '/clear', '/join'].indexOf(action) !== -1) {
    //     // @todo Skip of the previous line is the same as this one
    //     this.waitingMutableQueue.push({
    //       action,
    //       params
    //     });
    //   }
    //
    //   this.quickResponse(serverRes, 503, {
    //     warmingUp: true
    //   });
    //   return;
    // }

    switch (action) {
      // @mutable
      case '/set': {
        // Checks - skip them if request is from another node
        if (!params.nodeId) {
          if (typeof params?.k === 'undefined') {
            this.quickResponse(serverRes, 500, {
              error: 'MISSING_KEY_PARAM'
            });
            break;
          }

          if (params?.k?.length <= 0) {
            this.quickResponse(serverRes, 500, {
              error: 'EMPTY_KEY'
            });
            break;
          }

          if (params?.k?.length >= this.maxKeyLength) {
            this.quickResponse(serverRes, 500, {
              error: 'MAXIMUM_KEY_LENGTH_REACHED'
            });
            break;
          }

          if (typeof params?.v === 'undefined') {
            this.quickResponse(serverRes, 500, {
              error: 'MISSING_VALUE_PARAM'
            });
            break;
          }

          if (params?.v?.length >= this.maxValueLength) {
            this.quickResponse(serverRes, 500, {
              error: 'MAXIMUM_VALUE_LENGTH_REACHED'
            });
            break;
          }
        }

        // Set
        this.db[params.k] = params.v;

        // Replicate
        this.meshRequest(action, params);

        // Response
        this.quickResponse(serverRes, 200, {
          success: true
        });
        break;
      }

      case '/get': {
        // Checks - skip them if request is from another node
        if (!params.nodeId) {
          if (typeof params?.k === 'undefined') {
            this.quickResponse(serverRes, 500, {
              error: 'MISSING_KEY_PARAM'
            });
            break;
          }

          if (params?.k?.length <= 0) {
            this.quickResponse(serverRes, 500, {
              error: 'EMPTY_KEY'
            });
            break;
          }

          if (params?.k?.length >= this.maxKeyLength) {
            this.quickResponse(serverRes, 500, {
              error: 'MAXIMUM_KEY_LENGTH_REACHED'
            });
            break;
          }

          if (typeof this.db[params.k] === 'undefined') {
            this.quickResponse(serverRes, 404, {
              error: 'MISSING_RECORD'
            });
            break;
          }
        }

        // Response
        this.quickResponse(serverRes, 200, this.db[params.k]);
        break;
      }

      // @mutable
      case '/rm': {
        // Checks - skip them if request is from another node
        if (!params.nodeId) {
          if (typeof params?.k === 'undefined') {
            this.quickResponse(serverRes, 500, {
              error: 'MISSING_KEY_PARAM'
            });
            break;
          }

          if (params?.k?.length <= 0) {
            this.quickResponse(serverRes, 500, {
              error: 'EMPTY_KEY'
            });
            break;
          }

          if (params?.k?.length >= this.maxKeyLength) {
            this.quickResponse(serverRes, 500, {
              error: 'MAXIMUM_KEY_LENGTH_REACHED'
            });
            break;
          }

          if (typeof this.db[params.k] === 'undefined') {
            this.quickResponse(serverRes, 404, {
              error: 'MISSING_RECORD'
            });
            break;
          }
        }

        // Remove the value
        delete this.db[params.k];

        // Replicate
        this.meshRequest(action, params);

        // Response
        this.quickResponse(serverRes, 200, {
          success: true
        });
        break;
      }

      // @mutable
      case '/clear': {
        // Clear the database
        this.db = {};

        // Replicate
        this.meshRequest(action, params);

        // Response
        this.quickResponse(serverRes, 200, {
          success: true
        });
        break;
      }

      case '/is': {
        // Checks
        if (typeof params?.k === 'undefined') {
          this.quickResponse(serverRes, 500, {
            error: 'MISSING_KEY_PARAM'
          });
          break;
        }

        if (params?.k?.length <= 0) {
          this.quickResponse(serverRes, 500, {
            error: 'EMPTY_KEY'
          });
          break;
        }

        if (params?.k?.length >= this.maxKeyLength) {
          this.quickResponse(serverRes, 500, {
            error: 'MAXIMUM_KEY_LENGTH_REACHED'
          });
          break;
        }

        if (typeof this.db[params.k] === 'undefined') {
          this.quickResponse(serverRes, 404, {
            error: 'MISSING_RECORD'
          });
          break;
        }

        // Response
        this.quickResponse(serverRes, 200, {
          success: true
        });
        break;
      }

      case '/getKeys': {
        // Response
        this.quickResponse(serverRes, 200, Object.keys(this.db));
        break;
      }

      case '/getValues': {
        // Response
        this.quickResponse(serverRes, 200, Object.values(this.db));
        break;
      }

      case '/getAll': {
        // Response
        this.quickResponse(serverRes, 200, Object.entries(this.db).map(([k, v]) => ({k, v})));
        break;
      }

      case '/healthcheck': {
        // Response
        this.quickResponse(serverRes, 200, {
          status: 'ok'
        });
        break;
      }

      case '/status': {
        // Response
        this.quickResponse(serverRes, 200, {
          version: this.settings.version,
          nodeId: this.settings.nodeId,
          servicePort: this.settings.servicePort,
          serviceUrl: this.settings.serviceUrl,
          serviceLogLevel: this.settings.serviceLogLevel,
          isWarmup: this.settings.isWarmup,
          meshNetworkUrl: this.settings.meshNetworkUrl,
          meshNodes: this.settings.meshNodes,

          maxKeyLength: this.maxKeyLength,
          maxValueLength: this.maxValueLength,
          availableRecords: Object.keys(this.db).length
        });
        break;
      }

      // @mutable
      case '/join': {
        // Checks - skip them if request is from another node
        if (!params.nodeId) {
          // @todo make real URL check here
          if (params?.myUrl?.length <= 5) {
            this.quickResponse(serverRes, 500, {
              error: 'ENTER_VALID_URL'
            });
            break;
          }
        }

        // Remove nodeId to be able to tell to the other nodes too (because this may come from another node and we don`t have to stop populate it)
        delete params.nodeId;

        // Check is already added
        if (this.settings.meshNodes.indexOf(params.myUrl) !== -1) {
          this.log(`Skip to join [${params.myUrl}]`, this.logLevels.INCOME_REQUESTS);

          // Response
          this.quickResponse(serverRes, 200, {
            success: true,
            isNew: false
          });
          break;
        }

        // Check is the same as me
        if (params.myUrl === this.settings.serviceUrl) {
          this.log(`Skip to join myself to me [${params.myUrl}]`, this.logLevels.INCOME_REQUESTS);

          // But it is very important to replicate myself to the others
          this.meshRequest(action, params);

          // Introduce myself to the others
          this.meshRequest(action, {
            myUrl: this.settings.serviceUrl
          });

          // Response
          this.quickResponse(serverRes, 200, {
            success: true,
            isNew: false
          });
          break;
        }

        // Add the url to the mesh
        this.settings.meshNodes.push(params.myUrl);
        this.log(`Join [${params.myUrl}]`, this.logLevels.INCOME_REQUESTS);

        // Replicate
        this.meshRequest(action, params);

        // Introduce myself to the others
        this.meshRequest(action, {
          myUrl: this.settings.serviceUrl
        });

        // Response
        this.quickResponse(serverRes, 200, {
          success: true,
          isNew: true
        });
        break;
      }

      default: {
        this.quickResponse(serverRes, 404, {
          error: 'UNKNOWN_COMMAND'
        });
      }
    }
  }

  // Handle all requests from the web server
  requestHandler(req, res) {
    const urlParse = url.parse(req.url, true);
    const action = urlParse?.pathname || '/';
    const params = urlParse?.query || {};
    this.actionRun(action, params, res);
  }
}

const server = new Server();

// Start the http server
const app = http.createServer(server.requestHandler.bind(server));
app.listen(server.settings.servicePort, '0.0.0.0', () => {
  console.log(`Running on ${server.settings.serviceUrl} [NodeId: ${server.settings.nodeId}]`);
});
