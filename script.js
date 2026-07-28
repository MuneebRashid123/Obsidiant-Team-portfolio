// ---------- header scroll state ----------
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30));

// ---------- auto hero banner slider ----------
const hbsTrack = document.getElementById('hbsTrack');
const hbsSlides = document.querySelectorAll('.hbs-slide');
const hbsDotsWrap = document.getElementById('hbsDots');
const hbsPrev = document.getElementById('hbsPrev');
const hbsNext = document.getElementById('hbsNext');
const bannerSlider = document.getElementById('bannerSlider');
let hbsIndex = 0;
hbsSlides.forEach((s, i) => {
  const dot = document.createElement('div');
  dot.className = 'hbs-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  hbsDotsWrap.appendChild(dot);
});
function goToSlide(i) {
  hbsIndex = (i + hbsSlides.length) % hbsSlides.length;
  hbsTrack.style.transform = `translateX(-${hbsIndex * 100}%)`;
  hbsDotsWrap.querySelectorAll('.hbs-dot').forEach((d, di) => d.classList.toggle('active', di === hbsIndex));
}
hbsNext.addEventListener('click', () => goToSlide(hbsIndex + 1));
hbsPrev.addEventListener('click', () => goToSlide(hbsIndex - 1));
let hbsTimer = setInterval(() => goToSlide(hbsIndex + 1), 4500);
bannerSlider.addEventListener('mouseenter', () => clearInterval(hbsTimer));
bannerSlider.addEventListener('mouseleave', () => { hbsTimer = setInterval(() => goToSlide(hbsIndex + 1), 4500); });

// ---------- announcement banner ----------
const announceBar = document.getElementById('announceBar');
const announceClose = document.getElementById('announceClose');
const announceSpans = document.querySelectorAll('#announceTrack span');
let announceIdx = 0;
if (announceSpans.length > 1) {
  setInterval(() => {
    announceSpans[announceIdx].classList.remove('active');
    announceIdx = (announceIdx + 1) % announceSpans.length;
    announceSpans[announceIdx].classList.add('active');
  }, 4000);
}
announceClose.addEventListener('click', () => {
  announceBar.classList.add('dismissed');
  document.body.classList.add('banner-dismissed');
});

// ---------- mobile nav ----------
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle.addEventListener('click', () => navList.classList.toggle('open'));

// ---------- nav click: smooth scroll with header offset ----------
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', (e) => {
  const targetEl = document.querySelector(l.getAttribute('href'));
  navList.classList.remove('open');
  if (targetEl) {
    e.preventDefault();
    const headerH = header.offsetHeight + 14;
    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}));

// ---------- active link on scroll ----------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(s => navObserver.observe(s));

// ---------- cursor spotlight in hero ----------
const cursorGlow = document.getElementById('cursorGlow');
const heroSection = document.querySelector('.hero');
if (window.matchMedia('(pointer: fine)').matches) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    cursorGlow.style.left = (e.clientX - rect.left) + 'px';
    cursorGlow.style.top = (e.clientY - rect.top) + 'px';
    cursorGlow.style.opacity = '1';
  });
  heroSection.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
}

// ---------- hero ticker (typewriter through the six pillars) ----------
const heroPillars = ["Web & Business Systems", "HR & Talent Operations", "Supply Chain & Analytics", "Branding & Performance Marketing", "Customer Service & Sales", "Social Media & Content"];
const heroTickerEl = document.getElementById('heroTicker');
if (heroTickerEl) {
  let hpIdx = 0, hpChar = 0, hpDeleting = false;
  function tickerLoop() {
    const current = heroPillars[hpIdx];
    if (!hpDeleting) {
      hpChar++;
      heroTickerEl.textContent = current.slice(0, hpChar);
      if (hpChar === current.length) { hpDeleting = true; setTimeout(tickerLoop, 1300); return; }
    } else {
      hpChar--;
      heroTickerEl.textContent = current.slice(0, hpChar);
      if (hpChar === 0) { hpDeleting = false; hpIdx = (hpIdx + 1) % heroPillars.length; }
    }
    setTimeout(tickerLoop, hpDeleting ? 35 : 65);
  }
  tickerLoop();
}

// ---------- network graphic tilt (desktop only) ----------
const networkWrap = document.getElementById('networkWrap');
if (networkWrap && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    networkWrap.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
  });
  heroSection.addEventListener('mouseleave', () => { networkWrap.style.transform = 'perspective(900px) rotateX(0) rotateY(0)'; });
}

// ---------- counter animation ----------
function animateCounter(el, target, duration) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(p * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function setupCounterGroup(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const els = container.querySelectorAll('.stat-live');
  let fired = false;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !fired) {
        fired = true;
        els.forEach(el => animateCounter(el, parseInt(el.dataset.target, 10), 1100));
      }
    });
  }, { threshold: 0.35 });
  obs.observe(container);
}
setupCounterGroup('statsGrid');
setupCounterGroup('resultsGrid');

// ---------- scroll reveal ----------
const revealTargets = document.querySelectorAll('.section-title, .section-tag, .service-card, .team-card, .industry-tile, .process-step, .faq-item, .vision-card, .result-card, .tool-tile, .case-card, .hunza-highlight, .builder-wrap, .whyus-card, .whyus-cta, .ai-card');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in-view'), i * 50);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
revealTargets.forEach(t => revealObserver.observe(t));

// ---------- service / team card tilt (desktop only) ----------
if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -7;
      const rotateY = ((x / rect.width) - 0.5) * 7;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)'; });
  });
}

// ---------- testimonial carousel ----------
const testSlides = document.querySelectorAll('.test-slide');
const testDotsWrap = document.getElementById('testDots');
let testIndex = 0;
testSlides.forEach((s, i) => {
  const dot = document.createElement('div');
  dot.className = 'test-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => showTestSlide(i));
  testDotsWrap.appendChild(dot);
});
function showTestSlide(i) {
  testSlides[testIndex].classList.remove('active');
  testDotsWrap.children[testIndex].classList.remove('active');
  testIndex = i;
  testSlides[testIndex].classList.add('active');
  testDotsWrap.children[testIndex].classList.add('active');
}
let testTimer = setInterval(() => showTestSlide((testIndex + 1) % testSlides.length), 5000);

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if (other !== item) { other.classList.remove('open'); other.querySelector('.faq-a').style.maxHeight = null; }
    });
    if (isOpen) { item.classList.remove('open'); a.style.maxHeight = null; }
    else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

// ---------- back to top ----------
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => backTop.classList.toggle('show', window.scrollY > 700));
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- scroll progress bar ----------
const progressBar = document.getElementById('progressBar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress);
updateProgress();

// ---------- preloader (progress bar) ----------
const preloader = document.getElementById('preloader');
const preloaderFill = document.getElementById('preloaderFill');
const preloaderPercent = document.getElementById('preloaderPercent');
function hidePreloader() { preloader.classList.add('hidden'); }
function runPreloaderBar(duration) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const pct = Math.floor(p * 100);
    preloaderFill.style.width = pct + '%';
    preloaderPercent.textContent = pct + '%';
    if (p < 1) requestAnimationFrame(step);
    else setTimeout(hidePreloader, 250);
  }
  requestAnimationFrame(step);
}
runPreloaderBar(document.readyState === 'complete' ? 900 : 1400);
setTimeout(() => { preloaderFill.style.width = '100%'; preloaderPercent.textContent = '100%'; hidePreloader(); }, 2200);

// ---------- team member detail ("next page") ----------
// ---------- portfolio data (real projects only) ----------
const portfolioItems = [
  { member: "muneeb", title: "Hunza Candle — ERP/CRM/HR System", desc: "Single-file web app covering order pipeline management, inventory tracking, WhatsApp-integrated lead management, and a dual-view HR module for admins and employees.", tags: ["React", "Node.js", "WhatsApp API"], icon: "🧩" },
  { member: "muneeb", title: "Hunza Candle — Attendance System", desc: "Role-based attendance system with separate admin/employee logins and a photo-capture check-in workflow requiring admin approval.", tags: ["Node.js", "RBAC"], icon: "🕒" },
  { member: "muneeb", title: "MAISON", desc: "Luxury furniture e-commerce site with authentication, product modals, wishlist/cart, an admin panel, and a full WhatsApp/email checkout flow.", tags: ["React", "EmailJS", "WhatsApp"], icon: "🛋️" },
  { member: "muneeb", title: "VELORA", desc: "Fragrance brand storefront modeled on Autoscent Pakistan — Shopify-style checkout, Cash on Delivery, bundle discounts, and WhatsApp order messages.", tags: ["E-commerce", "COD"], icon: "🧴" },
  { member: "muneeb", title: "Mano Beaded Bracelets", desc: "Jewelry storefront with an animated loader, filterable product grid, and WhatsApp cart integration.", tags: ["JavaScript", "WhatsApp"], icon: "📿" },
  { member: "muneeb", title: "AI Outbound Call Agent", desc: "Node.js/Express prototype using Twilio Voice and Claude for conversation logic, with calling-hours enforcement, do-not-call list management, and AI disclosure safeguards.", tags: ["Node.js", "Twilio", "Claude"], icon: "📞" },
  { member: "hafsa", title: "Recruitment & Onboarding Pipeline", desc: "End-to-end HR pipeline — sourcing through LinkedIn, screening, and onboarding processed through Oracle HRMS, with payroll and orientation sorted before day one.", tags: ["Oracle HRMS", "LinkedIn"], icon: "🧑‍💼" },
  { member: "hafsa", title: "Sales & Marketing Outreach Coordination", desc: "Coordinated marketing outreach and sales follow-up across multiple locations, sourcing leads and maintaining clear client communication.", tags: ["Lead Sourcing", "Client Handoff"], icon: "📋" },
  { member: "abdul", title: "Toyota Hyderabad Motors — DMS Operations", desc: "Operated the Dealer Management System for service records and spare-part inventory tracking, streamlining booking and warranty claim workflows.", tags: ["DMS", "Inventory"], icon: "🚗" },
  { member: "abdul", title: "Hunza Candle — Logistics Dashboards", desc: "Built Excel and Power BI dashboards tracking sales KPIs and logistics performance for B2B order fulfillment.", tags: ["Power BI", "Excel"], icon: "📊" },
  { member: "abdul", title: "Fix It on Wheels — Feasibility Study", desc: "Data-driven feasibility analysis for a mobile car service startup — route planning models, cost projections, and a last-mile logistics framework.", tags: ["Python", "Route Planning"], icon: "🔧" },
  { member: "irtaza", title: "Private School Enrollment Campaign", desc: "Redesigned prospectus, campus visuals, and local enrollment ads for a school — inquiries picked up within the first month.", tags: ["Branding", "Meta Ads"], icon: "🎓" },
  { member: "irtaza", title: "Restaurant Reels & Hyper-Local Ads", desc: "Menu photography, Instagram/TikTok storyboards, and hyper-local Meta Ads to drive reservations and delivery orders.", tags: ["Content", "Meta Ads"], icon: "🍽️" },
  { member: "irtaza", title: "Healthcare Booking Funnel", desc: "Trust-building content and a streamlined appointment funnel for a specialty clinic, cutting front-desk call volume.", tags: ["Booking Funnels", "Healthcare"], icon: "🏥" },
  { member: "duaa", title: "Deelab — Customer Service & Campaigns", desc: "Managed customer communication, order processing, and digital marketing campaigns for a fragrance brand.", tags: ["Customer Support", "Campaigns"], icon: "🌸" },
  { member: "duaa", title: "Hunza Candle — Customer Handling", desc: "Customer service and order coordination alongside promotional campaign support.", tags: ["Order Coordination"], icon: "🕯️" },
  { member: "husnain", title: "Zarvangi Bespoke — Social Media", desc: "Content planning and platform management for a bespoke fashion brand.", tags: ["Social Media", "Canva"], icon: "👔" },
  { member: "husnain", title: "Grocery Ghar — Meta Ads & Content", desc: "Campaign creatives and audience engagement for a grocery delivery brand.", tags: ["Meta Ads", "Content"], icon: "🛒" },
  { member: "husnain", title: "Multi-Brand Shopify & SEO Support", desc: "Shopify store management and on-page SEO across several e-commerce clients including Netmatico and Asasa.", tags: ["Shopify", "SEO"], icon: "🛍️" }
];

const memberLabels = { muneeb: "Muneeb", hafsa: "Hafsa", abdul: "Abdul Raheem", irtaza: "Irtaza", duaa: "Duaa", husnain: "Husnain" };

function renderPortfolio(filter) {
  const grid = document.getElementById('portfolioGrid');
  const filtered = filter === 'all' ? portfolioItems : portfolioItems.filter(p => p.member === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="portfolio-item">
      <div class="portfolio-thumb"><span class="thumb-icon">${p.icon}</span><span class="member-badge">${memberLabels[p.member]}</span></div>
      <div class="portfolio-body">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="portfolio-owner"><div class="mini-avatar">${p.member.slice(0,2).toUpperCase()}</div>${memberLabels[p.member]}</div>
      </div>
    </div>
  `).join('');
  const items = grid.querySelectorAll('.portfolio-item');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 40);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(it => obs.observe(it));
}
renderPortfolio('all');
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPortfolio(btn.dataset.filter);
  });
});

// ---------- team member detail ("next page") ----------
const teamData = {
  muneeb: {
    name: "Muneeb", avatar: "MN", role: "Full-Stack Developer", location: "Pakistan",
    bio: "Full-stack developer based in Pakistan, spending most of his time building software for local brands — storefronts with WhatsApp ordering and Cash on Delivery, internal ERP/CRM tools, and the integrations that connect them. Cares about the unglamorous details: correct WhatsApp number formatting, inventory that doesn't drift, forms that actually validate — the kind of detail that decides whether a system survives contact with a real business.",
    experience: [
      { title: "Hunza Candle — ERP/CRM/HR System", period: "Ongoing", desc: "Single-file ERP/CRM/HR web app covering order pipeline management, inventory tracking, and WhatsApp-integrated lead management, plus a dual-view HR module for admins and employees." },
      { title: "Hunza Candle — Attendance System", period: "Ongoing", desc: "Separate attendance management system with role-based access control and a photo-capture check-in workflow requiring admin approval." },
      { title: "MAISON, VELORA & Mano Beaded Bracelets", period: "Ongoing", desc: "E-commerce storefronts with authentication, cart/wishlist, admin panels, and WhatsApp checkout — spanning luxury furniture, fragrance, and jewelry brands." }
    ],
    skillTags: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "WhatsApp Business API", "Twilio", "PostgreSQL"],
    tools: ["JavaScript", "Node.js", "React", "MongoDB", "Express", "WhatsApp Business API", "Twilio", "PostgreSQL", "Git"],
    education: "BE, Mehran University of Engineering and Technology, Jamshoro",
    certifications: ["Google AI Essentials", "Cisco — Introduction to HTML, CSS & JavaScript"],
    brands: ["Hunza Candle", "MAISON", "VELORA", "Mano Beaded Bracelets"],
    brandEngagements: [
      { brand: "Hunza Candle", role: "ERP/CRM/HR system + attendance system", where: "Remote — full-stack build" },
      { brand: "MAISON", role: "Luxury furniture storefront (auth, cart, admin panel, WhatsApp checkout)", where: "Remote — full-stack build" },
      { brand: "VELORA", role: "Fragrance storefront (Shopify-style checkout, COD, WhatsApp orders)", where: "Remote — full-stack build" },
      { brand: "Mano Beaded Bracelets", role: "Jewelry storefront (product grid, WhatsApp cart)", where: "Remote — full-stack build" }
    ],
    portfolioLink: "https://muneeb-portfolio-qeuh.vercel.app/",
    email: "muneeb@example.com", whatsapp: "923000000000"
  },
  hafsa: {
    name: "Hafsa Shaikh", avatar: "HS", role: "HR, Recruitment & Client Relations", location: "Karachi, Pakistan",
    bio: "Results-driven HR professional with 3+ years across HR operations, recruitment, payroll, and compliance — combined with hands-on sales coordination, client relations, and marketing outreach. Day to day, that means running end-to-end recruitment and onboarding, keeping payroll and attendance accurate in Oracle HRMS, and making sure policy compliance never falls through the cracks.",
    experience: [
      { title: "HR & People Operations", period: "2021 – Present", desc: "Managed end-to-end HR functions — recruitment, onboarding, payroll processing, and attendance — using Oracle HRMS to keep operations accurate and policy-compliant." },
      { title: "Sales & Client Coordination", period: "Ongoing", desc: "Coordinated marketing outreach and sales follow-up across multiple locations, sourcing leads through LinkedIn while maintaining clear client communication." },
      { title: "Digital Marketing & Ads Management", period: "Certified", desc: "Applied campaign planning, audience targeting, and automation tools — certified in both Google Ads Display and AI-Powered Performance Ads." }
    ],
    skills: [{ name: "HR Operations & Compliance", pct: 92 }, { name: "Sales & Marketing Coordination", pct: 75 }, { name: "Content & Communication", pct: 85 }],
    tools: ["Oracle HRMS", "LinkedIn Outreach", "Google Ads Display", "Payroll", "Policy Compliance", "Training Delivery"],
    education: "BBA, University of Sindh, Jamshoro (2021–2024)",
    certifications: ["Google Ads Display Certification", "AI-Powered Performance Ads Certification"],
    brands: [],
    brandEngagements: [],
    portfolioLink: "https://hafsa-shaikh-portfolio-aaun.vercel.app/",
    email: "hs845257@gmail.com", whatsapp: "923360187511"
  },
  abdul: {
    name: "Abdul Raheem", avatar: "AR", role: "Supply Chain Analyst & Data Analytics", location: "Karachi, Pakistan",
    bio: "Supply Chain Analyst and Operations professional with hands-on experience in supply chain planning, logistics coordination, inventory management, and data-driven business analytics. Proficient in Excel, Power BI, Python, and SAP, with a track record of streamlining operations and generating measurable efficiency gains.",
    experience: [
      { title: "Automotive & Dealership Operations", period: "Toyota Hyderabad Motors", desc: "Operated the Dealer Management System for service records, spare part inventory tracking, and customer follow-ups — streamlining booking and warranty claim workflows." },
      { title: "FMCG & Consumer Goods", period: "Hunza Candle", desc: "Coordinating logistics and supply chain activities, ensuring timely B2B order fulfillment, with performance dashboards in Excel and Power BI." },
      { title: "Startup Feasibility — Fix It on Wheels", period: "Project", desc: "Data-driven feasibility analysis for a mobile car service startup — route planning models, cost projections, and a last-mile logistics framework." }
    ],
    skillTags: ["Excel", "Power BI", "Python", "SAP", "Vendor Management", "Route Planning"],
    tools: ["Excel", "Power BI", "Python", "SAP", "Vendor Management", "Route Planning"],
    education: "",
    certifications: [],
    brands: ["Toyota Hyderabad Motors", "Hunza Candle", "Fix It on Wheels"],
    brandEngagements: [
      { brand: "Toyota Hyderabad Motors", role: "Dealer Management System — service records, inventory, warranty workflow", where: "On-site — Automotive" },
      { brand: "Hunza Candle", role: "Logistics coordination + Excel/Power BI dashboards", where: "Remote — FMCG" },
      { brand: "Fix It on Wheels", role: "Feasibility study — route planning, cost projections", where: "Project — Startup" }
    ],
    portfolioLink: "https://abdul-raheem-portfolio-gold.vercel.app/",
    email: "abdulraheemimtiaz10@gmail.com", whatsapp: "923173890602"
  },
  irtaza: {
    name: "Irtaza Khan", avatar: "IK", role: "Digital Marketing, Branding & Creative Strategy", location: "Hyderabad, Pakistan",
    bio: "Digital marketing, brand development, and creative design strategy for education, hospitality, corporate, healthcare, and luxury retail — merging visual storytelling with performance metrics that scale brands.",
    experience: [
      { title: "Branding & Visual Identity", period: "Ongoing", desc: "Custom logo design, product packaging, and cohesive brand guidelines tailored to the psychology of each industry." },
      { title: "Paid Media (Meta Ads)", period: "Ongoing", desc: "Data-driven Facebook & Instagram campaigns engineered for maximum ROAS and qualified lead generation." },
      { title: "Content & Account Management", period: "Ongoing", desc: "End-to-end social handling — engaging video hooks, storyboards, and audience community management." }
    ],
    skillTags: ["Branding", "Meta Ads", "Content Strategy", "Pitch Decks", "LinkedIn Growth", "Booking Funnels"],
    tools: ["Meta Ads Manager", "Canva", "Content Calendars", "Pitch Decks", "LinkedIn Growth", "Booking Funnels"],
    education: "",
    certifications: [],
    brands: [],
    brandEngagements: [],
    portfolioLink: "https://irtaza-khan-portfolio-gold.vercel.app/",
    email: "irtazakhankhan10@gmail.com", whatsapp: "923372489252"
  },
  duaa: {
    name: "Hafiza Duaa Qureshi", avatar: "DQ", role: "Customer Service, Sales & Digital Marketing", location: "Hyderabad, Pakistan",
    bio: "Customer Service Representative with hands-on experience managing customer communication, order coordination, and query resolution for two fragrance and home-goods brands. On an average day handles 30 to 40 customer conversations, most ending in a completed purchase.",
    experience: [
      { title: "Deelab — Fragrance", period: "2024", desc: "Customer Service Representative and Digital Marketing Intern — managed communication, order processing, and audience engagement campaigns." },
      { title: "Hunza Candle", period: "2023 – 2024", desc: "Customer Service Representative and Digital Marketing Intern — customer handling, order coordination, and promotional campaigns." },
      { title: "Saylani Welfare International Trust", period: "2023", desc: "Digital Marketing Intern — content creation and audience engagement strategies." }
    ],
    skills: [{ name: "Customer Service & Sales", pct: 95 }, { name: "Digital Marketing", pct: 68 }, { name: "Tools & Other", pct: 80 }],
    tools: ["Customer Support", "Order Coordination", "Google Ads", "Shopify", "Microsoft Office"],
    education: "",
    certifications: [],
    brands: ["Deelab", "Hunza Candle", "Saylani Welfare International Trust"],
    brandEngagements: [
      { brand: "Deelab", role: "Customer service + digital marketing campaigns", where: "On-site — Fragrance" },
      { brand: "Hunza Candle", role: "Customer handling + order coordination", where: "On-site — FMCG" },
      { brand: "Saylani Welfare International Trust", role: "Content creation + audience engagement", where: "Internship — Non-Profit" }
    ],
    portfolioLink: "https://hafiza-duaa-qureshi-portfolio.vercel.app/",
    email: "duaaqureshi2k5@gmail.com", whatsapp: "923177734090"
  },
  husnain: {
    name: "Syed Husnain Azmi", avatar: "HA", role: "Social Media Manager", location: "Hyderabad, Pakistan",
    bio: "Experienced in managing social media platforms and executing digital marketing strategies to build brand awareness and audience engagement. Skilled in content creation, copywriting, and basic graphic design using Canva, along with planning and scheduling posts across Instagram, Facebook, TikTok, LinkedIn, and X.",
    experience: [
      { title: "Social Media Management", period: "2022 – Present", desc: "Content planning, engagement, and scheduling across Instagram, Facebook, TikTok, LinkedIn, and X (Twitter)." },
      { title: "Meta Ads", period: "Ongoing", desc: "Campaign objectives, audience targeting, ad creatives, and performance monitoring for Facebook and Instagram advertising." },
      { title: "SEO & Shopify Store Management", period: "Ongoing", desc: "Keyword research, on-page optimization, and Shopify product/inventory management to support ecommerce brands." }
    ],
    skillTags: ["Meta Ads", "Shopify", "Canva", "Instagram Growth", "Reels Strategy", "Content Planning", "Copywriting"],
    tools: ["Meta Business Suite", "Canva", "Shopify", "Google Analytics"],
    education: "",
    certifications: [],
    brands: ["Zarvangi Bespoke", "Netmatico", "Asasa", "Brand Nova Solutions", "Digitease Solution", "Grocery Ghar", "Vorn"],
    brandEngagements: [
      { brand: "Zarvangi Bespoke", role: "Social media content & platform management", where: "Remote — Fashion" },
      { brand: "Netmatico", role: "Social media content & platform management", where: "Remote — Digital Services" },
      { brand: "Asasa", role: "Social media content & platform management", where: "Remote — Retail" },
      { brand: "Grocery Ghar", role: "Meta Ads & content creation", where: "Remote — Grocery/FMCG" },
      { brand: "Brand Nova Solutions, Digitease Solution, Vorn", role: "Shopify management & content support", where: "Remote — Multi-sector" }
    ],
    portfolioLink: "https://syed-husnain-azmi-portfolio-mij4.vercel.app/",
    email: "syedhusnainazmi@gmail.com", whatsapp: "923130485799"
  }
};

// ---------- build your team (interactive picker) ----------
const builderMap = { dev: 'muneeb', hr: 'hafsa', supply: 'abdul', marketing: 'irtaza', cs: 'duaa', social: 'husnain' };
const selectedBuilderKeys = new Set();
const brEmpty = document.getElementById('brEmpty');
const brFilled = document.getElementById('brFilled');
const brAvatars = document.getElementById('brAvatars');
const brCta = document.getElementById('brCta');

function updateBuilderResult() {
  if (selectedBuilderKeys.size === 0) {
    brEmpty.style.display = 'block';
    brFilled.style.display = 'none';
    return;
  }
  brEmpty.style.display = 'none';
  brFilled.style.display = 'block';
  const ids = [...selectedBuilderKeys].map(k => builderMap[k]);
  brAvatars.innerHTML = ids.map(id => {
    const d = teamData[id];
    return `<div class="br-avatar-row"><div class="mini-avatar">${d.avatar}</div><div><h5>${d.name}</h5><span>${d.role}</span></div></div>`;
  }).join('');
  const names = ids.map(id => teamData[id].name.split(' ')[0]).join(', ');
  const msg = encodeURIComponent(`Hi Obsidian Solutions, I'd like to talk about a project involving: ${names}.`);
  brCta.href = `https://wa.me/923000000000?text=${msg}`;
}

document.querySelectorAll('.builder-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const key = chip.dataset.key;
    if (selectedBuilderKeys.has(key)) { selectedBuilderKeys.delete(key); chip.classList.remove('selected'); }
    else { selectedBuilderKeys.add(key); chip.classList.add('selected'); }
    updateBuilderResult();
  });
});

const detailOverlay = document.getElementById('detailOverlay');
const detailInner = document.getElementById('detailInner');
const detailBack = document.getElementById('detailBack');

function renderDetail(id) {
  const d = teamData[id];
  if (!d) return;
  const skillsBlock = d.skills
    ? d.skills.map(s => `<div class="detail-skill-row"><div class="lbl"><span>${s.name}</span><span>${s.pct}%</span></div><div class="detail-skill-track"><div class="detail-skill-fill" data-pct="${s.pct}"></div></div></div>`).join('')
    : `<div class="detail-chip-row">${(d.skillTags || []).map(t => `<span class="detail-chip">${t}</span>`).join('')}</div>`;
  const brandsBlock = (d.brandEngagements && d.brandEngagements.length)
    ? `<div class="detail-section"><h3>Which Brands, Doing What, Where</h3>
        ${d.brandEngagements.map(b => `
          <div class="detail-exp-item brand-engagement">
            <div class="be-head"><h4>${b.brand}</h4><span class="be-where">${b.where}</span></div>
            <p>${b.role}</p>
          </div>
        `).join('')}
      </div>`
    : '';
  const eduCertBlock = (d.education || (d.certifications && d.certifications.length))
    ? `<div class="detail-section"><h3>Education &amp; Certifications</h3>
        ${d.education ? `<p class="detail-bio" style="font-size:.92rem;margin-bottom:10px;">🎓 ${d.education}</p>` : ''}
        ${(d.certifications && d.certifications.length) ? `<div class="detail-chip-row">${d.certifications.map(c => `<span class="detail-chip">🏅 ${c}</span>`).join('')}</div>` : ''}
      </div>`
    : '';
  detailInner.innerHTML = `
    <div class="detail-head">
      <div class="detail-avatar">${d.avatar}</div>
      <div>
        <h2>${d.name}</h2>
        <div class="detail-role">${d.role}</div>
        <div class="detail-loc">${d.location}</div>
      </div>
    </div>
    <div class="detail-section"><h3>About</h3><p class="detail-bio">${d.bio}</p></div>
    <div class="detail-section"><h3>Experience</h3>
      ${d.experience.map(e => `<div class="detail-exp-item"><h4>${e.title}</h4><p>${e.desc}</p><span class="exp-period">${e.period}</span></div>`).join('')}
    </div>
    ${brandsBlock}
    <div class="detail-section"><h3>Skills</h3>${skillsBlock}</div>
    <div class="detail-section"><h3>Tools</h3>
      <div class="detail-chip-row">${d.tools.map(t => `<span class="detail-chip">${t}</span>`).join('')}</div>
    </div>
    ${eduCertBlock}
    <div class="detail-section"><h3>Contact</h3>
      <div class="detail-ctas">
        <a href="mailto:${d.email}" class="btn btn-primary">✉ Email ${d.name.split(' ')[0]}</a>
        <a href="https://wa.me/${d.whatsapp}" target="_blank" class="btn btn-ghost">💬 WhatsApp</a>
        ${d.portfolioLink ? `<a href="${d.portfolioLink}" target="_blank" class="btn btn-ghost">🌐 View Full Portfolio</a>` : ''}
      </div>
    </div>
  `;
  requestAnimationFrame(() => {
    detailInner.querySelectorAll('.detail-skill-fill').forEach(f => {
      setTimeout(() => { f.style.width = f.dataset.pct + '%'; }, 300);
    });
  });
}


function openDetail(id, pushHistory) {
  renderDetail(id);
  detailOverlay.classList.add('open');
  document.body.classList.add('lock-scroll');
  detailOverlay.scrollTop = 0;
  if (pushHistory) history.pushState({ member: id }, '', '#team-' + id);
}
function closeDetail(popHistory) {
  detailOverlay.classList.remove('open');
  document.body.classList.remove('lock-scroll');
  if (popHistory && location.hash.indexOf('#team-') === 0) history.back();
}

document.querySelectorAll('.team-card').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.member;
    if (id) openDetail(id, true);
  });
});
detailBack.addEventListener('click', () => closeDetail(true));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && detailOverlay.classList.contains('open')) closeDetail(true);
});
window.addEventListener('popstate', () => {
  if (location.hash.indexOf('#team-') === 0) {
    const id = location.hash.replace('#team-', '');
    if (teamData[id]) openDetail(id, false);
  } else {
    closeDetail(false);
  }
});
if (location.hash.indexOf('#team-') === 0) {
  const initId = location.hash.replace('#team-', '');
  if (teamData[initId]) openDetail(initId, false);
}

// ---------- WhatsApp chatbot ----------
const waLauncher = document.getElementById('waLauncher');
const waPanel = document.getElementById('waPanel');
const waBody = document.getElementById('waBody');
let waOpen = false;
waLauncher.addEventListener('click', () => { waOpen = !waOpen; waPanel.classList.toggle('open', waOpen); });

const responses = {
  dev: "Muneeb leads Web & Business Systems — storefronts, ERP/CRM tooling, and WhatsApp-first checkout flows. Reach him at muneeb@example.com.",
  hr: "Hafsa Shaikh leads HR & Talent Operations — recruitment, onboarding, payroll, and compliance through Oracle HRMS. Reach her at hs845257@gmail.com.",
  supply: "Abdul Raheem leads Supply Chain & Analytics — logistics, inventory, and Power BI / Python dashboards. Reach him at abdulraheemimtiaz10@gmail.com.",
  marketing: "Irtaza Khan leads Branding & Performance Marketing — visual identity and Meta Ads across five industries. Reach him at irtazakhankhan10@gmail.com.",
  cs: "Duaa Qureshi leads Customer Service & Sales — order coordination and query resolution. Reach her at duaaqureshi2k5@gmail.com.",
  social: "Husnain Azmi leads Social Media & Content — platform management and Meta Ads campaigns. Reach him at syedhusnainazmi@gmail.com.",
  pricing: "Pricing depends on project scope — from one-off builds to ongoing retainers. Tell us a bit about what you need and we'll scope it after a short call.",
  timeline: "Timelines vary by project — a storefront usually takes 1–3 weeks, while marketing or HR engagements are often ongoing. We'll confirm specifics after a quick discovery chat.",
  location: "The team is based across Karachi and Hyderabad, Pakistan, and works with clients locally and remotely."
};

// alternate phrasing shown if a topic is asked again, so the bot never says the exact same thing twice
const followups = {
  dev: "Still on web & systems — you can also see Muneeb's shipped projects (MAISON, VELORA, Hunza Candle ERP) in the Portfolio section above, or message him directly on WhatsApp.",
  hr: "For HR specifically, Hafsa also handles sales coordination and outreach — worth mentioning if your need spans both hiring and client relations.",
  supply: "On supply chain — Abdul Raheem's dashboard work cut reporting time by about 60% for one client, if you want a concrete reference point.",
  marketing: "For branding/marketing, Irtaza's worked across education, hospitality, healthcare, and luxury retail — let him know your industry and he can share relevant examples.",
  cs: "For customer service, Duaa currently handles 30–40 conversations a day across two brands — she can walk you through how that scales for a new one.",
  social: "For social media, Husnain currently manages platforms for 7 client brands — happy to share examples relevant to your industry if you mention it.",
  pricing: "To be more specific on pricing, it really depends on scope — a quick description of what you need gets you a faster, more accurate number.",
  timeline: "Timeline-wise, it also depends on how much back-and-forth is needed on feedback rounds — tighter scopes move faster.",
  location: "Worth noting: everything is coordinated over WhatsApp and email, so working with a remote client is the default, not an exception."
};

const fallbackVariants = [
  "I can point you to the right specialist — try one of the quick options below, or ask about pricing, timelines, or a specific service like marketing, HR, or web systems.",
  "Not sure I caught that — you can tap a quick option below, or ask me directly about a service, an industry, pricing, or timelines.",
  "Let's narrow it down — which pillar sounds closest to what you need: web & systems, HR, supply chain, marketing, customer service, or social media?",
  "Happy to help — try rephrasing with a specific area (like 'marketing' or 'HR'), or use the buttons below to jump straight to a specialist."
];

let lastBotMessage = "";
let fallbackCursor = 0;
const askedTopics = new Set();

function pickFallback() {
  let msg = fallbackVariants[fallbackCursor % fallbackVariants.length];
  fallbackCursor++;
  if (msg === lastBotMessage) { msg = fallbackVariants[fallbackCursor % fallbackVariants.length]; fallbackCursor++; }
  return msg;
}

function respondForTopic(key) {
  if (!responses[key]) return pickFallback();
  if (askedTopics.has(key) && followups[key]) {
    askedTopics.add(key);
    return followups[key];
  }
  askedTopics.add(key);
  return responses[key];
}

function addMsg(text, who) {
  const div = document.createElement('div');
  div.className = 'wa-msg ' + who;
  div.textContent = text;
  waBody.appendChild(div);
  waBody.scrollTop = waBody.scrollHeight;
}
function showTyping() {
  const div = document.createElement('div');
  div.className = 'wa-typing';
  div.id = 'waTypingIndicator';
  div.innerHTML = '<span></span><span></span><span></span>';
  waBody.appendChild(div);
  waBody.scrollTop = waBody.scrollHeight;
}
function hideTyping() {
  const el = document.getElementById('waTypingIndicator');
  if (el) el.remove();
}
function respondWithDelay(text) {
  lastBotMessage = text;
  showTyping();
  setTimeout(() => { hideTyping(); addMsg(text, 'bot'); }, 800);
}

document.querySelectorAll('.qbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    addMsg(btn.textContent, 'user');
    respondWithDelay(respondForTopic(btn.dataset.q));
  });
});

function matchResponse(raw) {
  const t = raw.toLowerCase();
  if (/(web|system|store|erp|crm|whatsapp order|checkout|developer|code|app)/.test(t)) return 'dev';
  if (/(hr|hire|recruit|payroll|onboard|talent|staff)/.test(t)) return 'hr';
  if (/(supply|logistic|inventory|analytics|dashboard|data|power bi)/.test(t)) return 'supply';
  if (/(market|brand|ads|meta|campaign|social media manager|seo)/.test(t) && !/(social media$|instagram|facebook|tiktok)/.test(t)) return 'marketing';
  if (/(customer|support|order|query|complaint)/.test(t)) return 'cs';
  if (/(social|instagram|facebook|tiktok|content|post)/.test(t)) return 'social';
  if (/(price|cost|budget|charge|quote)/.test(t)) return 'pricing';
  if (/(time|timeline|long|when|deadline)/.test(t)) return 'timeline';
  if (/(where|location|based|office|city|country)/.test(t)) return 'location';
  return null;
}

const waInput = document.getElementById('waInput');
const waSend = document.getElementById('waSend');
function sendUserMessage() {
  const val = waInput.value.trim();
  if (!val) return;
  addMsg(val, 'user');
  waInput.value = '';
  const key = matchResponse(val);
  respondWithDelay(key ? respondForTopic(key) : pickFallback());
}
waSend.addEventListener('click', sendUserMessage);
waInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendUserMessage(); });
