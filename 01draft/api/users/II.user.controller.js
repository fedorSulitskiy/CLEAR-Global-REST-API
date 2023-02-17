/// Executes the SQL queries and catches any immediate connection errors
const winston = require('winston');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');

const { create, update, showAll, showUserById, showUserByEmail, deleteByID } = require('./I.user.service');

const status500 = function(res, err) {
    winston.error(err);
    return res.status(500).send('Database connection error');
}

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
            if (err) {
                if (err.code==='ER_DUP_ENTRY') {
                    winston.error(err)
                    return res.status(400).send(`User ${id}: ${req.body.name} ${req.body.surname} already exists`);
                }
                status500(res, err);
            }
            winston.info('New user created')
            return res.status(200).send(results);
        });
    },
    updateUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        update(req.params.id, body, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results) {
                const noAffectedRows = results.affectedRows;
                const noChangedRows = results.changedRows;
                if (noAffectedRows === 0) {
                    winston.error(err);
                    return res.status(404).send("Could not find user");
                }
                if (noChangedRows === 0) {
                    winston.info('No content has been changed. User id: '+req.params.id);
                    return res.status(200).send('No changes implemented');
                }
            }
            winston.info('User updated. User id: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    showAllUsers: (req, res) => {
        showAll((err, results) => {
            if (err) {
                status500(res, err);
            }
            winston.info(results.length+' users found');
            return res.status(200).send(results);
        });
    },
    showUserByID: (req, res) => {
        const id = req.params.id;
        showUserById(id, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (!results) {
                winston.error('Could not find user. User id: '+req.params.id);
                return res.status(404).send("Could not find user");
            }
            if (results.length === 0) {
                winston.error('Could not find user. User id: '+req.params.id);
                return res.status(404).send("Could not find user");
            }
            winston.info('User found. User id: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    showUserByEmail: (req, res) => {
        const email = req.params.email;
        showUserByEmail(req.params.email, (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (!results) {
                winston.error('Could not find user. User id: '+req.params.id);
                return res.status(404).send("Could not find user");
            }
            if (results.length === 0) {
                winston.error('Could not find user. User email: '+email);
                return res.status(404).send("Could not find user");
            }
            winston.info('User found. User email: '+email);
            return res.status(200).send(results);
        });
    },
    deleteUser: (req, res) => {
        deleteByID(req.params.id, (err, results) => {
            const noAffectedRows = results.affectedRows;
            if (err) {
                status500(res, err);
            }
            if (noAffectedRows === 0) {
                winston.error('Could not find user. User id: '+req.params.id);
                return res.status(404).send("Could not find user");
            }
            winston.info('User deleted. User id: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    login: (req, res) => {
        const body = req.body;
        getUserByEmail(body.email, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                });
            }
            const result = compareSync(body.password, results.password);
            if (result) {
                results.password = undefined;
                const jsontoken = sign({ result: results }, process.env.JWT_TOKEN, {
                    expiresIn: "1h",
                });
                return res.json({
                    success: 1,
                    message: "login successful",
                    token: jsontoken
                });
            }
            else {
                return res.json({
                    success: 0,
                    message: "Invalid email or password",
                });
            }
        });
    },
}