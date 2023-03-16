/// Connects the SQL query executor functions with html requests
const { createUser, updateUser, showAllUsers, showUserByID, showUserByEmail, deleteUser, login, logout, deleteTestHistory } = require('./II.user.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/auth');
// unregistered users can only see informationbut not change or add it

router.post("/", checkToken, createUser);
router.patch("/:id", checkToken, updateUser);
router.get("/", showAllUsers);
router.get("/:id(\\d+)", showUserByID);
router.get("/:email", showUserByEmail);
router.delete("/:id(\\d+)", checkToken, deleteUser);
router.delete("/testing/:user_id(\\d+)", checkToken, deleteTestHistory);
router.post("/login", login);
router.post("/logout/:user_id", logout);
// add something for language request history? suggested: /API/languages/history/

module.exports = router;