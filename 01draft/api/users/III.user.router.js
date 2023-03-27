/// Connects the SQL query executor functions with html requests
const { createUser, updateUser, showAllUsers, showUserByID, showUserByEmail, deleteUser, login, logout, deleteTestHistory } = require('./II.user.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/auth');
// unregistered users can only see informationbut not change or add it

router.post("/", checkToken, createUser);
router.patch("/:id", checkToken, updateUser);
router.delete("/:id(\\d+)", checkToken, deleteUser);

router.get("/show", showAllUsers);
router.get("/show/:id(\\d+)", showUserByID);
router.get("/show/:email", showUserByEmail);

router.delete("/testing/:user_id(\\d+)", checkToken, deleteTestHistory);

router.post("/login", login);
router.post("/login/:user_id", logout);
// add something for language request history? suggested: /API/languages/history/

module.exports = router;