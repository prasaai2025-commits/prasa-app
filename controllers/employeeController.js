const pool = require('../config/db');

exports.getAllEmployees = (req, res) => {
  pool.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json(results);
  });
};

exports.createEmployee = (req, res) => {
  const { name, email, position } = req.body;
  pool.query(
    'INSERT INTO employees (name, email, position) VALUES (?, ?, ?)',
    [name, email, position],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err });
      }
      res.status(201).json({ id: results.insertId, name, email, position });
    }
  );
};
