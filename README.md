# Fallen Heroes: Spring Revolution API
နွေဦးတော်လှန်ရေး၌ ကျဆုံးသွားသောသူရဲကောင်းများ API ဖြစ်ပါသည်။ ဖန်တီးရသည့် အဓိကရည်ရွယ်ချက်များမှာ
- 🎊 သူရဲကောင်းများအား အမြဲတမ်း မှတ်တမ်းတင် ဂုဏ်ပြုထားလိုခြင်း 
- 🆓 GitHub ပေါ်တွင်တည်ဆောက်ထားသည့်အတွက် လူတိုင်း or service တိုင်းကို အမြဲတမ်း အလကားပေးသုံးနိုင်ခြင်း 
    - ယခု API တွင် access limit မရှိသည့်အတွက် တစ်ခြား app or server များမှလည်း ကြိုက်သလို ကြိုက်သလောက် စိတ်ကြိုက် ယူသုံးနိုင်ခြင်း 
    - Server down time မှာလည်း မရှိသလောက်ဖြစ်ခြင်း
    - API JSON file ဖန်တီးခြင်းနှင့် backup လုပ်ခြင်းများကိုလည်း AWS LAMBDA, GITHUB ACTIONS, GIT စနစ်များပေါင်းစပ်ပြီး လူလုပ်စရာမလိုဘဲ အလိုလျောက်လုပ်ဆောင်ထားစေခြင်း
- 🤑 ယခုလို API backend ဘက်ကိုဖန်တီးပြီး free ပေးသုံးထားခြင်းဖြင့် app or service တစ်ခုခု ဖန်တီးသူများမှ backend အတွက် အကုန်အကျမရှိစေဘဲ ဝင်ငွေရှာနိုင်စေရန် ရည်ရွယ်ခြင်း 
    - ရရှိသောဝင်ငွေများကို ဘယ်လိုဘယ်ပုံသုံးမည်က မိမိစိတ်ကြိုက်ဖြစ်သော်လည်း သူရဲကောင်းမိဘများ or ဆွေမျိုးများထံ လှူဒါန်းပေးခြင်းကို အကြံပြုပါသည်
## API အသုံးပြုနည်း

**Summary အကျဥ်းချုပ်**  
https://thuraucsy.github.io/spring-revolution/v1/summary.json

```
{
    "total": 631,
    "gender": {
        "m": 566,
        "f": 43,
        "unknown": 22
    },
    "age": {
        "6": 1,
        "13": 4,
        "0th": 2
        "10th": 89,
        "20th": 169,
        "under16": 17,
        "under20": 91,
        "unknown": 162,
        ...
    },
    "fallenDay": {
        "2021-02-08": 2,
        "2021-02-09": 2,
        ...
    },
    "fallenState": {
        "မန္တလေး": 177,
        "နေပြည်တော်": 5,
        "တနင်္သာရီ": 29,
        "ရန်ကုန်": 198,
        ...
    },
    "fallenStateCity": {
        "တနင်္သာရီ": {
            "total": 29,
            "city": {
                "မြိတ်": 8,
                "ထားဝယ်": 10,
                "ပြည်ကြီးမဏ္ဍိုင်": 1,
                "ကော့သောင်း": 10
            }
        },
        "ရန်ကုန်": {
        ...
    }
}
```

Summary API သည် သိသင့်သည်ဟုယူဆသော အချက်အလက်များကို အကျဥ်းချုပ်စုစည်းပေးထားသော json file ဖြစ်ပါသည်။
JSON value နေရာတွင်ရှိသော Number တန်ဖိုးများမှာ သက်ဆိုင်ရာ JSON key ၏ အရေအတွက်ကို ဆိုလိုပါသည်။  
ဥပမာ ```"တနင်္သာရီ": 29``` ဟုတွေ့ရှိပါက တနင်္သာရီတိုင်းတွင် ကျဆုံးသူ 29ယောက်ဟု နားလည်နိုင်ပါသည်။
- total ကျဆုံးရသော စုစုပေါင်းသူရဲကောင်းအရေအတွက်
- gender ကျား/မ ခွဲခြားမှု
    - m ကျား
    - f မ
    - unknown မသိရှိသေး
- age အသက်
    - Number တစ်ခုထဲပါပါက သူရဲကောင်း၏အသက်ကို ရည်ညွှန်းပါသည်။ ဥပမာ 13 ဟုရေးထားပါက အသက် ၁၃နှစ် ကျဆုံးသူဖြစ်ပါသည်
    - ```under16``` စသဖြင့် Number အရှေ့မှ under လိုက်ပါက ထို Number အောက် ကျဆုံးသူများကို ရည်ညွှန်းပါသည်။  
      သိသင့်သည်ဟုယူဆသော ```under16``` (၁၆နှစ်အောက်), ```under18``` (၁၈နှစ်အောက်), ```under20``` (အနှစ်၂၀အောက်) များကို ဖော်ပြထားပါသည်။
    - ```0th``` ```10th``` စသဖြင့် Number အနော်ကမှ th လိုက်ပါက ထို Number ၏ အသက်အုပ်စုများကိုဆိုလိုပါသည်။  
      ```0th``` 0-9 နှစ်ကြား အသက်အုပ်စု  
      ```10th``` 10-19 နှစ်ကြား အသက်အုပ်စု  
      ```20th``` 20-29 နှစ်ကြား အသက်အုပ်စု စသဖြင့် နားလည်နိုင်ပါသည်။
- fallenDay ကျဆုံးခဲ့ရသောနေ့ရက်
- fallenState ကျဆုံးခဲ့သောတိုင်းဒေသကြီး
- fallenStateCity ကျဆုံးခဲ့သောမြို့
    - မြို့အမည်များကိုဖော်ပြရာတွင် တိုင်းဒေသကြီးအပေါ်မူတည်ပြီး မြို့အမည်တူများရှိနိုင်သောကြောင့် တိုင်းဒေသကြီးကို တစ်ဆင့်ခံပြီး ဖော်ပြထားပါသည်


**Hero ကျဆုံးသူ သူရဲကောင်းတစ်ယောက်ချင်းစီ၏ အသေးစိတ်**  
https://thuraucsy.github.io/spring-revolution/v1/hero.json

```
{
    "items": [
        {
            "heroName": "ကိုနပွား (ခ) ကိုကိုဦး",
            "fallenDay": "2021-02-08",
            "heroAge": "32",
            "heroGender": "m",
            "fallenCity": "မန္တလေး",
            "fallenState": "မန္တလေး",
            "fallenPlace": "",
            "heroPlace": "မန္တလေးမြို့၊ စင်္ကြာနွယ်ဝင်း",
            "fallenCause": "ညတွင် ကားဖြင့်တိုက်ခံရ"
        },
        {
            "heroName": "ကိုတူးအောင်(ခ)ကိုမာတူး",
            "fallenDay": "2021-02-08",
        ...
```

**Gender ကျား/မ ခွဲခြားမှု အသေးစိတ်**  
https://thuraucsy.github.io/spring-revolution/v1/gender.json

```
{
    "m": [
        {
            "heroName": "ကိုနပွား (ခ) ကိုကိုဦး",
            "fallenDay": "2021-02-08",
            "heroAge": "32",
            "heroGender": "m",
            "fallenCity": "မန္တလေး",
            "fallenState": "မန္တလေး",
            "fallenPlace": "",
            "heroPlace": "မန္တလေးမြို့၊ စင်္ကြာနွယ်ဝင်း",
            "fallenCause": "ညတွင် ကားဖြင့်တိုက်ခံရ"
        },
        {
            "heroName": "ကိုတူးအောင်(ခ)ကိုမာတူး",
            "fallenDay": "2021-02-08",
        ...
```

Gender > male သီးသန့်လိုချင်ပါကလည်း  
https://thuraucsy.github.io/spring-revolution/v1/gender/m.json  
※ `m.json` နေရာတွင် `summary.json` တွင်ရှိသော gender type ၃မျိုးစလုံး အသုံးပြုနိုင်ပါသည်။

**Age အသက် အသေးစိတ်**  
https://thuraucsy.github.io/spring-revolution/v1/age.json

```
{
    "6": [
        {
            "heroName": "မခင်မျိုးချစ်",
            "fallenDay": "2021-03-23",
            "heroAge": "6",
            "heroGender": "f",
            "fallenCity": "မန္တလေး",
            "fallenState": "မန္တလေး",
            "fallenPlace": "မန္တလေးမြို့၊ ၅၂C လမ်း၊ ၁ဝ၅/၁ဝ၆ လမ်းကြား",
            "heroPlace": "",
            "fallenCause": "ကျည်မှန်၊ ဗိုက်သို့ကျည်မှန်"
        }
    ],
    "7": [
        {
            "heroName": "",
            "fallenDay": "2021-03-27",
            ...
```
အသက်၁၆နှစ်အောက် သီးသန့်လိုချင်ပါကလည်း  
https://thuraucsy.github.io/spring-revolution/v1/age/under16.json  
※ `under16.json` နေရာတွင် `summary.json` တွင်ရှိသော age type များအားလုံး အသုံးပြုနိုင်ပါသည်။

**Fallen Day ကျဆုံးခဲ့ရသောနေ့ရက် အသေးစိတ်**  
https://thuraucsy.github.io/spring-revolution/v1/fallen-day.json  
ကျဆုံးခဲ့သောရက် တစ်ရက်ချင်းစီ၏ အသေးစိတ်ကိုလိုချင်ပါကလည်း  
https://thuraucsy.github.io/spring-revolution/v1/fallen-day/2021-03-03.json  
※ `2021-03-03.json` နေရာတွင် `summary.json` တွင်ရှိသော fallenDay များအားလုံး အသုံးပြုနိုင်ပါသည်။

**Fallen State ကျဆုံးခဲ့သောတိုင်းဒေသကြီး အသေးစိတ်**  
https://thuraucsy.github.io/spring-revolution/v1/fallen-state.json  
တိုင်းဒေသကြီးတစ်ခုချင်းစီ၏ အသေးစိတ်ကိုလိုချင်ပါကလည်း  
https://thuraucsy.github.io/spring-revolution/v1/fallen-state/မန္တလေး.json  
※ `မန္တလေး.json` နေရာတွင် `summary.json` တွင်ရှိသော fallenState များအားလုံး အသုံးပြုနိုင်ပါသည်။

**Fallen City ကျဆုံးခဲ့သောမြို့ အသေးစိတ်**  
https://thuraucsy.github.io/spring-revolution/v1/fallen-state-city.json  
မြို့တစ်ခုချင်းစီ၏ အသေးစိတ်ကိုလိုချင်ပါက တိုင်းဒေသကြီးကိုလည်း သိရှိရပါမည်။ တိုင်းဒေသကြီးလိုအပ်ခြင်းမှာ မြို့အမည်တူများရှိနိုင်သောကြောင့်ဖြစ်ပါသည်။  
https://thuraucsy.github.io/spring-revolution/v1/fallen-state/တနင်္သာရီ/ထားဝယ်.json  
※ `တနင်္သာရီ/ထားဝယ်.json` နေရာတွင် `summary.json` တွင်ရှိသော fallenStateCity များအားလုံး အသုံးပြုနိုင်ပါသည်။

## API update လုပ်ပေးသည့်အချိန်
[Myanmar Spring 2021 Death Toll - Google Spradsheet](https://docs.google.com/spreadsheets/d/1PYlfnHxUJFc_GYtFCpcvAIb3QbxYtBGQq9Ra2eltT3g/edit#gid=383324839) 
တွင် update ဖြစ်ပြီး ၇ မိနစ်အတွင်း အလိုလျောက် update လုပ်ပေးပါသည်။

## raw backup file
နေ့စဥ် backup file များအား **backup/{date}/raw.json** မှတစ်ဆင့်ရယူနိုင်ပါသည်။  
Example => https://thuraucsy.github.io/spring-revolution/v1/backup/20210410/raw.json  
※ နေ့တစ်နေ့စာအတွက် backup file စတင် create လုပ်ပေးသည့်အချိန်မှာ ရန်ကုန်အချိန်ဖြစ်ပါသည်။ ထို့နောက်လည်း update ရှိရင်ရှိသလို replace လုပ်ခြင်းဖြင့် backup လုပ်ပေးသွားစေရန် လုပ်ဆောင်ထားပါသည်။

## Sample app
<img align="left" src="https://github.com/thuraucsy/spring-revolution/blob/master/fallen-heroes.gif?raw=true" height="400">


ဒီ API လေးကိုသုံးပြီး **Fallen Heroes** app လေးကို ဖန်တီးထားပါတယ်ခင်ဗျာ။  
[Android](http://bit.ly/fallen-heroes-play-store-android) နဲ့ [iOS](http://bit.ly/fallen-heroes-app-store-ios) မှာအသုံးပြုနိုင်ပါတယ်။ 
  
※ ထပ်ပြီး ဒီ API နဲ့ဖန်တီးထားတဲ့ app/service တစ်ခုခုရှိရင်လည်း သိချင်ပါတယ်။ ဒီ README ဖိုင်လေးမှာ စုပေးထားချင်လို့ပါခင်ဗျ။
