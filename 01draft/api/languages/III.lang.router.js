/// Connects the SQL query executor functions with html requests
const { createLang, update, showAll, showLang, deleteLang } = require('./II.lang.controller');

const router = require('express').Router();

router.post("/", createLang);
router.get("/", showAll);
router.get("/:id", showLang);
router.delete("/:id", deleteLang);

module.exports = router;