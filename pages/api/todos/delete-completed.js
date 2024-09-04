import db from '../../../src/app/db';

export default function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const stmt = db.prepare('DELETE FROM todos WHERE completed = 1');
      stmt.run();
      res.status(200).json({ message: 'All completed todos deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete completed todos' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
