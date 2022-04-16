const { MongoClient } = require('mongodb');

// url is the MongoDB url provided
const connect = async (url) => {
    try {
      const con = (
        await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
      ).db();
      console.log('Connected to DB');
      return con;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to establish DB connection');
    }
};

// TODO: add more ops

module.exports = {
    connect,
}
