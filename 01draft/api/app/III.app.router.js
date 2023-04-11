const {
    showAllCountries,
    showCountriesByLang,
    showCountryInfo,
    showAllLang,
    showLangDetails,
    showRequestsByLang,
    showRequestsBetweenDates,
    showMostRecentRequest,
} = require('./II.app.controller');

const router = require('express').Router();

/// Countries output
router.get("/countries/", showAllCountries);
router.get("/countries/:lang", showCountriesByLang);
router.get("/countries/info/:country_name", showCountryInfo);

/// Languages output
router.get("/lang/", showAllLang);
router.get("/lang/:lang", showLangDetails);

/// Requests output
router.get("/requests/:lang", showRequestsByLang);
router.get("/requests/period/:lang", showRequestsBetweenDates);
router.get("/recent/", showMostRecentRequest);

module.exports = router;