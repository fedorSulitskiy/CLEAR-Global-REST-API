/// Functions that send queries to SQL database
/// IMPORTANT TIP FOR VSCODE: CTRL + K + CTRL + 2 closes all 2nd level blocks allowing for immidiately easier navigation

const winston = require('winston');

const pool = require('../../config/database');

const { decode } = require('jsonwebtoken');

module.exports = {
    createLang: (data, callBack) => {
        pool.query(
            `insert into languages(
                source_id,
                lang_name,
                iso_code,
                no_of_trans,
                lang_status,
                glottocode,
                total_speakers_nr,
                first_lang_speakers_nr,
                second_lang_speakers_nr,
                level,
                aes_status,
                family_name) 
            values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.source_id,
                data.lang_name,
                data.iso_code,
                data.no_of_trans,
                data.lang_status,
                data.glottocode,
                data.total_speakers_nr,
                data.first_lang_speakers_nr,
                data.second_lang_speakers_nr,
                data.level,
                data.aes_status,
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
                lr_lang_status,
                lr_status) 
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
                data.lr_lang_status,
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
                internet_users_percent,
                lang_id) 
            VALUES(?,?,?,?,?)`,
            [                       
                data.country_iso_code,
                data.official,
                data.national,
                data.internet_users_percent,
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
    addRefs: (id, data, callBack) => {
        pool.query(
            `BEGIN; \
            INSERT INTO refs(glottolog_ref_id, lgcode, bib) VALUES(?, ?, ?); \
            INSERT INTO lang_ref(ref_id, lang_id) VALUES(LAST_INSERT_ID(), ?); \
            COMMIT;`,
            [
                data.glottolog_ref_id,
                data.lgcode,
                data.bib,
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
    addSourceComment: (id, data, callBack) => {
        pool.query(
            `
            INSERT INTO source_comment (lang_id, comment)
            VALUES (?, ?);
            `,
            [
                id,
                data.comment
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    addAlternativeName: (id, data, callBack) => {
        pool.query(
            `
            INSERT INTO alternative_names (lang_id, alternative_name, source)
            VALUES (?, ?, ?);
            `,
            [
                id,
                data.alternative_name,
                data.source
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    addLinks: (id, data, callBack) => {
        pool.query(
            `
            INSERT INTO links (lang_id, link, description)
            VALUES (?, ?, ?);
            `,
            [
                id,
                data.link,
                data.description
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    addHDXLinks: (isoCode, data, callBack) => {
        pool.query(
            `
            INSERT INTO hdx_links (country_iso_code, link, description)
            VALUES (?, ?, ?);
            `,
            [
                isoCode,
                data.link,
                data.description
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    addPublicTableauLinks: (isoCode, data, callBack) => {
        pool.query(
            `
            INSERT INTO pt_links (country_iso_code, link, description)
            VALUES (?, ?, ?);
            `,
            [
                isoCode,
                data.link,
                data.description
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    addClearGlobalLinks: (isoCode, data, callBack) => {
        pool.query(
            `
            INSERT INTO clearglobal_links (country_iso_code, link, description)
            VALUES (?, ?, ?);
            `,
            [
                isoCode,
                data.link,
                data.description
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
            `UPDATE languages SET 
                source_id = ?, 
                lang_name = ?, 
                iso_code = ?, 
                no_of_trans = ?, 
                lang_status = ?, 
                glottocode = ?, 
                total_speakers_nr = ?, 
                first_lang_speakers_nr = ?, 
                second_lang_speakers_nr = ?, 
                level = ?, 
                aes_status = ?, 
                family_name = ? 
            WHERE lang_id = ?`,
            [                       
                data.source_id,
                data.lang_name,
                data.iso_code,
                data.no_of_trans,
                data.lang_status,
                data.glottocode,
                data.total_speakers_nr,
                data.first_lang_speakers_nr,
                data.second_lang_speakers_nr,
                data.level,
                data.aes_status,
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
            `UPDATE languages SET 
                source_id = ?, 
                lang_name = ?, 
                iso_code = ?, 
                no_of_trans = ?, 
                lang_status = ?, 
                glottocode = ?, 
                total_speakers_nr = ?, 
                first_lang_speakers_nr = ?, 
                second_lang_speakers_nr = ?, 
                level = ?, 
                aes_status = ?, 
                family_name = ?
            WHERE iso_code=?`,
            [                        
                data.source_id,
                data.lang_name,
                data.iso_code,
                data.no_of_trans,
                data.lang_status,
                data.glottocode,
                data.total_speakers_nr,
                data.first_lang_speakers_nr,
                data.second_lang_speakers_nr,
                data.level,
                data.aes_status,
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
                lr_lang_status = ?,
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
                data.lr_lang_status,
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
    updateRefs: (id, data, callBack) => {
        pool.query(
            `UPDATE refs SET 
                glottolog_ref_id = ?, 
                lgcode = ?,
                bib = ?
            WHERE ref_id = ?`,
            [   
                data.glottolog_ref_id,
                data.lgcode,
                data.bib,
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
    updateLinks: (id, data, callBack) => {
        pool.query(
            `UPDATE links SET 
                lang_id = ?,
                link = ?,
                description = ?
            WHERE link_id = ?`,
            [   
                data.lang_id,
                data.link,
                data.description,
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
            `SELECT 
                languages.*, 
                refs.*, 
                links.link, 
                links.description,
                alternative_names.alternative_name, 
                source_comment.comment 
            FROM languages 
            LEFT JOIN lang_ref ON languages.lang_id = lang_ref.lang_id 
            LEFT JOIN refs ON lang_ref.ref_id = refs.ref_id 
            LEFT JOIN links ON languages.lang_id = links.lang_id 
            LEFT JOIN alternative_names ON languages.lang_id = alternative_names.lang_id 
            LEFT JOIN source_comment ON languages.lang_id = source_comment.lang_id`,
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
            `SELECT 
                languages.*, 
                refs.*, 
                links.link, 
                links.description,
                alternative_names.alternative_name, 
                source_comment.comment 
            FROM languages 
            LEFT JOIN lang_ref ON languages.lang_id = lang_ref.lang_id 
            LEFT JOIN refs ON lang_ref.ref_id = refs.ref_id 
            LEFT JOIN links ON languages.lang_id = links.lang_id 
            LEFT JOIN alternative_names ON languages.lang_id = alternative_names.lang_id 
            LEFT JOIN source_comment ON languages.lang_id = source_comment.lang_id
            WHERE languages.lang_id = ?`,
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
            `SELECT 
                languages.*, 
                refs.*, 
                links.link, 
                links.description,
                alternative_names.alternative_name, 
                source_comment.comment 
            FROM languages 
            LEFT JOIN lang_ref ON languages.lang_id = lang_ref.lang_id 
            LEFT JOIN refs ON lang_ref.ref_id = refs.ref_id 
            LEFT JOIN links ON languages.lang_id = links.lang_id 
            LEFT JOIN alternative_names ON languages.lang_id = alternative_names.lang_id 
            LEFT JOIN source_comment ON languages.lang_id = source_comment.lang_id
            WHERE languages.iso_code = ?`,
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
            `SELECT 
                languages.*, 
                refs.*, 
                links.link, 
                links.description,
                alternative_names.alternative_name, 
                source_comment.comment 
            FROM languages 
            LEFT JOIN lang_ref ON languages.lang_id = lang_ref.lang_id 
            LEFT JOIN refs ON lang_ref.ref_id = refs.ref_id 
            LEFT JOIN links ON languages.lang_id = links.lang_id 
            LEFT JOIN alternative_names ON languages.lang_id = alternative_names.lang_id 
            LEFT JOIN source_comment ON languages.lang_id = source_comment.lang_id
            WHERE languages.lang_id = (SELECT lang_id FROM alternative_names WHERE alternative_name = ?);`,
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
            `SELECT 
                languages.*, 
                refs.*, 
                links.link, 
                links.description,
                alternative_names.alternative_name, 
                source_comment.comment 
            FROM languages 
            LEFT JOIN lang_ref ON languages.lang_id = lang_ref.lang_id 
            LEFT JOIN refs ON lang_ref.ref_id = refs.ref_id 
            LEFT JOIN links ON languages.lang_id = links.lang_id 
            LEFT JOIN alternative_names ON languages.lang_id = alternative_names.lang_id 
            LEFT JOIN source_comment ON languages.lang_id = source_comment.lang_id
            WHERE languages.level = 'dialect'`,
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
                languages.*, 
                refs.*, 
                links.link, 
                links.description,
                alternative_names.alternative_name, 
                source_comment.comment 
            FROM languages 
            LEFT JOIN lang_ref ON languages.lang_id = lang_ref.lang_id 
            LEFT JOIN refs ON lang_ref.ref_id = refs.ref_id 
            LEFT JOIN links ON languages.lang_id = links.lang_id 
            LEFT JOIN alternative_names ON languages.lang_id = alternative_names.lang_id 
            LEFT JOIN source_comment ON languages.lang_id = source_comment.lang_id
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
                languages.*, 
                refs.*, 
                links.link, 
                links.description,
                alternative_names.alternative_name, 
                source_comment.comment 
            FROM languages 
            LEFT JOIN lang_ref ON languages.lang_id = lang_ref.lang_id 
            LEFT JOIN refs ON lang_ref.ref_id = refs.ref_id 
            LEFT JOIN links ON languages.lang_id = links.lang_id 
            LEFT JOIN alternative_names ON languages.lang_id = alternative_names.lang_id 
            LEFT JOIN source_comment ON languages.lang_id = source_comment.lang_id
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
                languages.*, 
                refs.*, 
                links.link, 
                links.description,
                alternative_names.alternative_name, 
                source_comment.comment 
            FROM languages 
            LEFT JOIN lang_ref ON languages.lang_id = lang_ref.lang_id 
            LEFT JOIN refs ON lang_ref.ref_id = refs.ref_id 
            LEFT JOIN links ON languages.lang_id = links.lang_id 
            LEFT JOIN alternative_names ON languages.lang_id = alternative_names.lang_id 
            LEFT JOIN source_comment ON languages.lang_id = source_comment.lang_id
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
                languages.*, 
                refs.*, 
                links.link, 
                links.description,
                alternative_names.alternative_name, 
                source_comment.comment 
            FROM languages 
            LEFT JOIN lang_ref ON languages.lang_id = lang_ref.lang_id 
            LEFT JOIN refs ON lang_ref.ref_id = refs.ref_id 
            LEFT JOIN links ON languages.lang_id = links.lang_id 
            LEFT JOIN alternative_names ON languages.lang_id = alternative_names.lang_id 
            LEFT JOIN source_comment ON languages.lang_id = source_comment.lang_id
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
            FROM langs_countries 
            LEFT JOIN countries c ON langs_countries.country_iso_code = c.country_iso_code 
            LEFT JOIN countries_regions_int cri ON c.country_iso_code = cri.country_iso_code
            LEFT JOIN regions_continents rc ON cri.regions = rc.regions
            LEFT JOIN hdx_links hdx ON hdx.country_iso_code = c.country_iso_code
            LEFT JOIN pt_links pt ON pt.country_iso_code = c.country_iso_code
            LEFT JOIN clearglobal_links cg ON cg.country_iso_code = c.country_iso_code
            WHERE langs_countries.lang_id = (SELECT lang_id FROM languages WHERE lang_name = ?);;`,
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
            `DELETE FROM languages WHERE lang_id = ?`,
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
    },
    deleteRefs: (id, callBack) => {
        pool.query(
            `DELETE lang_ref, refs 
            FROM lang_ref 
            JOIN refs ON refs.ref_id = lang_ref.ref_id 
            WHERE lang_ref.ref_id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteSourceComment: (data, callBack) => {
        pool.query(
            `DELETE FROM source_comment WHERE lang_id = ? AND comment = ?`,
            [
                data.lang_id,
                data.comment
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteAlternativeName: (data, callBack) => {
        pool.query(
            `DELETE FROM alternative_names WHERE lang_id = ? AND alternative_name = ? AND source = ?`,
            [
                data.lang_id,
                data.alternative_name,
                data.source
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteLink: (id, callBack) => {
        pool.query(
            `DELETE FROM links WHERE link_id = ?`,
            [
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
    deleteHDXLink: (isoCode, data, callBack) => {
        pool.query(
            `DELETE FROM hdx_links WHERE country_iso_code = ? AND link = ?`,
            [
                isoCode,
                data.link
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deletePublicTableauLink: (isoCode, data, callBack) => {
        pool.query(
            `DELETE FROM pt_links WHERE country_iso_code = ? AND link = ?`,
            [
                isoCode,
                data.link
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteClearGlobalLink: (isoCode, data, callBack) => {
        pool.query(
            `DELETE FROM clearglobal_links WHERE country_iso_code = ? AND link = ?`,
            [
                isoCode,
                data.link
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
};