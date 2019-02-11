require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');

app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());

morgan.token('reqBody', function requestBody (req) {
  if(req.method === 'POST' && req.headers["content-type"] === 'application/json') {
    return JSON.stringify(req.body);
  }
  return null;
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'));


app.get('api/', (request, response) => {
  response.send('<h1>Persons API</h1>');
});

app.get('api/info', (request, response) => {
  response.send(
    `<div>Puhelinluettelossa ${persons.length} henkilön tiedot</div>
    <br />
    <div>${new Date}</div>`
  );
});

app.get('/api/persons', (request, response) => {
  Person.find({})
  .then(result => {
    response.json(result.map(person => person.toJSON()));
  })
  .then(() => mongoose.connection.close());
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person.toJSON())
  });
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (body.name === undefined) { 
    return response.status(400).json({ error: 'Name missing' });
  }

  if (body.number === undefined) { 
    return response.status(400).json({ error: 'Number missing' });
  }

  /*
  const exists = persons.find(element => element.name === person.name);

  if (exists) {
    return response.status(409).json({ 
      error:  `Entry already exists for ${person.name}` });
  }
  */

 const person = new Person({
  name: body.name,
  number: body.number,
  });

  person.save().then(createdPerson => {
    response.json(createdPerson.toJSON());
  });
  
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});