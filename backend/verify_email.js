const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testEmailUpdate() {
    try {
        console.log("1. Upserting Email to 'new_email@test.com'...");
        const upsertRes = await axios.post(`${BASE_URL}/admin/socials/upsert`, {
            platform: 'Email',
            url: 'new_email@test.com'
        });
        console.log("Upsert Response:", upsertRes.data);

        console.log("2. Fetching public data...");
        const fetchRes = await axios.get(`${BASE_URL}/public/all`);
        // console.log("Fetch Response:", JSON.stringify(fetchRes.data, null, 2));

        const socials = fetchRes.data.socials;
        const emailObj = socials.find(s => s.platform.toLowerCase() === 'email');

        if (emailObj) {
            console.log("Found Email object:", emailObj);
            if (emailObj.url === 'new_email@test.com') {
                console.log("SUCCESS: Email updated and fetched correctly.");
            } else {
                console.error("FAILURE: Email mismatch. Expected 'new_email@test.com', got", emailObj.url);
            }
        } else {
            console.error("FAILURE: 'Email' platform not found in public fetch.");
        }

    } catch (err) {
        console.error("Error during test:", err.message);
        if (err.response) {
            console.error("Response data:", err.response.data);
        }
    }
}

testEmailUpdate();
