import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('inventory-service is running');
});

export default app;
