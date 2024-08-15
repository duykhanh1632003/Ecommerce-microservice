import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('discount-coupon-service is running');
});

export default app;
