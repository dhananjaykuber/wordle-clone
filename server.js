const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const PORT = 5000;

const app = express();

app.use(cors());

app.get('/word', async (req, res) => {
  const { data } = await axios.get(`${process.env.URL}/api/v1/word`);

  res.send(data);
});

app.get('/check/:word', async (req, res) => {
  const { data } = await axios.get(
    `${process.env.URL}/api/v1/check/${req.params.word}`
  );
  res.send(data);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
