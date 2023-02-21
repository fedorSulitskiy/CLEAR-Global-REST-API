/// Executes the SQL queries and catches any immediate connection errors
const winston = require('winston');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');

const { create, update, showAll, showUserById, showUserByEmail, deleteByID } = require('./I.user.service');
const pool = require('../../config/database');

const status500 = function(res, err) {
    winston.error(err);
    return res.status(500).send('Database connection error');
}

module.exports = {
    createUser: async (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        const email = req.body.email;
        const result = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        const count = result[0].length;

        if (count > 0) {
            repeatingEmailError = new Error('Email already in database');
            winston.error(repeatingEmailError);
            return res.status(400).send('User with this email is already registered: '+ email);
        }

        create(body, (err, results) => {
            if (err) {
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
        update(req.params.id, body, async (err, results) => {
            if (err) {
                status500(res, err);
            }
            if (results) {
                const noAffectedRows = results.affectedRows;
                if (noAffectedRows === 0) {
                    winston.error(err);
                    return res.status(404).send("Could not find user");
                }
                // problem here is because I'm hashing the password the password string will always change so even if no actual changes are introduced the 
                // the password string will change due to new salts being generated meaning it's not possible to directly detect NO changes and this hashing
                // must be factored in.
                const result = await pool.promise().query('SELECT name, surname, email, password, type FROM users WHERE id = ?', [req.params.id]);
                const resultBody = { ...result[0][0] };

                const salt = genSaltSync(10);
                resultBody.password = hashSync(resultBody.password, salt);
                body.password = hashSync(body.password, salt);

                if (JSON.stringify(resultBody) === JSON.stringify(body)) {
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
                winston.error('Could not find user. User id: '+email);
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