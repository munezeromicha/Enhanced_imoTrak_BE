import express from 'express';
import routes from './routes';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
