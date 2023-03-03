/// Functions that send queries to SQL database
const winston = require('winston');

const pool = require('../../config/database');

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
    createLangRequests: (data, callBack) => {  // create a lang request entry, borrow lang_id
        pool.query(
            `insert into language_requests(lang_id, lang_request_id, created_user_id, assigned_user_id, lr_end_date, lr_type, lr_content, lr_status) 
            values((select lang_id from languages order by lang_id desc limit 1),?, ?, ?, ?, ?, ?, ?)`, // lang_id is 
                //fk, how do we connect a request to the language? increment doesnt work as asynchronous 
                //(ppl put requests in out of sync w language creation)
            [
                data.langReqId,
                data.createdUserId,
                data.assignedUserId,
                data.lr_end,
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
    updateByISO: (id, data, callBack) => { // do we actually need this? how often do iso codes change?
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
                data.isoCode
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
            [data.id,],
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
                data.id
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
                data.lang_req_id
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