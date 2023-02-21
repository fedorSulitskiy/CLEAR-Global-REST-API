const request = require('supertest');

let server;
let name;
let surname;
let email;
let password;
let type;
let id;

let trial_user_object;

describe('User API', () => {

    beforeEach(() => {
        server = require('../../index');
        name = 'Test';
        surname = 'Test';
        email = 'test@gmail.com';
        password = '1234';
        type = 0;
    });
    afterEach(async() => {
        trial_user_object = await request(server)
            .get("/api/users/" + email);
        id = trial_user_object.body.id;

        await request(server).delete("/api/users/"+id);
        
        server.close();
    });

    const execCreateUser = () => {
        return request(server)
            .post("/api/users/")
            .send({ name: name, surname: surname, email: email, password: password, type: type });
    };
    const execUpdateUser = () => {
        return request(server)
            .patch("/api/users/" + id)
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
            .delete("/api/users/" + id);
    };

    /// VALID REQUESTS

    describe('VALID REQUESTS', () => {
        it('Should return 200 if valid create request', async () => {
            const res = await execCreateUser();
            
            expect(res.status).toBe(200);
        });
        it('Should return 200 if valid showAll request', async () => {
            id = '';
    
            const res = await execShowUserByID();
            
            expect(res.status).toBe(200);
        });
        it('Should return 200 if valid showUser request', async () => {
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
    });

    /// BAD REQUESTS

    describe('BAD REQUESTS', () => {
        it("Should return 400 if user is already in the database", async () => {
            await execCreateUser();
    
            const res = await execCreateUser();
            
            expect(res.status).toBe(400);
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
        it('Should return 404 if user could not be found by updateUser', async () => {
            id = '10000000000';
            name = 'Test';

            const res = await execUpdateUser();

            expect(res.status).toBe(404);
        })
        /// Returns 404 and I just can't catch it anywhere :/// Need help
        // it('Should return 400 if isoCode for delete not provided', async () => {
        //     isoCode = ''

        //     const res = await execDeleteUser();
    
        //     expect(res.status).toBe(400);
        // });
    });   

    /// INTERNAL SERVER ERRORS

    describe('INTERNAL SERVER ERROR', () => {
        it('Should return 500 if server dies on createUser', async () => {

            const res = await request(server)
                .post("/api/users/")
                .send({ email: email, password: password });

            expect(res.status).toBe(500);              
        });
        it('Should return 500 if server dies on updateUser', async () => {
            await execCreateUser();

            trial_user_object = await request(server)
                .get("/api/users/" + email);
            id = trial_user_object.body.id;

            type = ""

            const res = await execUpdateUser();

            expect(res.status).toBe(500);              
        });
    //     // it('Should return 500 if server dies on showAll', async () => {
            
    //     //     const res = await request(server)
    //     //         .get("/api/users/" + isoCode);

    //     //     expect(res.status).toBe(500);              
    //     // });
    //     // it('Should return 500 if server dies on delete', async () => {
    //     //     isoCode = 'aaaa'
            
    //     //     const res = await request(server)
    //     //         .delete("/api/users/" + isoCode);

    //     //     expect(res.status).toBe(500);              
    //     // });
    });
});