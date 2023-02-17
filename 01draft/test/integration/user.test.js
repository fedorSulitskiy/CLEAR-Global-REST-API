// const request = require('supertest');

// let server;
// let name;
// let surname;
// let email;
// let password;
// let type;

// describe('User API', () => {
//     beforeEach(async() => {
//         server = require('../../index');
//         name = 'John';
//         surname = 'Doe';
//         email = 'john@gmail.com';
//         password = '1234';
//         type = 0;
//         id = await request(server)
//             .get("/api/users/f.sulitskiy@gmail.com");
//     });
//     afterEach(async() => {
//         // await request(server).delete("/api/users/"+id);
//         server.close();
//     });

//     const execCreateUser = () => {
//         return request(server)
//             .post("/api/users/")
//             .send({ name: name, surname: surname, email: email, password: password, type: type });
//     };
//     const execUpdateUser = () => {
//         return request(server)
//             .patch("/api/users/" + id)
//             .send({ name: name, surname: surname, email: email, password: password, type: type });
//     };
//     const execShowUserByID = () => {
//         return request(server)
//             .get("/api/users/" + email);
//     };
//     const execShowUserByEmail = () => {
//         return request(server)
//             .get("/api/users/" + id);
//     };
//     const execDeleteUser = () => {
//         return request(server)
//             .delete("/api/users/" + id);
//     };

//     it('It should return the fucking id', async() => {
//         const id = await request(server)
//             .get("/api/users/f.sulitskiy@gmail.com");
//         expect(id.status).toBe(200);
//     });
// });