const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const cookie = require('cookie');

const app = express();
const port = process.env.PORT || 3001;
dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_STRING)
.then(() => console.log('Connected!'))
.catch((error) => console.error('Connection error:', error));

app.use(cors());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})