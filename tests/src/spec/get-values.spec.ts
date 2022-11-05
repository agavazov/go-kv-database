import axios, { AxiosError } from 'axios';
import { expect } from 'chai';
import { envConfig } from '../lib/env-config';

describe('/getValues command', () => {
  describe('Successful clear all the records', () => {
    it('Should [clear all records] without error', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${envConfig.serviceUrl}/clear`);
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

  describe('Successful get all the values', () => {
    const testRecords = [...Array(10).keys()].map(key => ({
      k: `test:getValues:k:${key}`,
      v: `test:getValues:v:${key}`
    }));

    it(`Should save [TWICE ${testRecords.length} records] without error`, async () => {
      for (let i = 1; i <= 2; i++) {
        for (const testItem of testRecords) {
          let response;
          let error: AxiosError<any> | undefined;

          try {
            response = await axios.get(`${envConfig.serviceUrl}/set?k=${testItem.k}&v=${testItem.v}`);
          } catch (e) {
            error = e as AxiosError<any>;
          }

          // Check errors
          expect(error).to.be.undefined;

          // Check response
          expect(response?.status).to.be.equal(200);
          expect(response?.data).to.be.an('object');
          expect(response?.data?.success).to.be.equal(true);
        }
      }
    });

    it('Should [get the SAME UNIQUE records values] without error', async () => {
      let response;
      let error: AxiosError<any> | undefined;

      try {
        response = await axios.get(`${envConfig.serviceUrl}/getValues`);
      } catch (e) {
        error = e as AxiosError<any>;
      }

      // Check errors
      expect(error).to.be.undefined;

      // Check response
      expect(response?.status).to.be.equal(200);
      expect(response?.data).to.be.an('array');
      expect(response?.data.length).to.be.greaterThanOrEqual(testRecords.length);

      // Compare the records
      for (const testItem of testRecords) {
        const matches = response?.data.filter((dataItem: string) => {
          return dataItem === testItem.v;
        });

        expect(matches.length).to.be.equal(1);
      }
    });
  });
});
