import axios, { AxiosError } from 'axios';
import { expect } from 'chai';
import { envConfig } from '../lib/env-config';

describe('/clear command', () => {
  describe('Successful cleat all the records', () => {
    const testKey = 'test:clear:1';

    it('Should save [normal record] without error', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        const url = `${envConfig.serviceUrl}/set?k=${testKey}&v=ok`;
        response = await axios.get(url);
      } catch (e) {
        error = e as AxiosError<any>;
      }

      // Check errors
      expect(error).to.be.undefined;

      // Check response
      expect(response?.status).to.be.equal(200);
      expect(response?.data).to.be.an('object');
      expect(response?.data?.success).to.be.equal(true);
    });

    it('Should [get the some records] without error', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        const url = `${envConfig.serviceUrl}/getAll`;
        response = await axios.get(url);
      } catch (e) {
        error = e as AxiosError<any>;
      }

      // Check errors
      expect(error).to.be.undefined;

      // Check response
      expect(response?.status).to.be.equal(200);
      expect(response?.data).to.be.an('array');
      expect(response?.data.length).to.be.greaterThanOrEqual(1);
    });

    it('Should [clear all records] without error', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        const url = `${envConfig.serviceUrl}/clear`;
        response = await axios.get(url);
      } catch (e) {
        error = e as AxiosError<any>;
      }

      // Check errors
      expect(error).to.be.undefined;

      // Check response
      expect(response?.status).to.be.equal(200);
      expect(response?.data).to.be.an('object');
      expect(response?.data?.success).to.be.equal(true);
    });
  });
});
