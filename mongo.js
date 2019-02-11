const mongoose = require('mongoose');

const password = process.argv[2];

const url =  
`mongodb+srv://puhelinluettelo_mongo_user:${password}@cluster0-zo7xf.mongodb.net/numerotDB?retryWrites=true`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 3) {
  console.log('Not enough arguments, check that you gave password');
  process.exit(1);
}

if (process.argv.length === 3){
  mongoose.connect(url, {useNewUrlParser: true});
  Person.find({})
  .then(result => {
    result.forEach(person => {
      console.log(person)
    })
  })
  .then(() => mongoose.connection.close());
}

if (process.argv.length === 4) {
  console.log('Not enough arguments, check that you gave password, name and phone-number');
  process.exit(1);
}

if (process.argv.length === 5) {
  mongoose.connect(url, {useNewUrlParser: true});
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(response => {
    console.log(`${process.argv[3]} data saved to db!`);
    mongoose.connection.close();
  })
}

if (process.argv.length > 5) {
  console.log('Too many arguments, check that you gave password, name and phone-number');
  process.exit(1);
}

