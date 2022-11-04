import axios, { AxiosError } from 'axios';
import { expect } from 'chai';
import { config } from '../lib/config';

describe('/get command', () => {
  describe('Successful record get', () => {
    const testKey = 'test:get:1';
    const testValue = 'ok';

    it('Should save [normal record] without error', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/set?k=${testKey}&v=${testValue}`);
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

    it('Should [get the same record] without error', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/get?k=${testKey}`);
      } catch (e) {
        error = e as AxiosError<any>;
      }

      // Check errors
      expect(error).to.be.undefined;

      // Check response
      expect(response?.status).to.be.equal(200);
      expect(response?.data).to.be.an('string');
      expect(response?.data).to.be.equal(testValue);
    });
  });

  describe('Missing record', () => {
    it('Should respond with an error for [missing record]', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/get?k=test:get:missing`);
      } catch (e) {
        error = e as AxiosError<any>;
      }

      // Check errors
      expect(error?.response?.status).to.be.equal(404);
      expect(error).to.be.an('object');
      expect(error?.response?.data?.error).to.be.equal('MISSING_RECORD');

      // Check response
      expect(response?.data).to.be.undefined;
    });
  });

  describe('Fail scenarios', () => {
    it('Should respond with an error for [missing key]', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/get`);
      } catch (e) {
        error = e as AxiosError<any>;
      }

      // Check errors
      expect(error?.response?.status).to.be.equal(400);
      expect(error).to.be.an('object');
      expect(error?.response?.data?.error).to.be.equal('MISSING_KEY_PARAM');

      // Check response
      expect(response?.data).to.be.undefined;
    });

    it('Should respond with an error for [empty key]', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/get?k=`);
      } catch (e) {
        error = e as AxiosError<any>;
      }

      // Check errors
      expect(error?.response?.status).to.be.equal(400);
      expect(error).to.be.an('object');
      expect(error?.response?.data?.error).to.be.equal('EMPTY_KEY');

      // Check response
      expect(response?.data).to.be.undefined;
    });

    it('Should respond with an error for [maximum key length] reached', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/get?k=${'x'.repeat(500)}`);
      } catch (e) {
        error = e as AxiosError<any>;
      }

      // Check errors
      expect(error?.response?.status).to.be.equal(400);
      expect(error).to.be.an('object');
      expect(error?.response?.data?.error).to.be.equal('MAXIMUM_KEY_LENGTH_REACHED');

      // Check response
      expect(response?.data).to.be.undefined;
    });
  });
});
