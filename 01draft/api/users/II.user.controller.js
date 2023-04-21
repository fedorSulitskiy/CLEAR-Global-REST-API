/// Executes the SQL queries and catches any immediate connection errors
/// IMPORTANT TIP FOR VSCODE: CTRL + K + CTRL + 2 closes all 2nd level blocks allowing for immidiately easier navigation

const winston = require('winston');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const generateWebToken = require('../../auth/generateToken');

const { create, update, showAll, showUserById, showUserByEmail, deleteByID, logHistory, deleteTestHistory } = require('./I.user.service');
const pool = require('../../config/database');

const status500 = function(res, err) {
    winston.error(err);
    return res.status(500).send('Database connection error');
}

const hashPassword = function(res, password, salt) {
    try {
        return hashSync(password, salt);
    } catch(ex) {
        return status500(res, ex);
    } 
}

module.exports = {
    createUser: async (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashPassword(res, body.password, salt);

        const email = req.body.email;
        const result = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        const count = result[0].length;

        if (count > 0) {
            winston.error('User with this email is already registered: '+ email);
            return res.status(400).send('User with this email is already registered: '+ email);
        }

        create(body, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info('New user created')
            return res.status(200).send(results);
        });
    },
    updateUser: async (req, res) => {
        // problem here is because I'm hashing the password the password string will always change so even if no actual changes are introduced the 
        // the password string will change due to new salts being generated meaning it's not possible to directly detect NO changes and this hashing
        // must be factored in.
        const body = req.body;
        const initial = await pool.promise().query('SELECT first_name, last_name, email, password, hash, mobile, user_type_id, position, company, user_image, status FROM users WHERE user_id = ?', [req.params.id]);
        
        update(req.params.id, body, async (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (results) {
                const noAffectedRows = results.affectedRows;
                if (noAffectedRows === 0) {
                    winston.error('Could not find user. User id: '+req.params.id);
                    return res.status(404).send("Could not find user");
                }
                
                const intialBody = { ...initial[0][0] };

                noPasswordBody = {...body};
                delete noPasswordBody.password;
                noPasswordInitialBody = {...intialBody};
                delete noPasswordInitialBody.password;
                /// Check if all parts except password are the same or not
                if (JSON.stringify(noPasswordBody) === JSON.stringify(noPasswordInitialBody)) {
                    /// Check if passwords are the same
                    const result = compareSync(body.password, intialBody.password);
                    if(result) {
                        winston.info('No content has been changed. User id: '+req.params.id);
                        return res.status(200).send('No changes implemented');
                    }
                }
            }
            winston.info('User updated. User id: '+req.params.id);
            return res.status(200).send(results);
        });
    },
    showAllUsers: (req, res) => {
        showAll((err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info(results.length+' users found');
            return res.status(200).send(results);
        });
    },
    showUserByID: (req, res) => {
        const id = req.params.id;
        showUserById(id, (err, results) => {
            if (err) {
                return status500(res, err);
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
                return status500(res, err);
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
                return status500(res, err);
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
        showUserByEmail(body.email, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            if (!results) {
                winston.error('Invalid email / No details provided - no results returned');
                return res.status(404).send("Invalid email or password");
            }

            const result = compareSync(body.password, results.password);
            if (result) {
                results.password = undefined;
                const jsontoken = generateWebToken({ result: results });
                userID = results.user_id;
                logHistory(results.user_id, 'logged in', (err, results) => {
                    if (err) {
                        return status500(res, err);
                    }
                    winston.info('Login successful: user ' + userID);
                    results['token'] = jsontoken;
                    return res.status(200).send(results);
                });
            }
            else {
                winston.error('Invalid password - results returned');
                return res.status(404).send("Invalid email or password");
            }
        });
    },
    logout: (req, res) => {
        logHistory(req.params.user_id, 'logged out', (err, results) => {
            if (err) {
                return status500(res, err);
            }
            winston.info('Logout successful: user ' + req.params.user_id);
            return res.status(200).send('logout successful!');
        });
    },
    deleteTestHistory: (req, res) => {
        deleteTestHistory(req.params.user_id, (err, results) => {
            if (err) {
                return status500(res, err);
            }
            return res.status(200).send('deleted');
        });
    },
}