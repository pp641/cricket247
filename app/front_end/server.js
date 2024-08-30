const cluster = require('node:cluster');
const process = require('node:process');
const numCPUs = require('os').cpus().length
console.log("okd", numCPUs)
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  require('./worker.js');
}
