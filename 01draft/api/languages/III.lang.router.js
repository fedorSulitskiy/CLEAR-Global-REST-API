/// Connects the SQL query executor functions with html requests
const { 
    createLang, 
    createLangRequests,  
    updateLangByID,
    updateLangByISO,
    updateRequestsByID,
    showAll,
    showLangByID,
    showLangByISO,
    showLangRequestsByID,
    showAllRequests,
    showLangByAltName,
    showAllDialects,
    showLangByRegion,
    showLangBySubregion,
    showLangByIntregion,
    showLangByCountry,
    showCountriesByLanguage,
    showAllCompleteRequests,
    showCompleteRequestByLang,
    showAllOpenRequests,
    showOpenRequestByLang,
    showAllPendingRequests,
    showPendingRequestsByLang,
    deleteLangByID,
    deleteLangByISO
} = require('./II.lang.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/auth');
// unregistered users can only see informationbut not change or add it

/// General Languages Related Operations
router.post("/", checkToken, createLang);
router.patch("/:id(\\d+)", checkToken, updateLangByID);
router.patch("/:isoCode", checkToken, updateLangByISO);
router.get("/", showAll);
router.get("/:id(\\d+)", showLangByID);
router.get("/:isoCode(\[a-zA-Z]{3})", showLangByISO);
router.delete("/:id(\\d+)", checkToken, deleteLangByID);
router.delete("/:isoCode(\[a-zA-Z]{3})", checkToken, deleteLangByISO);

/// Searching by Alternative Name
router.get("/alt_name/:alt_name", showLangByAltName);

/// See all dialects
router.get("/dialects", showAllDialects);

/// Regional Ones
router.get("/region/:region_name", showLangByRegion);
router.get("/subregion/:subregion_name", showLangBySubregion);
router.get("/intregion/:intregion_name", showLangByIntregion);
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

module.exports = router;