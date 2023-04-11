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
            INNER JOIN countries ON countries.country_id = langs_countries.country_id 
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
                countries.iso_code, 
                countries.english_name, 
                regions.region_name, 
                subregions.subregion_name, 
                intermediate_regions.int_region_name 
            FROM countries 
            INNER JOIN regions ON countries.region_id = regions.region_id 
            INNER JOIN subregions ON countries.subregion_id = subregions.subregion_id 
            INNER JOIN intermediate_regions ON countries.int_region_id = intermediate_regions.int_region_id 
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
    // acceptChange: () => {
    //     pool.query(
    //         `update languages set 
    //             ref_id = ?,
    //             source_id = ?,
    //             lang_name = ?,
    //             iso_code = ?,
    //             no_of_trans = ?,
    //             lang_status = ?,
    //             glotto_ref = ?,
    //             official = ?,
    //             national = ?,
    //             official_H2H = ?,
    //             unofficial_H2H = ?,
    //             total_speakers_nr = ?,
    //             first_lang_speakers_nr = ?,
    //             second_lang_speakers_nr = ?,
    //             internet_users_percent = ?,
    //             TWB_machine_translation_development = ?,
    //             TWB_recommended_Pivot_langs = ?,
    //             community_feasibility = ?,
    //             recruitment_feasibility = ?,
    //             recruitment_category = ?,
    //             total_score_15 = ?,
    //             level = ?,
    //             aes_status = ?,
    //             source_comment = ?,
    //             alternative_names = ?,
    //             links = ?,
    //             family_name = ? 
    //         where iso_code=?`,
    //         [                        
                
    //         ],
    //         (error, results, fields) => {
    //             if (error) {
    //                 return callBack(error);
    //             }
    //             return callBack(null, results);
    //         }
    //     );
    // },
    showRequestsBetweenDates: (lang, data, callBack) => {
        pool.query(
            `SELECT * 
            FROM language_requests
            WHERE lr_start_date < ? 
            AND lr_end_date > ?
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