/// Functions that send queries to SQL database
const winston = require('winston');

const pool = require('../../config/database');

const { decode } = require('jsonwebtoken');

module.exports = {
    createLang: (data, callBack) => {
        pool.query(
            `insert into languages(
                ref_id,
                source_id,
                lang_name,
                iso_code,
                no_of_trans,
                lang_status,
                glotto_ref,
                official,
                national,
                official_H2H,
                unofficial_H2H,
                total_speakers_nr,
                first_lang_speakers_nr,
                second_lang_speakers_nr,
                internet_users_percent,
                TWB_machine_translation_development,
                TWB_recommended_Pivot_langs,
                community_feasibility,
                recruitment_feasibility,
                recruitment_category,
                total_score_15,
                level,
                aes_status,
                source_comment,
                alternative_names,
                links,
                family_name) 
            values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.ref_id,
                data.source_id,
                data.lang_name,
                data.iso_code,
                data.no_of_trans,
                data.lang_status,
                data.glotto_ref,
                data.official,
                data.national,
                data.official_H2H,
                data.unofficial_H2H,
                data.total_speakers_nr,
                data.first_lang_speakers_nr,
                data.second_lang_speakers_nr,
                data.internet_users_percent,
                data.TWB_machine_translation_development,
                data.TWB_recommended_Pivot_langs,
                data.community_feasibility,
                data.recruitment_feasibility,
                data.recruitment_category,
                data.total_score_15,
                data.level,
                data.aes_status,
                data.source_comment,
                data.alternative_names,
                data.links,
                data.family_name
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    createLangRequests: (data, req, callBack) => {
        // user id extraction
        let token = req.get("authorization");
        token = token.slice(7);
        var decoded = decode(token);
        // for some reason when running tests the generated token is different to normal operations
        if (Object.keys(decoded).length < 4) {
            decoded = decoded.result;
        }
        // current time
        const currentDate = new Date();
        const timestamp = Math.floor(currentDate.getTime() / 1000);

        pool.query(
            `insert into language_requests(
                created_user_id, 
                assigned_user_id, 
                lr_end_date, 
                lr_start_date, 
                lang_id, 
                lr_type, 
                lr_title, 
                lr_reason,
                lr_lang_name,
                lr_alternative_name,
                lr_iso_code,
                lr_glottocode,
                lr_added_countries,
                lr_removed_countries,
                lr_status) 
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                decoded.user_id, 
                data.assigned_user_id, 
                0, 
                timestamp, 
                data.lang_id, 
                data.lr_type, 
                data.lr_title, 
                data.lr_reason,
                data.lr_lang_name,
                data.lr_alternative_name,
                data.lr_iso_code,
                data.lr_glottocode,
                data.lr_added_countries,
                data.lr_removed_countries, 
                data.lr_status
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    addCountryToLanguageByID: (id, data, callBack) => {
        pool.query(
            `INSERT INTO langs_countries(
                country_iso_code,
                official,
                national,
                lang_id) 
            VALUES(?,?,?,?)`,
            [                       
                data.country_iso_code,
                data.official,
                data.national,
                id
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    addCountryToLanguageByISO: (isoCode, data, callBack) => {
        pool.query(
            `INSERT INTO langs_countries(
                country_iso_code, 
                official,
                national,
                lang_id) 
            VALUES(?,?,?,(SELECT lang_id FROM languages WHERE iso_code=?))`,
            [                       
                data.country_iso_code,
                data.official,
                data.national,
                isoCode
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    updateByID: (id, data, callBack) => {
        pool.query(
            `update languages set 
                ref_id = ?,
                source_id = ?,
                lang_name = ?,
                iso_code = ?,
                no_of_trans = ?,
                lang_status = ?,
                glotto_ref = ?,
                official = ?,
                national = ?,
                official_H2H = ?,
                unofficial_H2H = ?,
                total_speakers_nr = ?,
                first_lang_speakers_nr = ?,
                second_lang_speakers_nr = ?,
                internet_users_percent = ?,
                TWB_machine_translation_development = ?,
                TWB_recommended_Pivot_langs = ?,
                community_feasibility = ?,
                recruitment_feasibility = ?,
                recruitment_category = ?,
                total_score_15 = ?,
                level = ?,
                aes_status = ?,
                source_comment = ?,
                alternative_names = ?,
                links = ?,
                family_name = ? 
            where lang_id = ?`,
            [                       
                data.ref_id,
                data.source_id,
                data.lang_name,
                data.iso_code,
                data.no_of_trans,
                data.lang_status,
                data.glotto_ref,
                data.official,
                data.national,
                data.official_H2H,
                data.unofficial_H2H,
                data.total_speakers_nr,
                data.first_lang_speakers_nr,
                data.second_lang_speakers_nr,
                data.internet_users_percent,
                data.TWB_machine_translation_development,
                data.TWB_recommended_Pivot_langs,
                data.community_feasibility,
                data.recruitment_feasibility,
                data.recruitment_category,
                data.total_score_15,
                data.level,
                data.aes_status,
                data.source_comment,
                data.alternative_names,
                data.links,
                data.family_name,
                id
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    updateByISO: (isoCode, data, callBack) => {
        pool.query(
            `update languages set 
                ref_id = ?,
                source_id = ?,
                lang_name = ?,
                iso_code = ?,
                no_of_trans = ?,
                lang_status = ?,
                glotto_ref = ?,
                official = ?,
                national = ?,
                official_H2H = ?,
                unofficial_H2H = ?,
                total_speakers_nr = ?,
                first_lang_speakers_nr = ?,
                second_lang_speakers_nr = ?,
                internet_users_percent = ?,
                TWB_machine_translation_development = ?,
                TWB_recommended_Pivot_langs = ?,
                community_feasibility = ?,
                recruitment_feasibility = ?,
                recruitment_category = ?,
                total_score_15 = ?,
                level = ?,
                aes_status = ?,
                source_comment = ?,
                alternative_names = ?,
                links = ?,
                family_name = ? 
            where iso_code=?`,
            [                        
                data.ref_id,
                data.source_id,
                data.lang_name,
                data.iso_code,
                data.no_of_trans,
                data.lang_status,
                data.glotto_ref,
                data.official,
                data.national,
                data.official_H2H,
                data.unofficial_H2H,
                data.total_speakers_nr,
                data.first_lang_speakers_nr,
                data.second_lang_speakers_nr,
                data.internet_users_percent,
                data.TWB_machine_translation_development,
                data.TWB_recommended_Pivot_langs,
                data.community_feasibility,
                data.recruitment_feasibility,
                data.recruitment_category,
                data.total_score_15,
                data.level,
                data.aes_status,
                data.source_comment,
                data.alternative_names,
                data.links,
                data.family_name,
                isoCode
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    updateRequestsByID: (id, data, callBack) => {
        pool.query(
            `update language_requests set 
                created_user_id = ?, 
                assigned_user_id = ?, 
                lr_end_date = ?, 
                lr_start_date = ?,
                lr_type = ?, 
                lr_title = ?, 
                lr_reason = ?,
                lr_lang_name = ?,
                lr_alternative_name = ?,
                lr_iso_code = ?,
                lr_glottocode = ?,
                lr_added_countries = ?,
                lr_removed_countries = ?, 
                lr_status = ?
            where lang_request_id=?`,
            [
                data.createdUserId,
                data.assignedUserId,
                data.lr_end,
                data.lr_start,
                data.lr_type,
                data.lr_title, 
                data.lr_reason,
                data.lr_lang_name,
                data.lr_alternative_name,
                data.lr_iso_code,
                data.lr_glottocode,
                data.lr_added_countries,
                data.lr_removed_countries,
                data.lr_status,
                id
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAll: callBack => {
        pool.query(
            `select * from languages`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showByID: (id, callBack) => {
        pool.query(
            `select * from languages where lang_id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showByISO: (isoCode, callBack) => {
        pool.query(
            `select * from languages where iso_code = ?`,
            [isoCode],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showRequestsByID: (requestID, callBack) => {
        pool.query(
            `select * from language_requests where lang_request_id = ?`,
            [requestID],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAllRequests: (callBack) => {
        pool.query(
            `select * from language_requests`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showByAltName: (alt_name, callBack) => {
        pool.query(
            `SELECT * from languages 
            WHERE alternative_names = ?`,
            [alt_name],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAllDialects: (callBack) => {
        pool.query(
            `SELECT * from languages 
            WHERE level = 'dialect'`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showLanguagesByContinent: (continent, callBack) => {
        pool.query(
            `SELECT DISTINCT 
                languages.*
            FROM languages 
            JOIN langs_countries ON languages.lang_id = langs_countries.lang_id 
            JOIN countries ON langs_countries.country_iso_code = countries.country_iso_code 
            JOIN countries_regions_int ON countries.country_iso_code = countries_regions_int.country_iso_code 
            JOIN regions_continents ON regions_continents.regions = countries_regions_int.regions
            WHERE regions_continents.continents = ?`,
        [continent],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showLanguagesByRegion: (region, callBack) => {
        pool.query(
            `SELECT DISTINCT 
                languages.*
            FROM languages 
            JOIN langs_countries ON languages.lang_id = langs_countries.lang_id 
            JOIN countries ON langs_countries.country_iso_code = countries.country_iso_code 
            JOIN countries_regions_int ON countries.country_iso_code = countries_regions_int.country_iso_code 
            WHERE countries_regions_int.regions = ?`,
        [region],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showLanguagesByIntregion: (intregion_name, callBack) => {
        pool.query(
            `SELECT DISTINCT 
                languages.*
            FROM languages 
            JOIN langs_countries ON languages.lang_id = langs_countries.lang_id 
            JOIN countries ON langs_countries.country_iso_code = countries.country_iso_code 
            JOIN countries_regions_int ON countries.country_iso_code = countries_regions_int.country_iso_code 
            WHERE countries_regions_int.intermediate_regions = ?`,
        [intregion_name],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showLanguagesByCountry: (country, callBack) => {
        pool.query(
            `SELECT DISTINCT 
                languages.*
            FROM languages 
            JOIN langs_countries ON languages.lang_id = langs_countries.lang_id 
            JOIN countries ON langs_countries.country_iso_code = countries.country_iso_code 
            WHERE countries.english_name = ?`,
            [country],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showCountriesByLanguage: (lang, callBack) => {
        pool.query(
            `SELECT 
                countries.country_iso_code, 
                countries.english_name, 
                countries.french_name, 
                countries.german_name, 
                regions_continents.continents, 
                countries_regions_int.regions, 
                countries_regions_int.intermediate_regions
            FROM langs_countries 
            JOIN countries ON langs_countries.country_iso_code = countries.country_iso_code 
            JOIN countries_regions_int ON countries.country_iso_code = countries_regions_int.country_iso_code 
            JOIN regions_continents ON regions_continents.regions = countries_regions_int.regions
            WHERE langs_countries.lang_id = (SELECT lang_id FROM languages WHERE lang_name = ?);`,
            [lang],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAllCompleteRequests: callBack => {
        pool.query(
            `SELECT * 
            FROM language_requests
            WHERE lr_status='complete'`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showCompleteRequestByLang: (id, callBack) => { /// search by request id, return completed requests /// WHY NOT LANG_ID?
        pool.query(
            `SELECT * 
            FROM language_requests
            WHERE lang_id=? 
            AND lr_status='complete'`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAllOpenRequests: callBack => {
        pool.query(
            `SELECT * from language_requests
            WHERE lr_status='in progress'`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showOpenRequestByLang: (id, callBack) => {
        pool.query(
            `SELECT * from language_requests
            WHERE lang_id=? 
            AND lr_status='in progress'`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAllPendingRequests: callBack => {
        pool.query(
            `SELECT * from language_requests
            WHERE lr_status='pending'`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showPendingRequestsByLang: (id, callBack) => {
        pool.query(
            `SELECT * from language_requests
            WHERE lang_id=? 
            AND lr_status='pending'`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteByISO: (id, callBack) => {
        pool.query(
            `DELETE FROM languages WHERE iso_code = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteByID: (id, callBack) => {
        pool.query(
            `delete from languages where lang_id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteLangsCountry: (data, callBack) => {
        pool.query(
            `DELETE FROM langs_countries WHERE lang_id = ? AND country_iso_code = ?`,
            [
                data.lang_id,
                data.country_iso_code
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteRequest: (id, callBack) => {
        pool.query(
            `DELETE FROM language_requests WHERE lang_request_id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    }
};