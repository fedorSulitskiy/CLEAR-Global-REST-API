/// Connects the SQL query executor functions with html requests
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
    updateLangByID,
    updateLangByISO,
    updateRequestsByID,
    updateRefs,
    updateLinks,
    showAll,
    showLangByID,
    showLangByISO,
    showLangRequestsByID,
    showAllRequests,
    showByAltName,
    showAllDialects,
    showLanguagesByContinent,
    showLanguagesByRegion,
    showLanguagesByIntregion,
    showLangByCountry,
    showCountriesByLanguage,
    showAllCompleteRequests,
    showCompleteRequestByLang,
    showAllOpenRequests,
    showOpenRequestByLang,
    showAllPendingRequests,
    showPendingRequestsByLang,
    deleteLangByID,
    deleteLangByISO,
    deleteLangsCountry,
    deleteRequest,
    deleteRefs,
    deleteSourceComment,
    deleteAlternativeName,
    deleteLink,
    deleteHDXLink,
    deletePublicTableauLink,
    deleteClearGlobalLink
} = require('./II.lang.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/auth');
// unregistered users can only see informationbut not change or add it

/// General Languages Related Operations
router.post("/", createLang);
router.post("/refs/:id", checkToken, addRefs);
router.post("/sourceComment/:id", checkToken, addSourceComment);
router.post("/alternativeNames/:id", checkToken, addAlternativeName);
router.post("/links/:id", checkToken, addLinks);
router.patch("/:id(\\d+)", checkToken, updateLangByID);
router.patch("/:isoCode(\[a-zA-Z]{2,4})", checkToken, updateLangByISO);
router.patch("/refs/:id", checkToken, updateRefs);
router.patch("/links/:id", checkToken, updateLinks);
router.get("/", showAll);
router.get("/:id(\\d+)", showLangByID);
router.get("/:isoCode(\[a-zA-Z]{2,4})", showLangByISO); // ISO codes can't go above 3 but I made it 4 to allow to create an impossible test ISO code, verification on it being 3 should be done at front-end
router.delete("/:id(\\d+)", checkToken, deleteLangByID);
router.delete("/:isoCode(\[a-zA-Z]{2,4})", checkToken, deleteLangByISO);
router.delete("/refs/:id", checkToken, deleteRefs);
router.delete("/sourceComment/", checkToken, deleteSourceComment);
router.delete("/alternativeNames/", checkToken, deleteAlternativeName);
router.delete("/links/:id", checkToken, deleteLink);

/// Adding Countries
router.post("/newCountry/:id(\\d+)", checkToken, addCountryToLanguageByID);
router.post("/newCountry/:isoCode(\[a-zA-Z]{2,4})", checkToken, addCountryToLanguageByISO);
router.delete("/newCountry", checkToken, deleteLangsCountry);

/// Country links
router.post("/hdx/:isoCode", checkToken, addHDXLinks);
router.post("/pt/:isoCode", checkToken, addPublicTableauLinks);
router.post("/clearglobal/:isoCode", checkToken, addClearGlobalLinks);
router.delete("/hdx/:isoCode", checkToken, deleteHDXLink);
router.delete("/pt/:isoCode", checkToken, deletePublicTableauLink);
router.delete("/clearglobal/:isoCode", checkToken, deleteClearGlobalLink);

/// Searching by Alternative Name
router.get("/alt_name/:alt_name", showByAltName);

/// See all dialects
router.get("/dialects", showAllDialects);

/// Regional Ones
router.get("/continent/:continent", showLanguagesByContinent);
router.get("/region/:region_name", showLanguagesByRegion);
router.get("/intregion/:intregion_name", showLanguagesByIntregion);
router.get("/country/:country", showLangByCountry); // works for only English names

/// Show Countries
router.get("/showCountries/:lang", showCountriesByLanguage);

/// Request related
router.post("/requests", checkToken, createLangRequests);
router.patch("/requests/:id", checkToken, updateRequestsByID);
router.get("/requests/:id(\\d+)", checkToken, showLangRequestsByID);
router.get("/requests", checkToken, showAllRequests);
router.get("/requests/complete", checkToken, showAllCompleteRequests);
router.get("/requests/complete/:id(\\d+)", checkToken, showCompleteRequestByLang);
router.get("/requests/open", checkToken, showAllOpenRequests);
router.get("/requests/open/:id(\\d+)", checkToken, showOpenRequestByLang);
router.get("/requests/pending", checkToken, showAllPendingRequests);
router.get("/requests/pending/:id(\\d+)", checkToken, showPendingRequestsByLang);
router.delete("/requests/:id(\\d+)", checkToken, deleteRequest);

module.exports = router;