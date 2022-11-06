import { env } from '../../lib/env';
import { RequestHandler } from '../../net/http';
import { dbMaxKeyLength, dbMaxValueLength } from '../../storages/nkv-database';

// . Get server settings [immutable]
export const status: RequestHandler = async (db) => {
  // Response
  return {
    version: '0.0.1',
    nodeId: env.nodeId,
    servicePort: env.servicePort,
    maxKeyLength: dbMaxKeyLength,
    maxValueLength: dbMaxValueLength,
    availableRecords: db.size()
  };
};
