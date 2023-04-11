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

router.get("/countries/", showAllCountries);
router.get("/countries/:lang", showCountriesByLang);
router.get("/countries/info/:country_name", showCountryInfo);
router.get("/lang/", showAllLang);
router.get("/lang/:lang", showLangDetails);
router.get("/requests/:lang", showRequestsByLang);
router.get("/requests/period/", showRequestsBetweenDates);
router.get("/requests/recent/", showMostRecentRequest);

module.exports = router;