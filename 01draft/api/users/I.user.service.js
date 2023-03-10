/// Functions that send queries to SQL database

const pool = require('../../config/database');

module.exports = {
    create: (data, callBack) => {
        const currentDate = new Date();
        const timestamp = Math.floor(currentDate.getTime() / 1000);
        pool.query(
            `insert into users(
                first_name, 
                last_name, 
                email, 
                password, 
                hash,
                mobile,
                user_type_id,
                position,
                company,
                joined_date,
                user_image,
                status)
            values(?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                data.first_name,
                data.last_name,
                data.email,
                data.password,
                data.hash,
                data.mobile,
                data.user_type_id,
                data.position,
                data.company,
                timestamp,
                data.user_image,
                data.status,
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    update: (user_id, data, callBack) => {
        pool.query(
            `update users set 
                first_name = ?, 
                last_name = ?, 
                email = ?, 
                password = ?, 
                hash = ?,
                mobile = ?,
                user_type_id = ?,
                position = ?,
                company = ?,
                joined_date = ?,
                user_image = ?,
                status = ?
            where user_id = ?`,
            [
                data.first_name,
                data.last_name,
                data.email,
                data.password,
                data.hash,
                data.mobile,
                data.user_type_id,
                data.position,
                data.company,
                data.joined_date,
                data.user_image,
                data.status,
                user_id
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
    showUserById: (user_id, callBack) => {
        pool.query(
            `select * from users where user_id = ?`,
            [user_id],
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
    deleteByID: (user_id, callBack) => {
        pool.query(
            `delete from users where user_id = ?`,
            [user_id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    logHistory: (user_id, log_status, callBack) => {
        const currentDate = new Date();
        const timestamp = Math.floor(currentDate.getTime() / 1000);
        pool.query(
            `insert into history(
                user_id,
                log_details,
                log_time
            ) values(?,?,?)`,
            [
                user_id, 
                log_status, 
                timestamp
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteTestHistory: (user_id, callBack) => {
        pool.query(
            `delete from history where user_id = ?`,
            [user_id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    }
}