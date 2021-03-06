const axios = require('axios').default;
const fs = require('fs');
const knayi = require('knayi-myscript');

const SPREADSHEET_SECRETKEY = process.env.SPREADSHEET_SECRETKEY;
const GITHUB_CONTEXT_PAYLOAD = process.env.GITHUB_CONTEXT_PAYLOAD ? JSON.parse(process.env.GITHUB_CONTEXT_PAYLOAD) : '';
const BUILD_FOLDER = 'build';
const VERSION_NO = 'v1';
const UNKNOWN_NAME = 'unknown';
let CITY_STATE = {};
let HERO_TMP_FIX = {};

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

    function readJsonFromFile(fileName) {
        return JSON.parse(fs.readFileSync(fileName))
    }

    function writeJsonToFile(jsonObj = {}, fileName = '') {
        // fileName or folderName ကို camelCase မလိုချင်
        fileName = camelCaseToDash(fileName);

        // fileName မှာ / ပါခဲ့ရင် directory ကိုမရှိသေးရင် တည်ဆောက်ပေး
        // console.log(`writeJsonToFile`, fileName);
        if (fileName.indexOf('/') > -1) {
            let fileNameArr = fileName.split('/');
            fileNameArr.length = fileNameArr.length - 1;
            let dirName = `${BUILD_FOLDER}/${VERSION_NO}/`;
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
        fs.writeFileSync(`${BUILD_FOLDER}/${VERSION_NO}/${fileName}.json`, jsonString);
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

    // စာရိုက်အမှားများကို ပြင်ဆင်ပေးသည့် function ဖြစ်ပါသည်။ 
    // ဥပမာ 
    // "မင်္ဂလာတောင်ညွန့်" ကဲ့သို့ နောက်ဆုံး "ညွှန့်" မှာ "အောက်မြစ်" ဖြင့်အဆုံးသတ်ရမည့်အစား "အသတ်" ဖြင့်အဆုံးသတ်ထားသော စာရိုက်အမှား
    // "ဧရာ၀တီ" ကဲ့သို့သော ဝလုံး "ဝ" အစား မြန်မာစာလုံး သုည "၀" ဖြင့် သုံးထားခြင်းများ
    function normalizeMyanmarText(myanmarText, isMyanmarZeroFixWithWaLone = true) {
        myanmarText = knayi.normalize(myanmarText);
        if (isMyanmarZeroFixWithWaLone) {
            myanmarText = myanmarText.replace(/၀/g, 'ဝ');
        }
        return myanmarText;
    }

    function fixStateNameForWrongCityName(cityName) {
        return CITY_STATE[cityName] ? CITY_STATE[cityName] : cityName;
    }

    function fixHeroInfo(hero) {
        const foundFixHeroes = HERO_TMP_FIX.items.filter(x => JSON.stringify(x.from) == JSON.stringify(hero));
        if (foundFixHeroes.length > 0) {
            return foundFixHeroes[0].to;
        }
        return hero;
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

            if (heroAge < 16) {
                ageName = 'under16';
                pushToJSON(ageJSON, ageName, hero);
            }
            
            if (heroAge < 18) {
                ageName = 'under18';
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
        console.log(`GITHUB_CONTEXT_PAYLOAD`, GITHUB_CONTEXT_PAYLOAD);
        const serverTodayDate = (GITHUB_CONTEXT_PAYLOAD && GITHUB_CONTEXT_PAYLOAD.todayDate) ? GITHUB_CONTEXT_PAYLOAD.todayDate : '';
        console.log(`serverTodayDate`, serverTodayDate);
        let todayDateString = getFormattedDate(new Date(), true);
        if (serverTodayDate) {
            todayDateString = serverTodayDate;
        }
        let todayDateRawPath = `backup/${todayDateString}/raw`;
        let heroesFromBackup = [];

        try {
            heroesFromBackup = readJsonFromFile(`${BUILD_FOLDER}/${VERSION_NO}/${todayDateRawPath}.json`);
            console.log(`file reading finished`);
        } catch (e) {
            console.log(`file for ${todayDateRawPath} not exist yet`);
        }

        isHeroesNotChanging = JSON.stringify(heroes) === JSON.stringify(heroesFromBackup);
        console.log(`isHeroesNotChanging`, isHeroesNotChanging);

        // အပြောင်းအလဲမရှိသေးတာမို့လို့ ဆက်လုပ်ဖို့မလိုအပ်
        // if (isHeroesNotChanging) return;

        console.log(`createJSON`);
        writeJsonToFile(heroes, todayDateRawPath);

        let summaryJSON = {
            total: 0
        };
        let heroJSON = [];
        let genderJSON = {};
        let ageJSON = {};
        let fallenDayJSON = {};
        let fallenStateJSON = {};
        let fallenStateCityJSON = {};
        for (let i = 1; i < heroes.values.length; i++) {
            let heroVal = heroes.values[i];

            let fallenDay = getFormattedDate(heroVal[1]);
            let heroName = heroVal[0] ? normalizeMyanmarText(heroVal[0].trim()) : '';
            let heroAge = heroVal[2] ? heroVal[2].trim() : '';
            let heroGender = heroVal[3] ? (heroVal[3].trim().toLowerCase() == "​m" ? "m" : heroVal[3].trim().toLowerCase()) : '';
            let fallenCity = heroVal[4] ? normalizeMyanmarText(heroVal[4].trim()) : '';
            let fallenState = heroVal[5] ? normalizeMyanmarText(heroVal[5].trim()) : '';
            let fallenPlace = heroVal[6] ? normalizeMyanmarText(heroVal[6].trim(), false) : '';
            let heroPlace = heroVal[7] ? normalizeMyanmarText(heroVal[7].trim(), false) : '';
            let fallenCause = heroVal[8] ? normalizeMyanmarText(heroVal[8].trim(), false) : '';

            fallenState = fixStateNameForWrongCityName(fallenState);

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

            hero = fixHeroInfo(hero);

            // ကျဆုံးတဲ့တိုင်းဒေသကြီးပါတာပေါ်မူတည်ပြီး မှတ်စုသက်သက် or ကျဆုံးသူကိုခွဲခြား
            if (fallenState) {
                // heroJSON
                heroJSON.push(hero);

                pushToJSON(genderJSON, heroGender, hero);
                pushToJSON(ageJSON, heroAge, hero);
                pushToJSON(fallenDayJSON, fallenDay, hero);
                pushToJSON(fallenStateJSON, fallenState, hero);
                // အသက်နဲ့ပတ်သတ်ပြီး ၁၆နှစ်အောက် ၁၀နှစ်အောက် ၂၀နှစ်အောက်နဲ့ ၂၀-၂၉ကြား ၃၀-၃၉ကြား စသဖြင့်လည်း ခွဲခြားချင်
                heroAgeHumanReadable(ageJSON, heroAge, hero);

                if (!summaryJSON['fallenStateCity']) {
                    summaryJSON['fallenStateCity'] = {};
                }
                if (!summaryJSON['fallenStateCity'][fallenState]) {
                    summaryJSON['fallenStateCity'][fallenState] = {
                        total: 0,
                        city: {}
                    };
                }
                let fallenCityKeyName = fallenCity ? fallenCity : UNKNOWN_NAME;
                summaryJSON['fallenStateCity'][fallenState]['total']++;
                if (!summaryJSON['fallenStateCity'][fallenState]['city'][fallenCityKeyName]) {
                    summaryJSON['fallenStateCity'][fallenState]['city'][fallenCityKeyName] = 0;
                }
                summaryJSON['fallenStateCity'][fallenState]['city'][fallenCityKeyName]++;

                if (!fallenStateCityJSON[fallenState]) {
                    fallenStateCityJSON[fallenState] = {};
                }                    
                if (!fallenStateCityJSON[fallenState][fallenCityKeyName]) {
                    fallenStateCityJSON[fallenState][fallenCityKeyName] = [];    
                }
                fallenStateCityJSON[fallenState][fallenCityKeyName].push(hero);        
            }
        } // end for

        writeJsonToFile(heroJSON, 'hero');
        summaryJSON['total'] = heroJSON.length;

        createRecursiveJsonFiles(genderJSON, 'gender', summaryJSON);
        createRecursiveJsonFiles(ageJSON, 'age', summaryJSON);
        createRecursiveJsonFiles(fallenDayJSON, 'fallenDay', summaryJSON);
        createRecursiveJsonFiles(fallenStateJSON, 'fallenState', summaryJSON);
        
        // fallenCity က same city ရှိနိုင်တာမို့လို့ state အောက်မှာ တည်ဆောက်ပေးဖို့လိုအပ်
        writeJsonToFile(fallenStateCityJSON, `fallenStateCity`);
        for (const fallenState in fallenStateCityJSON) {
            for (const fallenCity in fallenStateCityJSON[fallenState]) {
                writeJsonToFile(fallenStateCityJSON[fallenState][fallenCity], `fallenState/${fallenState}/${fallenCity}`);
            }
        }

        // summary
        writeJsonToFile(summaryJSON, 'summary');
    }

    CITY_STATE = readJsonFromFile(`state-city.json`);
    HERO_TMP_FIX = readJsonFromFile(`hero-tmp-fix.json`);
    const heroes = await getHeroes();

    createJSON(heroes);
}

main();
