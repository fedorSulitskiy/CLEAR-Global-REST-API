/// Executes the SQL queries and catches any immediate connection errors
const winston = require('winston');

const { 
    createLang, 
    createLangRequests, 
    addCountryToLanguageByID,
    addCountryToLanguageByISO,
    updateByID,
    updateByISO,
    updateRequestsByID,
    showAll,
    showByID,
    showByISO,
    showRequestsByID,
    showAllRequests,
    showByAltName,
    showAllDialects,
    showLanguagesByRegion,
    showLanguagesBySubregion,
    showLanguagesByIntregion,
    showLanguagesByCountry,
    showCountriesByLanguage,
    showAllCompleteRequests,
    showCompleteRequestByLang,
    showAllOpenRequests,
    showOpenRequestByLang,
    showAllPendingRequests,
    showPendingRequestsByLang,
    deleteByID,
    deleteByISO,
    deleteLangsCountry
} = require('./I.lang.service');

const status500 = function(res, err) {
    winston.error(err);
    return res.status(500).send('Database connection error');
}

module.exports = {
    createLang: (req, res) => {
        const body = req.body;
        createLang(body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Language with isoCode ${req.body.iso_code} already exists`);
                }
                status500(res, err);
            }
            winston.info('New language created')
            return res.status(200).send(results);
        });
    },
    createLangRequests: (req, res) => {
        const body = req.body;
        createLangRequests(body, req, (err, results) => {
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
    addCountryToLanguageByID: (req, res) => {
        const body = req.body;
        addCountryToLanguageByID(req.params.id, body, (err, results) => {
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
                    winston.info('No content has been changed. Language ISO code: '+req.params.id);
                    return res.status(200).send('No changes implemented');
                }
            }
            winston.info('Language location updated. Country ID: '+body.country_id+'. Language ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    addCountryToLanguageByISO: (req, res) => {
        const body = req.body;
        addCountryToLanguageByISO(req.params.isoCode, body, (err, results) => {
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
            winston.info('Language location updated. Country ID: '+body.country_id+'. ISO code: '+req.params.isoCode);
            return res.status(200).send(results);
        });
    },
    updateLangByID: (req, res) => {
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
    },
    updateLangByISO: (req, res) => {
        const body = req.body;
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
        updateRequestsByID(req.params.id, body, (err, results) => {
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
    showAll: (req, res) => { 
        showAll((err, results) => {
            if (err) {
                status500(res, err);
            }
            winston.info(results.length+' languages found');
            return res.status(200).send(results);
        });
    },
    showLangByID: (req, res) => {
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
        });   
    },
    showLangByISO: (req, res) => {
        showByISO(req.params.isoCode, (err, results) => { 
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find language. Language ISO code: '+req.params.isoCode);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language found. ISO code: '+req.params.isoCode);
            return res.status(200).send(results);
        });
    },
    showLangRequestsByID: (req, res) => {
        showRequestsByID(req.params.id, (err, results) => { 
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find request. Language ID: '+req.params.isoCode);
                return res.status(404).send("Could not find request");
            }
            winston.info('Request found. Language ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    showAllRequests: (req, res) => {
        showAllRequests((err, results) => {
            if (err) {
                status500(res, err);
            }
            winston.info(results.length+' requests found');
            return res.status(200).send(results);
        });
    },
    showLangByAltName: (req, res) => {
        showByAltName(req.params.alt_name, (err, results) => { 
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find language. Language alternative name: '+req.params.alt_name);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language found. Alternative name: '+req.params.alt_name);
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
    showLangByRegion: (req, res) => {
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
    showLangBySubregion: (req, res) => {
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
    showLangByIntregion: (req, res) => {
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
    showLangByCountry: (req, res) => {
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
    showAllCompleteRequests: (req, res) => {
        showAllCompleteRequests((err, results) => {
            if (err) {
                status500(res, err);
            }
            winston.info(results.length+' requests found');
            return res.status(200).send(results);
        });
    },
    showCompleteRequestByLang: (req, res) => {
        showCompleteRequestByLang(req.params.id, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find complete request history for language ID: ' + req.params.id);
                return res.status(404).send("Could not return complete request history.");
            }
            winston.info(results.length + ' complete requests found for ID: ' + req.params.id);
            return res.status(200).send(results);
        });
    },
    showAllOpenRequests: (req, res) => {
        showAllOpenRequests((err, results) => {
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
    showOpenRequestByLang: (req, res) => {
        showOpenRequestByLang(req.params.id, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find open request history for language ID: ' + req.params.id);
                return res.status(404).send("Could not return open request history.");
            }
            winston.info(results.length + ' open requests found for ID: ' + req.params.id);
            return res.status(200).send(results);
        });
    },
    showAllPendingRequests: (req, res) => {
        showAllPendingRequests((err, results) => {
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
    showPendingRequestsByLang: (req, res) => {
        showPendingRequestsByLang(req.params.id, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find pending request history for language ID: ' + req.params.id);
                return res.status(404).send("Could not return pending request history.");
            }
            winston.info(results.length + ' pending requests found for ID: ' + req.params.id);
            return res.status(200).send(results);
        });
    },
    deleteLangByID: (req, res) => {
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
    },
    deleteLangByISO: (req, res) => {
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
    },
    deleteLangsCountry: (req, res) => {
        const body = req.body;
        deleteLangsCountry(body, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find record. Language ID: '+body.lang_id+'. Country ID: '+body.country_id);
                return res.status(404).send("Could not find record");
            }
            winston.info('Record deleted. Language ID: '+body.lang_id+'. Country ID: '+body.country_id);
            return res.status(200).send(results);
        });
    }
}