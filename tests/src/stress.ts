import axios from 'axios';

let requestsAmount = 100000;

const clusters = 50;
const workersPerCluster = 20;
const serviceUrl = process.env.SERVICE_URL;
const report: { [key: string]: any } = {
  errors: 0,
  success: 0,
  total: requestsAmount,
  start: new Date(),
  end: null
};

const worker = async () => {
  while (requestsAmount > 0) {
    try {
      let response = await axios.get(`${serviceUrl}/set?k=stress:${requestsAmount}&v=value:${requestsAmount}`);
      report.success++;
    } catch (e) {
      report.errors++;
    }

    requestsAmount--;

    if (requestsAmount % 1000 === 0) {
      console.log(`Left requests: ${requestsAmount}`);
    }

    if (requestsAmount <= 0) {
      showReport();
    }
  }
};

const stress = async () => {
  for (let i = 1; i <= workersPerCluster; i++) {
    worker().catch(console.error);
  }
};

const showReport = () => {
  report.end = new Date();
  const timeDiff = Math.abs(report.start - report.end);

  console.log(`\n==================\n`);
  console.log(`Report:`);
  console.log(` - Total requests: ${report.total}`);
  console.log(` - Total time: ${(timeDiff / 1000).toFixed(2)} sec`);
  console.log(` - Avg request response: ${(report.total / timeDiff).toFixed(2)} ms`);
  console.log(` - Errors: ${report.errors}`);
  console.log(` - Success: ${report.success}`);

  console.timeEnd('Stress test');

  process.exit(0);
};

(async () => {
  console.log(`Stress test with:`);
  console.log(` - Requests: ${requestsAmount}`);
  console.log(` - Clusters: ${clusters}`);
  console.log(` - Workers per cluster: ${workersPerCluster}`);
  console.log(`\n==================\n`);

  for (let i = 1; i <= clusters; i++) {
    stress().catch(console.error);
  }
})();
