# Lingoix - راهنمای کامل اجرا، توسعه و نگهداری

این سند بر اساس فایل‌ها و کدهای موجود در همین مخزن نوشته شده است. هدف آن این است که اگر شش ماه بعد دوباره به پروژه برگشتید، یا شخص دیگری پروژه را تحویل گرفت، بتواند بدون دانش قبلی پروژه را نصب، اجرا، عیب‌یابی و نگهداری کند.

## فهرست

1. [معماری پروژه](#معماری-پروژه)
2. [پیش‌نیازهای نصب](#پیشنیازهای-نصب)
3. [متغیرهای محیطی](#متغیرهای-محیطی)
4. [اجرای Frontend](#اجرای-frontend)
5. [اجرای Backend](#اجرای-backend)
6. [اجرای بخش AI / Python](#اجرای-بخش-ai--python)
7. [ترتیب صحیح اجرای پروژه](#ترتیب-صحیح-اجرای-پروژه)
8. [پورت‌ها](#پورتها)
9. [وابستگی بین سرویس‌ها](#وابستگی-بین-سرویسها)
10. [دیتابیس](#دیتابیس)
11. [ساختار پوشه‌ها](#ساختار-پوشهها)
12. [اسکریپت‌های package.json](#اسکریپتهای-packagejson)
13. [وابستگی‌های Python](#وابستگیهای-python)
14. [خطاهای رایج](#خطاهای-رایج)
15. [راه‌اندازی روی سیستم جدید](#راهاندازی-روی-سیستم-جدید)
16. [اجرای Production](#اجرای-production)
17. [بررسی نهایی وضعیت فعلی پروژه](#بررسی-نهایی-وضعیت-فعلی-پروژه)

## معماری پروژه

Lingoix یک پروژه آموزشی زبان است که از سه بخش اصلی تشکیل شده است:

- **Frontend:** اپلیکیشن React داخل پوشه `src/`
- **Backend:** API محلی Node.js/Express داخل پوشه `server/`
- **AI / Python Research Prototype:** نمونه پژوهشی مستقل Machine Learning داخل پوشه `research/adaptive_learning/`

### Frontend

Frontend با Create React App اجرا می‌شود. فایل ورودی اصلی آن `src/index.js` است و سپس `src/App.js` و `src/router.js` ساختار صفحه‌ها و routeها را مدیریت می‌کنند.

مسیرهای مهم frontend:

- `src/pages/`: صفحه‌های اصلی مانند داشبورد، تمرین، پنل ادمین و صفحات پژوهش
- `src/components/`: کامپوننت‌های قابل استفاده مجدد
- `src/services/apiClient.js`: کلاینت ارتباط با backend
- `src/locales/`: فایل‌های ترجمه `fa`, `en`, `de`
- `src/data/learningData.js`: داده seed برای دیتابیس backend هم از این فایل استفاده می‌شود

Frontend به صورت پیش‌فرض روی پورت `3000` اجرا می‌شود:

```bash
http://localhost:3000
```

### Backend

Backend یک Express API در مسیر `server/index.js` است. این backend:

- authentication و session را مدیریت می‌کند
- learner/resource/exercise/adaptive-decision API دارد
- از SQLite محلی با `better-sqlite3` استفاده می‌کند
- هنگام شروع اجرا دیتابیس را initialize و seed می‌کند
- lookup و translation دیکشنری را پشت Node API نگه می‌دارد
- خروجی‌های بخش Python research را از فایل‌های داخل `research/adaptive_learning/outputs/` می‌خواند

Backend به صورت پیش‌فرض روی پورت `4000` اجرا می‌شود:

```bash
http://localhost:4000
```

APIها زیر prefix زیر هستند:

```bash
http://localhost:4000/api
```

### بخش AI / Python

بخش Python در مسیر زیر قرار دارد:

```bash
research/adaptive_learning/
```

این بخش طبق `docs/adr/0002-standalone-python-research-prototype.md` یک prototype پژوهشی مستقل است، نه یک سرویس HTTP دائمی. اجرای آن dataset مصنوعی، مدل‌ها، جدول‌ها، نمودارها و گزارش نهایی تولید می‌کند. Backend بعدا خروجی‌های تولیدشده را از پوشه `research/adaptive_learning/outputs/` می‌خواند و از طریق APIهای research در اختیار frontend قرار می‌دهد.

### ارتباط بخش‌ها

```text
+-----------------------------+
| Browser                     |
| http://localhost:3000       |
+-------------+---------------+
              |
              | fetch()
              | REACT_APP_API_BASE_URL
              | default: http://localhost:4000/api
              v
+-----------------------------+
| Node / Express Backend      |
| server/index.js             |
| http://localhost:4000/api   |
+-------------+---------------+
              |
              | better-sqlite3
              v
+-----------------------------+
| SQLite Database             |
| server/data/lingoix.sqlite  |
+-----------------------------+

+-----------------------------+
| Python Research Prototype   |
| research/adaptive_learning  |
| run_pipeline.py             |
+-------------+---------------+
              |
              | writes files
              v
+-----------------------------+
| research/adaptive_learning/ |
| outputs/                    |
+-------------+---------------+
              ^
              | backend reads research outputs
              |
+-------------+---------------+
| Node / Express Backend      |
+-----------------------------+
```

## پیش‌نیازهای نصب

### ابزارهای لازم

- **Git:** برای clone و مدیریت نسخه‌ها
- **Node.js:** نسخه پیشنهادی عملی برای این پروژه `18` یا جدیدتر است
- **npm:** همراه Node نصب می‌شود؛ روی سیستم فعلی پروژه با `npm 11.2.0` اجرا شده است
- **Python:** برای بخش research؛ روی سیستم فعلی `Python 3.13.2` موجود است
- **pip:** برای نصب dependencyهای Python
- **venv:** برای ساخت virtual environment پایتون

### چرا Node.js 18 یا جدیدتر؟

در README قبلی پروژه نوشته شده بود Node.js نسخه 14 یا بالاتر. اما backend در `server/dictionaryLookupService.js` از `fetch` سراسری Node استفاده می‌کند. `fetch` سراسری در Node.js 18 به بعد به صورت پایدار در دسترس است. بنابراین برای اجرای کامل backend، مخصوصا providerهای dictionary/translation، نسخه 18 یا جدیدتر توصیه می‌شود.

نسخه‌های مشاهده‌شده روی سیستم فعلی:

```bash
node --version
# v22.14.0

npm --version
# 11.2.0

python3 --version
# Python 3.13.2

git --version
# git version 2.48.1
```

## متغیرهای محیطی

در مخزن فعلی فقط فایل زیر وجود دارد:

```bash
.env.example
```

فایل‌های `.env`, `.env.local`, `.env.development.local`, `.env.production.local` در مخزن وجود ندارند و طبق `.gitignore` نباید commit شوند.

### نکته مهم درباره خواندن env

Create React App فایل‌های `.env` ریشه پروژه را برای frontend می‌خواند، اما backend فعلی در `server/index.js` یا `server/dictionaryLookupService.js` هیچ `dotenv` loader ندارد. یعنی اگر متغیرهایی مثل `API_PORT` یا `GEMINI_API_KEY` را فقط داخل `.env` بنویسید، backend به صورت خودکار آن‌ها را نمی‌خواند.

برای backend باید envها را در shell export کنید، یا هنگام اجرای command به آن بدهید. نمونه:

```bash
API_PORT=4000 GEMINI_API_KEY=your_key npm run start:api
```

### متغیرهای موجود در `.env.example`

#### `GEMINI_API_KEY`

کاربرد: فعال کردن provider Gemini برای lookup و translation در `server/dictionaryLookupService.js`.

نمونه:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

اگر وجود نداشته باشد: backend خطای startup نمی‌دهد. سرویس دیکشنری از providerهای fallback بدون کلید استفاده می‌کند، اما کیفیت/پوشش AI کمتر می‌شود.

#### `GEMINI_MODEL`

کاربرد: تعیین مدل Gemini. اگر مقداردهی نشود، کد از مقدار پیش‌فرض `gemini-1.5-flash` استفاده می‌کند.

نمونه:

```bash
GEMINI_MODEL=gemini-1.5-flash
```

اگر وجود نداشته باشد: خطایی ایجاد نمی‌شود و مقدار پیش‌فرض استفاده می‌شود.

#### `OPENROUTER_API_KEY`

کاربرد: فعال کردن provider OpenRouter برای lookup و translation.

نمونه:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key
```

اگر وجود نداشته باشد: backend خطای startup نمی‌دهد. OpenRouter غیرفعال می‌ماند و providerهای دیگر امتحان می‌شوند.

#### `OPENROUTER_MODEL`

کاربرد: تعیین مدل OpenRouter. اگر مقداردهی نشود، کد از مقدار پیش‌فرض `google/gemini-2.0-flash-exp:free` استفاده می‌کند.

نمونه:

```bash
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

اگر وجود نداشته باشد: خطایی ایجاد نمی‌شود و مقدار پیش‌فرض استفاده می‌شود.

#### `APP_PUBLIC_URL`

کاربرد: مقدار header `HTTP-Referer` هنگام استفاده از OpenRouter.

نمونه:

```bash
APP_PUBLIC_URL=http://localhost:3000
```

اگر وجود نداشته باشد: backend از مقدار پیش‌فرض `http://localhost:3000` استفاده می‌کند.

### متغیرهایی که در کد استفاده شده‌اند ولی در `.env.example` نیستند

#### `API_PORT`

محل استفاده: `server/index.js`

کاربرد: تغییر پورت backend.

نمونه:

```bash
API_PORT=4001
```

اگر وجود نداشته باشد: backend روی پورت `4000` اجرا می‌شود.

#### `REACT_APP_API_BASE_URL`

محل استفاده: `src/services/apiClient.js`

کاربرد: تغییر آدرس API برای frontend.

نمونه:

```bash
REACT_APP_API_BASE_URL=http://localhost:4000/api
```

اگر وجود نداشته باشد: frontend از مقدار پیش‌فرض `http://localhost:4000/api` استفاده می‌کند.

#### `REACT_APP_GEMINI_API_KEY` و `REACT_APP_OPENROUTER_API_KEY`

محل استفاده: `server/dictionaryLookupService.js`

کاربرد: کد backend این نام‌ها را هم به عنوان fallback بررسی می‌کند.

هشدار: این نام‌ها با prefix `REACT_APP_` برای frontend قابل embed شدن هستند. در معماری فعلی طبق `docs/adr/0003-backend-owned-dictionary-provider-chain.md` کلیدهای provider باید پشت backend بمانند. بنابراین برای secretها از `GEMINI_API_KEY` و `OPENROUTER_API_KEY` در محیط backend استفاده کنید، نه از `REACT_APP_*`.

### نمونه کامل `.env`

این نمونه برای توسعه محلی است. توجه کنید backend فعلی `.env` را خودکار نمی‌خواند؛ برای backend باید متغیرها را export کنید یا loader اضافه شود.

```bash
# Frontend
REACT_APP_API_BASE_URL=http://localhost:4000/api

# Backend
API_PORT=4000

# Optional dictionary / translation providers
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

OPENROUTER_API_KEY=
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
APP_PUBLIC_URL=http://localhost:3000
```

## اجرای Frontend

Frontend در ریشه پروژه اجرا می‌شود، نه داخل پوشه جداگانه.

### نصب dependencyها

```bash
cd /path/to/lingo
npm install
```

برای نصب دقیق بر اساس `package-lock.json` روی سیستم جدید یا CI بهتر است از دستور زیر استفاده شود:

```bash
cd /path/to/lingo
npm ci
```

### اجرای Frontend در حالت Development

```bash
cd /path/to/lingo
npm start
```

این دستور فقط React development server را اجرا می‌کند:

```bash
http://localhost:3000
```

اگر backend جداگانه اجرا نشده باشد، صفحه بالا می‌آید، اما درخواست‌های login، dashboard، resource، dictionary و research به API شکست می‌خورند.

### Build گرفتن از Frontend

```bash
cd /path/to/lingo
npm run build
```

خروجی build در پوشه زیر تولید می‌شود:

```bash
build/
```

### اجرای Frontend در Production

در `package.json` اسکریپت production برای serve کردن `build/` وجود ندارد. فقط `npm run build` موجود است. برای اجرای production باید خروجی `build/` با یک static file server یا سرویس hosting جداگانه serve شود. این ابزار در خود پروژه تعریف نشده است.

نمونه با ابزار خارجی:

```bash
cd /path/to/lingo
npm run build
npx serve -s build
```

نکته: `serve` dependency پروژه نیست و با دستور بالا به صورت خارجی اجرا می‌شود.

## اجرای Backend

Backend در مسیر `server/` قرار دارد، اما dependencyهای آن در `package.json` ریشه پروژه تعریف شده‌اند. بنابراین نصب dependencyها از ریشه انجام می‌شود.

### نصب dependencyها

```bash
cd /path/to/lingo
npm install
```

یا روی سیستم تازه:

```bash
cd /path/to/lingo
npm ci
```

### اجرای Backend در حالت Development

```bash
cd /path/to/lingo
npm run start:api
```

این دستور اجرا می‌کند:

```bash
node server/index.js
```

آدرس backend:

```bash
http://localhost:4000
```

health endpoint:

```bash
http://localhost:4000/api/health
```

### اجرای Backend با پورت سفارشی

```bash
cd /path/to/lingo
API_PORT=4001 npm run start:api
```

در این حالت باید frontend را هم با API URL جدید اجرا کنید:

```bash
cd /path/to/lingo
REACT_APP_API_BASE_URL=http://localhost:4001/api npm start
```

### اجرای Production برای Backend

در پروژه اسکریپت production جداگانه برای backend وجود ندارد. اجرای فعلی همان Node process است:

```bash
cd /path/to/lingo
NODE_ENV=production API_PORT=4000 node server/index.js
```

برای restart، monitoring و اجرای دائمی باید از ابزار بیرونی مثل process manager سیستم‌عامل یا PM2 استفاده شود. PM2 داخل dependencyهای پروژه نیست.

## اجرای بخش AI / Python

### محل بخش Python

```bash
research/adaptive_learning/
```

### فایل اصلی اجرا

از ریشه مخزن:

```bash
python research/adaptive_learning/run_pipeline.py --seed 42
```

فایل wrapper بالا `research/adaptive_learning/adaptive_learning/run_pipeline.py` را اجرا می‌کند.

### ساخت Virtual Environment

```bash
cd /path/to/lingo/research/adaptive_learning
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### نصب dependencyهای optional

```bash
cd /path/to/lingo/research/adaptive_learning
source .venv/bin/activate
pip install -r requirements-optional.txt
```

روی macOS ممکن است XGBoost و LightGBM به OpenMP / `libomp` نیاز داشته باشند. طبق README همین بخش، اگر optional libraries نصب نباشند، pipeline آن‌ها را unavailable ثبت می‌کند و ادامه می‌دهد.

### اجرای pipeline

از ریشه پروژه:

```bash
cd /path/to/lingo
source research/adaptive_learning/.venv/bin/activate
python research/adaptive_learning/run_pipeline.py --seed 42
```

یا از داخل پوشه research:

```bash
cd /path/to/lingo/research/adaptive_learning
source .venv/bin/activate
python run_pipeline.py --seed 42
```

### خروجی‌های تولیدشده

اجرای pipeline خروجی‌های زیر را overwrite می‌کند:

```bash
research/adaptive_learning/outputs/data/learners.csv
research/adaptive_learning/outputs/data/interactions.csv
research/adaptive_learning/outputs/data/learner_features.csv
research/adaptive_learning/outputs/tables/*.csv
research/adaptive_learning/outputs/figures/*.png
research/adaptive_learning/outputs/final_report.md
research/adaptive_learning/outputs/manifest.json
```

### آیا مدل دانلود می‌شود؟

بر اساس کد موجود، مدل pre-trained دانلود نمی‌شود. داده مصنوعی تولید می‌شود و مدل‌های scikit-learn و optional gradient boosting روی همان داده train/evaluate می‌شوند.

### آیا API Key لازم است؟

برای بخش Python research هیچ API key در کد یا requirements دیده نمی‌شود. API keyها فقط مربوط به providerهای dictionary/translation در backend هستند.

### آیا بخش Python سرویس یا پورت دارد؟

خیر. این بخش HTTP server ندارد و پورتی باز نمی‌کند. فقط فایل تولید می‌کند.

## ترتیب صحیح اجرای پروژه

### اجرای کامل توسعه محلی با یک دستور

```bash
cd /path/to/lingo
npm install
npm run dev
```

`npm run dev` همزمان این دو دستور را اجرا می‌کند:

```bash
npm run start:api
npm start
```

ترتیب داخلی مهم است چون frontend برای داده‌های login/dashboard/research/dictionary به backend نیاز دارد. با `concurrently` هر دو با هم اجرا می‌شوند.

### اجرای مرحله‌ای

1. نصب dependencyهای Node:

```bash
cd /path/to/lingo
npm install
```

2. اجرای backend:

```bash
cd /path/to/lingo
npm run start:api
```

دلیل: backend دیتابیس SQLite را می‌سازد، schema را اجرا می‌کند و seed اولیه را وارد می‌کند.

3. اجرای frontend در terminal جدا:

```bash
cd /path/to/lingo
npm start
```

دلیل: React app از طریق `src/services/apiClient.js` به backend متصل می‌شود.

4. اجرای اختیاری Python research:

```bash
cd /path/to/lingo
source research/adaptive_learning/.venv/bin/activate
python research/adaptive_learning/run_pipeline.py --seed 42
```

دلیل: صفحات research در frontend از backend خروجی‌های `research/adaptive_learning/outputs/` را می‌خوانند. اگر خروجی‌ها وجود نداشته باشند، endpointهای research خطای `research_outputs_not_found` یا `*_not_found` می‌دهند.

## پورت‌ها

### Frontend

```bash
http://localhost:3000
```

این پورت توسط `react-scripts start` استفاده می‌شود. اگر پورت اشغال باشد، Create React App معمولا پیشنهاد پورت جایگزین می‌دهد.

### Backend

```bash
http://localhost:4000
```

در `server/index.js`:

```js
const PORT = process.env.API_PORT || 4000;
```

قابل تغییر با:

```bash
API_PORT=4001 npm run start:api
```

### AI / Python

پورت ندارد. سرویس HTTP اجرا نمی‌کند.

### نکته CORS

در `server/index.js` مقدار CORS به صورت hardcoded روی frontend محلی است:

```js
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
```

اگر frontend روی پورت یا دامنه دیگری اجرا شود، backend ممکن است CORS error بدهد مگر اینکه این مقدار در کد تغییر کند.

## وابستگی بین سرویس‌ها

### اگر Backend اجرا نشود

Frontend بالا می‌آید، اما هر چیزی که به API نیاز دارد کار نمی‌کند:

- login/signup
- دریافت حساب کاربر
- dashboard و learner data
- resources و exercises
- dictionary lookup/translation
- adaptive decisions
- reports و research pages

در browser console یا Network tab خطاهای `Failed to fetch`, `ERR_CONNECTION_REFUSED` یا خطاهای مشابه دیده می‌شود.

### اگر AI / Python اجرا نشود

خود اپلیکیشن اصلی همچنان اجرا می‌شود، چون بخش Python سرویس runtime نیست. اما اگر خروجی‌های research وجود نداشته باشند یا قدیمی/ناقص باشند، صفحات research از backend خطا دریافت می‌کنند:

- `research_outputs_not_found`
- `figure_not_found`
- `table_not_found`
- `dataset_not_found`
- `report_not_found`

### اگر Database اجرا نشود

دیتابیس سرویس جداگانه نیست. SQLite به صورت فایل محلی در backend استفاده می‌شود. اگر فایل وجود نداشته باشد، backend هنگام startup آن را می‌سازد:

```bash
server/data/lingoix.sqlite
```

اگر پوشه یا فایل قابل نوشتن نباشد، backend هنگام ساخت دیتابیس یا اجرای schema خطا می‌دهد.

## دیتابیس

### نوع دیتابیس

SQLite با کتابخانه:

```bash
better-sqlite3
```

### محل فایل دیتابیس

```bash
server/data/lingoix.sqlite
```

این مسیر در `server/db.js` ساخته می‌شود:

```js
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "lingoix.sqlite");
```

### schema

schema در فایل زیر است:

```bash
server/schema.sql
```

جدول‌های اصلی:

- `accounts`
- `sessions`
- `learners`
- `resources`
- `exercises`
- `skill_weaknesses`
- `learning_events`
- `adaptive_decisions`
- `dictionary_cache`

### migration

سیستم migration رسمی در پروژه وجود ندارد. در `server/db.js` هنگام startup:

- `server/schema.sql` اجرا می‌شود
- ستون‌های جدید با helper داخلی `ensureColumns` اضافه می‌شوند
- چند جدول/ستون تکمیلی با کد ساخته یا اصلاح می‌شوند

بنابراین migration فعلی به شکل دستی و startup-time انجام می‌شود، نه با ابزارهایی مثل Prisma, Knex یا Sequelize.

### seed

Seed هنگام اجرای backend انجام می‌شود:

- `seedAccounts()` حساب‌های demo را می‌سازد
- `seedDomainData()` داده‌های learner/resource/exercise را از `src/data/learningData.js` وارد می‌کند، البته فقط اگر جدول learners خالی باشد
- `ensureSpeakingSeedData()` داده‌های conversation/speaking را اضافه می‌کند
- `backfillExerciseContent()` محتوای تمرین‌های قدیمی را تکمیل می‌کند

### حساب‌های demo

همه حساب‌های زیر password یکسان دارند:

```bash
Lingoix123!
```

```text
Learner:        learner@lingoix.test
Teacher:        teacher@lingoix.test
School Admin:   school@lingoix.test
Platform Admin: admin@lingoix.test
```

### reset دیتابیس محلی

چون دیتابیس داخل `server/data/` است و این پوشه در `.gitignore` قرار دارد، برای reset کامل local data می‌توانید فایل SQLite را حذف کنید و backend را دوباره اجرا کنید:

```bash
cd /path/to/lingo
rm server/data/lingoix.sqlite
npm run start:api
```

هشدار: این کار داده‌های local را حذف می‌کند.

## ساختار پوشه‌ها

ساختار خلاصه پروژه، بدون `node_modules`:

```text
.
├── .env.example
├── .gitignore
├── CONTEXT.md
├── README.md
├── build/
│   ├── index.html
│   ├── static/
│   └── ...
├── docs/
│   └── adr/
│       ├── 0001-local-node-express-sqlite-backend.md
│       ├── 0002-standalone-python-research-prototype.md
│       └── 0003-backend-owned-dictionary-provider-chain.md
├── package.json
├── package-lock.json
├── public/
│   ├── index.html
│   ├── Hueber.pdf
│   ├── audio/
│   └── ...
├── research/
│   └── adaptive_learning/
│       ├── README.md
│       ├── requirements.txt
│       ├── requirements-optional.txt
│       ├── run_pipeline.py
│       ├── adaptive_learning/
│       │   ├── analysis.py
│       │   ├── config.py
│       │   ├── data_generation.py
│       │   ├── features.py
│       │   ├── models.py
│       │   ├── recommendations.py
│       │   ├── reporting.py
│       │   ├── run_pipeline.py
│       │   └── visualization.py
│       └── outputs/
│           ├── data/
│           ├── figures/
│           ├── tables/
│           ├── final_report.md
│           └── manifest.json
├── server/
│   ├── accountProfileValidation.js
│   ├── db.js
│   ├── dictionaryLookupService.js
│   ├── index.js
│   ├── schema.sql
│   └── data/
│       └── lingoix.sqlite
├── src/
│   ├── App.js
│   ├── index.js
│   ├── router.js
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── locales/
│   ├── pages/
│   └── services/
└── tailwind.config.js
```

### توضیح پوشه‌ها

- `src/`: کد اصلی React frontend
- `src/pages/`: page componentها
- `src/components/`: کامپوننت‌های UI و feature-level
- `src/services/`: API client و سرویس‌های dictionary/translation/learning
- `src/context/`: contextهای Theme و Language
- `src/locales/`: ترجمه‌های چندزبانه
- `src/data/`: داده آموزشی اولیه که backend هم برای seed استفاده می‌کند
- `server/`: backend Express، دیتابیس و providerهای dictionary
- `server/data/`: دیتابیس SQLite محلی، ignored by git
- `research/adaptive_learning/`: prototype پژوهشی Python/ML
- `research/adaptive_learning/outputs/`: خروجی‌های pipeline که backend می‌خواند
- `docs/adr/`: تصمیم‌های معماری ثبت‌شده
- `public/`: فایل‌های static ورودی CRA
- `build/`: خروجی production build، ignored by git
- `node_modules/`: dependencyهای npm، ignored by git

## اسکریپت‌های package.json

### `npm start`

```bash
npm start
```

اجرا می‌کند:

```bash
react-scripts start
```

فقط frontend را روی `http://localhost:3000` اجرا می‌کند.

### `npm run start:api`

```bash
npm run start:api
```

اجرا می‌کند:

```bash
node server/index.js
```

backend را روی `http://localhost:4000` یا مقدار `API_PORT` اجرا می‌کند.

### `npm run dev`

```bash
npm run dev
```

اجرا می‌کند:

```bash
concurrently "npm run start:api" "npm start"
```

backend و frontend را همزمان اجرا می‌کند. این دستور برای توسعه روزمره بهترین entrypoint پروژه فعلی است.

### `npm run build`

```bash
npm run build
```

اجرا می‌کند:

```bash
react-scripts build
```

خروجی production frontend را داخل `build/` می‌سازد.

### `npm test`

```bash
npm test
```

اجرا می‌کند:

```bash
react-scripts test
```

تست‌ها را در حالت watch اجرا می‌کند. برای اجرای یک‌باره در CI یا بررسی سریع:

```bash
npm test -- --watchAll=false
```

### `npm run eject`

```bash
npm run eject
```

اجرا می‌کند:

```bash
react-scripts eject
```

این عملیات تنظیمات CRA را از حالت managed خارج می‌کند و معمولا برگشت‌پذیر نیست. فقط در صورت نیاز جدی استفاده شود.

## وابستگی‌های Python

فایل اصلی:

```bash
research/adaptive_learning/requirements.txt
```

وابستگی‌ها:

- `numpy`: محاسبات عددی
- `pandas`: dataframe، CSV و تحلیل داده
- `scikit-learn`: مدل‌های classification/regression/clustering و pipelineهای ML
- `scipy`: تست‌های آماری
- `matplotlib`: تولید نمودار
- `seaborn`: visualization آماری
- `tabulate`: تولید جدول‌های Markdown در گزارش

فایل optional:

```bash
research/adaptive_learning/requirements-optional.txt
```

وابستگی‌های optional:

- `xgboost`: مدل gradient boosting
- `lightgbm`: مدل gradient boosting
- `catboost`: مدل gradient boosting

در `research/adaptive_learning/adaptive_learning/models.py` این libraryها با import اختیاری بررسی می‌شوند. نبودن آن‌ها pipeline را متوقف نمی‌کند.

## خطاهای رایج

### 1. پورت 3000 اشغال است

علت: یک React dev server دیگر در حال اجراست.

تشخیص: هنگام `npm start` پیام انتخاب پورت جدید یا خطای port in use دیده می‌شود.

رفع:

```bash
lsof -i :3000
```

process قبلی را ببندید یا با پیشنهاد CRA روی پورت دیگر اجرا کنید. اگر پورت frontend عوض شد، CORS backend فعلی هنوز فقط `http://localhost:3000` را مجاز می‌داند.

### 2. پورت 4000 اشغال است

علت: backend قبلی یا سرویس دیگری روی `4000` فعال است.

تشخیص:

```bash
lsof -i :4000
```

رفع:

```bash
API_PORT=4001 npm run start:api
```

و frontend را با API URL جدید اجرا کنید:

```bash
REACT_APP_API_BASE_URL=http://localhost:4001/api npm start
```

### 3. `Failed to fetch` در frontend

علت: backend اجرا نیست یا `REACT_APP_API_BASE_URL` اشتباه است.

تشخیص: Network tab مرورگر درخواست‌های `/api` را بررسی کنید.

رفع:

```bash
npm run start:api
```

یا:

```bash
REACT_APP_API_BASE_URL=http://localhost:4000/api npm start
```

### 4. CORS error

علت: backend فقط `http://localhost:3000` را در CORS مجاز کرده است.

تشخیص: browser console پیام CORS policy نشان می‌دهد.

رفع: frontend را روی `3000` اجرا کنید یا مقدار hardcoded در `server/index.js` را تغییر دهید.

### 5. `.env` برای backend اثر نمی‌کند

علت: backend فعلی `dotenv` را load نمی‌کند.

تشخیص: مثلا `API_PORT=4001` داخل `.env` گذاشته‌اید اما backend همچنان روی `4000` اجرا می‌شود.

رفع: env را هنگام اجرای command بدهید:

```bash
API_PORT=4001 npm run start:api
```

یا loader مناسب به backend اضافه کنید.

### 6. خطای build native برای `better-sqlite3`

علت: نصب native dependency نیاز به toolchain مناسب یا نسخه Node سازگار دارد.

تشخیص: `npm install` روی package `better-sqlite3` شکست می‌خورد.

رفع: Node 18+ نصب کنید، سپس:

```bash
rm -rf node_modules
npm install
```

روی macOS ممکن است نصب Xcode Command Line Tools لازم باشد:

```bash
xcode-select --install
```

### 7. دیتابیس ساخته نمی‌شود

علت: backend اجازه نوشتن در `server/data/` ندارد.

تشخیص: خطای filesystem یا SQLite هنگام `npm run start:api`.

رفع: permission مسیر پروژه را اصلاح کنید و backend را دوباره اجرا کنید.

### 8. login با حساب demo شکست می‌خورد

علت: دیتابیس local قبلا با داده متفاوت ساخته شده یا seed ناقص است.

تشخیص: endpoint login خطا می‌دهد یا کاربر پیدا نمی‌شود.

رفع: برای reset local:

```bash
rm server/data/lingoix.sqlite
npm run start:api
```

سپس از حساب‌های demo با password `Lingoix123!` استفاده کنید.

### 9. research page خطای `research_outputs_not_found` می‌دهد

علت: فایل‌های خروجی Python وجود ندارند یا ناقص هستند.

تشخیص: backend در endpoint `/api/research/adaptive-learning` خطای 404 برمی‌گرداند.

رفع:

```bash
source research/adaptive_learning/.venv/bin/activate
python research/adaptive_learning/run_pipeline.py --seed 42
```

### 10. Python dependency نصب نمی‌شود

علت: virtual environment فعال نیست، pip قدیمی است یا Python نامناسب استفاده می‌شود.

تشخیص: `pip install -r requirements.txt` خطا می‌دهد.

رفع:

```bash
cd research/adaptive_learning
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 11. XGBoost/LightGBM روی macOS خطای OpenMP می‌دهد

علت: optional libraries ممکن است به `libomp` نیاز داشته باشند.

تشخیص: import یا اجرای مدل‌های optional خطای OpenMP/libomp می‌دهد.

رفع: نصب optionalها ضروری نیست. اگر نیاز دارید، OpenMP را نصب کنید. اگر نصب نشوند، pipeline طبق کد ادامه می‌دهد و آن مدل‌ها را unavailable ثبت می‌کند.

### 12. خروجی‌های Python قدیمی هستند

علت: pipeline بعد از تغییر کد research دوباره اجرا نشده است.

تشخیص: تاریخ فایل‌های `research/adaptive_learning/outputs/` قدیمی است یا report با انتظار شما همخوان نیست.

رفع:

```bash
python research/adaptive_learning/run_pipeline.py --seed 42
```

### 13. تست‌ها در حالت watch گیر می‌کنند

علت: `npm test` به صورت پیش‌فرض watch mode است.

تشخیص: command تمام نمی‌شود و منتظر input می‌ماند.

رفع:

```bash
npm test -- --watchAll=false
```

### 14. production frontend به backend وصل نمی‌شود

علت: `REACT_APP_API_BASE_URL` هنگام build تنظیم نشده یا CORS backend production-ready نیست.

تشخیص: build serve می‌شود اما API calls به localhost اشتباه یا domain اشتباه می‌روند.

رفع:

```bash
REACT_APP_API_BASE_URL=https://your-api.example.com/api npm run build
```

همچنین CORS در `server/index.js` باید برای دامنه production تنظیم شود.

### 15. API keyهای Gemini/OpenRouter کار نمی‌کنند

علت: envها به backend نرسیده‌اند یا key/model اشتباه است.

تشخیص: dictionary/translation fallback می‌شود یا provider error در پاسخ سرویس دیده می‌شود.

رفع:

```bash
GEMINI_API_KEY=your_key GEMINI_MODEL=gemini-1.5-flash npm run start:api
```

یا:

```bash
OPENROUTER_API_KEY=your_key OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free npm run start:api
```

### 16. build با warning مربوط به Browserslist اجرا می‌شود

علت: database بسته `caniuse-lite` قدیمی است.

تشخیص: پیام `Browserslist: browsers data is ... old` دیده می‌شود.

رفع پیشنهادی خود tooling:

```bash
npx update-browserslist-db@latest
```

این warning معمولا مانع اجرای پروژه نیست.

### 17. APIهای research فایل‌های figure/table/report را پیدا نمی‌کنند

علت: نام فایل اشتباه است یا pipeline خروجی موردنظر را تولید نکرده است.

تشخیص: خطاهای `figure_not_found`, `table_not_found`, `dataset_not_found`, `report_not_found`.

رفع: pipeline را اجرا کنید و وجود فایل‌ها را بررسی کنید:

```bash
ls research/adaptive_learning/outputs/figures
ls research/adaptive_learning/outputs/tables
ls research/adaptive_learning/outputs/data
```

## راه‌اندازی روی سیستم جدید

فرض: سیستم کاملا خالی است.

### 1. نصب Git

macOS:

```bash
xcode-select --install
```

یا Git را از سایت رسمی نصب کنید.

### 2. نصب Node.js

نسخه 18 یا جدیدتر نصب کنید. سپس بررسی کنید:

```bash
node --version
npm --version
```

### 3. clone پروژه

```bash
git clone https://github.com/behshaad/lingoix.git
cd lingoix
```

### 4. نصب dependencyهای Node

```bash
npm ci
```

اگر `npm ci` به دلیل تغییر lockfile شکست خورد:

```bash
npm install
```

### 5. ساخت env محلی frontend

در صورت نیاز فایل `.env` بسازید:

```bash
REACT_APP_API_BASE_URL=http://localhost:4000/api
```

برای backend، envها را هنگام اجرای command بدهید یا در shell export کنید.

### 6. اجرای backend

```bash
npm run start:api
```

خروجی مورد انتظار:

```text
Lingoix API running on http://localhost:4000
```

### 7. اجرای frontend

در terminal دوم:

```bash
npm start
```

آدرس:

```bash
http://localhost:3000
```

### 8. ورود با حساب demo

```text
learner@lingoix.test / Lingoix123!
teacher@lingoix.test / Lingoix123!
school@lingoix.test / Lingoix123!
admin@lingoix.test / Lingoix123!
```

### 9. راه‌اندازی Python research

```bash
cd research/adaptive_learning
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

اجرای pipeline از ریشه پروژه:

```bash
cd /path/to/lingo
source research/adaptive_learning/.venv/bin/activate
python research/adaptive_learning/run_pipeline.py --seed 42
```

### 10. اجرای همه چیز با یک دستور برای توسعه

بعد از نصب dependencyها:

```bash
npm run dev
```

## اجرای Production

پروژه فعلی production deployment کامل و آماده با یک command ندارد. فقط build frontend و اجرای مستقیم backend موجود است.

### Build گرفتن frontend

```bash
cd /path/to/lingo
REACT_APP_API_BASE_URL=https://your-api.example.com/api npm run build
```

خروجی:

```bash
build/
```

### Deploy frontend

پوشه `build/` باید روی static hosting یا web server قرار بگیرد. این پروژه config مخصوص Nginx, Docker, Vercel, Netlify یا مشابه ندارد.

### اجرای backend در production

```bash
cd /path/to/lingo
NODE_ENV=production API_PORT=4000 GEMINI_API_KEY=your_key node server/index.js
```

### Restart backend

ابزار restart در پروژه تعریف نشده است. برای production واقعی باید process manager بیرونی تنظیم شود.

نمونه با PM2، اگر جداگانه نصب شده باشد:

```bash
pm2 start server/index.js --name lingoix-api
pm2 restart lingoix-api
pm2 logs lingoix-api
```

### نکات مهم production

- CORS در `server/index.js` روی `http://localhost:3000` hardcoded است و باید برای دامنه production قابل تنظیم شود.
- backend فایل‌های `build/` را serve نمی‌کند.
- دیتابیس SQLite در `server/data/lingoix.sqlite` است؛ برای production باید backup strategy تعریف شود.
- secretها نباید با `REACT_APP_` وارد frontend شوند.
- `.env` برای backend فعلی خودکار load نمی‌شود.

## بررسی نهایی وضعیت فعلی پروژه

### آیا پروژه بدون کار اضافه اجرا می‌شود؟

روی سیستم فعلی، بله. dependencyهای Node نصب هستند و دستور زیر پروژه را اجرا می‌کند:

```bash
npm run dev
```

خروجی مشاهده‌شده:

```text
Lingoix API running on http://localhost:4000
Compiled successfully!
Local: http://localhost:3000
```

### مواردی که باید بدانید

1. **فایل `.env.example` کامل نیست.**

فایل مربوطه:

```bash
.env.example
```

علت: متغیرهای `API_PORT` و `REACT_APP_API_BASE_URL` در کد استفاده می‌شوند ولی در `.env.example` نیامده‌اند.

راه‌حل پیشنهادی: این دو مقدار به `.env.example` اضافه شوند.

2. **backend فایل `.env` را خودکار load نمی‌کند.**

فایل‌های مربوطه:

```bash
server/index.js
server/dictionaryLookupService.js
```

علت: هیچ `require("dotenv").config()` یا loader مشابهی وجود ندارد.

راه‌حل پیشنهادی: یا در مستندات همیشه envها از shell pass شوند، یا dependency/config مناسب برای backend اضافه شود.

3. **CORS hardcoded است.**

فایل مربوطه:

```bash
server/index.js
```

مقدار فعلی:

```js
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
```

علت: فقط development local با پورت 3000 را پوشش می‌دهد.

راه‌حل پیشنهادی: origin از env خوانده شود، مثلا `APP_PUBLIC_URL`.

4. **production script کامل وجود ندارد.**

فایل مربوطه:

```bash
package.json
```

علت: فقط `build` برای frontend و `start:api` برای backend وجود دارد. اسکریپت serve static، process manager، Dockerfile یا deploy config وجود ندارد.

راه‌حل پیشنهادی: برای production واقعی deploy strategy مشخص شود.

5. **migration رسمی وجود ندارد.**

فایل‌های مربوطه:

```bash
server/db.js
server/schema.sql
```

علت: schema و تغییرات ستون‌ها هنگام startup اجرا می‌شوند.

راه‌حل پیشنهادی: اگر پروژه جدی‌تر شد، migration versioning اضافه شود.

6. **بخش Python runtime service نیست.**

فایل مربوطه:

```bash
research/adaptive_learning/run_pipeline.py
```

علت: بخش research فقط خروجی فایل تولید می‌کند.

راه‌حل پیشنهادی: اگر محصول نیاز به inference زنده دارد، باید سرویس API جداگانه طراحی شود.

7. **دیتابیس local در git ذخیره نمی‌شود.**

فایل مربوطه:

```bash
.gitignore
```

مسیر ignored:

```bash
server/data
```

این رفتار درست است، اما یعنی هر سیستم جدید با seed اولیه بالا می‌آید و داده‌های local منتقل نمی‌شوند مگر دستی backup شوند.

