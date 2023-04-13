const winston = require('winston');

const { 
    showAllCountries,
    showCountriesByLang,
    showCountryInfo,
    showAllLang,
    showLangDetails,
    showRequestsByLang,
    showRequestsBetweenDates,
    showMostRecentRequest,
} = require('./I.app.service');

const status500 = function(res, err) {
    winston.error(err);
    return res.status(500).send('Database connection error');
}

module.exports = {
    showAllCountries: (req, res) => { 
        showAllCountries((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info(results.length+' countries found');
            return res.status(200).send(results);
        });
    },
    showCountriesByLang: (req, res) => {
        showCountriesByLang(req.params.lang, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find countries for language: ' + req.params.lang);
                return res.status(404).send("Could not find countries");
            }
            winston.info(results.length + ' countries found for language: ' + req.params.lang);
            return res.status(200).send(results);
        });
    },
    showCountryInfo: (req, res) => {
        showCountryInfo(req.params.country_name, (err, results) => { 
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find country: '+req.params.country_name);
                return res.status(404).send("Could not find country");
            }
            winston.info('Country found: '+req.params.country_name);
            return res.status(200).send(results);
        });   
    },
    showAllLang: (req, res) => { 
        showAllLang((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info(results.length+' languages found');
            return res.status(200).send(results);
        });
    },
    showLangDetails: (req, res) => {
        showLangDetails(req.params.lang, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find languges: '+req.params.lang);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language found: '+req.params.lang);

            // returning readable data
            const language = [...new Set(results.map(item => JSON.stringify({ lang_name: item.lang_name, iso_code: item.iso_code, glottocode: item.glottocode })))].map(JSON.parse)[0];
            const alternativeNames = [...new Set(results.map(item => item.alternative_name))];
            const links = [...new Set(results.map(item => JSON.stringify({ link: item.link, description: item.description })))].map(JSON.parse);
            
            results = {
                "language":language,
                "alternative_names":alternativeNames,
                "links":links
            };

            return res.status(200).send(results);
        });
    },
    showRequestsByLang: (req, res) => {
        showRequestsByLang(req.params.lang, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find requests for language: '+req.params.lang);
                return res.status(404).send("Could not find requests");
            }
            winston.info('Requests found, for language: '+req.params.lang);
            return res.status(200).send(results);
        });
    },
    showRequestsBetweenDates: (req, res) => {
        showRequestsBetweenDates(req.params.lang, req.body, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find requests for language: '+req.params.lang+'between these times: '+req.body.start_date+' and '+req.body.end_date);
                return res.status(404).send("Could not find requests");
            }
            winston.info('Requests found, for language: '+req.params.lang);
            return res.status(200).send(results);
        });
    },
    showMostRecentRequest: (req, res) => {
        showMostRecentRequest((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info('Most recent request found');
            return res.status(200).send(results);
        });
    },
}