const proxy = require('http-proxy-middleware');

process.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.log("Node NOT Exiting...");
});

module.exports = function(app) {
  app.use(proxy('/api', { target: 'http://localhost:4000', ws: true }));
  app.use(proxy('/proxy', { target: 'http://localhost:4000', ws: true }));
};
