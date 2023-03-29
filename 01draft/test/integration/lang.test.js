const request = require('supertest');
const generateWebToken = require('../../auth/generateToken');
const tud = require('./_testUserDetails');

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
            ref_id:ref_id,
            source_id:source_id,
            lang_name:lang_name,
            iso_code:iso_code,
            no_of_trans:no_of_trans,
            lang_status:lang_status,
            glotto_ref:glotto_ref,
            official:official,
            national:national,
            official_H2H:official_H2H,
            unofficial_H2H:unofficial_H2H,
            total_speakers_nr:total_speakers_nr,
            first_lang_speakers_nr:first_lang_speakers_nr,
            second_lang_speakers_nr:second_lang_speakers_nr,
            internet_users_percent:internet_users_percent,
            TWB_machine_translation_development:TWB_machine_translation_development,
            TWB_recommended_Pivot_langs:TWB_recommended_Pivot_langs,
            community_feasibility:community_feasibility,
            recruitment_feasibility:recruitment_feasibility,
            recruitment_category:recruitment_category,
            total_score_15:total_score_15,
            level:level,
            latitude:latitude,
            longitude:longitude,
            aes_status:aes_status,
            source_comment:source_comment,
            alternative_names:alternative_names,
            links:links,
            family_name:family_name
        }

        country_id = 100;

        region_name = 'Africa';
        subregion_name = 'Northern Africa';
        intregion_name = 'Eastern Africa';
        country = 'Algeria';

        created_user_id = 0;
        assigned_user_id = 0;
        lr_end_date = 0;
        lr_start_date = 0;
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
            .post("/api/languages/requests")
            .set("Authorization", "Bearer "+token)
            .send({
                lang_id, 
                lr_type, 
                lr_content, 
                lr_status
            });
    };
    const execUpdateRequest = () => { // can be reused for showLangRequestsByID / showAllRequests
        return request(server)
            .post("/api/languages/requests/" + identificator) // identificator can be __ / lang_request_id
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

    /// TESTS

    describe('General Languages Related Operations', () => {
        describe('create language function', () => {
            it('Should return 200 if valid createLang request', async () => {
                const res = await execCreateLang();
                
                expect(res.status).toBe(200);
            });
        });
        describe('update by ID language function', () => {
            it('Should return 200 if valid updateLangByID request', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
    
                const res = await execUpdateLang();
                
                expect(res.status).toBe(200);
            });
        });
        describe('update by ISO language function', () => {
            it('Should return 200 if valid updateLangByISO request', async () => {
                await execCreateLang();
                
                dentificator = iso_code;
                
                const res = await execUpdateLang();
                
                expect(res.status).toBe(200);
            });
        });
        describe('showAll function', () => {
            it('Should return 200 if valid showAll request', async () => {            
                identificator = '';
    
                const res = await execShowLang();
                
                expect(res.status).toBe(200);
            });
        });
        describe('showLangByID function', () => {
            it('Should return 200 if valid showLangByID request', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
    
                const res = await execShowLang();
                
                expect(res.status).toBe(200);
            });
        });
        describe('showLangByISO function', () => {
            it('Should return 200 if valid showLangByISO request', async () => {
                await execCreateLang();
    
                identificator = iso_code;
    
                const res = await execShowLang();
                
                expect(res.status).toBe(200);
            });
        });
        describe('deleteLangByID function', () => {
            it('Should return 200 if valid deleteLangByID request', async () => {
                await execCreateLang();
    
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
    
                const res = await execDeleteLang();
                
                expect(res.status).toBe(200);
            });
        });
        describe('deleteLangByISO function', () => {
            it('Should return 200 if valid deleteLangByISO request', async () => {
                await execCreateLang();
    
                identificator = iso_code;
    
                const res = await execDeleteLang();
                
                expect(res.status).toBe(200);
            });
        });
    });


    describe('Searching by Alternative Name', () => {
        describe('showLangByAltName function', () => {
            it('Should return 200 if valid showLangByAltName request', async () => {
                await execCreateLang();

                const res = await execShowByAltName();

                expect(res.status).toBe(200);
            });
        });
    });

    describe('See all dialects', () => {
        describe('showAllDialects function', () => {
            it('Should return 200 if valid showAllDialects request', async () => {
                const res = await execShowAllDialects();

                expect(res.status).toBe(200);
            });
        });
    });

    describe('Regional Ones', () => {
        describe('showLangByRegion function', () => {
            it('Should return 200 if valid showLangByRegion request', async () => {
                const res = await execRegion();

                expect(res.status).toBe(200);
            });
        });
        describe('showLangBySubregion function', () => {
            it('Should return 200 if valid showLangBySubregion request', async () => {
                const res = await execSubRegion();

                expect(res.status).toBe(200);
            });
        });
        describe('showLangByIntregion function', () => {
            it('Should return 200 if valid showLangByIntregion request', async () => {
                const res = await execIntRegion();

                expect(res.status).toBe(200);
            });
        });
        describe('showLangByCountry function', () => {
            it('Should return 200 if valid showLangByCountry request', async () => {
                const res = await execCountry();

                expect(res.status).toBe(200);
            });
        });
    });
    
    describe('Show Countries', () => {
        describe('showCountriesByLanguage function', () => {
            it('Should return 200 if valid showCountriesByLanguage request', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body[0].lang_id;
                await execAddCountryToLang();
                
                const res = await execShowCountriesByLanguage();

                await execDeleteCountryFromLang();

                console.log(identificator);
                console.log(country_id);
                console.log(lang_name);

                expect(res.status).toBe(200);
            });
        });
    });

    // /// VALID REQUESTS

    // describe('VALID REQUESTS', () => {
    //     it('Should return 200 if valid createLang request', async () => {
    //         const res = await execCreateLang();
            
    //         expect(res.status).toBe(200);
    //     });
    //     it('Should return 200 if valid showAll request', async () => {
    //         isoCode = '';
    
    //         const res = await execShowLang();
            
    //         expect(res.status).toBe(200);
    //     });
    //     it('Should return 200 if valid showLang request', async () => {
    //         await execCreateLang();
    
    //         const res = await execShowLang();
            
    //         expect(res.status).toBe(200);
    //     });
    //     it('Should return 200 if updateLang is successful', async () => {
    //         await execCreateLang();
    //         name = 'TEST2';
    
    //         const res = await execUpdateLang();
    
    //         expect(res.status).toBe(200);
    //     });
    //     it('Should return 200 if no content changed', async () => {
    //         await execCreateLang();

    //         const res = await execUpdateLang();

    //         expect(res.status).toBe(200);
    //     });
    // });

    // /// BAD REQUESTS

    // describe('BAD REQUESTS', () => {
    //     it("Should return 400 if language is already in the database", async () => {
    //         await execCreateLang();
    
    //         const res = await execCreateLang();
            
    //         expect(res.status).toBe(400);
    //     });
    //     it('should return 400 if user is not logged in on createLang', async () => {
    //         token = '';

    //         const res = await execCreateLang();
    
    //         expect(res.status).toBe(400);
    //     });
    //     it('should return 400 if token is invalid in on updateLang', async () => {
    //         await execCreateLang();
    //         name = 'TEST2';
    //         token = '';

    //         const res = await execUpdateLang();
    
    //         expect(res.status).toBe(400);
    //     });
    //     it('should return 400 if token is invalid in on deleteLang', async () => {
    //         await execCreateLang();
            
    //         token = ''

    //         const res = await execDeleteLang();
    
    //         expect(res.status).toBe(400);
    //     });
    //     it('should return 401 if token is invalid in on createLang', async () => {

    //         const res = await request(server)
    //             .post("/api/languages/")
    //             .send(details);
    
    //         expect(res.status).toBe(401);
    //     });
    //     it('should return 401 if user is not logged in on updateLang', async () => {
    //         await execCreateLang();
    //         name = 'TEST2';

    //         const res = await request(server)
    //             .patch("/api/languages/" + isoCode)
    //             .send(details);
    
    //         expect(res.status).toBe(401);
    //     });
    //     it('should return 401 if user is not logged in on deleteLang', async () => {
    //         await execCreateLang();
    
    //         const res = await request(server)
    //             .delete("/api/languages/" + isoCode);
    
    //         expect(res.status).toBe(401);
    //     });
    //     it('Should return 404 if language not found by showLang', async () => {
    //         isoCode = 't';

    //         const res = await execShowLang();
    
    //         expect(res.status).toBe(404);
    //     });  
    //     it('Should return 404 if language not found by deleteLang', async () => {
    //         isoCode = 't';

    //         const res = await execDeleteLang();
    
    //         expect(res.status).toBe(404);
    //     });
    //     it('Should return 404 if language could not be found by updateLang', async () => {
    //         isoCode = 't';
    //         name = 'TEST2';

    //         const res = await execUpdateLang();

    //         expect(res.status).toBe(404);
    //     })
    // });   

    // /// INTERNAL SERVER ERRORS

    // describe('INTERNAL SERVER ERROR', () => {
    //     it('Should return 500 if there is a server error on createLang', async () => {

    //         const res = await request(server)
    //             .post("/api/languages/")
    //             .set("Authorization", "Bearer "+token)
    //             .send({ isoCode: isoCode, name: name });

    //         expect(res.status).toBe(500);              
    //     });
    //     it('Should return 500 if there is a server error on updateLang', async () => {
    //         await execCreateLang();

    //         const res = await request(server)
    //             .patch("/api/languages/" + isoCode)
    //             .set("Authorization", "Bearer "+token)
    //             .send({ isoCode: isoCode, name: name });

    //         expect(res.status).toBe(500);              
    //     });
    //     // it('Should return 500 if there is a server error on showAll', async () => {
            
    //     //     const res = await request(server)
    //     //         .get("/api/languages/" + isoCode);

    //     //     expect(res.status).toBe(500);              
    //     // });
    //     // it('Should return 500 if there is a server error on delete', async () => {
    //     //     isoCode = 'aaaa'
            
    //     //     const res = await request(server)
    //     //         .delete("/api/languages/" + isoCode);

    //     //     expect(res.status).toBe(500);              
    //     // });
    // });
});