/// Executes the SQL queries and catches any immediate connection errors
/// IMPORTANT TIP FOR VSCODE: CTRL + K + CTRL + 2 closes all 2nd level blocks allowing for immidiately easier navigation

const winston = require('winston');

const { 
    createLang, 
    createLangRequests, 
    addCountryToLanguageByID,
    addCountryToLanguageByISO,
    addRefs,
    addSourceComment,
    addAlternativeName,
    addLinks,
    addHDXLinks,
    addPublicTableauLinks,
    addClearGlobalLinks,
    updateByID,
    updateByISO,
    updateRequestsByID,
    updateRefs,
    updateLinks,
    showAll,
    showByID,
    showByISO,
    showRequestsByID,
    showAllRequests,
    showByAltName,
    showAllDialects,
    showLanguagesByContinent,
    showLanguagesByRegion,
    showLanguagesByIntregion,
    showLanguagesByCountry,
    showCountriesByLanguage,
    showAllCompleteRequests,
    showCompleteRequestByLang,
    showAllOpenRequests,
    showOpenRequestByLang,
    showAllPendingRequests,
    showPendingRequestsByLang,
    deleteByID,
    deleteByISO,
    deleteLangsCountry,
    deleteRequest,
    deleteRefs,
    deleteSourceComment,
    deleteAlternativeName,
    deleteLink,
    deleteHDXLink,
    deletePublicTableauLink,
    deleteClearGlobalLink
} = require('./I.lang.service');

const status500 = function(res, err) {
    winston.error(err);
    return res.status(500).send('Database connection error');
};

const refactorMultipleLanguages = function(results) {
    const result = {};
    let string_links = [];
    let string_refs = [];
    results.forEach((item) => {
        // main body of info
        if (!result[item.lang_name]) {
            result[item.lang_name] = { language: {
                lang_id: item.lang_id,
                source_id: item.source_id,
                lang_name: item.lang_name,
                iso_code: item.iso_code,
                no_of_trans: item.no_of_trans,
                lang_status: item.lang_status,
                glottocode: item.glottocode,
                total_speakers_nr: item.total_speakers_nr,
                first_lang_speakers_nr: item.first_lang_speakers_nr,
                second_lang_speakers_nr: item.second_lang_speakers_nr,
                TWB_machine_translation_development: item.TWB_machine_translation_development,
                TWB_recommended_Pivot_langs: item.TWB_recommended_Pivot_langs,
                community_feasibility: item.community_feasibility,
                recruitment_feasibility: item.recruitment_feasibility,
                recruitment_category: item.recruitment_category,
                total_score_15: item.total_score_15,
                level: item.level,
                aes_status: item.aes_status,
                family_name: item.family_name
            }, alternative_names: [], links: [], source_comments: [], refs: [] };
        }
        // alternative names
        if (!result[item.lang_name].alternative_names.includes(item.alternative_name)) {
            if (item.alternative_names !== null) {
                result[item.lang_name].alternative_names.push(item.alternative_name);
            }
        }
        // source comments
        if (!result[item.lang_name].source_comments.includes(item.comment)) {
            if (item.comment !== null) {
                result[item.lang_name].source_comments.push(item.comment);
            }
        } 
        // refs
        if (!string_refs.includes(JSON.stringify({ ref_id: item.ref_id, glottolog_ref_id: item.glottolog_ref_id, lgcode: item.lgcode, bib: item.bib }))) {
            if (item.ref_id !== null && item.glottolog_ref_id !== null && item.lgcode !== null && item.bib !== null) {
                result[item.lang_name].refs.push({ ref_id: item.ref_id, glottolog_ref_id: item.glottolog_ref_id, lgcode: item.lgcode, bib: item.bib });
            }
            string_refs.push(JSON.stringify({ ref_id: item.ref_id, glottolog_ref_id: item.glottolog_ref_id, lgcode: item.lgcode, bib: item.bib })); 
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

const refactorSingleLanguage = function(results) {
    // main body of info
    const language = [...new Set(results.map(item => JSON.stringify({ 
        lang_id: item.lang_id,
        source_id: item.source_id,
        lang_name: item.lang_name,
        iso_code: item.iso_code,
        no_of_trans: item.no_of_trans,
        lang_status: item.lang_status,
        glottocode: item.glottocode,
        total_speakers_nr: item.total_speakers_nr,
        first_lang_speakers_nr: item.first_lang_speakers_nr,
        second_lang_speakers_nr: item.second_lang_speakers_nr,
        TWB_machine_translation_development: item.TWB_machine_translation_development,
        TWB_recommended_Pivot_langs: item.TWB_recommended_Pivot_langs,
        community_feasibility: item.community_feasibility,
        recruitment_feasibility: item.recruitment_feasibility,
        recruitment_category: item.recruitment_category,
        total_score_15: item.total_score_15,
        level: item.level,
        aes_status: item.aes_status,
        family_name: item.family_name,
    })))].map(JSON.parse)[0];
    // alternative names
    const alternativeNames = [...new Set(results.map(item => item.alternative_name !== null ? item.alternative_name : null))].filter(Boolean);
    // links
    const links = results.filter(item => item.link !== null && item.description !== null)
        .reduce((uniqueLinks, item) => {
            const linkDescObj = { link: item.link, description: item.description };
            if (!uniqueLinks.some(link => JSON.stringify(link) === JSON.stringify(linkDescObj))) {
                uniqueLinks.push(linkDescObj);
            }
            return uniqueLinks;
        }, []);
    // source comments
    const source_comments = [...new Set(results.map(item => item.comment !== null ? item.comment : null))].filter(Boolean);
    // refs
    const refs = results.filter(item => item.ref_id !== null && item.glottolog_ref_id !== null && item.lgcode !== null && item.bib !== null)
        .reduce((uniqueRefs, item) => {
            const refDescObj = { ref_id: item.ref_id, glottolog_ref_id: item.glottolog_ref_id, lgcode: item.lgcode, bib: item.bib };
            if (!uniqueRefs.some(link => JSON.stringify(link) === JSON.stringify(linkDescObj))) {
                uniqueRefs.push(refDescObj);
            }
            return uniqueRefs;
        }, []);

    return {
        "language":language,
        "alternative_names":alternativeNames,
        "links":links,
        "source_comments": source_comments,
        "refs": refs
    };
};

module.exports = {
    createLang: (req, res) => {
        const body = req.body;
        createLang(body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Language with isoCode ${req.body.iso_code} already exists`);
                }
                return status500(res, err);
            }
            winston.info('New language created')
            return res.status(200).send(results);
        });
    },
    createLangRequests: (req, res) => {
        const body = req.body;
        createLangRequests(body, req, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info('New language request created')
            return res.status(200).send(results);
        });
    },
    addCountryToLanguageByID: (req, res) => {
        const body = req.body;
        addCountryToLanguageByID(req.params.id, body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Language with ID ${req.body.id} and country ID ${body.country_iso_code} already exists`);
                }
                return status500(res, err);
            }
            winston.info('Language location updated. Country ID: '+body.country_iso_code+'. Language ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    addCountryToLanguageByISO: (req, res) => {
        const body = req.body;
        addCountryToLanguageByISO(req.params.isoCode, body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Language with ISO Code ${req.params.isoCode} and country ID ${body.country_iso_code} already exists`);
                }
                return status500(res, err);
            }
            winston.info('Language location updated. Country ID: '+body.country_iso_code+'. ISO code: '+req.params.isoCode);
            return res.status(200).send(results);
        });
    },
    addRefs: (req, res) => {
        const body = req.body;
        addRefs(req.params.id, body, (err, results) => {
            if (err) {
                if (err.code==='ER_NO_REFERENCED_ROW_2') {
                    winston.error(err)
                    return res.status(404).send(`Language with id ${req.params.id} not found`);
                }
                return status500(res, err);
            }
            winston.info('New references added, for language with id: '+req.params.id)
            return res.status(200).send(results);
        });
    },
    addSourceComment: (req, res) => {
        const body = req.body;
        addSourceComment(req.params.id, body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Source comment ${body.comment} for language with id: ${req.params.id} already exists`);
                }
                if (err.code==='ER_NO_REFERENCED_ROW_2') {
                    winston.error(err)
                    return res.status(404).send(`Language with id ${req.params.id} not found`);
                }
                return status500(res, err);
            }
            winston.info('New source comment added, for language with id: '+req.params.id)
            return res.status(200).send(results);
        });
    },
    addAlternativeName: (req, res) => {
        const body = req.body;
        addAlternativeName(req.params.id, body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Alternative name ${body.alternative_name} for language with id: ${req.params.id} already exist`);
                }
                if (err.code==='ER_NO_REFERENCED_ROW_2') {
                    winston.error(err)
                    return res.status(404).send(`Language with id ${req.params.id} not found`);
                }
                return status500(res, err);
            }
            winston.info('New alternative names added, for language with id: '+req.params.id)
            return res.status(200).send(results);
        });
    },
    addLinks: (req, res) => {
        const body = req.body;
        addLinks(req.params.id, body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Link ${body.link} for language with id: ${req.params.id} already exist`);
                }
                if (err.code==='ER_NO_REFERENCED_ROW_2') {
                    winston.error(err)
                    return res.status(404).send(`Language with id ${req.params.id} not found`);
                }
                return status500(res, err);
            }
            winston.info('New links added, for language with id: '+req.params.id)
            return res.status(200).send(results);
        });
    },
    addHDXLinks: (req, res) => {
        const body = req.body;
        addHDXLinks(req.params.isoCode, body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Links for country with iso_code: ${req.params.isoCode} already exist`);
                }
                return status500(res, err);
            }
            winston.info('New links added, for country with iso_code: '+req.params.isoCode)
            return res.status(200).send(results);
        });
    },
    addPublicTableauLinks: (req, res) => {
        const body = req.body;
        addPublicTableauLinks(req.params.isoCode, body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Links for country with iso_code: ${req.params.isoCode} already exist`);
                }
                return status500(res, err);
            }
            winston.info('New links added, for country with iso_code: '+req.params.isoCode)
            return res.status(200).send(results);
        });
    },
    addClearGlobalLinks: (req, res) => {
        const body = req.body;
        addClearGlobalLinks(req.params.isoCode, body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`Links for country with iso_code: ${req.params.isoCode} already exist`);
                }
                return status500(res, err);
            }
            winston.info('New links added, for country with iso_code: '+req.params.isoCode)
            return res.status(200).send(results);
        });
    },
    updateLangByID: (req, res) => {
        const body = req.body;
        updateByID(req.params.id, body, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results) {
                const noAffectedRows = results.affectedRows;
                const noChangedRows = results.changedRows;
                if (noAffectedRows === 0) {
                    winston.error(err);
                    return res.status(404).send("Could not find language");
                }
                if (noChangedRows === 0) {
                    winston.info('No content has been changed. Language ID code: '+req.params.id);
                    return res.status(200).send('No changes implemented');
                }
            }
            winston.info('Language updated. Language ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    updateLangByISO: (req, res) => {
        const body = req.body;
        updateByISO(req.params.isoCode, body, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results) {
                const noAffectedRows = results.affectedRows;
                const noChangedRows = results.changedRows;
                if (noAffectedRows === 0) {
                    winston.error(err);
                    return res.status(404).send("Could not find language");
                }
                if (noChangedRows === 0) {
                    winston.info('No content has been changed. Language ISO code: '+req.params.isoCode);
                    return res.status(200).send('No changes implemented');
                }
            }
            winston.info('Language updated. ISO code: '+req.params.isoCode);
            return res.status(200).send(results);
        });
    },
    updateRequestsByID: (req, res) => { // should the above lang updates also use the keyword update?
        const body = req.body;
        updateRequestsByID(req.params.id, body, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results) {
                const noAffectedRows = results.affectedRows;
                const noChangedRows = results.changedRows;
                if (noAffectedRows === 0) {
                    winston.error(err);
                    return res.status(404).send("Could not find request");
                }
                if (noChangedRows === 0) {
                    winston.info('No content has been changed. Request ID code: '+req.params.id);
                    return res.status(200).send('No changes implemented');
                }
            }
            winston.info('Language updated. Language ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    updateRefs: (req, res) => {
        const body = req.body;
        updateRefs(req.params.id, body, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results) {
                const noAffectedRows = results.affectedRows;
                const noChangedRows = results.changedRows;
                if (noAffectedRows === 0) {
                    winston.error(err);
                    return res.status(404).send("Could not find reference");
                }
                if (noChangedRows === 0) {
                    winston.info('No content has been changed. Reference ID code: '+req.params.id);
                    return res.status(200).send('No changes implemented');
                }
            }
            winston.info('Reference updated. Reference ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    updateLinks: (req, res) => {
        const body = req.body;
        updateLinks(req.params.id, body, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results) {
                const noAffectedRows = results.affectedRows;
                const noChangedRows = results.changedRows;
                if (noAffectedRows === 0) {
                    winston.error(err);
                    return res.status(404).send("Could not find link");
                }
                if (noChangedRows === 0) {
                    winston.info('No content has been changed. Link ID: '+req.params.id);
                    return res.status(200).send('No changes implemented');
                }
            }
            winston.info('Link updated. Link ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    showAll: (req, res) => { 
        showAll((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info(results.length+' languages found');
            
            const result = refactorMultipleLanguages(results);

            return res.status(200).send(Object.values(result));
        });
    },
    showLangByID: (req, res) => {
        showByID(req.params.id, (err, results) => { 
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find language. Language ID: '+req.params.id);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language found. Language ID: '+req.params.id);

            const result = refactorSingleLanguage(results);
            
            return res.status(200).send(result);
        });   
    },
    showLangByISO: (req, res) => {
        showByISO(req.params.isoCode, (err, results) => { 
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find language. Language ISO code: '+req.params.isoCode);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language found. ISO code: '+req.params.isoCode);

            const result = refactorSingleLanguage(results);

            return res.status(200).send(result);
        });
    },
    showLangRequestsByID: (req, res) => {
        showRequestsByID(req.params.id, (err, results) => { 
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find request. Language ID: '+req.params.isoCode);
                return res.status(404).send("Could not find request");
            }
            winston.info('Request found. Language ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    showAllRequests: (req, res) => {
        showAllRequests((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info(results.length+' requests found');
            return res.status(200).send(results);
        });
    },
    showLangByAltName: (req, res) => {
        showByAltName(req.params.alt_name, (err, results) => { 
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find language. Language alternative name: '+req.params.alt_name);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language found. Alternative name: '+req.params.alt_name);

            const result = refactorMultipleLanguages(results);

            return res.status(200).send(Object.values(result));
        });
    },
    showAllDialects: (req, res) => {
        showAllDialects((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info(results.length + ' dialects found.');

            const result = refactorMultipleLanguages(results);

            return res.status(200).send(Object.values(result));
        });
    },
    showLanguagesByContinent: (req, res) => {
        showLanguagesByContinent(req.params.continent, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find languages for continent: ' + req.params.continent);
                return res.status(404).send("Could not find languages");
            }
            winston.info(results.length + ' languages found for continent: ' + req.params.continent);
            
            const result = refactorMultipleLanguages(results);

            return res.status(200).send(Object.values(result));
        });
    },
    showLanguagesByRegion: (req, res) => {
        showLanguagesByRegion(req.params.region_name, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find languages for region: ' + req.params.region_name);
                return res.status(404).send("Could not find languages");
            }
            winston.info(results.length + ' languages found for region: ' + req.params.region_name);
            
            const result = refactorMultipleLanguages(results);

            return res.status(200).send(Object.values(result));
        });
    },
    showLanguagesByIntregion: (req, res) => {
        showLanguagesByIntregion(req.params.intregion_name, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find languages for intermediate region: ' + req.params.intregion_name);
                return res.status(404).send("Could not find languages");
            }
            winston.info(results.length + ' languages found for intermediate region: ' + req.params.intregion_name);
            
            const result = refactorMultipleLanguages(results);

            return res.status(200).send(Object.values(result));
        });
    },
    showLangByCountry: (req, res) => {
        showLanguagesByCountry(req.params.country, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find languages for country: ' + req.params.country);
                return res.status(404).send("Could not find languages");
            }
            winston.info(results.length + ' languages found for country: ' + req.params.country);
            
            const result = refactorMultipleLanguages(results);

            return res.status(200).send(Object.values(result));
        });
    },
    showCountriesByLanguage: (req, res) => {
        showCountriesByLanguage(req.params.lang, (err, results) => {
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
    showAllCompleteRequests: (req, res) => {
        showAllCompleteRequests((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info(results.length+' requests found');
            return res.status(200).send(results);
        });
    },
    showCompleteRequestByLang: (req, res) => {
        showCompleteRequestByLang(req.params.id, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find complete request history for language ID: ' + req.params.id);
                return res.status(404).send("Could not return complete request history.");
            }
            winston.info(results.length + ' complete requests found for ID: ' + req.params.id);
            return res.status(200).send(results);
        });
    },
    showAllOpenRequests: (req, res) => {
        showAllOpenRequests((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info(results.length + ' open requests. ');
            return res.status(200).send(results);
        });
    },
    showOpenRequestByLang: (req, res) => {
        showOpenRequestByLang(req.params.id, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find open request history for language ID: ' + req.params.id);
                return res.status(404).send("Could not return open request history.");
            }
            winston.info(results.length + ' open requests found for ID: ' + req.params.id);
            return res.status(200).send(results);
        });
    },
    showAllPendingRequests: (req, res) => {
        showAllPendingRequests((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info(results.length + ' pending requests. ');
            return res.status(200).send(results);
        });
    },
    showPendingRequestsByLang: (req, res) => {
        showPendingRequestsByLang(req.params.id, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results.length === 0) {
                winston.error('Could not find pending request history for language ID: ' + req.params.id);
                return res.status(404).send("Could not return pending request history.");
            }
            winston.info(results.length + ' pending requests found for ID: ' + req.params.id);
            return res.status(200).send(results);
        });
    },
    deleteLangByID: (req, res) => {
        deleteByID(req.params.id, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                return status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find language. ID code: '+req.params.id);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language deleted. ID code: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    deleteLangByISO: (req, res) => {
        deleteByISO(req.params.isoCode, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                return status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find language. ISO code: '+req.params.isoCode);
                return res.status(404).send("Could not find language");
            }
            winston.info('Language deleted. ISO code: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    deleteLangsCountry: (req, res) => {
        const body = req.body;
        deleteLangsCountry(body, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                return status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find record. Language ID: '+body.lang_id+'. Country ID: '+body.country_iso_code);
                return res.status(404).send("Could not find record");
            }
            winston.info('Record deleted. Language ID: '+body.lang_id+'. Country ID: '+body.country_iso_code);
            return res.status(200).send(results);
        });
    },
    deleteRequest: (req, res) => {
        deleteRequest(req.params.id, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                return status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find request. ID: '+req.params.id);
                return res.status(404).send("Could not find request");
            }
            winston.info('Request deleted. ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    deleteRefs: (req, res) => {
        deleteRefs(req.params.id, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                return status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find reference. ID: '+req.params.id);
                return res.status(404).send("Could not find reference");
            }
            winston.info('Reference deleted. ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    deleteSourceComment: (req, res) => {
        body = req.body;
        deleteSourceComment(body, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                return status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find source comment. Details: '+body);
                return res.status(404).send("Could not find source comment");
            }
            winston.info('Source comment deleted. Details: '+body);
            return res.status(200).send(results);
        });
    },
    deleteAlternativeName: (req, res) => {
        body = req.body;
        deleteAlternativeName(body, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                return status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find alternative name. Details: '+body);
                return res.status(404).send("Could not find alternative name");
            }
            winston.info('Alternative name deleted. Details: '+body);
            return res.status(200).send(results);
        });
    },
    deleteLink: (req, res) => {
        deleteLink(req.params.id, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                return status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find link. Link ID: '+req.params.id);
                return res.status(404).send("Could not find link");
            }
            winston.info('Link deleted. Link ID: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    deleteHDXLink: (req, res) => {
        body = req.body;
        deleteHDXLink(req.params.isoCode, body, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                return status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find link. Details: ' + body);
                return res.status(404).send("Could not find link");
            }
            winston.info('Link deleted. Details: ' + body);
            return res.status(200).send(results);
        });
    },
    deletePublicTableauLink: (req, res) => {
        body = req.body;
        deletePublicTableauLink(req.params.isoCode, body, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                return status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find link. Details: ' + body);
                return res.status(404).send("Could not find link");
            }
            winston.info('Link deleted. Details: ' + body);
            return res.status(200).send(results);
        });
    },
    deleteClearGlobalLink: (req, res) => {
        body = req.body;
        deleteClearGlobalLink(req.params.isoCode, body, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                return status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find link. Details: ' + body);
                return res.status(404).send("Could not find link");
            }
            winston.info('Link deleted. Details: ' + body);
            return res.status(200).send(results);
        });
    },
}