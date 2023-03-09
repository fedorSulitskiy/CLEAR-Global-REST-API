/// Functions that send queries to SQL database
const winston = require('winston');

const pool = require('../../config/database');

const { decode } = require('jsonwebtoken');

module.exports = {
    createLang: (data, callBack) => { // plan is to combine these into one table..
        pool.query(
            `insert into languages(iso_id, lang_name, lang_status, reference_id, kato_id, source_id, glotto_ref,
            alternative_names, official, national, official_H2H, unofficial_H2H, total_speakers_nr,
            first_lang_speakers_nr, second_lang_speakers_nr, internet_users_percent, TWB_machine_translation_development,
            TWB_recommended_Pivot_langs, community_feasibility, reqruitment_feasibility, reqruitment_category,
            total_score_15, level, latitude, longitude, aes_status, source_comment, alternative_names,
            links, family_name) 
            values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.isoCode,
                data.name,
                data.status,
                data.reference_id,
                data.kato_id,
                data.source_id,
                data.glotto_ref,
                data.alt_names,
                data.official,
                data.national,
                data.official_h2h,
                data.unoffical_h2h,
                data.total_speakers,
                data.first_lang_speakers,
                data.second_lang_speakers,
                data.internet_users_per,
                data.twb_trans,
                data.twb_rec_pivot,
                data.community_feas,
                data.recruitment_feas,
                data.recruitment_cat,
                data.total_score,
                data.level,
                data.latitude,
                data.longitude,
                data.aes_stat,
                data.source_comment,
                data.links,
                data.family_name,
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
        const decoded = decode(token);
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
                decoded.result.user_id, 
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
    updateByISO: (isoCode, data, callBack) => { // do we actually need this? how often do iso codes change?
        pool.query(
            `update languages set iso_id=?, lang_name=?, lang_status =?, reference_id=?, kato_id=?, source_id=?, glotto_ref=?,
            alternative_names=?, official=?, national=?, official_H2H=?, unofficial_H2H=?, total_speakers_nr=?,
            first_lang_speakers_nr=?, second_lang_speakers_nr=?, internet_users_percent=?, TWB_machine_translation_development=?,
            TWB_recommended_Pivot_langs=?, community_feasibility=?, reqruitment_feasibility=?, reqruitment_category=?,
            total_score_15=?, level=?, latitude=?, longitude=?, aes_status=?, source_comment=?, alternative_names=?,
            links=?, family_name =?
            where iso_id=?`,
            [                        
                data.newISOCode,
                data.name,
                data.status,
                data.reference_id,
                data.kato_id,
                data.source_id,
                data.glotto_ref,
                data.alt_names,
                data.official,
                data.national,
                data.official_h2h,
                data.unoffical_h2h,
                data.total_speakers,
                data.first_lang_speakers,
                data.second_lang_speakers,
                data.internet_users_per,
                data.twb_trans,
                data.twb_rec_pivot,
                data.community_feas,
                data.recruitment_feas,
                data.recruitment_cat,
                data.total_score,
                data.level,
                data.latitude,
                data.longitude,
                data.aes_stat,
                data.source_comment,
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
    showByISO: (data, callBack) => {
        pool.query(
            `select * from languages where iso_id = ?`,
            [data.isoCode],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showByID: (data, callBack) => {
        pool.query(
            `select * from languages where lang_id = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showRequestsByID: (data, callBack) => {
        pool.query(
            `select * from languages_requests where lang_request_id = ?`,
            [data.requestsID,],
            [data.requestsID,],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAllRequests: (data, callBack) => {
        pool.query(
            `select * from languages_requests`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAllInfo: (data, callBack) => {
        pool.query(
            `select * from langs_info`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAllInfoByID: (data, callBack) => {
        pool.query(
            `select * from langs_info where lang_id = ?`,
            [id],
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
    showLanguagesByCountry: (country, callBack) => {
        pool.query(
            `SELECT 
                languages.lang_name, 
                languages.iso_code, 
                languages.no_of_trans, 
                languages.lang_status, 
                languages.glotto_ref, 
                languages.official, 
                languages.national, 
                languages.official_H2H, 
                languages.unofficial_H2H, 
                languages.total_speakers_nr, 
                languages.first_lang_speakers_nr, 
                languages.second_lang_speakers_nr, 
                languages.internet_users_percent, 
                languages.TWB_machine_translation_development, 
                languages.TWB_recommended_Pivot_langs, 
                languages.community_feasibility, 
                languages.reqruitment_feasibility, 
                languages.reqruitment_category, 
                languages.total_score_15, 
                languages.level, 
                languages.latitude,
                languages.longitude, 
                languages.aes_status, 
                languages.source_comment, 
                languages.alternative_names, 
                languages.links, 
                languages.family_name
            FROM langs_countries
            INNER JOIN languages ON languages.lang_id = langs_countries.lang_id
            WHERE langs_countries.country_id = (SELECT country_id FROM countries WHERE country_name = ?)`,
            [country],
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
            `update languages set iso_id=?, lang_name=?, lang_status=? reference_id=?, kato_id=?, source_id=?, glotto_ref=?,
            alternative_names=?, official=?, national=?, official_H2H=?, unofficial_H2H=?, total_speakers_nr=?,
            first_lang_speakers_nr=?, second_lang_speakers_nr=?, internet_users_percent=?, TWB_machine_translation_development=?,
            TWB_recommended_Pivot_langs=?, community_feasibility=?, reqruitment_feasibility=?, reqruitment_category=?,
            total_score_15=?, level=?, latitude=?, longitude=?, aes_status=?, source_comment=?, alternative_names=?,
            links=?, family_name=? 
            where lang_id=?`,
            [                       
                data.isoCode,
                data.name,
                data.status,
                data.reference_id,
                data.kato_id,
                data.source_id,
                data.glotto_ref,
                data.alt_names,
                data.official,
                data.national,
                data.official_h2h,
                data.unoffical_h2h,
                data.total_speakers,
                data.first_lang_speakers,
                data.second_lang_speakers,
                data.internet_users_per,
                data.twb_trans,
                data.twb_rec_pivot,
                data.community_feas,
                data.recruitment_feas,
                data.recruitment_cat,
                data.total_score,
                data.level,
                data.latitude,
                data.longitude,
                data.aes_stat,
                data.source_comment,
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
    updateRequestsByID: (id, data, callBack) => {
        pool.query(
            `update language_requests set created_user_id = ?, assigned_user_id = ?, lr_end_date = ?, lr_start_date = ?,
            lr_type = ?, lr_content = ?, lr_status = ?
            where lang_requests_id=?`,
            [                        // all fields for langs_requests here, lang_requests_id is primary key
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
    deleteByISO: (id, callBack) => {
        pool.query(
            `delete from languages where iso_id = ?`,
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
};