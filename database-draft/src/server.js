const http = require('http');
const url = require('url');
const path = require('path');

/*******************************************************************/
/* Draft code with duplicated snippets and many non-good practices */
/*******************************************************************/

// Load env
require('dotenv').config();

// Quick function for the HTTP response
const quickResponse = (res, code, data) => {
  res.writeHead(code, {'Content-Type': 'text/json'});
  res.end(JSON.stringify(data));
};

// The storage
let db = {};

// Settings
const settings = {
  version: require(path.join(__dirname, './../package.json')).version,
  nodeId: `DB_${process.env.HOSTNAME}`,
  servicePort: process.env.SERVICE_PORT || 80,
  host: process.env.SERVICE_HOST || '0.0.0.0',
  isWarmup: true,
  meshNetworkUrl: process.env.MESH_NETWORK_URL || null,
  meshNodes: [] // List of the joined nodes
};

// Warmup
setTimeout(() => {
  settings.isWarmup = false;
  console.log(`Service is warmed up and synced with 5 more nodes [NodeId: ${settings.nodeId}] `);
}, 3000);

// All in once
const server = http.createServer((req, res) => {
  const urlParse = url.parse(req.url, true);
  const maxKeyLength = 64;
  const maxValueLength = 256;

  // console.log('urlParse.path', urlParse.path);

  if (settings.isWarmup) {
    quickResponse(res, 503, {
      warmingUp: true
    });
    return;
  }

  switch (urlParse.pathname) {
    case '/set': {
      // Checks
      if (typeof urlParse?.query?.k === 'undefined') {
        quickResponse(res, 500, {
          error: 'MISSING_KEY_PARAM'
        });
        break;
      }

      if (urlParse?.query?.k?.length <= 0) {
        quickResponse(res, 500, {
          error: 'EMPTY_KEY'
        });
        break;
      }

      if (urlParse?.query?.k?.length >= maxKeyLength) {
        quickResponse(res, 500, {
          error: 'MAXIMUM_KEY_LENGTH_REACHED'
        });
        break;
      }

      if (typeof urlParse?.query?.v === 'undefined') {
        quickResponse(res, 500, {
          error: 'MISSING_VALUE_PARAM'
        });
        break;
      }

      if (urlParse?.query?.v?.length >= maxValueLength) {
        quickResponse(res, 500, {
          error: 'MAXIMUM_VALUE_LENGTH_REACHED'
        });
        break;
      }

      // Set
      db[urlParse.query.k] = urlParse.query.v;

      // Response
      quickResponse(res, 200, {
        success: true
      });
      break;
    }

    case '/get': {
      // Checks
      if (typeof urlParse?.query?.k === 'undefined') {
        quickResponse(res, 500, {
          error: 'MISSING_KEY_PARAM'
        });
        break;
      }

      if (urlParse?.query?.k?.length <= 0) {
        quickResponse(res, 500, {
          error: 'EMPTY_KEY'
        });
        break;
      }

      if (urlParse?.query?.k?.length >= maxKeyLength) {
        quickResponse(res, 500, {
          error: 'MAXIMUM_KEY_LENGTH_REACHED'
        });
        break;
      }

      if (typeof db[urlParse.query.k] === 'undefined') {
        quickResponse(res, 404, {
          error: 'MISSING_RECORD'
        });
        break;
      }

      // Response
      quickResponse(res, 200, db[urlParse.query.k]);
      break;
    }

    case '/rm': {
      // Checks
      if (typeof urlParse?.query?.k === 'undefined') {
        quickResponse(res, 500, {
          error: 'MISSING_KEY_PARAM'
        });
        break;
      }

      if (urlParse?.query?.k?.length <= 0) {
        quickResponse(res, 500, {
          error: 'EMPTY_KEY'
        });
        break;
      }

      if (urlParse?.query?.k?.length >= maxKeyLength) {
        quickResponse(res, 500, {
          error: 'MAXIMUM_KEY_LENGTH_REACHED'
        });
        break;
      }

      if (typeof db[urlParse.query.k] === 'undefined') {
        quickResponse(res, 404, {
          error: 'MISSING_RECORD'
        });
        break;
      }

      // Remove the value
      delete db[urlParse.query.k];

      // Response
      quickResponse(res, 200, {
        success: true
      });
      break;
    }

    case '/clear': {
      // Clear the database
      db = {};

      // Response
      quickResponse(res, 200, {
        success: true
      });
      break;
    }

    case '/is': {
      // Checks
      if (typeof urlParse?.query?.k === 'undefined') {
        quickResponse(res, 500, {
          error: 'MISSING_KEY_PARAM'
        });
        break;
      }

      if (urlParse?.query?.k?.length <= 0) {
        quickResponse(res, 500, {
          error: 'EMPTY_KEY'
        });
        break;
      }

      if (urlParse?.query?.k?.length >= maxKeyLength) {
        quickResponse(res, 500, {
          error: 'MAXIMUM_KEY_LENGTH_REACHED'
        });
        break;
      }

      if (typeof db[urlParse.query.k] === 'undefined') {
        quickResponse(res, 404, {
          error: 'MISSING_RECORD'
        });
        break;
      }

      // Response
      quickResponse(res, 200, {
        success: true
      });
      break;
    }

    case '/getKeys': {
      // Response
      quickResponse(res, 200, Object.keys(db));
      break;
    }

    case '/getValues': {
      // Response
      quickResponse(res, 200, Object.values(db));
      break;
    }

    case '/getAll': {
      // Response
      quickResponse(res, 200, Object.entries(db).map(([k, v]) => ({k, v})));
      break;
    }

    case '/healthcheck': {
      // Response
      quickResponse(res, 200, {
        status: 'ok'
      });
      break;
    }

    case '/status': {
      // Response
      quickResponse(res, 200, {
        version: settings.version,
        nodeId: settings.nodeId,
        meshNodes: settings.meshNodes,
        maxKeyLength: maxKeyLength,
        maxValueLength: maxValueLength
      });
      break;
    }

    default: {
      quickResponse(res, 404, {error: 'UNKNOWN_COMMAND'});
    }
  }
});

// Start the server
server.listen(settings.servicePort, settings.host, () => {
  console.log(`Service is running on [http://127.0.0.1:${settings.servicePort}] [NodeId: ${settings.nodeId}]`);
});
