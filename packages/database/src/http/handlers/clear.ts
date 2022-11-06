import { RequestHandler } from '../../net/http';

// . Clear all records [mutable]
export const clear: RequestHandler = async (db) => {
  // Database actions [no waiting to execute]
  db.clear()
    .catch(console.error);

  // Response
  return {
    success: true
  };

  /*
  // @todo
	// Request replicate to the other nodes
	app.AsyncReplicateMeshRequest(c.Path(), c.QueryParams(), true)
  */
};
