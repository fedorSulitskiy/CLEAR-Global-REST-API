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
                latitude,
                longitude,
                aes_status,
                source_comment,
                alternative_names,
                links,
                family_name) 
            values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                data.latitude,
                data.longitude,
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
                lr_content, 
                lr_status) 
            values(?,?,?,?,?,?,?,?)`,
            [
                decoded.user_id, 
                data.assigned_user_id, 
                0, 
                timestamp, 
                data.lang_id, 
                data.lr_type, 
                data.lr_content, 
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
                country_id, 
                lang_id) 
            VALUES(?,?)`,
            [                       
                data.country_id,
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
                country_id, 
                lang_id) 
            VALUES(?,(SELECT lang_id FROM languages WHERE iso_code=?))`,
            [                       
                data.country_id,
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
                latitude = ?,
                longitude = ?,
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
                data.latitude,
                data.longitude,
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
                latitude = ?,
                longitude = ?,
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
                data.latitude,
                data.longitude,
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
                lr_content = ?, 
                lr_status = ?
            where lang_request_id=?`,
            [
                data.createdUserId,
                data.assignedUserId,
                data.lr_end,
                data.lr_start,
                data.lr_type,
                data.lr_content,
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
    showLanguagesByRegion: (region_name, callBack) => {
        pool.query(
            `SELECT DISTINCT 
                languages.*
            FROM languages 
            JOIN langs_countries ON languages.lang_id = langs_countries.lang_id 
            JOIN countries ON langs_countries.country_id = countries.country_id 
            JOIN regions ON countries.region_id = regions.region_id 
            WHERE regions.region_name = ?`,
        [region_name],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showLanguagesBySubregion: (subregion_name, callBack) => {
        pool.query(
            `SELECT DISTINCT 
                languages.*
            FROM languages 
            JOIN langs_countries ON languages.lang_id = langs_countries.lang_id 
            JOIN countries ON langs_countries.country_id = countries.country_id 
            JOIN subregions ON countries.subregion_id = subregions.subregion_id 
            WHERE subregions.subregion_name = ?`,
        [subregion_name],
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
            JOIN countries ON langs_countries.country_id = countries.country_id 
            JOIN intermediate_regions ON countries.int_region_id = intermediate_regions.int_region_id 
            WHERE intermediate_regions.int_region_name = ?`,
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
            `SELECT 
                languages.*
            FROM langs_countries
            INNER JOIN languages ON languages.lang_id = langs_countries.lang_id
            WHERE langs_countries.country_id = (SELECT country_id FROM countries WHERE english_name = ?)`,
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
                countries.iso_code, 
                countries.english_name, 
                countries.french_name, 
                countries.german_name, 
                regions.region_name, 
                subregions.subregion_name, 
                intermediate_regions.int_region_name
            FROM langs_countries 
            INNER JOIN countries ON countries.country_id = langs_countries.country_id 
            INNER JOIN regions ON countries.region_id = regions.region_id 
            INNER JOIN subregions ON countries.subregion_id = subregions.subregion_id
            INNER JOIN intermediate_regions ON countries.int_region_id = intermediate_regions.int_region_id
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
            `DELETE FROM langs_countries WHERE lang_id = ? AND country_id = ?`,
            [
                data.lang_id,
                data.country_id
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