require('dotenv').config();
// correct url
const url1 = `mongodb+srv://${process.env.MONGO_USER_ADMIN}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
// url for exceptions
const url2 = `mongodb+srv://${process.env.MONGO_USER_ADMIN}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/wrongDatabase?retryWrites=true&w=majority`;
module.exports = {
  url1, url2,
};
