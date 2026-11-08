import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notes`);
      const data = await res.json();
      if (Array.isArray(data)) setNotes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const createNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    await fetch(`${API_BASE}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags })
    });
    setTitle('');
    setContent('');
    setTagInput('');
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await fetch(`${API_BASE}/api/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
  };

  return (
    <div className="container">
      <header className="header">
        <h2>NoteSprint</h2>
        <span className="env-pill">API: {API_BASE}</span>
      </header>

      <form onSubmit={createNote} className="note-form">
        <input 
          placeholder="Note Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          className="input-title"
        />
        <div className="editor-grid">
          <textarea 
            placeholder="Write markdown content here..." 
            rows={6} 
            value={content} 
            onChange={e => setContent(e.target.value)} 
          />
          <div className="preview-pane">
            <em>Live Preview:</em>
            <div className="preview-content">{content || 'Nothing to preview'}</div>
          </div>
        </div>
        <input 
          placeholder="Tags (comma-separated, e.g. devops, aws, ci/cd)" 
          value={tagInput} 
          onChange={e => setTagInput(e.target.value)} 
          className="input-tags"
        />
        <button type="submit" className="btn-save">Save Note</button>
      </form>

      <div className="notes-grid">
        {notes.map(note => (
          <div key={note._id} className="note-card">
            <button onClick={() => deleteNote(note._id)} className="btn-close">✕</button>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <div className="tags-container">
              {note.tags?.map(t => (
                <span key={t} className="tag-chip">#{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

