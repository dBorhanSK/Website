# Borhan_SK Portfolio — راهنمای فارسی (Appwrite)

این نسخه سایت دو‌زبانه‌ی رزومه، نمونه‌کار و دریافت سفارش Borhan_SK است. ساختار اصلی سایت حفظ شده و فرایند سفارش به گفت‌وگوی خصوصی بین مشتری و مالک گسترش یافته است.

## امکانات

- سایت فارسی و انگلیسی با RTL/LTR
- رزومه، خدمات و نمونه‌کارها با مدیریت از پنل مالک
- ثبت سفارش بدون ساخت حساب کاربری معمولی؛ ایجاد نشست مهمان Appwrite برای پیگیری سفارش
- گفت‌وگوی خصوصی در هر سفارش، ارسال پیام و حداکثر ۵ فایل در هر پیام
- پشتیبانی از هر نوع فایل پیوست تا ۵۰ مگابایت برای هر فایل
- آپلود مستقیم تصویر نمونه‌کار از پنل مالک؛ نیازی به لینک عکس نیست
- مدیریت وضعیت، برآورد قیمت، یادداشت خصوصی و ارسال خودکار فایل تحویل در گفت‌وگوی همان سفارش
- حذف تکی پیام‌ها همراه فایل‌های پیوست؛ پاک‌کردن کامل تاریخچه چت و فایل تحویل بدون حذف سفارش؛ حذف کامل سفارش همراه همه فایل‌های وابسته
- فرم پشتیبانی و دیدگاه‌های قابل تأیید توسط مالک
- لینک پیام خصوصی تلگرام به‌جای لینک پروفایل GitHub

## معماری

- GitHub: نگهداری و نسخه‌بندی کد
- میزبانی استاتیک: GitHub Pages یا Statichost
- Appwrite Cloud: TablesDB، Authentication و Storage
- دو Appwrite Function: لینک امن فایل و مدیریت گفت‌وگوی سفارش

فایل `statichost.yml` پوشه `public/` را برای انتشار Statichost معرفی می‌کند. نسخه ریشه سایت نیز با `public/` همگام شده تا GitHub Pages با انتشار از ریشه مخزن کار کند.

## مرحله ۱ — پروژه و حساب مالک در Appwrite

1. وارد https://cloud.appwrite.io شوید و پروژه را باز کنید.
2. Endpoint و Project ID را یادداشت کنید.
3. در بخش **Add a platform** یک Web platform بسازید و `localhost` و دامنه نهایی سایت را اضافه کنید.
4. در **Auth → Users** حساب مالک را بسازید و شناسه `$id` آن را بردارید.
5. در **Auth → Settings** ورود/نشست ناشناس (Anonymous sessions) را فعال کنید. این قابلیت برای ساخت هویت مهمان مشتری و محدودکردن گفت‌وگو به همان مشتری استفاده می‌شود.

## مرحله ۲ — ساخت یا به‌روزرسانی ساختار دیتابیس و Storage

1. در Appwrite یک API Key موقت بسازید و Scopeهای زیر را به آن بدهید:
   - `databases.read` و `databases.write`
   - `tables.read` و `tables.write`
   - `columns.read` و `columns.write`
   - `indexes.read` و `indexes.write`
   - `buckets.read` و `buckets.write`
2. فایل `.env.example` را به `.env` کپی کنید و Endpoint، Project ID، API Key موقت و Owner User ID را در آن بگذارید.
3. در ریشه پروژه اجرا کنید:

```bash
node tools/setup-appwrite.mjs
```

4. اسکریپت جدول‌ها و ستون‌های جدید گفت‌وگو (`order_messages` و `customer_user_id`) را می‌سازد، ایندکس لازم را اضافه می‌کند و Bucket را برای فایل‌های با هر پسوند تا سقف ۵۰ مگابایت تنظیم می‌کند. اجرای دوباره اسکریپت برای ساختار موجود نیز در نظر گرفته شده است.
5. بعد از موفقیت، API Key موقت را از Appwrite حذف کنید. فایل `.env` را در GitHub قرار ندهید.

## مرحله ۳ — تنظیم سایت و آیدی خصوصی تلگرام

فایل `public/assets/js/config.js` را بررسی کنید:

- `appwriteEndpoint`: آدرس API همراه `/v1`
- `appwriteProjectId`: شناسه پروژه
- `appwriteOwnerUserId`: شناسه حساب مالک
- `appwriteDeliveryFunctionId`: شناسه Function تحویل، یعنی `delivery_link`
- `appwriteChatFunctionId`: شناسه Function گفت‌وگو، یعنی `order_chat`
- مقدار Telegram را به `https://t.me/YOUR_TELEGRAM_USERNAME` تغییر دهید و به‌جای عبارت نمونه، username واقعی حساب شخصی خودتان را قرار دهید.

همچنین می‌توانید آدرس تلگرام شخصی را بعد از ورود به پنل مالک، در بخش «اطلاعات سایت» و فیلد Telegram private profile URL وارد و ذخیره کنید. تا قبل از جایگزینی placeholder، لینک تلگرام در سایت نمایش داده نمی‌شود. لینک GitHub شخصی از کارت‌های عمومی حذف شده است؛ لینک مخزن اختصاصی هر پروژه همچنان اختیاری و قابل استفاده است.

هیچ‌وقت API Key یا Secret را در `config.js`، HTML یا JavaScript قرار ندهید.

## مرحله ۴ — Function لینک امن فایل (`delivery_link`)

این Function برای ساخت لینک دانلود زمان‌دار پیوست سفارش و فایل تحویل قبلی استفاده می‌شود.

1. در Appwrite از بخش **Functions** یک Function بسازید:
   - Function ID: `delivery_link`
   - Runtime: Node.js 22 یا نسخه جدیدتر موجود
   - Entrypoint: `src/main.js`
   - Build command: `npm install`
2. محتوای پوشه `functions/create-delivery-link/` را به‌عنوان Deployment بارگذاری کنید.
3. Scope: `tokens.write`
4. Execute access: فقط `user:YOUR_OWNER_USER_ID`
5. Environment variables:
   - `BORHAN_OWNER_USER_ID` = شناسه مالک
   - `BORHAN_BUCKET_ID` = `client_files`
6. Function را Deploy کنید.

## مرحله ۵ — Function گفت‌وگوی سفارش (`order_chat`)

این Function پیام‌ها را می‌خواند و ثبت می‌کند، مالکیت سفارش را بررسی می‌کند، لینک‌های موقت مشاهده/دانلود می‌سازد و هنگام حذف پیام، پاک‌کردن تاریخچه چت یا حذف سفارش، فایل‌های پیوست را نیز از Storage حذف می‌کند. پاک‌کردن تاریخچه، خود سفارش را نگه می‌دارد.

1. در **Functions → Create function** یک Function با این تنظیمات بسازید:
   - Function ID: `order_chat`
   - Runtime: Node.js 22 یا نسخه جدیدتر موجود
   - Entrypoint: `src/main.js`
   - Build command: `npm install`
2. محتویات پوشه `functions/order-chat/` را ZIP کنید و به‌عنوان Deployment بارگذاری کنید.
3. Scopeهای Function را دقیقاً این موارد قرار دهید:
   - `rows.read`
   - `rows.write`
   - `files.read`
   - `files.write` (برای حذف فایل‌های پیام و سفارش از Storage)
   - `tokens.write`
4. در **Execute access** گزینه `Any` را انتخاب کنید. این فقط اجازه فراخوانی Function را می‌دهد؛ خود کد قبل از هر عملیات، شناسه کاربر را بررسی می‌کند و فقط مالک یا مشتری ثبت‌شده همان سفارش را می‌پذیرد.
5. Environment variables:
   - `BORHAN_OWNER_USER_ID` = شناسه مالک
   - `BORHAN_DATABASE_ID` = `borhan_sk`
   - `BORHAN_BUCKET_ID` = `client_files`
6. Function را Deploy کنید و مطمئن شوید شناسه آن `order_chat` است.

کلید موقت یا API Key جداگانه داخل Function قرار ندهید؛ Appwrite برای هر اجرای Function کلید موقت را در زمان اجرا فراهم می‌کند و Scopeهای Function سطح دسترسی آن را تعیین می‌کنند.

## مرحله ۶ — انتشار سایت

**برای Statichost:** مخزن را متصل کنید، Build command را خالی بگذارید و Output directory را `public` انتخاب کنید.

**برای GitHub Pages:** فایل‌ها را در ریشه مخزن نگه دارید و از Settings → Pages انتشار از Branch و پوشه `/ (root)` را فعال کنید. نسخه ریشه `index.html`، `owner.html` و پوشه `assets/` در این بسته با نسخه `public/` همسان شده است.

دامنه نهایی سایت را نیز به Web platform پروژه Appwrite اضافه کنید.

## محدودیت و حریم خصوصی گفت‌وگو

- مشتری حساب معمولی نمی‌سازد؛ سایت برای او نشست مهمان Appwrite ایجاد می‌کند.
- تاریخچه سفارش روی همان مرورگر و نشست قابل پیگیری است. نشست مهمان قابل بازیابی مجدد با ایمیل/رمز نیست؛ اگر نشست منقضی شود، مرورگر/داده‌های آن پاک شود یا مشتری دستگاه دیگری استفاده کند، ممکن است نتواند به گفت‌وگوی قبلی برگردد. برای بازیابی بین دستگاه‌ها باید بعداً ورود با ایمیل یا اتصال حساب اضافه شود. این محدودیت مربوط به نشست‌های ناشناس Appwrite است.
- پیوست‌های گفت‌وگو عمومی نیستند؛ دسترسی فایل هر مشتری و مالک در مجوزهای فایل ثبت می‌شود. لینک مشاهده/دانلود فایل در زمان درخواست از Function ساخته می‌شود و ۱۵ دقیقه اعتبار دارد.
- برای هر پیام حداکثر ۵ فایل و برای هر فایل ۵۰ مگابایت در نظر گرفته شده است. در این نسخه پسوند فایل‌ها محدود نشده؛ سقف واقعی تابع تنظیمات و سهمیه Storage پروژه Appwrite نیز هست.
- تصویر نمونه‌کار برای نمایش عمومی خواندنی است، اما ویرایش و حذف آن در اختیار مالک باقی می‌ماند. سقف تصویر نمونه‌کار در پنل ۱۵ مگابایت است.
- در پنل هر سفارش، مالک می‌تواند پیام تکی را همراه پیوست آن حذف کند یا با دکمه «پاک‌کردن تاریخچه چت» همه پیام‌ها، پیوست‌ها و فایل تحویل را پاک کند؛ خود سفارش باقی می‌ماند.
- حذف کامل سفارش، پیام‌ها، پیوست‌های گفت‌وگو، فایل تحویل و فایل اولیه ارسال‌شده همراه سفارش را از Storage حذف می‌کند.
- لینک File Token را مانند رمز عبور نگه دارید و فقط برای مشتری همان سفارش ارسال کنید.

## فایل‌های اصلی

```text
public/index.html
public/owner.html
public/assets/js/config.js
public/assets/js/appwrite-compat.js
public/assets/js/site.js
public/assets/js/owner.js
public/assets/css/site.css
public/assets/css/owner.css
tools/setup-appwrite.mjs
functions/create-delivery-link/
functions/order-chat/
```
