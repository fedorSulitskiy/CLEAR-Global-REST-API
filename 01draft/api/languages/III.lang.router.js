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
    deleteRequest
} = require('./II.lang.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/auth');
// unregistered users can only see informationbut not change or add it

/// General Languages Related Operations
router.post("/", checkToken, createLang);
router.post("/refs/", addRefs);
router.post("/sourceComment/:id", addSourceComment);
router.post("/alternativeNames/:id", addAlternativeName);
router.post("/links/:id", addLinks);
router.patch("/:id(\\d+)", checkToken, updateLangByID);
router.patch("/:isoCode(\[a-zA-Z]{2,4})", checkToken, updateLangByISO);
router.get("/", showAll);
router.get("/:id(\\d+)", showLangByID);
router.get("/:isoCode(\[a-zA-Z]{2,4})", showLangByISO); // ISO codes can't go above 3 but I made it 4 to allow to create an impossible test ISO code, verification on it being 3 should be done at front-end
router.delete("/:id(\\d+)", checkToken, deleteLangByID);
router.delete("/:isoCode(\[a-zA-Z]{2,4})", checkToken, deleteLangByISO);

/// Adding Countries
router.post("/newCountry/:id(\\d+)", checkToken, addCountryToLanguageByID);
router.post("/newCountry/:isoCode(\[a-zA-Z]{2,4})", checkToken, addCountryToLanguageByISO);
router.delete("/newCountry", checkToken, deleteLangsCountry);

/// Searching by Alternative Name
router.get("/alt_name/:alt_name", showLangByAltName);

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