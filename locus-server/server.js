const express = require('express');
// const req = require('express/lib/request');

const lib = require('./dbOperations');

// intialize web app with json
const webapp = express();
webapp.use(express.json());
webapp.use(
  express.urlencoded({
    extended: true,
  }),
);

// root endpoint
webapp.get('/', (req, res) => {
    res.json({ message: 'Welcome to locus!' })
});

// Start server; edit the port here if needed
const port = process.env.PORT || 3306;
webapp.listen(port, async () => {
  // TODO: db connection here:
  // db = await lib.connect(url);
  console.log(`Server running on port:${port}`);
});

module.exports = webapp;