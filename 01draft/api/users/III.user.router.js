/// Connects the SQL query executor functions with html requests
const { createUser, updateUser, showAllUsers, showUserByID, showUserByEmail, deleteUser } = require('./II.user.controller');

const router = require('express').Router();

router.post("/", createUser);
router.patch("/:id", updateUser);
router.get("/", showAllUsers);
router.get("/:id(\\d+)", showUserByID);
router.get("/:email", showUserByEmail);
router.delete("/:id(\\d+)", deleteUser);

module.exports = router;