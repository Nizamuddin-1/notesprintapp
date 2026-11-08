const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString() 
  });
});

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  isPinned: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', NoteSchema);

app.get('/api/notes', async (req, res) => {
  try {
    const { search, tag } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (tag) filter.tags = tag;
    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || process.env.APP_PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/notesprint')
    .then(() => app.listen(PORT, () => console.log(`NoteSprint API on port ${PORT} [${process.env.NODE_ENV}]`)))
    .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = app;

