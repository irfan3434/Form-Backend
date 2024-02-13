require('dotenv').config(); // This should automatically load your .env file
console.log(process.env.MONGODB_URI); // This should print your MongoDB URI if it's loaded correctly
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// Built-in middleware for parsing JSON and URL-encoded bodies
app.use(cors());
app.use(express.static(path.join(__dirname, 'FCEC_Repo'))); // Adjusted to a direct folder name
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI; // <-- Change is here
if (!mongoUri) {
  console.error('MONGODB_URI is not defined.');
  process.exit(1); // Exit the application if the URI is not defined
}
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// Define a schema
const prototypeformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phonenumber: { type: String, required: false },
  company: String,
});

// Create a model
const PrototypeForm = mongoose.model('PrototypeForm', prototypeformSchema, 'Prototype Form');

// Route to handle form submission
app.post('/submit-form', async (req, res) => {
  const { name, email, phonenumber, company } = req.body;
  
  console.log(`Name: ${name}, Email: ${email}, Phone: ${phonenumber}, Company: ${company}`);
  
  const formEntry = new PrototypeForm({ name, email, phonenumber, company });

  try {
    await formEntry.save();
    res.send('Form submitted successfully.');
  } catch (error) {
    console.error('Save to MongoDB failed:', error);
    res.status(500).send('An error occurred.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
