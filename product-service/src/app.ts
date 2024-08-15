import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('product-service is running');
});

export default app;
