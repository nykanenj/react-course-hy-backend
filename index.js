require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'));

morgan.token('reqBody', (req) => {
  if (req.method === 'POST' && req.headers['content-type'] === 'application/json') {
    return JSON.stringify(req.body);
  }
  return null;
});

app.get('/api/', (request, response) => {
  response.send('<h1>Persons API</h1>');
});

app.get('/api/info', (request, response, next) => {
  Person.find({})
    .then((result) => {
      response.send(
        `<div>Puhelinluettelossa ${result.length} henkilön tiedot</div>
        <br />
        <div>${new Date()}</div>`,
      );
    })
    .catch(error => next(error));
  response.send(

  );
});

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((result) => {
      response.json(result.map(person => person.toJSON()));
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person.toJSON());
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  if (body.name === undefined) {
    return response.status(400).json({ error: 'Name missing' });
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: 'Number missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then((createdPerson) => {
      response.json(createdPerson.toJSON());
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);
