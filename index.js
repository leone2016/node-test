//external dependencies
const express = require('express');
const basicAuth = require('express-basic-auth')

//local dependencies
const file = require('./lib/file');
const converter = require('./lib/converter');
const filter = require('./lib/filter');

//configuration
const app = express();
const port = 3000

//basic auth
app.use(basicAuth({
  users: {
    'usuarioA@gmail.com': '1234567890',
    'usuarioB@gmail.com': '1234567890',
    'usuarioC@gmail.com': '1234567890',
    'usuarioA@hotmail.com': '1234567890',
    'usuarioB@hotmail.com': '1234567890',
    'usuarioB@yahoo.com': '1234567890',
  },
  unauthorizedResponse: (req) => {
    return req.auth ? 'unauthorized' : 'empty credentials'
  }
}))

app.get('/', (req, res) => {
  res.send("ok")
})

app.get('/data', (req, res) => {

  const data = file.LoadFromLocal()
  const dataJSON = converter.FromYaml2JSON(data);
  res.json(dataJSON);
});
/**
 * get user information related in all groups throughout email 
 */
app.get('/data/emailFilter', (req, res) => {
  const data = file.LoadFromLocal()
  const dataJSON = converter.FromYaml2JSON(data);
  res.json(filter.ByEmail(dataJSON, req.auth.user));
});
/**
/**
 * get user information by kind
 */
app.get('/data/emailFilter/:kind', (req, res) => {
  const data = file.LoadFromLocal()
  const dataJSON = converter.FromYaml2JSON(data);
  const dataFiltered = filter.ByEmail(dataJSON, req.auth.user);
  res.json(filter.ByKind(dataFiltered,req.params.kind));
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
