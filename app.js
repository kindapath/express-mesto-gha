const express = require('express');

const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log('My first server ever');

  console.log('My second server ever');
});
