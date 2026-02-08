async function checkPublicData() {
    try {
        console.log("Fetching public data from http://localhost:5001/api/public/all ...");
        const res = await fetch('http://localhost:5001/api/public/all');
        const data = await res.json();

        console.log("\n--- CV Data ---");
        console.log(JSON.stringify(data.cv, null, 2));

        if (data.cv && data.cv.url) {
            console.log("Checking CV URL accessibility:", data.cv.url);

            const variants = [
                data.cv.url,
                data.cv.url.replace('/image/upload/', '/raw/upload/'),
                data.cv.url.replace('/image/upload/', '/image/upload/fl_attachment/')
            ];

            for (const variant of variants) {
                try {
                    console.log(`Testing variant: ${variant}`);
                    const cvRes = await fetch(variant);
                    console.log(`Status: ${cvRes.status} ${cvRes.statusText}`);
                    if (cvRes.ok) {
                        console.log("SUCCESS! This variant works.");
                    }
                } catch (e) {
                    console.error("Fetch failed:", e.message);
                }
                console.log('---');
            }
        }

    } catch (err) {
        console.error("Request failed:", err.message);
    }
}

checkPublicData();
