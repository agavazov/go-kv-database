import axios from 'axios';
import { config } from './config';

export const warmupCheck = async (tries = 15): Promise<boolean> => {
  const waitingStatusCode = 503;

  for (let i = 1; i <= tries; i++) {
    let response;
    let error: unknown | undefined;

    try {
      response = await axios.get(`${config.serviceUrl}/`);
    } catch (e) {
      error = e;
    }

    // Get the status code from the response or from the error
    const statusCode = response?.status || error?.response?.status;

    // Break the process and return true
    if (statusCode !== waitingStatusCode) {
      return true;
    }

    // Sleep for 1 second
    await new Promise(r => setTimeout(r, 1000));
  }

  return false;
};
