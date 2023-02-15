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
        await request(server).delete("/api/languages/hah")
        server.close();
    });

    it('Should return 200 if valid request', async () => {
        const res = await request(server)
            .post("/api/languages")
            .send({ isoCode: isoCode, name: name, altName: altName, noTranslators: noTranslators });
        
        expect(res.status).toBe(200);
    });
});