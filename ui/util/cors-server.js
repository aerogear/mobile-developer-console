const corsProxy = require('cors-anywhere');

corsProxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2']
}).listen(8080, 'localhost', () => {
  console.log('Running CORS Anywhere on localhost:8080');
});
