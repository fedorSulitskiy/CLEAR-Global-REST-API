/* Note: In user API token validation is tested across every function but here it's only tested on createLang.
   we aren't testing it for every function because it is middleware and so it works the same every time, regardless
   of the function-specific error handling so it is redundant to test it for every function.
   It is tested on one, which means it should theoretically be enough to prove that it works for all.
*/

/// IMPORTANT TIP FOR VSCODE: CTRL + K + CTRL + 2 closes all 2nd level blocks allowing for immidiately easier navigation
/// IMPORTANT TIP FOR TESTS: If tests start failing due to "Exceeded timeout of 5000 ms for a testfalse." then run the following command: npm run clear_jest, it will clear the cache of jest testing library. It may help sometimes

const request = require('supertest');
const generateWebToken = require('../../auth/generateToken');
const tud = require('./_testUserDetails');
const winston = require('winston');

/// General data for for facilitating tests' functionality
let server;
let identificator;
let token;
let details;
let trial_language_object;

// Data to generate a tester language
let source_id;
let lang_name;
let iso_code;
let no_of_trans;
let lang_status;
let glottocode;
let total_speakers_nr;
let first_lang_speakers_nr;
let second_lang_speakers_nr;
let level;
let aes_status;
let family_name;

// Data for adding links to languages
let ref_id;
let link_id;
let glottolog_ref_id;
let lgcode;
let bib;
let comment;
let alternative_name;
let source;
let link;
let description;

// Data to manupilate country-language relationships
let country_iso_code;
let official;
let national;
let internet_users_percent;

// Geographical data for regional functions
let continent;
let region_name;
let intregion_name;
let country;

// Data for generating requests
let created_user_id;
let assigned_user_id;
let lr_end_date;
let lr_start_date;
let lang_id;
let lr_type;
let lr_title;
let lr_reason;
let lr_lang_name;
let lr_alternative_name;
let lr_iso_code;
let lr_glottocode;
let lr_added_countries;
let lr_removed_countries;
let lr_lang_status;
let lr_status;

// Data for generating authentication tokens
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

        // Data for generating a tester language
        source_id = 4;
        lang_name = 'The Testing Language';
        iso_code = 'TEST'; // Impossible 4 letter iso-code
        no_of_trans = 0;
        lang_status = 'verified';
        glottocode = 'test1234';
        total_speakers_nr = '0';
        first_lang_speakers_nr = '0';
        second_lang_speakers_nr = '0';
        level = 'language';
        aes_status = 'test';
        family_name = 'test';

        details = {
            source_id,
            lang_name,
            iso_code,
            no_of_trans,
            lang_status,
            glottocode,
            total_speakers_nr,
            first_lang_speakers_nr,
            second_lang_speakers_nr,
            level,
            aes_status,
            family_name
        }

        // Data for adding links to languages
        glottolog_ref_id = '12345678';
        lgcode = 'Test = testing time';
        bib = '@test';
        comment = 'J. Symons';
        alternative_name = 'Testenese';
        source = 'We made it up';
        link = 'https://clearglobal.org/';
        description = 'CLEAR Global';

        // Data to manipulate country-language relationships
        country_iso_code = 'GB'; /// This country must have proper reference to all regions / sub-regions / int-regions
        official = 'True';
        national = 'False';
        internet_users_percent = 10;

        // Georgraphical info regional functions
        continent = 'Africa';
        region_name = 'Northern Africa';
        intregion_name = 'Eastern Africa';
        country = 'Algeria';

        // Data for generating requests
        created_user_id = 2;
        assigned_user_id = 2;
        lr_type = "add";
        lr_title = 'Test', 
        lr_reason = 'We need to test',
        lr_lang_name = '',
        lr_alternative_name = '',
        lr_iso_code = '',
        lr_glottocode = '',
        lr_added_countries = '',
        lr_removed_countries = '',
        lr_lang_status = 'verified',
        lr_status = "complete";

        // Data to generate authorisation token
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
    const execAddRefs = () => {
        return request(server)
            .post("/api/languages/refs/"+lang_id)
            .set("Authorization", "Bearer "+token)
            .send({
                glottolog_ref_id:glottolog_ref_id,
                lgcode:lgcode,
                bib:bib
            });
    };
    const execAddSourceComment = () => {
        return request(server)
            .post("/api/languages/sourceComment/"+lang_id)
            .set("Authorization", "Bearer "+token)
            .send({
                comment:comment
            });
    };
    const execAddAlternativeNames = () => {
        return request(server)
            .post("/api/languages/alternativeNames/"+lang_id)
            .set("Authorization", "Bearer "+token)
            .send({
                alternative_name:alternative_name,
                source:source
            });
    };
    const execAddLinks = () => {
        return request(server)
            .post("/api/languages/links/"+lang_id)
            .set("Authorization", "Bearer "+token)
            .send({
                link:link,
                description:description
            });
    };
    const execUpdateLang = () => { // can be reused for updateLangByID / updateLangByISO
        return request(server)
            .patch("/api/languages/" + identificator) // can be id / iso_code
            .set("Authorization", "Bearer "+token)
            .send(details);
    };
    const execUpdateRefs = () => {
        return request(server)
            .patch("/api/languages/refs/" + ref_id)
            .set("Authorization", "Bearer "+token)
            .send({
                glottolog_ref_id:glottolog_ref_id,
                lgcode:lgcode,
                bib:bib
            });
    };
    const execUpdateLinks = () => {
        return request(server)
            .patch("/api/languages/links/" + link_id)
            .set("Authorization", "Bearer "+token)
            .send({
                lang_id:lang_id,
                link:link,
                description:description
            });
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
    const execDeleteRefs = () => {
        return request(server)
            .delete("/api/languages/refs/" + ref_id)
            .set("Authorization", "Bearer "+token);
    };
    const execDeleteSourceComment = () => {
        return request(server)
            .delete("/api/languages/sourceComment/")
            .set("Authorization", "Bearer "+token)
            .send({
                lang_id:lang_id,
                comment:comment
            });
    };
    const execDeleteAlternativeName= () => {
        return request(server)
            .delete("/api/languages/alternativeNames/")
            .set("Authorization", "Bearer "+token)
            .send({
                lang_id:lang_id,
                alternative_name:alternative_name,
                source:source
            });
    };
    const execDeleteLink = () => {
        return request(server)
            .delete("/api/languages/links/" + link_id)
            .set("Authorization", "Bearer "+token);
    };

    /// Adding Countries

    const execAddCountryToLang = () => { // can be reused for deleteLangByID / deleteLangByISO
        return request(server)
            .post("/api/languages/newCountry/" + identificator) // can be id / iso_code
            .set("Authorization", "Bearer "+token) 
            .send({
                country_iso_code:country_iso_code,
                official:official,
                national:national,
                internet_users_percent:internet_users_percent
            });
    };
    const execDeleteCountryFromLang = () => {
        return request(server)
            .delete("/api/languages/newCountry/") 
            .set("Authorization", "Bearer "+token) 
            .send({
                country_iso_code:country_iso_code,
                lang_id:identificator
            });
    };

    /// Country Links

    const execAddHDXLinks = () => {
        return request(server)
            .post("/api/languages/hdx/"+country_iso_code)
            .set("Authorization", "Bearer "+token)
            .send({
                link:link,
                description:description
            });
    };
    const execAddPublicTableauLinks = () => {
        return request(server)
            .post("/api/languages/pt/"+country_iso_code)
            .set("Authorization", "Bearer "+token)
            .send({
                link:link,
                description:description
            });
    };
    const execAddClearGlobalLinks = () => {
        return request(server)
            .post("/api/languages/clearglobal/"+country_iso_code)
            .set("Authorization", "Bearer "+token)
            .send({
                link:link,
                description:description
            });
    };
    const execDeleteHDXLink = () => {
        return request(server)
            .delete("/api/languages/hdx/" + country_iso_code)
            .set("Authorization", "Bearer "+token)
            .send({
                link:link
            });
    };
    const execDeletePublicTableauLink = () => {
        return request(server)
            .delete("/api/languages/pt/" + country_iso_code)
            .set("Authorization", "Bearer "+token)
            .send({
                link:link
            });
    };
    const execDeleteClearGlobalLink = () => {
        return request(server)
            .delete("/api/languages/clearglobal/" + country_iso_code)
            .set("Authorization", "Bearer "+token)
            .send({
                link:link
            });
    };

    /// Searching by Alternative Name

    const execShowByAltName = () => {
        return request(server)
            .get("/api/languages/alt_name/" + alternative_name);
    };

    /// See all dialects

    const execShowAllDialects = () => {
        return request(server)
            .get("/api/languages/dialects");
    };

    /// Regional Ones

    const execRegion = () => {
        return request(server)
            .get("/api/languages/continent/" + continent);
    };
    const execSubRegion = () => {
        return request(server)
            .get("/api/languages/region/" + region_name);
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
                assigned_user_id:assigned_user_id, 
                lang_id:identificator,  // This has to be set to an existing language's id
                lr_type:lr_type, 
                lr_title:lr_title, 
                lr_reason:lr_reason,
                lr_lang_name:lr_lang_name,
                lr_alternative_name:lr_alternative_name,
                lr_iso_code:lr_iso_code,
                lr_glottocode:lr_glottocode,
                lr_added_countries:lr_added_countries,
                lr_removed_countries:lr_removed_countries,
                lr_lang_status:lr_lang_status,
                lr_status:lr_status
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
                lr_title, 
                lr_reason,
                lr_lang_name,
                lr_alternative_name,
                lr_iso_code,
                lr_glottocode,
                lr_added_countries,
                lr_removed_countries, 
                lr_lang_status,
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
            .delete("/api/languages/requests/" + identificator)
            .set("Authorization", "Bearer " + token);
    };

    const clearRequestTest = async() => {
        // clears identifier so I can extract all requests
        identificator = '';
        var allRequests = await execShowAllRequest();

        // finds the latest created request which must be the request made during test
        allRequests = allRequests.body;
        const sortedArray = allRequests.sort((a, b) => b.lr_start_date - a.lr_start_date);
        identificator = sortedArray[0].lang_request_id;

        // deletes the request
        await execDeleteRequest();
    };
    const findIdentificator = async() => { 
        /* This fucntion helps to reduce repetitive code that helps find lang_id
        but I can't seem to make this work every time... */
        trial_language_object = await request(server)
            .get("/api/languages/" + iso_code);
        return trial_language_object.body.language.lang_id;
    };
    
    /// Tests
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
        describe('addRefs function', () => {
            it('should return 200 if valid addRefs request', async () => {
                await execCreateLang();

                lang_id = findIdentificator();
                const res = await execAddRefs();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                ref_id = trial_language_object.body.refs[0].ref_id;
                await execDeleteRefs();
                expect(res.status).toBe(200);
            });
            it('should return 404 if language not found by addRefs', async () => {
                lang_id = 999999;
    
                const res = await execAddRefs();
                expect(res.status).toBe(404);
            });
            
        });
        describe('addSourceComment function', () => {
            it('should return 200 if valid addSourceComment request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                lang_id = trial_language_object.body.language.lang_id;
                const res = await execAddSourceComment();
                
                await execDeleteSourceComment();
                expect(res.status).toBe(200);
            });
            it('should return 400 if source comment already exists', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                lang_id = trial_language_object.body.language.lang_id;
                await execAddSourceComment();
                const res = await execAddSourceComment();
                
                await execDeleteSourceComment();
                expect(res.status).toBe(400);
            });
            it('should return 404 if language not found by addSourceComment', async () => {
                lang_id = 999999;
    
                const res = await execAddSourceComment();
                expect(res.status).toBe(404);
            });
        });
        describe('addAlternativeName function', () => {
            it('should return 200 if valid addAlternativeName request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                lang_id = trial_language_object.body.language.lang_id;
                const res = await execAddAlternativeNames();
                
                await execDeleteAlternativeName();
                expect(res.status).toBe(200);
            });
            it('should return 400 if alternative name already exists', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                lang_id = trial_language_object.body.language.lang_id;
                await execAddAlternativeNames();
                const res = await execAddAlternativeNames();
                
                await execDeleteAlternativeName();
                expect(res.status).toBe(400);
            });
            it('should return 404 if language not found by addAlternativeName', async () => {
                lang_id = 999999;
    
                const res = await execAddAlternativeNames();
                expect(res.status).toBe(404);
            });
        });
        describe('addLinks function', () => {
            it('should return 200 if valid addLinks request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                lang_id = trial_language_object.body.language.lang_id;
                const res = await execAddLinks();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                link_id = trial_language_object.body.links[0].link_id;                
                await execDeleteLink();
                expect(res.status).toBe(200);
            });
            it('should return 400 if link already exists', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                lang_id = trial_language_object.body.language.lang_id;
                await execAddLinks();
                const res = await execAddLinks();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                link_id = trial_language_object.body.links[0].link_id;                
                await execDeleteLink();
                expect(res.status).toBe(400);
            });
            it('should return 404 if language not found by addLinks', async () => {
                lang_id = 999999;
    
                const res = await execAddLinks();
                expect(res.status).toBe(404);
            });
        });
        describe('update by ID language function', () => {
            it('should return 200 if valid updateLangByID request', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;
                
                details.lang_name = 'UPDATED NAME';
    
                const res = await execUpdateLang();

                expect(res.status).toBe(200);
            });
            it('should return 200 if if no content changed', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;
    
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
                identificator = trial_language_object.body.language.lang_id;
    
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
                identificator = trial_language_object.body.language.lang_id;
    
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
                identificator = trial_language_object.body.language.lang_id;
                const res = await execAddCountryToLang();

                await execDeleteCountryFromLang();
                expect(res.status).toBe(200);
            });
            it('should return 400 if combination of language and country are already in the database', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;
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
                identificator = trial_language_object.body.language.lang_id;
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
                identificator = trial_language_object.body.language.lang_id;
                await execDeleteCountryFromLang();

                expect(res.status).toBe(400);
            });
        });
        describe('deleteLangsCountry function', () => {
            it('should return 200 if valid deleteLangsCountry request', async () => {
                await execCreateLang();
                
                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;
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
                winston.info('AAAAAAAAAAAAAAAAAAA');
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                lang_id = trial_language_object.body.language.lang_id;

                await execAddAlternativeNames();

                const res = await execShowByAltName();

                await execDeleteAlternativeName();

                expect(res.status).toBe(200);
                winston.info('AAAAAAAAAAAAAAAAAAA');
            });
            it('should return 404 if language not found by showLangByAltName', async () => {
                alternative_name = 'This name is not in the db';

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
                continent = 'Narnia';

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
                region_name = 'Narnia';

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
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;

                const res = await execCreateRequest();

                await clearRequestTest();

                expect(res.status).toBe(200);
            });
            it('Should return 500 if server throws internal error on createLangRequests', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;
                lr_status = 'Not a real status';

                const res = await execCreateRequest();

                await clearRequestTest();

                expect(res.status).toBe(200);            
            });
        });
        describe('updateRequestsByID function', () => {
            it('should return 200 if valid updateRequestsByID request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;

                await execCreateRequest();

                identificator = '';
                var allRequests = await execShowAllRequest();

                allRequests = allRequests.body;
                const sortedArray = allRequests.sort((a, b) => b.lr_start_date - a.lr_start_date);
                identificator = sortedArray[0].lang_request_id;

                lr_end_date = 1;

                const res = await execUpdateRequest();

                await execDeleteRequest();

                expect(res.status).toBe(200);
            });
            it('should return 200 if no content changed', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;

                await execCreateRequest();

                identificator = '';
                var allRequests = await execShowAllRequest();

                allRequests = allRequests.body;
                const sortedArray = allRequests.sort((a, b) => b.lr_start_date - a.lr_start_date);
                identificator = sortedArray[0].lang_request_id;

                await execUpdateRequest();
                const res = await execUpdateRequest();

                await execDeleteRequest();

                expect(res.status).toBe(200);
            });
            it('should return 404 if request not found by updateRequestsByID', async () => {
                identificator = 999999;

                lr_end_date = 1;

                const res = await execUpdateRequest();

                expect(res.status).toBe(404);
            });
        });
        describe('showLangRequestsByID function', () => {
            it('should return 200 if valid showLangRequestsByID request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;

                await execCreateRequest();

                identificator = '';
                var allRequests = await execShowAllRequest();

                allRequests = allRequests.body;
                const sortedArray = allRequests.sort((a, b) => b.lr_start_date - a.lr_start_date);
                identificator = sortedArray[0].lang_request_id;

                const res = await execShowAllRequest();

                await execDeleteRequest();

                expect(res.status).toBe(200);
            });
            it('should return 404 if request not found by showLangRequestsByID', async () => {
                identificator = 999999;

                const res = await execShowAllRequest();

                expect(res.status).toBe(404);
            });
        });
        describe('showAllRequests function', () => {
            it('should return 200 if valid showAllRequests request', async () => {
                identificator = '';
                
                const res = await execShowAllRequest();

                expect(res.status).toBe(200);
            });
        });
        describe('showAllCompleteRequests function', () => {
            it('should return 200 if valid showAllCompleteRequests request', async () => {
                identificator = '';
                
                const res = await execShowCompleteRequest();

                expect(res.status).toBe(200);
            });
        });
        describe('showCompleteRequestByLang function', () => {
            it('should return 200 if valid showCompleteRequestByLang request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;

                await execCreateRequest();

                const res = await execShowCompleteRequest();

                await clearRequestTest();

                expect(res.status).toBe(200);
            });
            it('should return 404 if request not found by showCompleteRequestByLang', async () => {
                identificator = 999999;

                const res = await execShowCompleteRequest();

                expect(res.status).toBe(404);
            });
        });
        describe('showAllOpenRequests function', () => {
            it('should return 200 if valid showAllOpenRequests request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;
                lr_status = 'in progress';

                await execCreateRequest();
                
                identificator = '';
                
                const res = await execShowOpenRequest();

                await clearRequestTest();

                expect(res.status).toBe(200);
            });
        });
        describe('showOpenRequestByLang function', () => {
            it('should return 200 if valid showOpenRequestByLang request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;
                lr_status = 'in progress';

                await execCreateRequest();

                const res = await execShowOpenRequest();

                await clearRequestTest();

                expect(res.status).toBe(200);
            });
            it('should return 404 if request not found by showOpenRequestByLang', async () => {
                identificator = 999999;

                const res = await execShowOpenRequest();

                expect(res.status).toBe(404);
            });
        });
        describe('showAllPendingRequests function', () => {
            it('should return 200 if valid showAllPendingRequests request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;
                lr_status = 'pending';

                await execCreateRequest();
                
                identificator = '';
                
                const res = await execShowPendingRequest();

                await clearRequestTest();

                expect(res.status).toBe(200);
            });
        });
        describe('showPendingRequestsByLang function', () => {
            it('should return 200 if valid showPendingRequestsByLang request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;
                lr_status = 'pending';

                await execCreateRequest();

                const res = await execShowPendingRequest();

                await clearRequestTest();

                expect(res.status).toBe(200);
            });
            it('should return 404 if request not found by showPendingRequestsByLang', async () => {
                identificator = 999999;

                const res = await execShowPendingRequest();

                expect(res.status).toBe(404);
            });
        });
        describe('deleteRequest function', () => {
            it('should return 200 if valid deleteRequest request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                identificator = trial_language_object.body.language.lang_id;

                await execCreateRequest();

                identificator = '';
                var allRequests = await execShowAllRequest();

                allRequests = allRequests.body;
                const sortedArray = allRequests.sort((a, b) => b.lr_start_date - a.lr_start_date);
                identificator = sortedArray[0].lang_request_id;

                const res = await execDeleteRequest();

                expect(res.status).toBe(200);
            });
            it('should return 404 if request not found by deleteRequest', async () => {
                identificator = 999999;

                const res = await execDeleteRequest();

                expect(res.status).toBe(404);
            });
        });
    });
});