/* Note: In user API token validation is tested across every function but here it's only tested on createLang.
   we aren't testing it for every function because it is middleware and so it works the same every time, regardless
   of the function-specific error handling so it is redundant to test it for every function.
   It is tested on one, which means it should theoretically be enough to prove that it works for all.
*/       

const request = require('supertest');
const winston = require('winston');
const generateWebToken = require('../../auth/generateToken');
const tud = require('./_testUserDetails');
const { decode } = require('jsonwebtoken');

let server;
let identificator;
let token;
let details;
let trial_language_object;

let ref_id;
let source_id;
let lang_name;
let iso_code;
let no_of_trans;
let lang_status;
let glotto_ref;
let official;
let national;
let official_H2H;
let unofficial_H2H;
let total_speakers_nr;
let first_lang_speakers_nr;
let second_lang_speakers_nr;
let internet_users_percent;
let TWB_machine_translation_development;
let TWB_recommended_Pivot_langs;
let community_feasibility;
let recruitment_feasibility;
let recruitment_category;
let total_score_15;
let level;
let latitude;
let longitude;
let aes_status;
let source_comment;
let alternative_names;
let links;
let family_name;

let country_id;

let region_name;
let subregion_name;
let intregion_name;
let country;

let lang_request_id;
let created_user_id;
let assigned_user_id;
let lr_end_date;
let lr_start_date;
let lang_id;
let lr_type;
let lr_content;
let lr_status;

let first_name;
let last_name;
let email; 
let password;
let hash;
let mobile;
let user_type_id;
let position;
let company;
let user_image;
let status;

describe('Language API', () => {

    beforeEach(() => {
        server = require('../../index');

        ref_id = 0;
        source_id = 0;
        lang_name = 'The Testing Language';
        iso_code = 'TEST'; // Impossible 4 letter iso-code
        no_of_trans = 0;
        lang_status = 0;
        glotto_ref = 'test';
        official = 'Yes';
        national = 'Yes';
        official_H2H = 'TRUE';
        unofficial_H2H = 'TRUE';
        total_speakers_nr = '0';
        first_lang_speakers_nr = '0';
        second_lang_speakers_nr = '0';
        internet_users_percent = '0%';
        TWB_machine_translation_development = 0;
        TWB_recommended_Pivot_langs = 0;
        community_feasibility = 0;
        recruitment_feasibility = 0;
        recruitment_category = 'test';
        total_score_15 = 0;
        level = 'language';
        latitude = '0';
        longitude = '0';
        aes_status = 'test';
        source_comment = 'test';
        alternative_names = 'Testenese';
        links = 'test';
        family_name = 'test';

        details = {
            ref_id,
            source_id,
            lang_name,
            iso_code,
            no_of_trans,
            lang_status,
            glotto_ref,
            official,
            national,
            official_H2H,
            unofficial_H2H,
            total_speakers_nr,
            first_lang_speakers_nr,
            second_lang_speakers_nr,
            internet_users_percent,
            TWB_machine_translation_development,
            TWB_recommended_Pivot_langs,
            community_feasibility,
            recruitment_feasibility,
            recruitment_category,
            total_score_15,
            level,
            latitude,
            longitude,
            aes_status,
            source_comment,
            alternative_names,
            links,
            family_name
        }

        country_id = 10; /// This country must have proper reference to all regions / sub-regions / int-regions . id=1 wouldn't work cuz it belong to int-region=0 and int-region=0 doesn't exist

        region_name = 'Africa';
        subregion_name = 'Northern Africa';
        intregion_name = 'Eastern Africa';
        country = 'Algeria';

        created_user_id = 2;
        assigned_user_id = 2;
        lr_end_date = 1;
        lr_start_date = 1;
        lang_id = 0;
        lr_type = "add";
        lr_content = "test";
        lr_status = "complete";

        first_name = tud.first_name;
        last_name = tud.last_name;
        email = tud.email; 
        password = tud.password;
        hash = tud.hash;
        mobile = tud.mobile;
        user_type_id = tud.user_type_id;
        position = tud.position;
        company = tud.company;
        user_image = tud.user_image;
        status = tud.status;

        token = generateWebToken({
            user_id: 0, 
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
    });
    afterEach(async() => {
        identificator = iso_code;
        await execDeleteLang();
        server.close();
    });

    /// General Languages Related Operations

    const execCreateLang = () => {
        return request(server)
            .post("/api/languages/")
            .set("Authorization", "Bearer "+token)
            .send(details);
    };
    const execUpdateLang = () => { // can be reused for updateLangByID / updateLangByISO
        return request(server)
            .patch("/api/languages/" + identificator) // can be id / iso_code
            .set("Authorization", "Bearer "+token)
            .send(details);
    };
    const execShowLang = () => { // can be reused for showAll / showLangByID / showLangByISO
        return request(server)
            .get("/api/languages/" + identificator); // can be __ / id / iso_code
    };
    const execDeleteLang = () => { // can be reused for deleteLangByID / deleteLangByISO
        return request(server)
            .delete("/api/languages/" + identificator) // can be id / iso_code
            .set("Authorization", "Bearer "+token);
    };

    /// Adding Countries

    const execAddCountryToLang = () => { // can be reused for deleteLangByID / deleteLangByISO
        return request(server)
            .post("/api/languages/newCountry/" + identificator) // can be id / iso_code
            .set("Authorization", "Bearer "+token) 
            .send({country_id:country_id});
    };
    const execDeleteCountryFromLang = () => {
        return request(server)
            .delete("/api/languages/newCountry/") 
            .set("Authorization", "Bearer "+token) 
            .send({
                country_id:country_id,
                lang_id:identificator
            });
    };

    /// Searching by Alternative Name

    const execShowByAltName = () => {
        return request(server)
            .get("/api/languages/alt_name/" + alternative_names);
    };

    /// See all dialects

    const execShowAllDialects = () => {
        return request(server)
            .get("/api/languages/dialects");
    };

    /// Regional Ones

    const execRegion = () => {
        return request(server)
            .get("/api/languages/region/" + region_name);
    };
    const execSubRegion = () => {
        return request(server)
            .get("/api/languages/subregion/" + subregion_name);
    };
    const execIntRegion = () => {
        return request(server)
            .get("/api/languages/intregion/" + intregion_name);
    };
    const execCountry = () => {
        return request(server)
            .get("/api/languages/country/" + country);
    };

    /// Show Countries

    const execShowCountriesByLanguage = () => {
        return request(server)
            .get("/api/languages/showCountries/" + lang_name);
    };

    /// Request Related

    const execCreateRequest = () => {
        return request(server)
            .post("/api/languages/requests/")
            .set("Authorization", "Bearer "+token)
            .send({
                assigned_user_id, 
                lang_id, 
                lr_type, 
                lr_content, 
                lr_status
            });
    };
    const execUpdateRequest = () => { // can be reused for showLangRequestsByID / showAllRequests
        return request(server)
            .patch("/api/languages/requests/" + identificator) // identificator can be __ / lang_request_id
            .set("Authorization", "Bearer " + token)
            .send({
                created_user_id, 
                assigned_user_id, 
                lr_end_date, 
                lr_start_date, 
                lr_type, 
                lr_content, 
                lr_status
            });
    };
    const execShowAllRequest = () => { // can be reused for showAllRequests / showLangRequestsByID
        return request(server)
            .get("/api/languages/requests/" + identificator) // identificator can be __ / lang_request_id
            .set("Authorization", "Bearer " + token);
    };
    const execShowCompleteRequest = () => { // can be reused for showAllCompleteRequests / showCompleteRequestByLang
        return request(server)
            .get("/api/languages/requests/complete/" + identificator) // identificator can be __ / lang_id
            .set("Authorization", "Bearer " + token);
    };
    const execShowOpenRequest = () => { // can be reused for showAllOpenRequests / showOpenRequestByLang
        return request(server)
            .get("/api/languages/requests/open/" + identificator) // identificator can be __ / lang_id
            .set("Authorization", "Bearer " + token);
    };
    const execShowPendingRequest = () => { // can be reused for showAllPendingRequests / showPendingRequestsByLang
        return request(server)
            .get("/api/languages/requests/pending/" + identificator) // identificator can be __ / lang_id
            .set("Authorization", "Bearer " + token);
    };
    const execDeleteRequest = () => {
        return request(server)
            .delete("/api/languages/requests/" + lang_request_id)
            .set("Authorization", "Bearer " + token);
    };
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////TESTS//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    describe('General Languages Related Operations', () => {
        describe('create language function', () => {
            it('should return 200 if valid createLang request', async () => {
                const res = await execCreateLang();
                
                expect(res.status).toBe(200);
            });
            it('should return 400 if languages is already in the database', async () => {
                await execCreateLang();
                const res = await execCreateLang();
                
                expect(res.status).toBe(400);
            });
            it('should return 400 if token is invalid on createLang', async () => {
                token = '';
    
                const res = await execCreateLang();
        
                expect(res.status).toBe(400);
            });
            it('should return 401 if user is not logged in on createLang', async () => {

                const res = await request(server)
                    .post("/api/languages/")
                    .send(details);
        
                expect(res.status).toBe(401);
            });
            it('should return 500 if server throws internal error on createLang', async () => {

                const res = await request(server)
                    .post("/api/languages/")
                    .set("Authorization", "Bearer "+token)
                    .send({ nonsense: 'this will cause an SQL error' });
    
                expect(res.status).toBe(500);              
            });
        });
        describe('update by ID language function', () => {
            it('should return 200 if valid updateLangByID request', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;

                details.lang_name = 'UPDATED NAME';
    
                const res = await execUpdateLang();

                expect(res.status).toBe(200);
            });
            it('should return 200 if if no content changed', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
    
                const res = await execUpdateLang();
                expect(res.status).toBe(200);
            });
            it('should return 404 if language not found by updateLangByID', async () => {
                await execCreateLang();
                
                identificator = 999999;
    
                const res = await execUpdateLang();
                expect(res.status).toBe(404);
            });

        });
        describe('update by ISO language function', () => {
            it('should return 200 if valid updateLangByISO request', async () => {
                await execCreateLang();
            
                identificator = 'TEST';

                details.lang_name = 'UPDATED NAME';
    
                const res = await execUpdateLang();

                expect(res.status).toBe(200);
            });
            it('should return 200 if if no content changed', async () => {
                await execCreateLang();

                identificator = 'TEST';
    
                const res = await execUpdateLang();
                expect(res.status).toBe(200);
            });
            it('should return 404 if language not found by updateLangByISO', async () => {              
                identificator = 'Nope';
    
                const res = await execUpdateLang();
                expect(res.status).toBe(404);
            });
        });
        describe('showAll function', () => {
            it('should return 200 if valid showAll request', async () => {            
                identificator = '';
    
                const res = await execShowLang();
                
                expect(res.status).toBe(200);
            });
        });
        describe('showLangByID function', () => {
            it('should return 200 if valid showLangByID request', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
    
                const res = await execShowLang();
                
                expect(res.status).toBe(200);
            });
            it('should return 404 if language not found by showLangByID', async () => {
                identificator = 999999;
    
                const res = await execShowLang();
                
                expect(res.status).toBe(404);
            });
        });
        describe('showLangByISO function', () => {
            it('should return 200 if valid showLangByISO request', async () => {
                await execCreateLang();
    
                identificator = iso_code;
    
                const res = await execShowLang();
                
                expect(res.status).toBe(200);
            });
            it('should return 404 if language not found by showLangByID', async () => {
                identificator = 'Nope';
    
                const res = await execShowLang();
                
                expect(res.status).toBe(404);
            });
        });
        describe('deleteLangByID function', () => {
            it('should return 200 if valid deleteLangByID request', async () => {
                await execCreateLang();
    
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
    
                const res = await execDeleteLang();
                
                expect(res.status).toBe(200);
            });
            it('should return 404 if language cannot be found by deleteLangByID', async () => {
                identificator = 999999;
    
                const res = await execDeleteLang();
                
                expect(res.status).toBe(404);
            });
        });
        describe('deleteLangByISO function', () => {
            it('should return 200 if valid deleteLangByISO request', async () => {
                await execCreateLang();
    
                identificator = iso_code;
    
                const res = await execDeleteLang();
                
                expect(res.status).toBe(200);
            });
            it('should return 404 if language cannot be found by deleteLangByID', async () => {
                identificator = 'Nope';
    
                const res = await execDeleteLang();
                
                expect(res.status).toBe(404);
            });
        });
    });

    describe('Adding Countries', () => {
        describe('addCountryToLanguageByID function', () => {
            it('should return 200 if valid addCountryToLanguageByID request', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
                const res = await execAddCountryToLang();

                await execDeleteCountryFromLang();

                expect(res.status).toBe(200);
            });
            it('should return 400 if combination of language and country are already in the database', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
                await execAddCountryToLang();
                const res = await execAddCountryToLang();

                await execDeleteCountryFromLang();

                expect(res.status).toBe(400);
            });
        });
        describe('addCountryToLanguageByISO function', () => {
            it('should return 200 if valid addCountryToLanguageByISO request', async () => {
                await execCreateLang();
                
                identificator = iso_code;
                const res = await execAddCountryToLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
                await execDeleteCountryFromLang();

                expect(res.status).toBe(200);
            });
            it('should return 400 if combination of language and country are already in the database', async () => {
                await execCreateLang();
                
                identificator = iso_code;
                await execAddCountryToLang();
                const res = await execAddCountryToLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
                await execDeleteCountryFromLang();

                expect(res.status).toBe(400);
            });
        });
        describe('deleteLangsCountry function', () => {
            it('should return 200 if valid deleteLangsCountry request', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
                await execAddCountryToLang();

                const res = await execDeleteCountryFromLang();

                expect(res.status).toBe(200);
            });
            it('should return 404 if language-country pair cannot be found by deleteLangsCountry', async () => {
                identificator = 999999;

                const res = await execDeleteCountryFromLang();

                expect(res.status).toBe(404);
            });
        });
    });

    describe('Searching by Alternative Name', () => {
        describe('showLangByAltName function', () => {
            it('should return 200 if valid showLangByAltName request', async () => {
                await execCreateLang();

                const res = await execShowByAltName();

                expect(res.status).toBe(200);
            });
            it('should return 404 if language not found by showLangByAltName', async () => {
                alternative_names = 'This name is not in the db';

                const res = await execShowByAltName();

                expect(res.status).toBe(404);
            });
        });
    });

    describe('See all dialects', () => {
        describe('showAllDialects function', () => {
            it('should return 200 if valid showAllDialects request', async () => {
                const res = await execShowAllDialects();

                expect(res.status).toBe(200);
            });
        });
    });

    describe('Regional Ones', () => {
        describe('showLangByRegion function', () => {
            it('should return 200 if valid showLangByRegion request', async () => {
                const res = await execRegion();

                expect(res.status).toBe(200);
            });
            it('should return 404 if no languages are found for a region', async () => {
                region_name = 'Narnia';

                const res = await execRegion();

                expect(res.status).toBe(404);
            });
        });
        describe('showLangBySubregion function', () => {
            it('should return 200 if valid showLangBySubregion request', async () => {
                const res = await execSubRegion();

                expect(res.status).toBe(200);
            });
            it('should return 404 if no languages are found for a subregion', async () => {
                subregion_name = 'Narnia';

                const res = await execSubRegion();

                expect(res.status).toBe(404);
            });
        });
        describe('showLangByIntregion function', () => {
            it('should return 200 if valid showLangByIntregion request', async () => {
                const res = await execIntRegion();

                expect(res.status).toBe(200);
            });
            it('should return 404 if no languages are found for a intermediate region', async () => {
                intregion_name = 'Narnia';

                const res = await execIntRegion();

                expect(res.status).toBe(404);
            });
        });
        describe('showLangByCountry function', () => {
            it('should return 200 if valid showLangByCountry request', async () => {
                const res = await execCountry();

                expect(res.status).toBe(200);
            });
            it('should return 404 if no languages are found for a country', async () => {
                country = 'Narnia';

                const res = await execCountry();

                expect(res.status).toBe(404);
            });
        });
    });
    
    describe('Show Countries', () => {
        describe('showCountriesByLanguage function', () => {
            it('should return 200 if valid showCountriesByLanguage request', async () => {
                await execCreateLang();
                
                identificator = iso_code;
                await execAddCountryToLang();
                
                const res = await execShowCountriesByLanguage();

                console.log(res.body);
                console.log(identificator);

                await execDeleteCountryFromLang();

                expect(res.status).toBe(200);
            });
            it('should return 404 if no countries are found for a language', async () => {
                identificator = 999999;
                await execAddCountryToLang();
                
                const res = await execShowCountriesByLanguage();

                await execDeleteCountryFromLang();

                expect(res.status).toBe(404);
            });
        });
    });

    describe('Request related', () => {
        describe('createLangRequests function', () => {
            it('should return 200 if valid createLangRequests request', async () => {
                winston.info('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAa');
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;

                const res = await request(server)
                    .post("/api/languages/requests")
                    .set("Authorization", "Bearer "+token)
                    .send({
                        assigned_user_id:assigned_user_id, 
                        lang_id:identificator, 
                        lr_type:lr_type, 
                        lr_content:lr_content, 
                        lr_status:lr_status
                    });

                token = token.slice(7);
                const decoded = decode(token);

                console.log(token.result);

                identificator = '';

                // const haha = await execShowAllRequest();
                // console.log(res);
                // // lang_request_id = requests[-1].lang_request_id;

                // identificator = '0';
                // await execShowCompleteRequest();
                // await execShowOpenRequest();
                // await execShowPendingRequest();
                // await execUpdateRequest();

                // await execDeleteRequest();
                winston.info('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAa');
                expect(res.status).toBe(200);
            });
        });
    });
});