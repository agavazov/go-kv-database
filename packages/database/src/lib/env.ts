/**
 * Centralised object with all environment variables used in the project
 */
export const env = {
  env: process.env.NODE_ENV || 'development',
  servicePort: Number(process.env.SERVICE_PORT) || 80,
  nodeId: process.env.NODE_ID || `Db_${process.env.HOSTNAME}`
};
