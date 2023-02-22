/// Functions that send queries to SQL database

const pool = require('../../config/database');

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into users(name, surname, email, password, type)
                values(?,?,?,?,?)`,
            [
                data.name,
                data.surname,
                data.email,
                data.password,
                data.type,
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    update: (id, data, callBack) => {
        pool.query(
            `update users set name=?, surname=?, email=?, password=?, type=? where id = ?`,
            [
                data.name,
                data.surname,
                data.email,
                data.password,
                data.type,
                id
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showAll: callBack => {
        pool.query(
            `select * from users`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showUserById: (id, callBack) => {
        pool.query(
            `select * from users where id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    showUserByEmail: (email, callBack) => {
        pool.query(
            `select * from users where email = ?`,
            [email],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    deleteByID: (id, callBack) => {
        pool.query(
            `delete from users where id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showUserByName: (name, surname, callBack) => {
        pool.query(
            `select * from users where name = ?, surname = ?`,
            [name, surname],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
}