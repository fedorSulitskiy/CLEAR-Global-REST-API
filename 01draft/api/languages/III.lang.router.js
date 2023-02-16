/// Connects the SQL query executor functions with html requests
const { createLang, updateLang, showAll, showLang, deleteLang } = require('./II.lang.controller');

const router = require('express').Router();

router.post("/", createLang);
router.patch("/:id", updateLang);
router.get("/", showAll);
router.get("/:id", showLang);
router.delete("/:id", deleteLang);

module.exports = router;