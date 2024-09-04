import db from '../../../src/app/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const todos = db.prepare('SELECT * FROM todos').all();
    res.status(200).json(todos);
  } else if (req.method === 'POST') {
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: 'Missing title or description' });
      return;
    }

    const stmt = db.prepare('INSERT INTO todos (title, description) VALUES (?, ?)');
    const info = stmt.run(title, description);
    res.status(201).json({ id: info.lastInsertRowid, title, description, completed: false });

  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}