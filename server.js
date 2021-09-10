const dotenv = require('dotenv');
const mongoose = require('mongoose')
dotenv.config({path: `${__dirname}/config.env`});

const app = require('./app');
// console.log(process.env);
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
    .then(() => console.log('Database connection succeed!!!'))
    .catch(() => console.log('Database connection Failed!!!'))
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`)
});
