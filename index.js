const axios = require('axios').default;
const fs = require('fs');

const SPREADSHEET_SECRETKEY = process.env.SPREADSHEET_SECRETKEY;
const VERSION_NO = 'v1';
const UNKNOWN_NAME = 'unknown';

async function main() {
    async function getHeroes() {
        let heroes = [];
        try {
            const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1PYlfnHxUJFc_GYtFCpcvAIb3QbxYtBGQq9Ra2eltT3g/values/[MM]Detail%20Cases?key=${SPREADSHEET_SECRETKEY}`);
            heroes = response.data;
        } catch (error) {
            console.error(error);
        }
        return heroes;
    }

    function writeJsonToFile(jsonObj = {}, fileName = '') {
        // fileName or folderName ကို camelCase မလိုချင်
        fileName = camelCaseToDash(fileName);

        // fileName မှာ / ပါခဲ့ရင် directory ကိုမရှိသေးရင် တည်ဆောက်ပေး
        // console.log(`writeJsonToFile`, fileName);
        if (fileName.indexOf('/') > -1) {
            let fileNameArr = fileName.split('/');
            fileNameArr.length = fileNameArr.length - 1;
            let dirName = `${VERSION_NO}/`;
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName);
            }
            fileNameArr.forEach((e) => {
                dirName += `${e}/`;
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
        // date ဟုတ်မဟုတ် သေချာအောင်ထပ်ပြန်စစ်ပေးပြီး မဟုတ်ရင် '' ကိုပဲ return ပြန်ပေးလိုက်မယ်
        if (!d.match(/^[0-9\-]+$/i)) {
            return '';
        }
        return d;
    }

    function camelCaseToDash(myStr) {
        return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    function pushToJSON(pushJSON, jsonKey, hero) {
        if (jsonKey) {
            if (!pushJSON[jsonKey]) {
                pushJSON[jsonKey] = [];
            }
            pushJSON[jsonKey].push(hero);
        } else {
            if (!pushJSON[UNKNOWN_NAME]) {
                pushJSON[UNKNOWN_NAME] = [];
            }
            pushJSON[UNKNOWN_NAME].push(hero);
        }
    }

    function createRecursiveJsonFiles(recJSON, jsonKeyName, summaryJSON) {
        writeJsonToFile(recJSON, jsonKeyName);
        for (const key in recJSON) {
            writeJsonToFile(recJSON[key], `${jsonKeyName}/${key}`);
            if (!summaryJSON[jsonKeyName]) {
                summaryJSON[jsonKeyName] = {};
            }
            summaryJSON[jsonKeyName][key] = recJSON[key].length;
        }
    }

    function heroAgeHumanReadable(ageJSON, heroAge, hero) {
        if (heroAge) {
            let ageName = '';
            if (heroAge < 10) {
                ageName = 'under10';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge < 16) {
                ageName = 'under16';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge < 20) {
                ageName = 'under20';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge >= 0 && heroAge <= 9) {
                ageName = '0th';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge >= 10 && heroAge <= 19) {
                ageName = '10th';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge >= 20 && heroAge <= 29) {
                ageName = '20th';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge >= 30 && heroAge <= 39) {
                ageName = '30th';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge >= 40 && heroAge <= 49) {
                ageName = '40th';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge >= 50 && heroAge <= 59) {
                ageName = '50th';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge >= 60 && heroAge <= 69) {
                ageName = '60th';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge >= 70 && heroAge <= 79) {
                ageName = '70th';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge >= 80 && heroAge <= 89) {
                ageName = '80th';
                pushToJSON(ageJSON, ageName, hero);
            }

            if (heroAge >= 90 && heroAge <= 99) {
                ageName = '90th';
                pushToJSON(ageJSON, ageName, hero);
            }
        }
    }

    function createJSON(heroes) {
        let todayDate = `backup/${getFormattedDate(new Date(), true)}/raw`;
        let heroesFromBackup = [];

        try {
            heroesFromBackup = JSON.parse(fs.readFileSync(`${VERSION_NO}/${todayDate}.json`));
            console.log(`file reading finished`);
        } catch (e) {
            console.log(`file for ${todayDate} not exist yet`);
        }

        isHeroesNotChanging = JSON.stringify(heroes) === JSON.stringify(heroesFromBackup);
        console.log(`isHeroesNotChanging`, isHeroesNotChanging);

        // အပြောင်းအလဲမရှိသေးတာမို့လို့ ဆက်လုပ်ဖို့မလိုအပ်
        if (isHeroesNotChanging) return;

        console.log(`createJSON`);
        writeJsonToFile(heroes, todayDate);

        let summaryJSON = {
            total: 0
        };
        let heroJSON = [];
        let genderJSON = {};
        let ageJSON = {};
        let fallenDayJSON = {};
        for (let i = 1; i < heroes.values.length; i++) {
            let heroVal = heroes.values[i];

            let heroName = heroVal[0] ? heroVal[0] : '';
            let fallenDay = getFormattedDate(heroVal[1]);
            let heroAge = heroVal[2] ? heroVal[2] : '';
            let heroGender = heroVal[3].toLowerCase();
            let fallenCity = heroVal[4] ? heroVal[4] : '';
            let fallenState = heroVal[5] ? heroVal[5] : '';
            let fallenPlace = heroVal[6] ? heroVal[6] : '';
            let heroPlace = heroVal[7] ? heroVal[7] : '';
            let fallenCause = heroVal[8] ? heroVal[8] : '';

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

                pushToJSON(genderJSON, heroGender, hero);
                pushToJSON(ageJSON, heroAge, hero);
                pushToJSON(fallenDayJSON, fallenDay, hero);
                // အသက်နဲ့ပတ်သတ်ပြီး ၁၆နှစ်အောက် ၁၀နှစ်အောက် ၂၀နှစ်အောက်နဲ့ ၂၀-၂၉ကြား ၃၀-၃၉ကြား စသဖြင့်လည်း ခွဲခြားချင်
                heroAgeHumanReadable(ageJSON, heroAge, hero);
            }
        } // end for

        writeJsonToFile(heroJSON, 'hero');
        summaryJSON['total'] = heroJSON.length;

        createRecursiveJsonFiles(genderJSON, 'gender', summaryJSON);
        createRecursiveJsonFiles(ageJSON, 'age', summaryJSON);
        createRecursiveJsonFiles(fallenDayJSON, 'fallenDay', summaryJSON);

        // summary
        writeJsonToFile(summaryJSON, 'summary');
    }

    const heroes = await getHeroes();

    createJSON(heroes);
}

main();