import 'mocha';
import { expect } from 'chai';
import axios from 'axios';
import { config } from '../lib/config';

describe('/healthcheck', () => {
  describe('Get node health status', () => {
    it('Should be healthy', async () => {
      let response;
      let error: any | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/healthcheck`);
      } catch (e) {
        error = e;
      }

      // Check errors
      expect(error).to.be.undefined;

      // Check response
      expect(response?.status).to.be.equal(200);
      expect(response?.data).to.be.an('object');
      expect(response?.data?.status).to.be.equal('health');
    });
  });
});
