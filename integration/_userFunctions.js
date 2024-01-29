module.exports = {
    execCreateUser: () => {
        return request(server)
            .post("/api/users/")
            .set("Authorization", "Bearer "+token)
            .send({ 
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                hash: hash,
                mobile: mobile,
                user_type_id: user_type_id,
                position: position,
                company: company,
                user_image: user_image,
                status: status,
            });
    },
    execUpdateUser: () => {
        return request(server)
            .patch("/api/users/" + user_id)
            .set("Authorization", "Bearer "+token)
            .send({ 
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                hash: hash,
                mobile: mobile,
                user_type_id: user_type_id,
                position: position,
                company: company,
                user_image: user_image,
                status: status,
            });
    },
    execShowUserByID: () => {
        return request(server)
            .get("/api/users/" + user_id);
    },
    execShowUserByEmail: () => {
        return request(server)
            .get("/api/users/" + email);
    },
    execDeleteUser: () => {
        return request(server)
            .delete("/api/users/" + user_id)
            .set("Authorization", "Bearer "+token);
    },
    execLogin: () => {
        return request(server)
            .post("/api/users/login/")
            .send({ email: email, password: password});
    },
    execLogout: () => {
        return request(server)
            .post("/api/users/logout/" + user_id)
            .set("Authorization", "Bearer "+token);
    }
}