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
        await request(server).delete("/api/languages/"+isoCode);
        server.close();
    });

    const execCreateLang = () => {
        return request(server)
            .post("/api/languages/")
            .send({ isoCode: isoCode, name: name, altName: altName, noTranslators: noTranslators });
    };
    const execShowLang = () => {
        return request(server)
            .get("/api/languages/" + isoCode)
    };
    const execUpdateLang = () => {
        return request(server)
            .patch("/api/languages/")
    }

    /// VALID REQUESTS

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
    // it('Should return 200 if update is successful', async () => {
        
    // });

    /// 400

    // it("Should return 400 if language is already in the database", async () => {
    //     await execCreateLang();

    //     const res = await execCreateLang();
        
    //     expect(res.status).toBe(400);
    // });
    // it('Should return 404 if language not found', async () => {
    //     const res = await execShowLang();

    //     expect()
    // });   
    // it('Should return 400 if isoCode for delete not provided', async () => {
        
    // });
    // it('Should return 400 if isoCode for showById not provided', async () => {
        
    // });

    // /// 500

    // it('Should return 500 if there is a server error', async () => {
        
    // });
    
});