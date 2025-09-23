import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [limitReached, setLimitReached] = useState(false);

  async function load() {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/notes', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setNotes(data);
      setLimitReached(data.length >= 3);
    }
  }

  useEffect(() => { load(); }, []);

  async function create() {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title, content }) });
    if (res.status === 403) alert('Free plan limit reached. Please upgrade.');
    else if (res.ok) { setTitle(''); setContent(''); load(); }
  }

  async function remove(id: number) {
    const token = localStorage.getItem('token');
    await fetch(`/api/notes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  }

  return (
    <div style={{ maxWidth: 760, margin: '24px auto' }}>
      <h1>Notes</h1>
      {limitReached && <div style={{ background: '#ffe', padding: 12 }}>Free plan limit reached — <strong>Upgrade to Pro</strong></div>}
      <div>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" />
        <button onClick={create}>Create</button>
      </div>
      <ul>
        {notes.map(n => (
          <li key={n.id}>
            <h3>{n.title}</h3>
            <p>{n.content}</p>
            <button onClick={() => remove(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
