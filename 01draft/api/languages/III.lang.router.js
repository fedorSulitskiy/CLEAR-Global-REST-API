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

router.post("/", createLang);
router.post("/requests", createLangRequests);
router.patch("/:id(\\d+)", updateLangByID);
router.patch("/:isoCode", updateLangByISO);
router.patch("/requests/:id",updateRequestsByID);
router.get("/", showAll);
router.get("/:id(\\d+)", showLangByID);
router.get("/:isoCode(\[a-zA-Z]{3})", showLangByISO);
router.get("/requests/:id(\\d+)", showLangRequestsByID);
router.get("/requests", showAllRequests);
router.get("/alt_name/:alt_name", showLangByAltName);
router.get("/dialects", showAllDialects);
router.get("/region/:region_name", showLangByRegion);
router.get("/subregion/:subregion_name", showLangBySubregion);
router.get("/intregion/:intregion_name", showLangByIntregion);
router.get("/country/:country", showLangByCountry); // works for only English names
router.get("/showCountries/:lang", showCountriesByLanguage);
router.get("/requests/complete", showAllCompleteRequests);
router.get("/requests/complete/:id(\\d+)", showCompleteRequestByLang);
router.get("/requests/open", showAllOpenRequests);
router.get("/requests/open/:id(\\d+)", showOpenRequestByLang);
router.get("/requests/pending", showAllPendingRequests);
router.get("/requests/pending/:id(\\d+)", showPendingRequestsByLang);
router.delete("/:id(\\d+)", deleteLangByID);
router.delete("/:isoCode(\[a-zA-Z]{3})", deleteLangByISO);

module.exports = router;