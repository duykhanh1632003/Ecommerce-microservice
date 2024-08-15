import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('notification-service is running');
});

export default app;
