import { RequestHandler } from '../../net/http';

// . Join node to this one and make mesh [mutable]
export const join: RequestHandler = async (db, params) => {
  // @todo
  return {
    action: 'join',
    params
  };
};
