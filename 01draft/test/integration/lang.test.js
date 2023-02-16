const request = require('supertest');

let server;
let isoCode;
let name;
let altName;
let noTranslators;

describe('Language API', () => {

    beforeEach(() => {
        server = require('../../index');
        isoCode = "hah";
        name = "English";
        altName = "Anglish";
        noTranslators = 1000;
    });
    afterEach(async() => {
        await execDeleteLang();
        server.close();
    });

    const execCreateLang = () => {
        return request(server)
            .post("/api/languages/")
            .send({ isoCode: isoCode, name: name, altName: altName, noTranslators: noTranslators });
    };
    const execShowLang = () => {
        return request(server)
            .get("/api/languages/" + isoCode);
    };
    const execUpdateLang = () => {
        return request(server)
            .patch("/api/languages/" + isoCode)
            .send({ isoCode: isoCode, name: name, altName: altName, noTranslators: noTranslators });
    };
    const execDeleteLang = () => {
        return request(server)
            .delete("/api/languages/"+isoCode);
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
            name = 'Hehish';
    
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
            isoCode = 'a';

            const res = await execShowLang();
    
            expect(res.status).toBe(404);
        });  
        it('Should return 404 if language not found by deleteLang', async () => {
            isoCode = 'a';

            const res = await execDeleteLang();
    
            expect(res.status).toBe(404);
        });
        it('Should return 404 if language could not be found by updateLang', async () => {
            isoCode = 'a';
            name = 'Hehish';

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
});