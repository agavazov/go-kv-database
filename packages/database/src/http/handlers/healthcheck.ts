import { RequestHandler } from '../../net/http';

// . Get server heath status (warmup or health) [immutable]
export const healthcheck: RequestHandler = async () => {
  // Response
  return {
    status: 'ok'
  };
};
