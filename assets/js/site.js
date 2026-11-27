import { createClient } from './appwrite-compat.js';
import { SITE_CONFIG, isAppwriteConfigured } from './config.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const configured = isAppwriteConfigured();
const appwrite = configured ? createClient() : null;

const copy = {
  fa: {
    nav_about:'درباره من',nav_services:'خدمات',nav_work:'نمونه‌کارها',nav_process:'روند همکاری',nav_feedback:'دیدگاه‌ها',nav_contact:'ارتباط',nav_cta:'ثبت سفارش',
    hero_eyebrow:'توسعه‌دهنده نرم‌افزار مستقل',hero_title:'ایده‌های خوب،<br><span class="gradient-text">به تجربه‌های دیجیتال</span><br>تبدیل می‌شوند.',hero_lead:'من برهان هستم؛ روی ساخت ابزارهای کاربردی، اتوماسیون و تجربه‌های وب تمرکز می‌کنم. بیایید مسئله‌ات را به یک راه‌حل ساده و قابل‌اعتماد تبدیل کنیم.',hero_primary:'شروع یک پروژه',hero_secondary:'دیدن نمونه‌کارها',hero_note:'همکاری شفاف، ارتباط مستقیم و تحویل مرحله‌ای',chip_build:'ساخت محصول',chip_launch:'انتشار و رشد',code_output:'راه‌حل آماده‌ی شروع است',hero_bottom_left:'طراحی دقیق · کدنویسی تمیز · ارتباط روشن',scroll:'اسکرول کن',
    trust_label:'حوزه‌های تمرکز',about_kicker:'01 — درباره من',about_title:'کدنویسی فقط نوشتن کد نیست؛<span class="gradient-text"> حل مسئله است.</span>',about_body:'من به ساخت ابزارهایی علاقه دارم که کارهای پیچیده را ساده‌تر می‌کنند؛ از ربات‌ها و اتوماسیون گرفته تا وب‌سایت‌ها و داشبوردهای کاربردی. در هر پروژه، هدفم ساخت راه‌حلی روشن، قابل نگهداری و متناسب با نیاز واقعی است.',about_location_label:'موقعیت',about_location:'ایران · همکاری آنلاین',about_focus_label:'تمرکز فعلی',about_focus:'پروژه‌های وب و اتوماسیون',about_contact_label:'ارتباط',about_contact:'مستقیم و مرحله‌به‌مرحله',about_link:'درباره پروژه‌ات صحبت کنیم',resume_download:'دانلود رزومه <span aria-hidden="true">↓</span>',email_label_social:'ایمیل مستقیم',skills_title:'ابزارها و مهارت‌ها',
    services_kicker:'02 — خدمات',services_title:'از ایده تا <span class="gradient-text">نسخه قابل استفاده</span>',services_intro:'می‌توانیم از یک قابلیت کوچک شروع کنیم یا یک محصول کامل را از ابتدا طراحی و پیاده‌سازی کنیم.',service_1_title:'ربات و ابزار تلگرام',service_1_body:'ربات‌های کاربردی، پنل مدیریت، گردش‌کار و اتصال به سرویس‌های دیگر.',service_2_title:'اتوماسیون با پایتون',service_2_body:'حذف کارهای تکراری، پردازش داده و ساخت ابزارهای اختصاصی.',service_3_title:'وب‌سایت و داشبورد',service_3_body:'وب‌سایت‌های واکنش‌گرا، پنل‌های مدیریتی و رابط‌های کاربری.',service_4_title:'API و دیتابیس',service_4_body:'اتصال سرویس‌ها، طراحی ساختار داده و یکپارچه‌سازی سیستم‌ها.',
    work_kicker:'03 — منتخب پروژه‌ها',work_title:'چیزهایی که <span class="gradient-text">ساخته‌ام</span>',work_intro:'نمونه‌کارها با توضیح مسئله، راه‌حل و فناوری‌های استفاده‌شده نمایش داده می‌شوند.',project_pending:'در حال آماده‌سازی',project_pending_title:'نمونه‌کارهای منتخب به‌زودی',project_pending_body:'پروژه‌های منتشرشده از پنل مالک به این بخش اضافه خواهند شد.',work_note:'برای مشاهده جزئیات یا درخواست پروژه‌ای مشابه، پیام بده.',work_cta:'درخواست پروژه',
    process_kicker:'04 — روند همکاری',process_title:'مسیر همکاری، <span class="gradient-text">شفاف و مشخص</span>',process_intro:'از اولین پیام تا تحویل نهایی، هر مرحله روشن است و قبل از شروع درباره محدوده و زمان‌بندی توافق می‌کنیم.',step_1_title:'ثبت درخواست',step_1_body:'نیاز، هدف و جزئیات اولیه پروژه را ارسال می‌کنی.',step_2_title:'بررسی و توافق',step_2_body:'راه‌حل، محدوده کار، هزینه و زمان تقریبی مشخص می‌شود.',step_3_title:'طراحی و اجرا',step_3_body:'پروژه مرحله‌ای پیش می‌رود و در جریان کار به‌روزرسانی می‌گیری.',step_4_title:'تحویل و پشتیبانی',step_4_body:'نسخه نهایی، فایل‌ها و راهنمای استفاده تحویل داده می‌شود.',
    feedback_kicker:'05 — صدای شما',feedback_title:'بازخوردها، مسیر را <span class="gradient-text">بهتر می‌کنند.</span>',feedback_intro:'نظر، پیشنهاد یا حتی انتقاد سازنده‌ات را بنویس. دیدگاه‌های تأییدشده در همین صفحه برای همه نمایش داده می‌شوند.',feedback_count_label:'دیدگاه منتشرشده',feedback_empty:'هنوز دیدگاهی منتشر نشده؛ اولین نفر باش.',field_name:'نام',field_type:'نوع پیام',feedback_kind_review:'نظر',feedback_kind_suggestion:'پیشنهاد',feedback_kind_criticism:'انتقاد',field_feedback:'متن دیدگاه',feedback_moderation:'دیدگاه‌ها پس از بررسی مالک منتشر می‌شوند.',feedback_submit:'ارسال دیدگاه',
    order_kicker:'06 — شروع همکاری',order_title:'پروژه بعدی‌ات<br><span class="gradient-text">از همین‌جا شروع می‌شود.</span>',order_intro:'هرچقدر از ایده‌ات می‌دانی بنویس. بعد از بررسی، برای هماهنگی جزئیات با تو تماس می‌گیرم.',order_aside:'هنوز همه جزئیات مشخص نیست؟ مشکلی نیست؛ درخواست اولیه هم کافی است.',prefer_direct:'ارتباط مستقیم را ترجیح می‌دهی؟',order_form_title:'شرح پروژه',required_fields:'فیلدهای ستاره‌دار ضروری‌اند',field_email:'ایمیل',field_telegram:'آیدی تلگرام (اختیاری)',field_service:'نوع پروژه',select_service:'انتخاب کن...',service_opt_1:'ربات تلگرام',service_opt_2:'اتوماسیون پایتون',service_opt_3:'وب‌سایت / داشبورد',service_opt_4:'API / دیتابیس',service_opt_other:'سایر موارد',field_budget:'بودجه تقریبی',budget_unspecified:'هنوز مشخص نیست',budget_small:'اقتصادی',budget_medium:'متوسط',budget_large:'بالاتر / توافقی',field_deadline:'زمان موردنظر',deadline_flexible:'انعطاف‌پذیر',deadline_urgent:'فوری',deadline_2weeks:'۱ تا ۲ هفته',deadline_month:'حدود یک ماه',field_project_title:'عنوان کوتاه پروژه',field_description:'توضیحات و نیازمندی‌ها',field_attachment:'پیوست (اختیاری، هر نوع فایل تا ۵۰ مگابایت)',file_help:'هر نوع فایل مرتبط، تصویر، سند یا فایل فشرده قابل ارسال است؛ بعد از ثبت سفارش هم می‌توانی در گفت‌وگو فایل بفرستی.',privacy_consent:'با ذخیره اطلاعات این درخواست برای بررسی و پیگیری موافقم.',order_submit:'ارسال درخواست پروژه',privacy_note:'اطلاعات تماس و شرح پروژه فقط در پنل خصوصی مالک قابل مشاهده است.',
    contact_kicker:'ارتباط و پشتیبانی',contact_title:'سؤالی داری؟<br><span class="gradient-text">در ارتباط باشیم.</span>',contact_intro:'برای پشتیبانی، پیشنهاد همکاری یا هر سؤال دیگری می‌توانی پیام بفرستی.',telegram_label:'پیام خصوصی تلگرام',linkedin_label:'پروفایل حرفه‌ای',contact_form_title:'ارسال پیام به من',contact_private:'پیام خصوصی',field_subject:'موضوع',field_message:'پیام',contact_submit:'ارسال پیام',final_kicker:'یک ایده در ذهن داری؟',final_title:'بیایید چیزی <span>ارزشمند</span> بسازیم.',final_cta:'شروع گفتگو',footer_line:'ساخت راه‌حل‌های دیجیتال، با تمرکز بر سادگی و کاربرد.',back_top:'بازگشت به بالا ↑',rights:'تمامی حقوق محفوظ است.',privacy_link:'حریم خصوصی',owner_access:'ورود مالک',footer_made:'طراحی و توسعه با دقت',
    msg_config:'برای فعال‌شدن فرم‌ها، تنظیمات Appwrite را در فایل assets/js/config.js وارد کن.',msg_sent:'درخواستت با موفقیت ثبت شد. کد پیگیری:',msg_feedback_sent:'دیدگاهت ثبت شد و پس از بررسی منتشر می‌شود.',msg_contact_sent:'پیامت ثبت شد. ممنون از ارتباطت.',msg_error:'ثبت اطلاعات انجام نشد. اتصال را بررسی کن و دوباره تلاش کن.',msg_file:'نوع یا حجم فایل مجاز نیست.',msg_required:'لطفاً همه فیلدهای ضروری را کامل کن.',msg_load_error:'بارگذاری اطلاعات با مشکل مواجه شد.',kind_review:'نظر',kind_suggestion:'پیشنهاد',kind_criticism:'انتقاد',
    project_view:'مشاهده پروژه',project_source:'کد منبع',project_details:'جزئیات بیشتر',project_empty:'هنوز نمونه‌کاری منتشر نشده است.',service_empty:'خدمات جدید به‌زودی اضافه می‌شود.'
  },
  en: {
    nav_about:'About',nav_services:'Services',nav_work:'Projects',nav_process:'Process',nav_feedback:'Feedback',nav_contact:'Contact',nav_cta:'Start a project',
    hero_eyebrow:'Independent software developer',hero_title:'Good ideas<br><span class="gradient-text">become meaningful</span><br>digital experiences.',hero_lead:'I’m Borhan. I build useful tools, automations, and web experiences. Let’s turn your challenge into a simple, reliable solution.',hero_primary:'Start a project',hero_secondary:'Explore my work',hero_note:'Clear collaboration, direct communication, thoughtful delivery',chip_build:'Product building',chip_launch:'Launch & growth',code_output:'Solution is ready to ship',hero_bottom_left:'Thoughtful design · Clean code · Clear communication',scroll:'Scroll to explore',
    trust_label:'Areas of focus',about_kicker:'01 — About me',about_title:'Coding is more than writing code; it is <span class="gradient-text">problem solving.</span>',about_body:'I enjoy building tools that make complex tasks simpler — from bots and automation to websites and practical dashboards. Every project is an opportunity to create a clear, maintainable solution shaped around a real need.',about_location_label:'Based in',about_location:'Iran · Remote collaboration',about_focus_label:'Current focus',about_focus:'Web products & automation',about_contact_label:'Communication',about_contact:'Direct and step by step',about_link:'Let’s talk about your project',resume_download:'Download résumé <span aria-hidden="true">↓</span>',email_label_social:'Direct email',skills_title:'Tools & skills',
    services_kicker:'02 — Services',services_title:'From an idea to a <span class="gradient-text">working product</span>',services_intro:'We can start with a focused feature or design and build a complete product from the ground up.',service_1_title:'Telegram bots & tools',service_1_body:'Useful bots, admin panels, workflows, and integrations with other services.',service_2_title:'Python automation',service_2_body:'Eliminate repetitive work, process data, and build tailored utilities.',service_3_title:'Websites & dashboards',service_3_body:'Responsive websites, management panels, and polished user interfaces.',service_4_title:'APIs & databases',service_4_body:'Service integrations, data modeling, and system connections.',
    work_kicker:'03 — Selected work',work_title:'Things I’ve <span class="gradient-text">built</span>',work_intro:'Each case study explains the challenge, the approach, and the technology behind the result.',project_pending:'Coming together',project_pending_title:'Selected projects are on the way',project_pending_body:'Published projects will appear here once added from the owner dashboard.',work_note:'Want more details or a similar solution? Send me a message.',work_cta:'Request a project',
    process_kicker:'04 — How we work',process_title:'A collaboration that is <span class="gradient-text">clear and considered</span>',process_intro:'From the first message to final delivery, each stage is visible. We agree on scope and timing before work begins.',step_1_title:'Send a request',step_1_body:'Share the need, goal, and initial details of your project.',step_2_title:'Review & agree',step_2_body:'We define the approach, scope, budget, and estimated timeline.',step_3_title:'Design & build',step_3_body:'Work moves forward in stages, with progress updates along the way.',step_4_title:'Delivery & support',step_4_body:'You receive the final version, files, and usage guidance.',
    feedback_kicker:'05 — Your voice',feedback_title:'Feedback helps make the work <span class="gradient-text">better.</span>',feedback_intro:'Share a review, suggestion, or constructive criticism. Approved feedback is displayed publicly on this page.',feedback_count_label:'published comments',feedback_empty:'No public feedback yet. Be the first to share yours.',field_name:'Name',field_type:'Message type',feedback_kind_review:'Review',feedback_kind_suggestion:'Suggestion',feedback_kind_criticism:'Criticism',field_feedback:'Your feedback',feedback_moderation:'Feedback is published after owner review.',feedback_submit:'Send feedback',
    order_kicker:'06 — Start a collaboration',order_title:'Your next project<br><span class="gradient-text">starts right here.</span>',order_intro:'Tell me what you know about your idea. I’ll review the request and get in touch to discuss the details.',order_aside:'Not every detail figured out yet? That’s fine — an initial brief is enough.',prefer_direct:'Prefer a direct message?',order_form_title:'Project brief',required_fields:'Fields marked with * are required',field_email:'Email',field_telegram:'Telegram username (optional)',field_service:'Project type',select_service:'Choose one...',service_opt_1:'Telegram bot',service_opt_2:'Python automation',service_opt_3:'Website / dashboard',service_opt_4:'API / database',service_opt_other:'Other',field_budget:'Approximate budget',budget_unspecified:'Not sure yet',budget_small:'Lean',budget_medium:'Medium',budget_large:'Flexible / larger',field_deadline:'Expected timeline',deadline_flexible:'Flexible',deadline_urgent:'Urgent',deadline_2weeks:'1–2 weeks',deadline_month:'About a month',field_project_title:'Short project title',field_description:'Description & requirements',field_attachment:'Attachment (optional, any file up to 50 MB)',file_help:'Send images, documents, archives, or any related file. You can also share files in the conversation after submitting.',privacy_consent:'I agree to store this request information for review and follow-up.',order_submit:'Submit project request',privacy_note:'Your contact details and project brief are visible only in the private owner dashboard.',
    contact_kicker:'Contact & support',contact_title:'Have a question?<br><span class="gradient-text">Let’s connect.</span>',contact_intro:'Send a message about support, a potential collaboration, or anything else.',telegram_label:'Private Telegram chat',linkedin_label:'Professional profile',contact_form_title:'Send me a message',contact_private:'Private message',field_subject:'Subject',field_message:'Message',contact_submit:'Send message',final_kicker:'Have an idea in mind?',final_title:'Let’s build something <span>meaningful.</span>',final_cta:'Start a conversation',footer_line:'Building digital solutions with simplicity and usefulness in mind.',back_top:'Back to top ↑',rights:'All rights reserved.',privacy_link:'Privacy',owner_access:'Owner access',footer_made:'Designed and built with care',
    msg_config:'Connect Appwrite in assets/js/config.js to enable forms.',msg_sent:'Your request was submitted. Reference:',msg_feedback_sent:'Your feedback was received and will be published after review.',msg_contact_sent:'Your message was received. Thank you for reaching out.',msg_error:'Could not submit your information. Check your connection and try again.',msg_file:'This file type or size is not allowed.',msg_required:'Please complete all required fields.',msg_load_error:'Some content could not be loaded.',kind_review:'Review',kind_suggestion:'Suggestion',kind_criticism:'Criticism',
    project_view:'View project',project_source:'Source code',project_details:'More details',project_empty:'No projects have been published yet.',service_empty:'New services will be added soon.'
  }
};

let lang = localStorage.getItem('borhansk-language') === 'en' ? 'en' : 'fa';
let profile = null;
const defaultSocial = SITE_CONFIG.social;
const esc = (value='') => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const isSafeUrl = value => { try { const u = new URL(value, location.href); return ['http:','https:'].includes(u.protocol); } catch { return false; } };
const setStatus = (id, message, error=false) => { const node = document.getElementById(id); if (!node) return; node.textContent = message; node.classList.toggle('error', error); };
const value = (fa, en) => lang === 'fa' ? (fa || en || '') : (en || fa || '');

function applyLanguage() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.title = lang === 'fa' ? 'Borhan_SK — رزومه و نمونه‌کار' : 'Borhan_SK — Developer Portfolio';
  $$('[data-i18n]').forEach(el => { const key = el.dataset.i18n; if (copy[lang][key] !== undefined) el.innerHTML = copy[lang][key]; });
  $('.lang-fa')?.classList.toggle('active', lang === 'fa');
  $('.lang-en')?.classList.toggle('active', lang === 'en');
  $('#language-switch')?.setAttribute('aria-label', lang === 'fa' ? 'Switch to English' : 'تغییر زبان به فارسی');
  const desc = $('textarea[name="description"]');
  if (desc) desc.placeholder = lang === 'fa' ? desc.dataset.placeholderFa : desc.dataset.placeholderEn;
  $('#mobile-menu')?.setAttribute('aria-label', lang === 'fa' ? 'باز کردن منو' : 'Open navigation');
  renderServices(window._services || []);
  renderProjects(window._projects || []);
  renderFeedback(window._feedback || []);
}

$('#language-switch').addEventListener('click', () => {
  lang = lang === 'fa' ? 'en' : 'fa';
  localStorage.setItem('borhansk-language', lang);
  applyLanguage();
  if (profile) setSocialLinks(profile);
});
$('#year').textContent = new Date().getFullYear();
$('#mobile-menu').addEventListener('click', () => {
  const open = $('#main-nav').classList.toggle('open');
  $('#mobile-menu').setAttribute('aria-expanded', String(open));
});
$('#main-nav').addEventListener('click', event => { if (event.target.closest('a')) { $('#main-nav').classList.remove('open'); $('#mobile-menu').setAttribute('aria-expanded','false'); } });

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
$$('.reveal').forEach(el => observer.observe(el));
const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { $$('.main-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)); } }), { rootMargin: '-35% 0px -55% 0px' });
$$('main section[id]').forEach(section => navObserver.observe(section));

function setSocialLinks(s = {}) {
  const storedTelegram = String(s.telegram_url || '');
  const personalTelegram = storedTelegram.includes('Borhan_SK_bot') ? defaultSocial.telegram : (storedTelegram || defaultSocial.telegram);
  const links = { telegram: personalTelegram, linkedin: s.linkedin_url || defaultSocial.linkedin };
  const map = [['telegram-link-inline',links.telegram],['linkedin-link-inline',links.linkedin],['telegram-card',links.telegram],['linkedin-card',links.linkedin]];
  for (const [id, url] of map) { const el = document.getElementById(id); if (!el) continue; if (isSafeUrl(url) && !url.includes('YOUR_')) { el.href = url; el.hidden = false; } else { el.hidden = true; } }
  const email = s.email || defaultSocial.email; const mail = $('#email-card'); if (mail) { const validEmail = Boolean(email && !email.includes('YOUR_') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)); mail.hidden = !validEmail; if (validEmail) mail.href = `mailto:${email}`; }
  const resume = $('#resume-link'); if (resume && s.resume_url && isSafeUrl(s.resume_url)) { resume.href = s.resume_url; resume.hidden = false; } else if (resume) resume.hidden = true;
  if (s.headline_fa || s.headline_en) { const headline = $('#hero-headline'); if (headline) headline.innerHTML = esc(value(s.headline_fa,s.headline_en)).replace(/\n/g,'<br>'); }
  if (s.bio_fa || s.bio_en) { const bio = value(s.bio_fa,s.bio_en); if ($('#hero-bio')) $('#hero-bio').textContent = bio; if ($('#about-bio')) $('#about-bio').textContent = bio; }
  if (s.location_fa || s.location_en) $('#profile-location').textContent = value(s.location_fa,s.location_en);
  if (s.focus_fa || s.focus_en) $('#profile-focus').textContent = value(s.focus_fa,s.focus_en);
  renderSkillLists(value(s.skills_fa,s.skills_en));
}

function renderSkillLists(raw) {
  const skills = String(raw || '').split(',').map(x => x.trim()).filter(Boolean).slice(0, 24);
  const focus = $('#focus-skills-list');
  const list = $('#skills-list');
  if (focus && skills.length) focus.innerHTML = skills.map((item, i) => `${i ? '<b aria-hidden="true">✳</b>' : ''}<span>${esc(item)}</span>`).join('');
  if (list && skills.length) list.innerHTML = skills.map(item => `<span>${esc(item)}</span>`).join('');
}

function renderServices(rows) {
  const grid = $('#services-grid'); if (!grid) return;
  if (!rows.length) { if (configured) grid.innerHTML = `<div class="empty-note">${esc(copy[lang].service_empty)}</div>`; return; }
  grid.innerHTML = rows.map((r, i) => `<article class="service-card"><span class="service-number">${String(i+1).padStart(2,'0')}</span><div class="service-icon">${esc(r.icon || '✦')}</div><h3>${esc(value(r.title_fa,r.title_en))}</h3><p>${esc(value(r.description_fa,r.description_en))}</p><span class="service-arrow">↗</span></article>`).join('');
}
function renderProjects(rows) {
  const grid = $('#projects-grid'); if (!grid) return;
  if (!rows.length) { grid.innerHTML = `<article class="project-placeholder"><div class="placeholder-visual visual-one"><span>01</span><b>Portfolio</b></div><div class="placeholder-copy"><small>${esc(copy[lang].project_pending)}</small><h3>${esc(copy[lang].project_pending_title)}</h3><p>${esc(copy[lang].project_pending_body)}</p></div></article>`; return; }
  grid.innerHTML = rows.map((r, i) => {
    const title = value(r.title_fa,r.title_en), summary = value(r.summary_fa,r.summary_en);
    const visual = r.cover_url && isSafeUrl(r.cover_url) ? `<img src="${esc(r.cover_url)}" alt="${esc(title)}" loading="lazy">` : `<div class="project-symbol">${esc(r.icon || '✦')}</div>`;
    const tags = (r.stack || []).slice(0,7).map(tag => `<span>${esc(tag)}</span>`).join('');
    const details = value(r.description_fa,r.description_en);
    const links = `${r.project_url && isSafeUrl(r.project_url) ? `<a href="${esc(r.project_url)}" target="_blank" rel="noopener">${esc(copy[lang].project_view)} ↗</a>` : ''}${r.repo_url && isSafeUrl(r.repo_url) ? `<a href="${esc(r.repo_url)}" target="_blank" rel="noopener">${esc(copy[lang].project_source)} ↗</a>` : ''}`;
    return `<article class="project-card"><div class="project-visual">${visual}</div><div class="project-copy"><div class="project-topline"><span>${esc(r.category || 'PROJECT')}</span><span>${String(i+1).padStart(2,'0')}</span></div><h3>${esc(title)}</h3><p>${esc(summary)}</p>${details ? `<details class="project-details"><summary>${esc(copy[lang].project_details)}</summary><p>${esc(details)}</p></details>` : ''}<div class="tag-list">${tags}</div>${links ? `<div class="project-links">${links}</div>` : ''}</div></article>`;
  }).join('');
}
function renderFeedback(rows) {
  const list = $('#feedback-list'); if (!list) return;
  $('#feedback-count').textContent = String(rows.length).padStart(2,'0');
  if (!rows.length) { list.innerHTML = `<div class="empty-note">${esc(copy[lang].feedback_empty)}</div>`; return; }
  list.innerHTML = rows.map(r => `<article class="feedback-item"><div class="feedback-item-head"><b>${esc(r.name)}</b><span>${esc(copy[lang][`kind_${r.kind}`] || copy[lang].kind_review)}</span></div><p>${esc(r.message)}</p></article>`).join('');
}

async function loadPublicContent() {
  if (!appwrite) { setSocialLinks(); return; }
  try {
    const [p,s,w,f] = await Promise.all([
      appwrite.from('site_profile').select('*').eq('id', true).maybeSingle(),
      appwrite.from('services').select('*').eq('is_published', true).order('sort_order'),
      appwrite.from('projects').select('*').eq('is_published', true).order('sort_order'),
      appwrite.from('feedback').select('id,name,message,kind,created_at').eq('status','approved').order('created_at',{ascending:false}).limit(12)
    ]);
    if (p.error) throw p.error; profile = p.data;
    window._services = s.error ? [] : (s.data || []); window._projects = w.error ? [] : (w.data || []); window._feedback = f.error ? [] : (f.data || []);
    applyLanguage(); setSocialLinks(profile || {});
  } catch (err) { console.warn('Public content load failed:', err); setSocialLinks(); }
}

function showFormMessage(id, message, error=false) { setStatus(id, message, error); }
function requireBackend(id) { if (appwrite) return true; showFormMessage(id, copy[lang].msg_config, true); return false; }
function randomCode() { return `SK-${crypto.randomUUID().replaceAll('-','').slice(0,8).toUpperCase()}`; }
function cleanFilename(name) { return name.normalize('NFKD').replace(/[^\w.-]+/g,'_').slice(-90) || 'attachment'; }
function formatBytes(bytes) {
  if (!Number.isFinite(Number(bytes)) || Number(bytes) <= 0) return '';
  const units = ['B','KB','MB','GB']; let size = Number(bytes), i = 0;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(i ? 1 : 0)} ${units[i]}`;
}
const CUSTOMER_ORDERS_KEY = 'borhansk-customer-orders-v1';
let activeCustomerOrder = null;
let customerGuest = null;
let customerPoll = null;
const customerOrders = () => { try { const rows = JSON.parse(localStorage.getItem(CUSTOMER_ORDERS_KEY) || '[]'); return Array.isArray(rows) ? rows : []; } catch { return []; } };
function saveCustomerOrder(order) {
  const rows = customerOrders().filter(item => item.id !== order.id);
  rows.unshift({ id:order.id, code:order.code, title:order.title, createdAt:order.createdAt || new Date().toISOString() });
  localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(rows.slice(0, 10)));
}
function renderCustomerChatShell() {
  const panel = $('#customer-chat-panel');
  const rows = customerOrders();
  panel.hidden = false;
  panel.innerHTML = `<div class="chat-heading"><div><span class="chat-eyebrow">${lang === 'fa' ? 'گفت‌وگوی خصوصی سفارش' : 'PRIVATE PROJECT CONVERSATION'}</span><h3>${lang === 'fa' ? 'در ارتباط مستقیم بمانیم' : 'Let’s keep everything in one place'}</h3><p>${lang === 'fa' ? 'پیام‌ها و فایل‌های این سفارش فقط برای شما و مالک سایت قابل مشاهده است.' : 'Only you and the site owner can access this order conversation.'}</p></div><span class="chat-live-dot">${lang === 'fa' ? 'گفت‌وگو' : 'CHAT'}</span></div>
    ${rows.length > 1 ? `<label class="chat-order-switch"><span>${lang === 'fa' ? 'گفت‌وگوی سفارش' : 'Order conversation'}</span><select id="customer-order-switch">${rows.map(r => `<option value="${esc(r.id)}" ${activeCustomerOrder?.id === r.id ? 'selected' : ''}>${esc(r.code)} · ${esc(r.title)}</option>`).join('')}</select></label>` : ''}
    <div class="chat-order-meta" id="customer-chat-meta"></div><div class="chat-messages" id="customer-chat-messages" aria-live="polite"><div class="chat-empty">${lang === 'fa' ? 'در حال بارگذاری گفت‌وگو…' : 'Loading conversation…'}</div></div>
    <form class="chat-composer" id="customer-chat-form"><textarea name="message" rows="3" maxlength="8000" placeholder="${lang === 'fa' ? 'پیام خود را بنویسید…' : 'Write your message…'}"></textarea><div class="chat-composer-bottom"><label class="chat-attach-button"><input name="files" type="file" multiple hidden><span>＋ ${lang === 'fa' ? 'افزودن فایل' : 'Attach files'}</span></label><small>${lang === 'fa' ? 'حداکثر ۵ فایل در هر پیام · هر فایل تا ۵۰ مگابایت' : 'Up to 5 files per message · 50 MB each'}</small><button class="button button-primary button-small" type="submit">${lang === 'fa' ? 'ارسال پیام' : 'Send message'} ↗</button></div><div class="chat-selected-files" id="customer-chat-selected-files"></div><div class="form-status" id="customer-chat-status" role="status" aria-live="polite"></div></form>
    <p class="chat-footnote">${lang === 'fa' ? 'برای دیدن تاریخچه، همین مرورگر و اطلاعات سایت را نگه دارید. پاک‌شدن داده‌های مرورگر یا پایان نشست مهمان ممکن است دسترسی دوباره را ناممکن کند.' : 'Keep using this browser to revisit the conversation. Clearing browser data or losing the guest session may make it unrecoverable.'}</p>`;
  $('#customer-order-switch')?.addEventListener('change', async e => { const selected = rows.find(r => r.id === e.target.value); if (selected) { activeCustomerOrder = selected; await refreshCustomerChat(); } });
  const fileInput = $('#customer-chat-form input[name="files"]');
  fileInput.addEventListener('change', () => {
    const chosen = [...fileInput.files];
    $('#customer-chat-selected-files').textContent = chosen.length ? chosen.map(f => `${f.name} (${formatBytes(f.size)})`).join(' · ') : '';
  });
  $('#customer-chat-form').addEventListener('submit', sendCustomerMessage);
  panel.querySelectorAll('[data-chat-file]').forEach(button => button.addEventListener('click', () => openCustomerChatFile(button.dataset.messageId, button.dataset.fileId)));
}
function renderChatMessages(root, messages, currentId) {
  if (!messages.length) { root.innerHTML = `<div class="chat-empty">${lang === 'fa' ? 'هنوز پیامی در این گفت‌وگو نیست. اولین پیام را ارسال کنید.' : 'No messages yet. Send the first message.'}</div>`; return; }
  root.innerHTML = messages.map(m => `<article class="chat-message ${m.sender_role === 'customer' ? 'mine' : 'theirs'}"><div class="chat-message-head"><b>${esc(m.sender_role === 'customer' ? (lang === 'fa' ? 'شما' : 'You') : (lang === 'fa' ? 'برهان · مالک' : 'Borhan · Owner'))}</b><time>${esc(new Date(m.created_at).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US'))}</time></div>${m.body ? `<p>${esc(m.body).replace(/\n/g,'<br>')}</p>` : ''}${m.attachments?.length ? `<div class="chat-attachments">${m.attachments.map(f => `<button type="button" class="chat-file" data-chat-file="1" data-message-id="${esc(m.id)}" data-file-id="${esc(f.id)}"><span>↗</span><span>${esc(f.name)}</span><small>${esc(formatBytes(f.size))}</small></button>`).join('')}</div>` : ''}</article>`).join('');
  root.querySelectorAll('[data-chat-file]').forEach(button => button.addEventListener('click', () => openCustomerChatFile(button.dataset.messageId, button.dataset.fileId)));
  root.scrollTop = root.scrollHeight;
}
async function openCustomerChatFile(messageId, fileId) {
  const tab = window.open('about:blank', '_blank');
  try { const result = await appwrite.chat.call({ action:'file_link', orderId:activeCustomerOrder.id, messageId, fileId }); if (tab) tab.location.href = result.url; else location.href = result.url; }
  catch (error) { if (tab) tab.close(); console.error(error); toast(lang === 'fa' ? 'بازکردن فایل ممکن نشد؛ دوباره تلاش کن.' : 'Could not open this file. Please try again.'); }
}
async function refreshCustomerChat() {
  if (!activeCustomerOrder) return;
  try {
    const result = await appwrite.chat.call({ action:'list', orderId:activeCustomerOrder.id });
    const root = $('#customer-chat-messages'); if (root) renderChatMessages(root, result.rows || [], customerGuest?.$id);
    const meta = $('#customer-chat-meta'); if (meta) meta.textContent = `${lang === 'fa' ? 'کد پیگیری' : 'Reference'}: ${activeCustomerOrder.code} · ${activeCustomerOrder.title}`;
    $('#customer-chat-status').textContent = '';
  } catch (error) {
    console.error(error);
    const root = $('#customer-chat-messages'); if (root) root.innerHTML = `<div class="chat-empty error">${esc(lang === 'fa' ? 'دسترسی به این گفت‌وگو برقرار نشد. ممکن است نشست مهمان منقضی شده باشد؛ این گفت‌وگو را فقط با همان مرورگر و نشست قبلی می‌توان بازیابی کرد.' : 'This conversation could not be accessed. The guest session may have expired; the conversation can only be recovered with the original browser session.')}</div>`;
  }
}
async function openCustomerChat(order) {
  activeCustomerOrder = order;
  try { customerGuest = customerGuest || await appwrite.chat.ensureGuestSession(); }
  catch (error) { console.error(error); showFormMessage('order-status', lang === 'fa' ? 'ساخت نشست گفت‌وگو ممکن نشد. تنظیم Anonymous Sessions در Appwrite را بررسی کن.' : 'Could not start the chat session. Check Anonymous Sessions in Appwrite.', true); return; }
  renderCustomerChatShell();
  await refreshCustomerChat();
  if (customerPoll) clearInterval(customerPoll);
  customerPoll = setInterval(() => { if (!document.hidden && activeCustomerOrder) refreshCustomerChat(); }, 6000);
  $('#customer-chat-panel').scrollIntoView({ behavior:'smooth', block:'start' });
}
async function sendCustomerMessage(event) {
  event.preventDefault();
  const form = event.currentTarget, status = $('#customer-chat-status'), button = $('button[type="submit"]', form);
  const message = String(new FormData(form).get('message') || '').trim();
  const files = [...form.elements.files.files];
  if (!message && !files.length) { status.textContent = lang === 'fa' ? 'یک پیام بنویس یا فایلی انتخاب کن.' : 'Write a message or attach a file.'; return; }
  if (files.length > 5 || files.some(f => f.size > SITE_CONFIG.maxUploadBytes)) { status.textContent = lang === 'fa' ? 'حداکثر ۵ فایل و حجم هر فایل ۵۰ مگابایت است.' : 'Up to 5 files; each file can be 50 MB.'; return; }
  button.disabled = true; status.textContent = lang === 'fa' ? 'در حال ارسال…' : 'Sending…';
  const uploadedIds = [];
  try {
    customerGuest = customerGuest || await appwrite.chat.ensureGuestSession();
    const attachments = [];
    for (const file of files) { const attachment = await appwrite.chat.uploadFile(file, customerGuest.$id); attachments.push(attachment); uploadedIds.push(attachment.id); }
    await appwrite.chat.call({ action:'send', orderId:activeCustomerOrder.id, message, attachments });
    form.reset(); $('#customer-chat-selected-files').textContent = ''; status.textContent = '';
    await refreshCustomerChat();
  } catch (error) { if (uploadedIds.length) { try { await appwrite.storage.from('client-uploads').remove(uploadedIds); } catch {} } console.error(error); status.textContent = error.message || (lang === 'fa' ? 'ارسال پیام انجام نشد.' : 'Message could not be sent.'); }
  finally { button.disabled = false; }
}

$('#order-form').addEventListener('submit', async event => {
  event.preventDefault(); const form = event.currentTarget; const status = 'order-status';
  if (!requireBackend(status)) return;
  const data = new FormData(form); const file = data.get('attachment');
  if (String(data.get('website') || '').trim()) return;
  if (!data.get('consent') || !data.get('name') || !data.get('email') || !data.get('title') || String(data.get('description')).trim().length < 20) { showFormMessage(status,copy[lang].msg_required,true); return; }
  if (file && file.size && file.size > SITE_CONFIG.maxUploadBytes) { showFormMessage(status,copy[lang].msg_file,true); return; }
  const button = $('button[type="submit"]', form); button.disabled = true; button.dataset.old = button.innerHTML; button.textContent = lang === 'fa' ? 'در حال ثبت سفارش…' : 'Submitting…';
  let uploadedFileId = null;
  try {
    const guest = await appwrite.chat.ensureGuestSession(); customerGuest = guest;
    let attachment = null;
    if (file && file.size) { attachment = await appwrite.chat.uploadFile(file, guest.$id); uploadedFileId = attachment.id; }
    const code = randomCode();
    const { data: created, error } = await appwrite.from('orders').insert({
      public_code:code,client_name:String(data.get('name')).trim(),email:String(data.get('email')).trim(),
      telegram:String(data.get('telegram') || '').trim(),service_key:data.get('service'),budget_key:data.get('budget'),
      deadline_key:data.get('deadline'),title:String(data.get('title')).trim(),description:String(data.get('description')).trim(),
      locale:lang,attachment_path:attachment?.id || null,customer_user_id:guest.$id
    });
    if (error) throw error;
    const savedOrder = { id:created.id, code, title:String(data.get('title')).trim(), createdAt:created.created_at || new Date().toISOString() };
    saveCustomerOrder(savedOrder);
    try { await appwrite.chat.call({ action:'send', orderId:savedOrder.id, message:String(data.get('description')).trim(), attachments:attachment ? [attachment] : [] }); }
    catch (chatError) { console.error('Initial order chat message failed:',chatError); }
    form.reset(); showFormMessage(status,`${copy[lang].msg_sent} ${code}`); toast(`${copy[lang].msg_sent} ${code}`);
    await openCustomerChat(savedOrder);
  } catch (err) {
    console.error('Order submission failed:',err);
    if (uploadedFileId) { try { await appwrite.storage.from('client-uploads').remove([uploadedFileId]); } catch {} }
    showFormMessage(status,err.message || copy[lang].msg_error,true);
  } finally { button.disabled = false; button.innerHTML = button.dataset.old || copy[lang].order_submit; }
});

// Restore the last conversation on the same browser session when available.
if (appwrite && customerOrders().length) {
  const recentOrder = customerOrders()[0];
  appwrite.chat.ensureGuestSession().then(user => { customerGuest = user; return openCustomerChat(recentOrder); }).catch(error => console.warn('Could not restore customer chat:',error));
}

$('#feedback-form').addEventListener('submit', async event => {
  event.preventDefault(); const form = event.currentTarget; if (!requireBackend('feedback-status')) return;
  const d = new FormData(form); if (String(d.get('website') || '').trim()) return; const msg = String(d.get('message') || '').trim();
  if (msg.length < 8) { showFormMessage('feedback-status',copy[lang].msg_required,true); return; }
  const button = $('button[type="submit"]',form); button.disabled = true;
  try {
    const { error } = await appwrite.from('feedback').insert({name:String(d.get('name')).trim(),kind:d.get('kind'),message:msg,locale:lang,status:'pending'});
    if (error) throw error; form.reset(); showFormMessage('feedback-status',copy[lang].msg_feedback_sent);
  } catch (err) { console.error(err); showFormMessage('feedback-status',copy[lang].msg_error,true); }
  finally { button.disabled = false; }
});

$('#contact-form').addEventListener('submit', async event => {
  event.preventDefault(); const form = event.currentTarget; if (!requireBackend('contact-status')) return;
  const d = new FormData(form); if (String(d.get('website') || '').trim()) return; const button = $('button[type="submit"]',form); button.disabled = true;
  try {
    const { error } = await appwrite.from('contact_messages').insert({name:String(d.get('name')).trim(),email:String(d.get('email')).trim(),subject:String(d.get('subject')).trim(),message:String(d.get('message')).trim(),locale:lang,status:'new'});
    if (error) throw error; form.reset(); showFormMessage('contact-status',copy[lang].msg_contact_sent);
  } catch (err) { console.error(err); showFormMessage('contact-status',copy[lang].msg_error,true); }
  finally { button.disabled = false; }
});

let toastTimer;
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'),4500); }
window.addEventListener('online', () => toast(lang === 'fa' ? 'اتصال اینترنت برقرار شد.' : 'You are back online.'));
applyLanguage();
loadPublicContent();
