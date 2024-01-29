/// Functions that send queries to SQL database
/// IMPORTANT TIP FOR VSCODE: CTRL + K + CTRL + 2 closes all 2nd level blocks allowing for immidiately easier navigation

const winston = require('winston');
const generateWebToken = require('../../auth/generateToken');
const pool = require('../../config/database');

module.exports = {
    showAllCountries: callBack => {
        pool.query(
            `SELECT 
                c.country_iso_code, 
                c.english_name, 
                cri.regions, 
                cri.intermediate_regions, 
                rc.continents,
                hdx.link hdx_link,
                hdx.description hdx_description,
                pt.link pt_link,
                pt.description pt_description,
                cg.link cg_link,
                cg.description cg_description
            FROM countries c
            INNER JOIN countries_regions_int cri ON c.country_iso_code = cri.country_iso_code
            INNER JOIN regions_continents rc ON cri.regions = rc.regions
            LEFT JOIN hdx_links hdx ON hdx.country_iso_code = c.country_iso_code
            LEFT JOIN pt_links pt ON pt.country_iso_code = c.country_iso_code
            LEFT JOIN clearglobal_links cg ON cg.country_iso_code = c.country_iso_code`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showCountriesByLang: (lang, callBack) => {
        pool.query(
            `SELECT 
                countries.english_name
            FROM langs_countries 
            INNER JOIN countries ON countries.country_iso_code = langs_countries.country_iso_code 
            WHERE langs_countries.lang_id = (SELECT lang_id FROM languages WHERE lang_name = ?)`,
            [lang],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showCountryInfo: (country_name, callBack) => {
        pool.query(
            `SELECT 
                c.country_iso_code, 
                c.english_name, 
                cri.regions, 
                cri.intermediate_regions, 
                rc.continents,
                hdx.link hdx_link,
                hdx.description hdx_description,
                pt.link pt_link,
                pt.description pt_description,
                cg.link cg_link,
                cg.description cg_description
            FROM countries c
            INNER JOIN countries_regions_int cri ON c.country_iso_code = cri.country_iso_code
            INNER JOIN regions_continents rc ON cri.regions = rc.regions
            LEFT JOIN hdx_links hdx ON hdx.country_iso_code = c.country_iso_code
            LEFT JOIN pt_links pt ON pt.country_iso_code = c.country_iso_code
            LEFT JOIN clearglobal_links cg ON cg.country_iso_code = c.country_iso_code
            WHERE c.english_name = ?
            `,
            [country_name],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAllLang: callBack => {
        pool.query(
            `SELECT
                lang_id,
                lang_name, 
                lang_status 
            FROM languages`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAllLangNames: callBack => {
        pool.query(
            `SELECT
                lang_name 
            FROM languages`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAllLangDetails: callBack => {
        pool.query(
            `SELECT 
                languages.lang_name, 
                languages.iso_code, 
                languages.glottocode, 
                languages.lang_status,
                links.link, 
                links.description, 
                alternative_names.alternative_name
            FROM languages 
            LEFT JOIN links ON languages.lang_id = links.lang_id 
            LEFT JOIN alternative_names ON languages.lang_id = alternative_names.lang_id`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showLangDetails: (lang, callBack) => {
        pool.query(
            `SELECT 
                languages.lang_name, 
                languages.iso_code, 
                languages.glottocode, 
                languages.lang_status,
                links.link, 
                links.description, 
                alternative_names.alternative_name
            FROM languages 
            LEFT JOIN links ON languages.lang_id = links.lang_id
            LEFT JOIN alternative_names ON languages.lang_id = alternative_names.lang_id
            WHERE languages.lang_name = ?`,
            [lang],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showRequestsByLang: (lang, callBack) => { ///clarify what exactly Daniel would like to see here 
        pool.query(
            `SELECT * 
            FROM language_requests
            WHERE lang_id = (SELECT lang_id FROM languages WHERE lang_name = ?)`,
            [lang],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showRequestsBetweenDates: (lang, data, callBack) => {
        pool.query(
            `SELECT * 
            FROM language_requests
            WHERE lr_start_date > ? 
            AND lr_start_date < ?
            AND lang_id = (SELECT lang_id FROM languages WHERE lang_name = ?)`,
            [
                data.start_date,
                data.end_date,
                lang
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showMostRecentRequest: callBack => {
        pool.query(
            `SELECT * 
            FROM language_requests
            WHERE lr_start_date = (SELECT MAX(lr_start_date) FROM language_requests)`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    forgotPassword: (data, callBack) => {
        const jsontoken = generateWebToken({ result: data });
        const currentDate = new Date();
        const timestamp = Math.floor(currentDate.getTime() / 1000);
        pool.query(
            `
            INSERT INTO password_reset (user_id, reset_token, timestamp)
            VALUES ((SELECT user_id FROM users WHERE email=?), ?, ?)
            ON DUPLICATE KEY UPDATE reset_token = VALUES(reset_token), timestamp = VALUES(timestamp);
            `,
            [   
                data.email,
                jsontoken,
                timestamp + 60*60 // this is set to 60 minutes after creation because generateWebToken function create a token expiring in an hour
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    extractToken: (email, callBack) => {
        pool.query(
            `SELECT 
                reset_token,
                timestamp
            FROM password_reset
            WHERE user_id = (SELECT user_id FROM users WHERE email=?)`,
            [
                email
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    }
}