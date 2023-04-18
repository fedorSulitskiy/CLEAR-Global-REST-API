/// IMPORTANT TIP FOR VSCODE: CTRL + K + CTRL + 2 closes all 2nd level blocks allowing for immidiately easier navigation

const request = require('supertest');
const generateWebToken = require('../../auth/generateToken');
const tud = require('./_testUserDetails');
const winston = require('winston');

// Data for facilitating general test processes
let server;
let token;
let details;

// Data to search for requests between dates
let start_date;
let end_date;
let country_name;

// Data to create a language
let source_id;
let lang_name;
let iso_code;
let no_of_trans;
let lang_status;
let glottocode;
let total_speakers_nr;
let first_lang_speakers_nr;
let second_lang_speakers_nr;
let TWB_machine_translation_development;
let TWB_recommended_Pivot_langs;
let community_feasibility;
let recruitment_feasibility;
let recruitment_category;
let total_score_15;
let level;
let aes_status;
let family_name;

// Data to create a request
let assigned_user_id;
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
let lr_status;

// Data to delete request
let lang_request_id;

// Data to manage country-language relationships
let country_iso_code;
let official;
let national;

// Data to generate authorisation token
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

describe('App API', () => {

    beforeEach(() => {
        server = require('../../index');

        // Current time
        const currentDate = new Date();
        const timestamp = Math.floor(currentDate.getTime() / 1000);
        
        // Data to search for requests between dates
        start_date = timestamp - 100;
        end_date = timestamp + 200;
        country_name = 'Algeria';

        // Data to create a language
        source_id = 4;
        lang_name = 'The Testing Language';
        iso_code = 'TEST'; // Impossible 4 letter iso-code
        no_of_trans = 0;
        lang_status = 'verified';
        glottocode = 'test1234';
        total_speakers_nr = '0';
        first_lang_speakers_nr = '0';
        second_lang_speakers_nr = '0';
        TWB_machine_translation_development = 0;
        TWB_recommended_Pivot_langs = 0;
        community_feasibility = 0;
        recruitment_feasibility = 0;
        recruitment_category = 'test';
        total_score_15 = 0;
        level = 'language';
        aes_status = 'test';
        family_name = 'test';

        lang_details = {
            source_id,
            lang_name,
            iso_code,
            no_of_trans,
            lang_status,
            glottocode,
            total_speakers_nr,
            first_lang_speakers_nr,
            second_lang_speakers_nr,
            TWB_machine_translation_development,
            TWB_recommended_Pivot_langs,
            community_feasibility,
            recruitment_feasibility,
            recruitment_category,
            total_score_15,
            level,
            aes_status,
            family_name
        }

        // Data to create a request
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
        lr_status = "complete";

        req_details = {
            assigned_user_id:assigned_user_id, 
            lang_id:lang_id,  // This has to be set to an existing language's id
            lr_type:lr_type, 
            lr_title:lr_title, 
            lr_reason:lr_reason,
            lr_lang_name:lr_lang_name,
            lr_alternative_name:lr_alternative_name,
            lr_iso_code:lr_iso_code,
            lr_glottocode:lr_glottocode,
            lr_added_countries:lr_added_countries,
            lr_removed_countries:lr_removed_countries,
            lr_status:lr_status
        }

        // Data to manage country-language relationships
        country_iso_code = 'ABW'; // This country must have proper reference to all regions / sub-regions / int-regions
        official = 1;
        national = 0;

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
        await execDeleteLang();
        server.close();
    });
    
    // Set-up functions
    const execCreateLang = () => {
        return request(server)
            .post("/api/languages/")
            .set("Authorization", "Bearer "+token)
            .send(lang_details);
    };
    const execDeleteLang = () => {
        return request(server)
            .delete("/api/languages/" + iso_code)
            .set("Authorization", "Bearer "+token);
    };
    const execCreateRequest = () => {
        return request(server)
            .post("/api/languages/requests")
            .set("Authorization", "Bearer "+token)
            .send(req_details);
    };
    const execDeleteRequest = () => {
        return request(server)
            .delete("/api/languages/requests/" + lang_request_id)
            .set("Authorization", "Bearer "+token);
    };

    // Tested functions
    const execShowAllCountries = () => {
        return request(server)
            .get("/api/app/countries")
    };
    const execShowCountriesByLanguage = () => {
        return request(server)
            .get("/api/app/countries/"+lang_name);
    };
    const execShowCountryInfo = () => {
        return request(server)
            .get("/api/app/countries/info/"+country_name);
    };
    const execShowAllLang = () => {
        return request(server)
            .get("/api/app/lang/");
    };
    const execShowLangDetails = () => {
        return request(server)
            .get("/api/app/lang/"+lang_name);
    };
    const execShowRequestByLang = () => {
        return request(server)
            .get("/api/app/requests/"+lang_name);
    };
    const execShowRequestBetweenDates = () => {
        return request(server)
            .get("/api/app/requests/period/"+lang_name)
            .send({
                start_date:start_date,
                end_date:end_date
            });
    };
    const execShowMostRecentRequest = () => {
        return request(server)
            .get("/api/app/recent/");
    };
    const execShowAllRequest = () => { 
        return request(server)
            .get("/api/languages/requests/")
            .set("Authorization", "Bearer " + token);
    };

    // Finding lang_request_id
    const findRequestID = async () => {
        // clears identifier so I can extract all requests
        var allRequests = await execShowAllRequest();

        // finds the latest created request which must be the request made during test
        allRequests = allRequests.body;
        const sortedArray = allRequests.sort((a, b) => b.lr_start_date - a.lr_start_date);
        return sortedArray[0].lang_request_id;
    };

    /// Tests
    describe('Countries Output', () => {
        describe('showAllCountries', () => {
            it('should return 200 if valid showAllCountries request', async () => {
                const res = await execShowAllCountries();
                
                expect(res.status).toBe(200);
            });
        });
        describe('showCountriesByLang', () => {
            it('should return 200 if valid showCountriesByLang request', async () => {
                lang_name = 'English';

                const res = await execShowCountriesByLanguage();
                
                expect(res.status).toBe(200);
            });
            it('should return 404 if country not found by showCountriesByLang', async () => {
                lang_name = 'NOT A REAL NAME';
    
                const res = await execShowCountriesByLanguage();
                
                expect(res.status).toBe(404);
            });
        });
        describe('showCountryInfo', () => {
            it('should return 200 if valid showCountryInfo request', async () => {
                const res = await execShowCountryInfo();
                
                expect(res.status).toBe(200);
            });
            it('should return 404 if country not found by showCountryInfo', async () => {
                country_name = 'NOT A REAL NAME';
    
                const res = await execShowCountryInfo();
                
                expect(res.status).toBe(404);
            });
        });
    });

    describe('Languages Output', () => {
        describe('showAllLang', () => {
            it('should return 200 if valid showAllLang request', async () => {
                const res = await execShowAllLang();
                
                expect(res.status).toBe(200);
            });
        });
        describe('showLangDetails', () => {
            it('should return 200 if valid showLangDetails request', async () => {
                await execCreateLang();
                
                const res = await execShowLangDetails();
                
                expect(res.status).toBe(200);
            });
            it('should return 404 if language not found by showLangDetails', async () => {
                lang_name = 'NOT A REAL NAME';
    
                const res = await execShowLangDetails();
                
                expect(res.status).toBe(404);
            });
        });
    });

    describe('Requests Output', () => {
        describe('showRequestsByLang', () => {
            it('should return 200 if valid showRequestsByLang request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                req_details.lang_id = trial_language_object.body.language.lang_id;

                await execCreateRequest();

                lang_request_id = findRequestID();

                const res = await execShowRequestByLang();

                await execDeleteRequest();

                expect(res.status).toBe(200);
            });
            it('should return 404 if request not found by showRequestsByLang', async () => {
                lang_name = 'NOT A REAL NAME';
    
                const res = await execShowRequestByLang();
                
                expect(res.status).toBe(404);
            });
        });
        describe('showRequestsBetweenDates', () => {
            it('should return 200 if valid showRequestsBetweenDates request', async () => {
                await execCreateLang();

                trial_language_object = await request(server)
                    .get("/api/languages/" + iso_code);
                req_details.lang_id = trial_language_object.body.language.lang_id;

                await execCreateRequest();

                lang_request_id = findRequestID();

                const res = await execShowRequestBetweenDates();

                await execDeleteRequest();

                expect(res.status).toBe(200);
            });
            it('should return 404 if request not found by showRequestsBetweenDates', async () => {
                lang_name = 'NOT A REAL NAME';
    
                const res = await execShowRequestBetweenDates();
                
                expect(res.status).toBe(404);
            });
        });
        describe('showMostRecentRequest', () => {
            it('should return 200 if valid showMostRecentRequest request', async () => {
                const res = await execShowMostRecentRequest();
                
                expect(res.status).toBe(200);
            });
        });
    });
});