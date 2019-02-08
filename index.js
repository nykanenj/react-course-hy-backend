const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

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

app.get('/', (request, response) => {
  response.send('<h1>Persons API</h1>');
});

app.get('/info', (request, response) => {
  response.send(
    `<div>Puhelinluettelossa ${persons.length} henkilön tiedot</div>
    <br />
    <div>${new Date}</div>`
  );
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(person => person.id === Number(request.params.id));
  console.log(person);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post('/api/persons', (request, response) => {
  const id = ~~(Math.random() * 1000000) + 1;
  const stuff = request.body;
  console.log('id', id);
  console.log('stiff', stuff);

});

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(person => person.id !== Number(request.params.id));
  response.status(204).end();
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});