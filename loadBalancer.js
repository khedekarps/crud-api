// loadBalancer.js
const http = require('http');
const proxy = require('http-proxy');
const port = process.env.PORT || 4000;

const proxyServer = proxy.createProxyServer({});
const workerAddresses = [];
const numCPUs = 4;
for (let i = 1; i < numCPUs; i++) {
  workerAddresses.push(`http://127.0.0.1:${Number(port) + i}/api`);
}

const server = http.createServer((req, res) => {
  const target = workerAddresses.shift();
  workerAddresses.push(target);
  console.log(`Proxying to ${target}`);
  proxyServer.web(req, res, { target });
});

server.listen(port, () => {
  console.log('Load balancer listening on port ' + port);
});
