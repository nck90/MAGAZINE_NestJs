const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'magazine',
    password: 'admin',
    port: 5432,
});

console.log('Attempting connection...');
client.connect()
    .then(() => {
        console.log('SUCCESS: Connected to Postgres!');
        return client.end();
    })
    .catch(err => {
        console.error('FAILURE: Connection failed:', err.message);
        client.end();
    });
