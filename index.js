const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

app.use(express.static('build'))
app.use(cors());
app.use(bodyParser.json());

const url =  
`mongodb+srv://puhelinluettelo_mongo_user:${password}@cluster0-zo7xf.mongodb.net/numerotDB?retryWrites=true`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

morgan.token('reqBody', function requestBody (req) {
  if(req.method === 'POST' && req.headers["content-type"] === 'application/json') {
    return JSON.stringify(req.body);
  }
  return null;
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'));

let persons = [
  {
    "name": "Lea Kutvonen",
    "number": "0000000000",
    "id": 4
  },
  {
    "name": "Kalle Kaalinen",
    "number": "0109998888",
    "id": 6
  },
  {
    "name": "Kirsti Kaalinen",
    "number": "1112223333",
    "id": 7
  }
];

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
  mongoose.connect(url, {useNewUrlParser: true});
  Person.find({})
  .then(result => {
    result.forEach(person => {
      console.log(person)
    })
  })
  .then(() => mongoose.connection.close());
});

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(person => person.id === Number(request.params.id));
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post('/api/persons', (request, response) => {
  const person = request.body;

  if (person.name === undefined) { 
    return response.status(400).json({ error: 'name missing' });
  }
  
  if (person.number === undefined) { 
    return response.status(400).json({ error: 'number missing' });
  }

  const exists = persons.find(element => element.name === person.name);

  if (exists) {
    return response.status(409).json({ 
      error:  `Entry already exists for ${person.name}` });
  }

  person.id = ~~(Math.random() * 1000000) + 1;

  persons = persons.concat(person);
  response.json(person);

});

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(person => person.id !== Number(request.params.id));
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});