/// Executes the SQL queries and catches any immediate connection errors
const winston = require('winston');

const { create, update, showAll, showByID, showByISO, showCountriesByLanguage, showLanguagesByCountry, createLangRequests, deleteByID, deleteByISO } = require('./I.lang.service');

const status500 = function(res, err) {
    winston.error(err);
    return res.status(500).send('Database connection error');
}

module.exports = {
    createLang: (req, res) => {
        const body = req.body;
        create(body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Language with isoCode ${req.body.isoCode} already exists`);
                }
                status500(res, err);
            }
            winston.info('New language created')
            return res.status(200).send(results);
        });
    },
    createLangRequests: (req, res) => {
        const body = req.body;
        create(body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Language request with code ${req.body.langReqId} already exists`);
                }
                status500(res, err);
            }
            winston.info('New language request created')
            return res.status(200).send(results);
        });
    },
    updateLang: (req, res) => {
        const body = req.body;
        updateByID(req.params.id, body, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results) {
                const noAffectedRows = results.affectedRows;
                const noChangedRows = results.changedRows;
                if (noAffectedRows === 0) {
                    winston.error(err);
                    return res.status(404).send("Could not find language");
                }
                if (noChangedRows === 0) {
                    winston.info('No content has been changed. Language ID code: '+req.params.id);
                    return res.status(200).send('No changes implemented');
                }
            }
            winston.info('Language updated. Language ID: '+req.params.id);
            return res.status(200).send(results);
        });
        updateByISO(req.params.isoCode, body, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results) {
                const noAffectedRows = results.affectedRows;
                const noChangedRows = results.changedRows;
                if (noAffectedRows === 0) {
                    winston.error(err);
                    return res.status(404).send("Could not find language");
                }
                if (noChangedRows === 0) {
                    winston.info('No content has been changed. Language ISO code: '+req.params.isoCode);
                    return res.status(200).send('No changes implemented');
                }
            }
            winston.info('Language updated. ISO code: '+req.params.isoCode);
            return res.status(200).send(results);
        });
    },
    updateRequestsByID: (req, res) => { // should the above lang updates also use the keyword update?
        const body = req.body;
        update(req.params.id, body, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results) {
                const noAffectedRows = results.affectedRows;
                const noChangedRows = results.changedRows;
                if (noAffectedRows === 0) {
                    winston.error(err);
                    return res.status(404).send("Could not find request");
                }
                if (noChangedRows === 0) {
                    winston.info('No content has been changed. Request ID code: '+req.params.id);
                    return res.status(200).send('No changes implemented');
                }
            }
            winston.info('Language updated. Language ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    showAll: (req, res) => { // should this be changed? why two?
        showAll((err, results) => {
            if (err) {
                status500(res, err);
            }
            winston.info(results.length+' languages found');
            return res.status(200).send(results);
        })
    },
    showLang: (req, res) => {
        showByID(req.params.id, (err, results) => { 
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find language. Language ID: '+req.params.id);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language found. Language ID: '+req.params.id);
            return res.status(200).send(results);
        })
        showByISO(req.params.isoCode, (err, results) => { 
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find language. Language ISO code: '+req.params.isoCode);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language found. ISO code: '+req.params.id);
            return res.status(200).send(results);
        })
    },
    createLangRequests: (req, res) => {
        const body = req.body;
        createLangRequests(body, req, (err, results) => {
            if (err) {
                status500(res, err);
            }
            winston.info('success!!');
            return res.status(200).send(results);
        });
    },
    showCountriesByLanguage: (req, res) => {
        showCountriesByLanguage(req.params.lang, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find countries for language: ' + req.params.lang);
                return res.status(404).send("Could not find countries");
            }
            winston.info(results.length + ' countries found for language: ' + req.params.lang);
            return res.status(200).send(results);
        });
    },
    showLanguagesByCountry: (req, res) => {
        showLanguagesByCountry(req.params.country, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find languages for country: ' + req.params.country);
                return res.status(404).send("Could not find languages");
            }
            winston.info(results.length + ' languages found for country: ' + req.params.country);
            return res.status(200).send(results);
        });
    },
    showLanguagesByRegion: (req, res) => {
        showLanguagesByRegion(req.params.region_name, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find languages for region: ' + req.params.region_name);
                return res.status(404).send("Could not find languages");
            }
            winston.info(results.length + ' languages found for region: ' + req.params.region_name);
            return res.status(200).send(results);
        });
    },
    showLanguagesBySubregion: (req, res) => {
        showLanguagesBySubregion(req.params.subregion_name, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find languages for subregion: ' + req.params.subregion_name);
                return res.status(404).send("Could not find languages");
            }
            winston.info(results.length + ' languages found for subregion: ' + req.params.subregion_name);
            return res.status(200).send(results);
        });
    },
    showLanguagesByIntregion: (req, res) => {
        showLanguagesByIntregion(req.params.intregion_name, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find languages for intermediate region: ' + req.params.intregion_name);
                return res.status(404).send("Could not find languages");
            }
            winston.info(results.length + ' languages found for intermediate region: ' + req.params.intregion_name);
            return res.status(200).send(results);
        });
    },
    showRequestHistory: (req, res) => {
        showRequestHistory(req.params.id, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find request history for request ID: ' + req.params.id);
                return res.status(404).send("Could not return request history.");
            }
            winston.info(results.length + ' requests found for ID: ' + req.params.id);
            return res.status(200).send(results);
        });
    },
    showOpenRequests: (req, res) => {
        showOpenRequests((err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find any open requests.');
                return res.status(404).send("Could not any open requests.");
            }
            winston.info(results.length + ' open requests. ');
            return res.status(200).send(results);
        });
    },
    showPendingRequests: (req, res) => {
        showPendingRequests((err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find any pending requests.');
                return res.status(404).send("Could not any pending requests.");
            }
            winston.info(results.length + ' pending requests. ');
            return res.status(200).send(results);
        });
    },
    showByAltName: (req, res) => {
        showByAltName(req.params.alt_name, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('No results for: ' + req.params.alt_name);
                return res.status(404).send("No results found.");
            }
            winston.info(results.length + ' results for: ' + req.params.alt_name);
            return res.status(200).send(results);
        });
    },
    showAllDialects: (req, res) => {
        showAllDialects((err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find dialects.');
                return res.status(404).send("Could not find dialects.");
            }
            winston.info(results.length + ' dialects found.');
            return res.status(200).send(results);
        });
    },
    deleteLang: (req, res) => {
        deleteByID(req.params.id, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find language. ID code: '+req.params.id);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language deleted. ID code: '+req.params.id);
            return res.status(200).send(results);
        });
        deleteByISO(req.params.isoCode, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find language. ISO code: '+req.params.isoCode);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language deleted. ISO code: '+req.params.id);
            return res.status(200).send(results);
        });
    }
}