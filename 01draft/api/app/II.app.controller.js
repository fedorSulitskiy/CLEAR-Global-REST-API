/// Executes the SQL queries and catches any immediate connection errors
/// IMPORTANT TIP FOR VSCODE: CTRL + K + CTRL + 2 closes all 2nd level blocks allowing for immidiately easier navigation

const winston = require('winston');

const { 
    showAllCountries,
    showCountriesByLang,
    showCountryInfo,
    showAllLang,
    showAllLangNames,
    showAllLangDetails,
    showLangDetails,
    showRequestsByLang,
    showRequestsBetweenDates,
    showMostRecentRequest,
    forgotPassword,
    extractToken
} = require('./I.app.service');

const status500 = function(res, err) {
    winston.error(err);
    return res.status(500).send('Database connection error');
}

const refactorMultipleLanguages = function(results) {
    const result = {};
    let string_links = [];
    results.forEach((item) => {
        // main body of info
        if (!result[item.lang_name]) {
            result[item.lang_name] = { language: {
                lang_name: item.lang_name,
                iso_code: item.iso_code,
                lang_status: item.lang_status,
                glottocode: item.glottocode
            }, alternative_names: [], links: [] };
        }
        // alternative names
        if (!result[item.lang_name].alternative_names.includes(item.alternative_name)) {
            if (item.alternative_names !== null) {
                result[item.lang_name].alternative_names.push(item.alternative_name);
            }
        }
        // links
        if (!string_links.includes(JSON.stringify({ link: item.link, description: item.description }))) {
            if (item.link !== null && item.description !== null) {
                result[item.lang_name].links.push({ link: item.link, description: item.description });
            }
            string_links.push(JSON.stringify({ link: item.link, description: item.description })); 
        }
                         
    });
    return result;
};

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
    showAllLangNames: (req, res) => { 
        showAllLangNames((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info(results.length+' languages found');
            return res.status(200).send(results);
        });
    },
    showAllLangDetails: (req, res) => { 
        showAllLangDetails((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info(results.length+' languages found');

            result = refactorMultipleLanguages(results);

            return res.status(200).send(result);
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
            const language = [...new Set(results.map(item => JSON.stringify({ lang_id: item.lang_id, lang_name: item.lang_name, iso_code: item.iso_code, glottocode: item.glottocode, lang_status: item.lang_status })))].map(JSON.parse)[0];
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
    forgotPassword: (req, res) => {
        const body = req.body;
        forgotPassword(body, (err, results) => {
            if (err) {
                if (err.code==='ER_BAD_NULL_ERROR') {
                    winston.error(err)
                    return res.status(404).send(`User with email ${body.email} not found`);
                }
                return status500(res, err);
            }
            winston.info('Link to reset password for user set. User email: '+body.email)
            return res.status(200).send(results);
        });
    },
    extractToken: (req, res) => {
        const body = req.body;
        extractToken(body, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find token for user with email: ' + body.email);
                return res.status(404).send("Could not find token");
            }
            winston.info('Token found. User id: '+body.email)
            return res.status(200).send(results);
        });
    }
}