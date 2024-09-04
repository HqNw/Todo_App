import db from '../../../src/app/db';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.status(200).json(todo);

  } else if (req.method === 'PUT') {
    const { title, description, completed } = req.body;
    const completedValue = completed ? 1 : 0;

    const stmt = db.prepare('UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?');
    stmt.run(title, description, completedValue, id);
    res.status(200).json({ id, title, description, completed: completedValue });

  } else if (req.method === 'DELETE') {

    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    stmt.run(id);
    res.status(204).end();

  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}