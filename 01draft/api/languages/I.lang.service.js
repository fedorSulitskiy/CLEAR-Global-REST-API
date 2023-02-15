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
                    winston.error(error.message, error);
                    return callBack(error);
                }
                winston.info(data);
                return callBack(null, results);
            }
        );
    },
    update: (id, callBack) => {
        pool.query(
            
        )
    },
    showAll: callBack => {
        pool.query(
            
        )
    },
    showByID: (id, callBack) => {
        pool.query(
            
        )
    },
    delete: (id, callBack) => {
        pool.query(
            
        )
    },
};