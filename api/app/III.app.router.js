const {
    showAllCountries,
    showCountriesByLang,
    showCountryInfo,
    showAllLang,
    showAllLangNames,
    showAllLangDetails,
    showLangDetails,
    showRequestsByLang,
    showRequestsBetweenDates,
    showMostRecentRequest,
    forgotPassword,
    extractToken
} = require('./II.app.controller');

const router = require('express').Router();

/// Countries output
router.get("/countries/", showAllCountries);
router.get("/countries/:lang", showCountriesByLang);
router.get("/countries/info/:country_name", showCountryInfo);

/// Languages output
router.get("/lang/", showAllLang);
router.get("/lang/:lang", showLangDetails);

/// Language names
router.get("/langNames/", showAllLangNames);

/// Language details
router.get("/langDetails/", showAllLangDetails);

/// Requests output
router.get("/requests/:lang", showRequestsByLang);
router.get("/requests/period/:lang", showRequestsBetweenDates);
router.get("/recent/", showMostRecentRequest);

/// Forgot password
router.post("/password/", forgotPassword);
router.get("/password/:email", extractToken);

module.exports = router;