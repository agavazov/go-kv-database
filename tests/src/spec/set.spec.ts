import axios, { AxiosError } from 'axios';
import { expect } from 'chai';
import { config } from '../lib/config';

describe('/set command', () => {
  describe('Successful record set', () => {
    it('Should save [empty value] without error', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/set?k=test:set:2&v=`);
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

    it('Should save [normal value] without error', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/set?k=test:set:3&v=ok`);
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

  describe('UTF16 successful record set', () => {
    const testKey = 'test:set:utf:✓';
    const testValue = '𤭢';

    it('Should save [UTF8 key] and [UTF16 value] without error', async () => {
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

    it('Should get the [UTF16 value] by the [UTF8 key] without error', async () => {
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

  describe('Fail scenarios', () => {
    it('Should respond with an error for [missing key]', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/set`);
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
        response = await axios.get(`${config.serviceUrl}/set?k=`);
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
        response = await axios.get(`${config.serviceUrl}/set?k=${'x'.repeat(500)}`);
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

    it('Should respond with an error for missing [value]', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/set?k=test:set`);
      } catch (e) {
        error = e as AxiosError<any>;
      }

      // Check errors
      expect(error?.response?.status).to.be.equal(400);
      expect(error).to.be.an('object');
      expect(error?.response?.data?.error).to.be.equal('MISSING_VALUE_PARAM');

      // Check response
      expect(response?.data).to.be.undefined;
    });

    it('Should respond with an error for [maximum value length] reached', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/set?k=test:set&v=${'x'.repeat(1000)}`);
      } catch (e) {
        error = e as AxiosError<any>;
      }

      // Check errors
      expect(error?.response?.status).to.be.equal(400);
      expect(error).to.be.an('object');
      expect(error?.response?.data?.error).to.be.equal('MAXIMUM_VALUE_LENGTH_REACHED');

      // Check response
      expect(response?.data).to.be.undefined;
    });
  });
});
