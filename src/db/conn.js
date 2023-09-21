// getting-started.js
require('dotenv').config();
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_GB, { useNewUrlParser: true, useUnifiedTopology: true });

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log("no connection")
})