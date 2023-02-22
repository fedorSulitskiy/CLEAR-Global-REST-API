const request = require('supertest');
const generateWebToken = require('../../auth/generateToken');
const tud = require('./_testUserDetails');

let server;
let name;
let surname;
let email;
let password;
let type;
let id;
let token;

let trial_user_object;

describe('User API', () => {

    beforeEach(() => {
        server = require('../../index');
        name = tud.name;
        surname = tud.surname;
        email = tud.email;
        password = tud.password;
        type = tud.type;

        token = generateWebToken({ name: name, surname: surname, email: email, password: password, type: type });
    });
    afterEach(async() => {
        trial_user_object = await request(server)
            .get("/api/users/" + email);
        id = trial_user_object.body.id;

        await request(server)
            .delete("/api/users/"+id)
            .set("Authorization", "Bearer "+token);
        
        server.close();
    });

    const execCreateUser = () => {
        return request(server)
            .post("/api/users/")
            .set("Authorization", "Bearer "+token)
            .send({ name: name, surname: surname, email: email, password: password, type: type });
    };
    const execUpdateUser = () => {
        return request(server)
            .patch("/api/users/" + id)
            .set("Authorization", "Bearer "+token)
            .send({ name: name, surname: surname, email: email, password: password, type: type });
    };
    const execShowUserByID = () => {
        return request(server)
            .get("/api/users/" + id);
    };
    const execShowUserByEmail = () => {
        return request(server)
            .get("/api/users/" + email);
    };
    const execDeleteUser = () => {
        return request(server)
            .delete("/api/users/" + id)
            .set("Authorization", "Bearer "+token);
    };
    const execLogin = () => {
        return request(server)
            .post("/api/users/login/")
            .send({ email: email, password: password});
    };

    /// VALID REQUESTS

    describe('VALID REQUESTS', () => {
        it('Should return 200 if valid createUser request', async () => {
            const res = await execCreateUser();
            
            expect(res.status).toBe(200);
        });
        it('Should return 200 if valid showAllUsers request', async () => {
            id = '';
    
            const res = await execShowUserByID();
            
            expect(res.status).toBe(200);
        });
        it('Should return 200 if valid showUserByID request', async () => {
            await execCreateUser();

            trial_user_object = await request(server)
                .get("/api/users/" + email);
            id = trial_user_object.body.id;
    
            const res = await execShowUserByID();
            
            expect(res.status).toBe(200);
        });
        it('Should return 200 if valid showUserByEmail request', async () => {
            await execCreateUser();
    
            const res = await execShowUserByEmail();
            
            expect(res.status).toBe(200);
        });
        it('Should return 200 if update is successful', async () => {
            await execCreateUser();
            name = 'TEST';
            trial_user_object = await request(server)
                .get("/api/users/" + email);
            id = trial_user_object.body.id;
    
            const res = await execUpdateUser();
    
            expect(res.status).toBe(200);
        });
        it('Should return 200 if no content changed', async () => {
            await execCreateUser();

            trial_user_object = await request(server)
                .get("/api/users/" + email);
            id = trial_user_object.body.id;

            const res = await execUpdateUser();

            expect(res.status).toBe(200);
        });
        it('Should return 200 if deleteUser is successful', async () => {
            await execCreateUser();

            trial_user_object = await request(server)
                .get("/api/users/" + email);
            id = trial_user_object.body.id;
    
            const res = await execDeleteUser();
    
            expect(res.status).toBe(200);
        });
        it('Should return 200 if login successful', async () => {
            await execCreateUser();

            const res = await execLogin();
            
            expect(res.status).toBe(200);
        });
    });

    /// BAD REQUESTS

    describe('BAD REQUESTS', () => {
        it("Should return 400 if user is already in the database", async () => {
            await execCreateUser();
    
            const res = await execCreateUser();
            
            expect(res.status).toBe(400);
        });
        it('should return 400 if token is invalid on createUser', async () => {
            token = '';

            const res = await execCreateUser();
    
            expect(res.status).toBe(400);
        });
        it('should return 400 if token is invalid in on updateUser', async () => {
            await execCreateUser();
            name = 'TEST';
            trial_user_object = await request(server)
                .get("/api/users/" + email);
            id = trial_user_object.body.id;

            token = '';

            const res = await execUpdateUser();
    
            expect(res.status).toBe(400);
        });
        it('should return 400 if token is invalid in on deleteUser', async () => {
            await execCreateUser();

            trial_user_object = await request(server)
                .get("/api/users/" + email);
            id = trial_user_object.body.id;

            token = '';
    
            const res = await execDeleteUser();
    
            expect(res.status).toBe(400);
        });
        it('should return 401 if user is not logged in on createUser', async () => {

            const res = await request(server)
                .post("/api/users/")
                .send({ name: name, surname: surname, email: email, password: password, type: type });
    
            expect(res.status).toBe(401);
        });
        it('should return 401 if user is not logged in on updateUser', async () => {
            await execCreateUser();
            name = 'TEST';
            trial_user_object = await request(server)
                .get("/api/users/" + email);
            id = trial_user_object.body.id;

            const res = await request(server)
                .patch("/api/users/" + id)
                .send({ name: name, surname: surname, email: email, password: password, type: type });
    
            expect(res.status).toBe(401);
        });
        it('should return 401 if user is not logged in on deleteUser', async () => {
            await execCreateUser();

            trial_user_object = await request(server)
                .get("/api/users/" + email);
            id = trial_user_object.body.id;
    
            const res = await request(server)
                .delete("/api/users/" + id);
    
            expect(res.status).toBe(401);
        });
        it('Should return 404 if user not found by showUserByID', async () => {
            id = '10000000000';

            const res = await execShowUserByID();
    
            expect(res.status).toBe(404);
        });  
        it('Should return 404 if user not found by showUserByEmail', async () => {
            email = 'THIS_EMAIL@dont.exist';

            const res = await execShowUserByEmail();
    
            expect(res.status).toBe(404);
        }); 
        it('Should return 404 if user not found by deleteUser', async () => {
            id = '10000000000';

            const res = await execDeleteUser();
    
            expect(res.status).toBe(404);
        });
        it('Should return 404 if user not found by updateUser', async () => {
            id = '10000000000';
            name = 'Test';

            const res = await execUpdateUser();

            expect(res.status).toBe(404);
        });
        it('Should return 404 if incorrect login details are provided', async () => {
            await execCreateUser();

            password = '';

            const res = await execLogin();
            
            expect(res.status).toBe(404);
        });
        it('Should return 404 if no login details are provided', async () => {
            await execCreateUser();

            email = '';
            password = '';

            const res = await execLogin();
            
            expect(res.status).toBe(404);
        });
    });   

    /// INTERNAL SERVER ERRORS

    describe('INTERNAL SERVER ERROR', () => {
        it('Should return 500 if server throws internal error on createUser', async () => {

            const res = await request(server)
                .post("/api/users/")
                .set("Authorization", "Bearer "+token)
                .send({ email: 'trial@email.com', password: '1111' });

            expect(res.status).toBe(500);              
        });
        it('Should return 500 if server throws internal error on updateUser', async () => {
            await execCreateUser();

            trial_user_object = await request(server)
                .get("/api/users/" + email);
            id = trial_user_object.body.id;

            type = ""

            const res = await execUpdateUser();

            expect(res.status).toBe(500);              
        });
    //     // it('Should return 500 if server throws internal error on showAll', async () => {
            
    //     //     const res = await request(server)
    //     //         .get("/api/users/" + isoCode);

    //     //     expect(res.status).toBe(500);              
    //     // });
    //     // it('Should return 500 if server throws internal error on delete', async () => {
    //     //     isoCode = 'aaaa'
            
    //     //     const res = await request(server)
    //     //         .delete("/api/users/" + isoCode);

    //     //     expect(res.status).toBe(500);              
    //     // });
    });
});