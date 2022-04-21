const express = require('express');
// const req = require('express/lib/request');

const lib = require('./dbOperations');
let db;
const url = 'mongodb+srv://cis350:rv1wLHpUDR94Bmmk@locus.cyx90.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

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

// login endpoint
webapp.get('/login', (req, res) => {
  if(!req.body.name || req.body.name.length === 0){
    res.status(404).json({error: 'username not provided'});
    return;
  }
  try {
    
  } catch (err) { 
    res.status(500).json({error: 'something went wrong'});
  }
});

// Start server; edit the port here if needed
const port = process.env.PORT || 3306;
webapp.listen(port, async () => {
  db = await lib.connect(url);
  console.log(`Server running on port:${port}`);
});

module.exports = webapp;