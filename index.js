const axios = require('axios').default;
const fs = require('fs');

const SPREADSHEET_SECRETKEY = process.env.SPREADSHEET_SECRETKEY;
const VERSION_NO = 'v1';
const UNKNOWN_NAME = 'unknown';

async function main() {
    async function getHeros() {
        let heros = [];
        try {
            const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1PYlfnHxUJFc_GYtFCpcvAIb3QbxYtBGQq9Ra2eltT3g/values/[MM]Detail%20Cases?key=${SPREADSHEET_SECRETKEY}`);
            heros = response.data;
        } catch (error) {
            console.error(error);
        }
        return heros;
    }

    function writeJsonToFile(jsonObj = {}, fileName = '') {
        // fileName မှာ / ပါခဲ့ရင် directory ကိုမရှိသေးရင် တည်ဆောက်ပေး
        if (fileName.indexOf('/') > -1) {
            let fileNameArr = fileName.split('/');
            fileNameArr = fileNameArr.splice(0, 1);
            fileNameArr.forEach((e) => {
                let dirName = `${VERSION_NO}/${e}`;
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName);
                }
            });
        }

        if (Array.isArray(jsonObj)) {
            jsonObj = {
                items: jsonObj
            }
        }

        let jsonString = JSON.stringify(jsonObj, null, 4);
        fs.writeFileSync(`${VERSION_NO}/${fileName}.json`, jsonString);
    }

    function getFormattedDate(date, isOnlyDigit = false) {
        if (!date) return '';
        let d = date;
        if (typeof date === "string") {
            d = new Date(date);
        }
        d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
        if (isOnlyDigit) {
            d = d.replace(/-/g, '');
        }
        return d;
    }

    function createJSON(todayJSON) {
        const heros = JSON.parse(fs.readFileSync(`${VERSION_NO}/${todayJSON}.json`));

        let summaryJSON = {
            total: 0,
            gender: {}
        };
        let heroJSON = [];
        let genderJSON = {};
        for (let i = 1; i < heros.values.length; i++) {
            let heroVal = heros.values[i];

            let heroName = heroVal[0];
            let fallenDay = getFormattedDate(heroVal[1]);
            let heroAge = heroVal[2];
            let heroGender = heroVal[3].toLowerCase();
            let fallenCity = heroVal[4];
            let fallenState = heroVal[5];
            let fallenPlace = heroVal[6];
            let heroPlace = heroVal[7];
            let fallenCause = heroVal[8];

            let hero = {
                heroName,
                fallenDay,
                heroAge,
                heroGender,
                fallenCity,
                fallenState,
                fallenPlace,
                heroPlace,
                fallenCause
            };

            // ကျဆုံးတဲ့ရက်ပါတာပေါ်မူတည်ပြီး မှတ်စုသက်သက် or ကျဆုံးသူကိုခွဲခြား
            if (fallenDay) {
                // heroJSON
                heroJSON.push(hero);

                // genderJSON
                if (heroGender) {
                    if (!genderJSON[heroGender]) {
                        genderJSON[heroGender] = [];
                    }
                    genderJSON[heroGender].push(hero);
                } else {
                    if (!genderJSON[UNKNOWN_NAME]) {
                        genderJSON[UNKNOWN_NAME] = [];
                    }
                    genderJSON[UNKNOWN_NAME].push(hero);
                }
            }
        } // end for

        writeJsonToFile(heroJSON, 'hero');

        writeJsonToFile(genderJSON, 'gender');
        for (const gender in genderJSON) {
            writeJsonToFile(genderJSON[gender], `gender/${gender}`);
            summaryJSON['gender'][gender] = genderJSON[gender].length;
            summaryJSON['total'] += genderJSON[gender].length;
        }

        // summary
        writeJsonToFile(summaryJSON, 'summary');
    }

    let todayDate = getFormattedDate(new Date(), true);
    // const heros = await getHeros();
    // writeJsonToFile(heros, `${todayDate}/raw`);

    createJSON(`${todayDate}/raw`);
}

main();