import express from 'express';
import router from './routes/index';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 4000;

// Use the routes defined above
app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`Gateway running at http://localhost:${port}`);
});
