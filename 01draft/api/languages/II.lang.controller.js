const winston = require('winston');

const { create } = require('./I.lang.service');

module.exports = {
    createLang: (req, res) => {
        const body = req.body;
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                winston.error('Creating new language failed.')
                return res.status(500).send('Database connection error');
            }
            winston.info('New language created')
            return res.status(200).send(results);
        });
    },
};