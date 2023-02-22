/// Functions that send queries to SQL database
const winston = require('winston');

const pool = require('../../config/database');

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into languages(iso_id, lang_name, altName, noTranslators) 
                values(?,?,?,?)`, // PROBLEM: they dont have an altName or noTranslators field in their db
            [
                data.isoCode,
                data.name,
                data.altName,
                data.noTranslators,
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
            `update languages set iso_id=?, lang_name=?, altName=?, noTranslators=? where isoCode=?`,
            [                        // PROBLEM: they dont have an altName or noTranslators field in their db
                data.isoCode,
                data.name,
                data.altName,
                data.noTranslators,
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
            `select * from languages`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    showByID: (id, callBack) => {
        pool.query(
            `select * from languages where iso_id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteByID: (id, callBack) => {
        pool.query(
            `delete from languages where iso_id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
};