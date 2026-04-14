require ('dotenv').config();
const express = require('express');
const pgp = require('pg-promise')(/* opciones */);
const app = express();
app.use(express.json());

const port = 3000;

const db = pgp(`postgres://${process.env.POSTGRESQL_USER}:${process.env.POSTGRESQL_PASSWORD}@${process.env.POSTGRESQL_HOST}:${process.env.POSTGRESQL_PORT}/${process.env.POSTGRESQL_DATABASE}`);

app.get('/', (req, res) => {
    res.send('Hola!');
});

/* Control de Usuarios */

app.get('/users', async (req, res) => {
    try {
        const users = await db.any('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/users', async (req, res) => {
    const { username, email, password_hash } = req.body;

    try {
        const newUser = await db.one('INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3) RETURNING *', [username, email, password_hash]);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.none('DELETE FROM users WHERE id = $1', [id]);
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});