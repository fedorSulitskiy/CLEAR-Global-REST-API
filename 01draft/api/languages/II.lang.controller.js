/// Executes the SQL queries and catches any immediate connection errors
const winston = require('winston');

const { create, update, showAll, showByID, deleteByID } = require('./I.lang.service');

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

    deleteLang: (req, res) => {
        deleteByID(req.params.id, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                console.log(err);
                winston.error('Deleting language failed.')
                return res.status(500).send('Database connection error');
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find language. ISO code: '+req.params.id);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language deleted. ISO code: '+req.params.id);
            return res.status(200).send(results);
        })
    }
};