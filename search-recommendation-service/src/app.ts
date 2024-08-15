import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('search-recommendation-service is running');
});

export default app;
