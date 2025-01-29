const express = require('express');
const next = require('next');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const mime = require('mime-types');
const { deleteExpiredFiles } = require('./scripts/deleteExpiredFiles.js');
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client, BUCKET_NAME } = require('./lib/s3.mjs');
const { Readable } = require('stream');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Custom route to serve files
  server.get('/:fileName', async (req, res) => {
    const { fileName } = req.params;

    if (fileName == 'terms' || fileName == 'favicon.ico') {
        return handle(req, res);
    }

    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
      });
      
      const response = await s3Client.send(command);
      
      if (response.ContentType) {
        res.setHeader('Content-Type', response.ContentType);
      }

      // Handle different response.Body types
      const body = response.Body;
      if (body instanceof Readable) {
        // If it's already a readable stream, pipe it
        body.pipe(res);
      } else if (body instanceof Uint8Array || Buffer.isBuffer(body)) {
        // If it's a Uint8Array or Buffer, send it directly
        res.send(body);
      } else if (typeof body === 'string') {
        // If it's a string, send it as-is
        res.send(body);
      } else {
        // For other types, try to convert to buffer
        const buffer = Buffer.from(await body.transformToByteArray());
        res.send(buffer);
      }
    } catch (error) {
      console.error('Error fetching file:', error);
      res.status(404).json({ error: 'File not found' });
    }
  });

  // Default Next.js request handler
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