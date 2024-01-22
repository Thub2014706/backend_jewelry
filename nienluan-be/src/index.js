const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3001;
dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_STRING)
.then(() => console.log('Connected!'))
.catch((error) => console.error('Connection error:', error));

app.use(cors({credentials: true, origin: 'http://localhost:3000',}));
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})