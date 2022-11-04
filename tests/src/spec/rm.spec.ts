import axios, { AxiosError } from 'axios';
import { expect } from 'chai';
import { config } from '../lib/config';

describe('/rm command', () => {
  describe('Successful record remove', () => {
    const testKey = 'test:rm:1';

    it('Should save [normal record] without error', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/set?k=${testKey}&v=ok`);
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

    it('Should [remove the same record] without error', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/rm?k=${testKey}`);
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

    it('Should respond with an error for [missing record] after try to remove the same record again', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${config.serviceUrl}/rm?k=${testKey}`);
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
        response = await axios.get(`${config.serviceUrl}/rm`);
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
        response = await axios.get(`${config.serviceUrl}/rm?k=`);
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
        response = await axios.get(`${config.serviceUrl}/rm?k=${'x'.repeat(500)}`);
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
