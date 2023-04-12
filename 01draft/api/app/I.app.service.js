/// Functions that send queries to SQL database
const winston = require('winston');

const pool = require('../../config/database');

module.exports = {
    showAllCountries: callBack => {
        pool.query(
            `SELECT english_name FROM countries`,
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
                rc.continents
            FROM countries c
            INNER JOIN countries_regions_int cri ON c.country_iso_code = cri.country_iso_code
            INNER JOIN regions_continents rc ON cri.regions = rc.regions
            WHERE english_name = ?;
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
    showLangDetails: (lang, callBack) => {
        pool.query(
            `SELECT
                lang_name,
                iso_code,
                glotto_ref,
                links,
                alternative_names
            FROM languages
            WHERE lang_name = ?`,
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
}