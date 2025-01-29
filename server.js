const express = require('express');
const next = require('next');
const cron = require('node-cron');
const { deleteExpiredFiles } = require('./scripts/deleteExpiredFiles.js');
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client, BUCKET_NAME } = require('./lib/s3.mjs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('/:fileName', async (req, res, next) => {
    const { fileName } = req.params;

    if (fileName === 'terms' || fileName === 'favicon.ico') {
      return handle(req, res);
    }

    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
      });
      
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
      
      // Create a one-time proxy for this specific request
      const proxy = createProxyMiddleware({
        target: signedUrl,
        changeOrigin: true,
        pathRewrite: (path) => '',  
        onProxyRes: (proxyRes, req, res) => {
          if (proxyRes.statusCode === 403 || proxyRes.statusCode === 404) {
            proxyRes.statusCode = 404;
          }
        }
      });

      // Use the proxy for this request
      proxy(req, res, next);
    } catch (error) {
      console.error('Error setting up proxy:', error);
      res.status(404).json({ error: 'File not found' });
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
  });
}); 

cron.schedule('0/15 * * * *', () => {
  console.log('Running a task to delete expired files');
  deleteExpiredFiles();
});