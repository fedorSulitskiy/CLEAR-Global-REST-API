/// Functions that send queries to SQL database
const winston = require('winston');

const pool = require('../../config/database');

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into languages(isoCode, name, altName, noTranslators)
                values(?,?,?,?)`,
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
            `update languages set isoCode=?, name=?, altName=?, noTranslators=? where isoCode=?`,
            [
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
            `select * from languages where isoCode = ?`,
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
            `delete from languages where isoCode = ?`,
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