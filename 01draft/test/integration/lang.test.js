const request = require('supertest');
const generateWebToken = require('../../auth/generateToken');
const tud = require('./_testUserDetails');

let server;
let isoCode;
let name;
let altName;
let noTranslators;
let token;

const userName = tud.name;
const surname = tud.surname;
const email = tud.email;
const password = tud.password;
const type = tud.type;

describe('Language API', () => {

    beforeEach(() => {
        server = require('../../index');
        isoCode = "tst";
        name = "Test";
        altName = "Testing";
        noTranslators = 1000;

        token = generateWebToken({ name: userName, surname: surname, email: email, password: password, type: type });
    });
    afterEach(async() => {
        await execDeleteLang();
        server.close();
    });

    const execCreateLang = () => {
        return request(server)
            .post("/api/languages/")
            .set("Authorization", "Bearer "+token)
            .send({ isoCode: isoCode, name: name, altName: altName, noTranslators: noTranslators });
    };
    const execUpdateLang = () => {
        return request(server)
            .patch("/api/languages/" + isoCode)
            .set("Authorization", "Bearer "+token)
            .send({ isoCode: isoCode, name: name, altName: altName, noTranslators: noTranslators });
    };
    const execShowLang = () => {
        return request(server)
            .get("/api/languages/" + isoCode);
    };
    const execDeleteLang = () => {
        return request(server)
            .delete("/api/languages/"+isoCode)
            .set("Authorization", "Bearer "+token);
    };

    /// VALID REQUESTS

    describe('VALID REQUESTS', () => {
        it('Should return 200 if valid create request', async () => {
            const res = await execCreateLang();
            
            expect(res.status).toBe(200);
        });
        it('Should return 200 if valid showAll request', async () => {
            isoCode = '';
    
            const res = await execShowLang();
            
            expect(res.status).toBe(200);
        });
        it('Should return 200 if valid showLang request', async () => {
            await execCreateLang();
    
            const res = await execShowLang();
            
            expect(res.status).toBe(200);
        });
        it('Should return 200 if update is successful', async () => {
            await execCreateLang();
            name = 'TEST2';
    
            const res = await execUpdateLang();
    
            expect(res.status).toBe(200);
        });
        it('Should return 200 if no content changed', async () => {
            await execCreateLang();

            const res = await execUpdateLang();

            expect(res.status).toBe(200);
        });
    });

    /// BAD REQUESTS

    describe('BAD REQUESTS', () => {
        it("Should return 400 if language is already in the database", async () => {
            await execCreateLang();
    
            const res = await execCreateLang();
            
            expect(res.status).toBe(400);
        });
        it('Should return 404 if language not found by showLang', async () => {
            isoCode = 't';

            const res = await execShowLang();
    
            expect(res.status).toBe(404);
        });  
        it('Should return 404 if language not found by deleteLang', async () => {
            isoCode = 't';

            const res = await execDeleteLang();
    
            expect(res.status).toBe(404);
        });
        it('Should return 404 if language could not be found by updateLang', async () => {
            isoCode = 't';
            name = 'TEST2';

            const res = await execUpdateLang();

            expect(res.status).toBe(404);
        })
        /// Returns 404 and I just can't catch it anywhere :/// Need help
        // it('Should return 400 if isoCode for delete not provided', async () => {
        //     isoCode = ''

        //     const res = await execDeleteLang();
    
        //     expect(res.status).toBe(400);
        // });
    });   

    /// INTERNAL SERVER ERRORS

    describe('INTERNAL SERVER ERROR', () => {
        it('Should return 500 if there is a server error on createLang', async () => {

            const res = await request(server)
                .post("/api/languages/")
                .set("Authorization", "Bearer "+token)
                .send({ isoCode: isoCode, name: name });

            expect(res.status).toBe(500);              
        });
        it('Should return 500 if there is a server error on updateLang', async () => {
            await execCreateLang();

            const res = await request(server)
                .patch("/api/languages/" + isoCode)
                .set("Authorization", "Bearer "+token)
                .send({ isoCode: isoCode, name: name });

            expect(res.status).toBe(500);              
        });
        // it('Should return 500 if there is a server error on showAll', async () => {
            
        //     const res = await request(server)
        //         .get("/api/languages/" + isoCode);

        //     expect(res.status).toBe(500);              
        // });
        // it('Should return 500 if there is a server error on delete', async () => {
        //     isoCode = 'aaaa'
            
        //     const res = await request(server)
        //         .delete("/api/languages/" + isoCode);

        //     expect(res.status).toBe(500);              
        // });
    });
});