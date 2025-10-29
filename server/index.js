import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import https from 'https';

dotenv.config();
const app = express();
app.use(
  cors({ origin: 'https://pacdora-backend.onrender.com', credentials: true })
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

app.listen(5001, () => console.log('Server running on http://localhost:5001'));
