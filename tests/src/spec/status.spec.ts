import 'mocha';
import { expect } from 'chai';
import axios from 'axios';
import { config } from '../lib/config';

describe('/status', () => {
  describe('Get node status', () => {
    it('Should return expected setting properties as a response', async () => {
      let response;
      let error: any | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/status`);
      } catch (e) {
        error = e;
      }

      // Check errors
      expect(error).to.be.undefined;

      // Check response
      expect(response?.status).to.be.equal(200);
      expect(response?.data).to.be.an('object');
      expect(response?.data?.version).to.be.an('string');
      expect(response?.data?.maxKeyLength).to.be.an('number');
      expect(response?.data?.maxValueLength).to.be.an('number');
      expect(response?.data?.nodeId).to.be.an('string');
    });
  });
});
