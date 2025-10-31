import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import https from 'https';

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://huiling97.github.io',
  'https://pacdora-build.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl/Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('🚫 Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-pacdora-appid',
      'x-pacdora-appkey',
    ],
  })
);

app.use(express.json());

// Start export
app.post('/api/export/:fileType', async (req, res) => {
  try {
    const { fileType } = req.params;
    const { projectIds, config } = req.body;
    const url = `https://api.pacdora.com/open/v1/user/projects/export/${fileType}`;

    const response = await axios.post(
      url,
      { projectIds, config },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-pacdora-appid': process.env.PACDORA_APPID,
          'x-pacdora-appkey': process.env.PACDORA_APPKEY,
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: true }),
      }
    );

    const data = response.data;
    if (data.code === 200 && data.data?.length) {
      return res.json({ taskId: data.data[0].taskId });
    }
    res.status(500).json({ error: 'Export failed', details: data });
  } catch (err) {
    res.status(500).json({ error: err.message, details: err.response?.data });
  }
});

// Poll export status
app.get('/api/export-status/:fileType', async (req, res) => {
  try {
    const { fileType } = req.params;
    const { taskId } = req.query;
    const url = `https://api.pacdora.com/open/v1/user/projects/export/${fileType}`;

    const response = await axios.get(url, {
      headers: {
        'x-pacdora-appid': process.env.PACDORA_APPID,
        'x-pacdora-appkey': process.env.PACDORA_APPKEY,
      },
      params: { taskId },
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message, details: err.response?.data });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
