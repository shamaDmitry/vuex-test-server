import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import 'dotenv/config';
import routes from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', routes);

app.get('/', async (req, res, next) =>
  res.status(200).json({
    msg: 'hello index page',
  })
);

const port = process.env.PORT || 5000;

const server = http.createServer(app);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
  )
  .then(() => {
    console.log('Mongodb connected');
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch(err => {
    console.log({ err });
    process.exit(1);
  });
