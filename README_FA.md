# Borhan_SK Portfolio — راهنمای فارسی (Appwrite)

این نسخه، سایت دو‌زبانه‌ی رزومه و دریافت سفارش Borhan_SK است و از **Appwrite Cloud** برای دیتابیس، ورود مالک و ذخیره‌سازی فایل‌ها استفاده می‌کند. هیچ وابستگی به Supabase، Flask، Render یا Telegram Desktop ندارد.

## امکانات

- سایت عمومی فارسی و انگلیسی با RTL/LTR
- رزومه، معرفی، مهارت‌ها، خدمات و نمونه‌کارها
- ثبت سفارش پروژه بدون نیاز به ساخت حساب برای بازدیدکننده
- آپلود پیوست سفارش در فضای خصوصی
- فرم پشتیبانی و پیام خصوصی
- ثبت نظر، پیشنهاد و انتقاد؛ انتشار فقط با تأیید مالک
- پنل مالک با ورود ایمیل/رمز Appwrite از آیکون قفل سایت
- مدیریت سفارش‌ها، وضعیت، یادداشت خصوصی و فایل تحویل
- مدیریت رزومه، لینک‌ها، مهارت‌ها، خدمات و نمونه‌کارها به دو زبان

## معماری

- GitHub: نگهداری و نسخه‌بندی کد
- statichost.eu: میزبانی فایل‌های سایت
- Appwrite Cloud: TablesDB، احراز هویت و Storage
- یک Appwrite Function: ساخت لینک دانلود زمان‌دار برای فایل‌ها

سایت استاتیک است. فایل `statichost.yml` پوشه‌ی `public/` را برای انتشار مشخص می‌کند.

## پیش‌نیازها

- یک پروژه Appwrite Cloud
- Node.js نسخه ۲۰ یا جدیدتر روی کامپیوتر، فقط برای اجرای اسکریپت ساخت دیتابیس
- یک حساب مالک در Appwrite Authentication

## مرحله ۱ — ساخت پروژه و حساب مالک در Appwrite

1. وارد https://cloud.appwrite.io شوید و یک Project بسازید.
2. Region پروژه را انتخاب کنید و **API Endpoint** و **Project ID** را از تنظیمات پروژه کپی کنید.
3. در بخش **Add a platform** یک Web platform اضافه کنید. برای شروع `localhost` را اضافه کنید؛ بعداً hostname واقعی سایت Statichost را نیز اضافه کنید. Appwrite برای سایت منتشرشده به hostname همان سایت نیاز دارد تا درخواست‌های مرورگر پذیرفته شوند.
4. از بخش **Auth → Users** یک کاربر با ایمیل و رمز قوی برای خودتان بسازید. شناسه‌ی `$id` کاربر را کپی کنید. سایت صفحه‌ی ثبت‌نام عمومی ندارد.

## مرحله ۲ — ساخت دیتابیس و Bucket با اسکریپت

این اسکریپت جدول‌ها، ستون‌ها، مجوزهای دسترسی و Storage bucket را ایجاد می‌کند.

1. در Appwrite از بخش **API Keys** یک کلید موقت بسازید.
2. فقط این Scopeها را به کلید بدهید:
   - `databases.read` و `databases.write`
   - `tables.read` و `tables.write`
   - `columns.read` و `columns.write`
   - `buckets.read` و `buckets.write`
3. از GitHub یا بسته‌ی پروژه، فایل `.env.example` را در ریشه کپی و نام نسخه‌ی کپی را `.env` کنید.
4. در `.env` مقادیر واقعی `APPWRITE_ENDPOINT`، `APPWRITE_PROJECT_ID`، `APPWRITE_API_KEY` و `APPWRITE_OWNER_USER_ID` را قرار دهید. شناسه‌های Database و Bucket را همان مقدار پیش‌فرض نگه دارید.
5. در ترمینال، در ریشه‌ی پروژه اجرا کنید:

```bash
node tools/setup-appwrite.mjs
```

6. باید پیام `SUCCESS` را ببینید. بعد از ساخت موفق، کلید موقت را از Appwrite Console حذف کنید. فایل `.env` را هرگز در GitHub آپلود نکنید؛ `.gitignore` آن را نادیده می‌گیرد.

اسکریپت فعلی داده‌های قدیمی Supabase را منتقل نمی‌کند؛ فقط ساختار جدید Appwrite را ایجاد می‌کند. اگر قبلاً سفارشی یا محتوایی در Supabase ذخیره کرده‌اید، باید جداگانه Export/Import شود.

## مرحله ۳ — تنظیم فایل سایت

فایل `public/assets/js/config.js` را باز کنید و این مقادیر را تکمیل کنید:

- `appwriteEndpoint`: Endpoint دقیق پروژه، با `/v1`
- `appwriteProjectId`: شناسه پروژه
- `appwriteOwnerUserId`: مقدار `$id` حساب مالک
- `appwriteDeliveryFunctionId`: شناسه‌ی Function تحویل؛ در این راهنما `delivery_link` است
- لینک Telegram، LinkedIn، GitHub و ایمیل خودتان

Project ID و Owner User ID شناسه‌اند، نه API key. هیچ‌وقت API Key یا Secret را در `config.js` قرار ندهید.

## مرحله ۴ — ساخت Function امن برای لینک دانلود

برای اینکه فایل پیوست مشتری خصوصی بماند ولی بتوانید لینک تحویل را برای مشتری بفرستید، یک Function کوچک نیاز است. این Function فقط برای حساب مالک قابل اجراست و با کلید موقت یا کلید مرورگر کار نمی‌کند؛ از API key موقت Appwrite که هنگام اجرای Function تزریق می‌شود و فقط Scope `tokens.write` دارد استفاده می‌کند.

1. در Appwrite وارد **Functions → Create function** شوید.
2. مقدارها را تنظیم کنید:
   - Function ID: `delivery_link`
   - Name: `Borhan delivery link`
   - Runtime: Node.js 22 یا جدیدترِ موجود در Console
   - Entrypoint: `src/main.js`
   - Build command: `npm install`
3. محتوای پوشه‌ی `functions/create-delivery-link/` را به‌صورت ZIP (خود محتویات پوشه، نه پوشه‌ی والد) به‌عنوان Deployment بارگذاری کنید.
4. در تنظیمات Function، بخش **Scopes** فقط `tokens.write` را فعال کنید.
5. در **Execute access** فقط نقش `user:YOUR_OWNER_USER_ID` را اضافه کنید.
6. در **Environment variables** این دو متغیر را بسازید:
   - `BORHAN_OWNER_USER_ID` = شناسه‌ی حساب مالک
   - `BORHAN_BUCKET_ID` = `client_files`
7. Function را Deploy کنید. شناسه‌ی Function باید با مقدار `appwriteDeliveryFunctionId` در `config.js` یکی باشد.

این Function قبل از ساخت لینک، شناسه‌ی کاربر اجراکننده را با شناسه‌ی مالک مقایسه می‌کند. لینک‌های پیوست مشتری ۱۰ دقیقه و لینک فایل تحویل ۳۰ روز اعتبار دارند. لینک تحویل را فقط برای مشتری مربوطه ارسال کنید.

## مرحله ۵ — انتشار سایت

1. تمام فایل‌های پروژه را در ریشه‌ی مخزن GitHub قرار دهید.
2. مطمئن شوید `config.js` فقط شامل مقادیر عمومی/شناسه‌هاست و `.env` در مخزن نیست.
3. در Statichost مخزن را متصل کنید و شاخه `main` را انتخاب کنید.
4. Build command را خالی بگذارید و Output directory را `public` قرار دهید.
5. hostname منتشرشده را در Appwrite به‌عنوان Web platform اضافه کنید.
6. سایت را باز کنید و ثبت سفارش، تغییر زبان و ورود مالک را تست کنید.

## مجوزهای امنیتی و فایل‌ها

- جدول‌های سفارش، پیام و بازخوردِ در انتظار بررسی فقط اجازه CREATE عمومی دارند؛ خواندن آن‌ها به مالک محدود است.
- دیدگاه‌های تأییدشده و محتوای عمومی فقط READ عمومی دارند؛ نوشتن و ویرایش به مالک محدود است.
- Bucket فقط اجازه CREATE به بازدیدکنندگان می‌دهد و READ/UPDATE/DELETE برای مالک است. فایل‌های پیوست بدون مجوز عمومی ذخیره می‌شوند.
- لینک‌های دانلود خارجی با File Token و Function مالک ساخته می‌شوند؛ API key در مرورگر نیست.
- قبل از استفاده واقعی، در یک مرورگر ناشناس بررسی کنید که سفارش‌ها، پیام‌ها و فایل‌های پیوست بدون ورود مالک قابل خواندن نباشند.

## محدودیت‌ها و نگهداری

- پلن رایگان Appwrite فعلاً شامل ۵ گیگابایت ترافیک، ۲ گیگابایت فضای ذخیره‌سازی، ۷۵۰ هزار اجرا، ۷۵ هزار کاربر فعال ماهانه، یک Database، یک Bucket و دو Function است. این پروژه از یک Database، یک Bucket و یک Function استفاده می‌کند.
- پروژه‌ی رایگان Appwrite در صورت نداشتن فعالیت توسعه‌ای طی ۷ روز متوالی به‌صورت خودکار Pause می‌شود؛ تا زمان فعال‌سازی دوباره، سایت نمی‌تواند از دیتابیس استفاده کند. رسیدن به سهمیه‌های رایگان نیز ممکن است پروژه را تا Reset سهمیه Freeze کند.
- هیچ سرویس ایمیل خودکاری در این نسخه فعال نیست؛ دکمه پاسخ ایمیل، برنامه ایمیل دستگاه مالک را باز می‌کند.
- لینک‌های File Token را مانند رمز عبور در نظر بگیرید؛ هرکس لینک را داشته باشد می‌تواند در مدت اعتبار، همان فایل را دانلود کند.
- اسکریپت ساخت دیتابیس، داده‌های Supabase را انتقال نمی‌دهد.
- قبل از اتکا به سرویس، ورود به Appwrite Console و دسترسی به API endpoint را از شبکه‌ی خودتان آزمایش کنید.
- در این محیط Syntax و ساختار فایل‌ها قابل بررسی است؛ اجرای واقعی روی پروژه Appwrite شما، Deploy Function و تست آپلود/دانلود باید پس از واردکردن شناسه‌ها و ساخت پروژه انجام شود.

## فایل‌های مهم

```text
public/index.html                         سایت عمومی
public/owner.html                         پنل مالک
public/privacy.html                       سیاست حریم خصوصی
public/assets/js/config.js                تنظیمات عمومی Appwrite
public/assets/js/appwrite-compat.js       اتصال TablesDB/Auth/Storage
public/assets/js/site.js                  منطق سایت عمومی
public/assets/js/owner.js                 منطق پنل مالک
tools/setup-appwrite.mjs                  ایجاد Database، Tableها و Bucket
functions/create-delivery-link/           Function ساخت لینک دانلود امن
statichost.yml                            انتشار پوشه public
```
