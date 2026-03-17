/**
 * Digital Blood Network - Main JavaScript
 * Shared utilities: navbar injection, auth state, toast notifications, API helpers
 */

// ===== Translations =====
const TRANSLATIONS = {
  en: {
    heroBadge: 'Live Blood Donation Network',
    heroH1Pre: 'Every Drop ',
    heroH1Bold: 'Saves a Life',
    heroP: 'Connect with blood donors, hospitals, and blood banks in real-time. Our platform ensures that no one has to wait for life-saving blood during emergencies.',
    heroBtn1: 'Find Blood Now',
    heroBtn2: 'Become a Donor',
    statDonors: 'Donors',
    statLives: 'Lives Saved',
    statHospitals: 'Hospitals',
    statCities: 'Cities',
    navHome: 'Home', navFind: 'Find Blood', navDonor: 'Become Donor',
    navBanks: 'Blood Banks', navEmergency: 'Emergency', navCompat: 'Compatibility',
    navContact: 'Contact', navLogin: 'Login', navRegister: 'Register', navDashboard: 'Dashboard',
    langLabel: '\uD83C\uDF10 English'
  },
  hi: {
    heroBadge: '\u0932\u093E\u0907\u0935 \u0930\u0915\u094D\u0924\u0926\u093E\u0928 \u0928\u0947\u091F\u0935\u0930\u094D\u0915',
    heroH1Pre: '\u0939\u0930 \u092C\u0942\u0902\u0926 ',
    heroH1Bold: '\u090F\u0915 \u091C\u0940\u0935\u0928 \u092C\u091A\u093E\u0924\u0940 \u0939\u0948',
    heroP: '\u0935\u093E\u0938\u094D\u0924\u0935\u093F\u0915 \u0938\u092E\u092F \u092E\u0947\u0902 \u0930\u0915\u094D\u0924 \u0926\u093E\u0924\u093E\u0913\u0902, \u0905\u0938\u094D\u092A\u0924\u093E\u0932\u094B\u0902 \u0914\u0930 \u092C\u094D\u0932\u0921 \u092C\u0948\u0902\u0915\u094B\u0902 \u0938\u0947 \u091C\u0941\u095C\u0947\u0902\u0964 \u0939\u092E\u093E\u0930\u093E \u092A\u094D\u0932\u0947\u091F\u092B\u093C\u0949\u0930\u094D\u092E \u092F\u0939 \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948 \u0915\u093F \u0906\u092A\u093E\u0924\u0915\u093E\u0932 \u092E\u0947\u0902 \u0915\u093F\u0938\u0940 \u0915\u094B \u092A\u094D\u0930\u0924\u0940\u0915\u094D\u0937\u093E \u0928 \u0915\u0930\u0928\u0940 \u092A\u095C\u0947\u0964',
    heroBtn1: '\u0905\u092D\u0940 \u0930\u0915\u094D\u0924 \u0916\u094B\u091C\u0947\u0902',
    heroBtn2: '\u0926\u093E\u0924\u093E \u092C\u0928\u0947\u0902',
    statDonors: '\u0926\u093E\u0924\u093E', statLives: '\u091C\u0940\u0935\u0928 \u092C\u091A\u093E\u090F',
    statHospitals: '\u0905\u0938\u094D\u092A\u0924\u093E\u0932', statCities: '\u0936\u0939\u0930',
    navHome: '\u0939\u094B\u092E', navFind: '\u0930\u0915\u094D\u0924 \u0916\u094B\u091C\u0947\u0902', navDonor: '\u0926\u093E\u0924\u093E \u092C\u0928\u0947\u0902',
    navBanks: '\u092C\u094D\u0932\u0921 \u092C\u0948\u0902\u0915', navEmergency: '\u0906\u092A\u093E\u0924\u0915\u093E\u0932', navCompat: '\u0938\u0902\u0917\u0924\u0924\u093E',
    navContact: '\u0938\u0902\u092A\u0930\u094D\u0915', navLogin: '\u0932\u0949\u0917\u093F\u0928', navRegister: '\u0930\u091C\u093F\u0938\u094D\u091F\u0930', navDashboard: '\u0921\u0948\u0936\u092C\u094B\u0930\u094D\u0921',
    langLabel: '\uD83C\uDF10 \u0939\u093F\u0902\u0926\u0940'
  },
  bho: {
    heroBadge: '\u0932\u093E\u0907\u0935 \u0916\u0942\u0928 \u0926\u0947\u0935\u0947 \u0915\u0947 \u0928\u0947\u091F\u0935\u0930\u094D\u0915',
    heroH1Pre: '\u0939\u0930 \u092C\u0942\u0902\u0926 ',
    heroH1Bold: '\u090F\u0917\u094B \u091C\u093F\u0928\u0917\u0940 \u092C\u091A\u093E\u0935\u0947\u0932\u093E',
    heroP: '\u0905\u0938\u0932 \u0938\u092E\u092F \u092E\u0947\u0902 \u0916\u0942\u0928 \u0926\u0947\u0935\u0947 \u0935\u093E\u0932\u093E, \u0905\u0938\u094D\u092A\u0924\u093E\u0932 \u0906 \u0916\u0942\u0928 \u092C\u0948\u0902\u0915 \u0938\u0947 \u091C\u0941\u095C\u0940\u0902\u0964 \u0939\u092E\u093E\u0930 \u092E\u0902\u091A \u0938\u0947 \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0939\u094B\u0932\u093E \u0915\u093F \u0906\u092A\u093E\u0924 \u0915\u093E\u0932 \u092E\u0947\u0902 \u0915\u0947\u0939\u0942 \u0915\u0947 \u0907\u0902\u0924\u091C\u093E\u0930 \u0928\u093E \u0915\u0930\u0947 \u0915\u0947 \u092A\u095C\u0947\u0964',
    heroBtn1: '\u0905\u092D\u0940 \u0916\u0942\u0928 \u0916\u094B\u091C\u0940\u0902',
    heroBtn2: '\u0926\u093E\u0928\u0940 \u092C\u0928\u0940\u0902',
    statDonors: '\u0926\u093E\u0924\u093E', statLives: '\u091C\u093F\u0928\u0917\u0940 \u092C\u091A\u093E\u0907\u0932',
    statHospitals: '\u0905\u0938\u094D\u092A\u0924\u093E\u0932', statCities: '\u0936\u0939\u0930',
    navHome: '\u0918\u0930', navFind: '\u0916\u0942\u0928 \u0916\u094B\u091C\u0940\u0902', navDonor: '\u0926\u093E\u0928\u0940 \u092C\u0928\u0940\u0902',
    navBanks: '\u0916\u0942\u0928 \u092C\u0948\u0902\u0915', navEmergency: '\u0906\u092A\u093E\u0924\u0915\u093E\u0932', navCompat: '\u092E\u093F\u0932\u093E\u0928',
    navContact: '\u0938\u0902\u092A\u0930\u094D\u0915', navLogin: '\u0932\u0949\u0917\u093F\u0928', navRegister: '\u0930\u091C\u093F\u0938\u094D\u091F\u0930', navDashboard: '\u0921\u0948\u0936\u092C\u094B\u0930\u094D\u0921',
    langLabel: '\uD83C\uDF10 \u092D\u094B\u091C\u092A\u0941\u0930\u0940'
  }
};

let currentLang = localStorage.getItem('dbn_lang') || 'en';

function applyTranslations(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  currentLang = lang;
  localStorage.setItem('dbn_lang', lang);

  // Translate all data-i18n elements (hero section etc.)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Translate navbar links by data-nav attribute
  const navKeys = {
    home: 'navHome', find: 'navFind', donor: 'navDonor', banks: 'navBanks',
    emergency: 'navEmergency', compat: 'navCompat', contact: 'navContact',
    login: 'navLogin', register: 'navRegister', dashboard: 'navDashboard'
  };
  Object.entries(navKeys).forEach(([navKey, transKey]) => {
    document.querySelectorAll(`[data-nav="${navKey}"]`).forEach(el => {
      if (t[transKey]) el.textContent = t[transKey];
    });
  });

  // Update language button label
  const langBtn = document.getElementById('langDropdownBtn');
  if (langBtn) langBtn.innerHTML = `<i class="fas fa-globe me-1"></i>${t.langLabel.replace(/^\uD83C\uDF10\s*/, '')} <i class="fas fa-chevron-down ms-1" style="font-size:0.7rem"></i>`;
}

// ===== API Configuration =====
const API_BASE = '/api';

// ===== Auth State Management =====
const Auth = {
  getToken() {
    return localStorage.getItem('dbn_token');
  },
  getUser() {
    const user = localStorage.getItem('dbn_user');
    return user ? JSON.parse(user) : null;
  },
  setAuth(token, user) {
    localStorage.setItem('dbn_token', token);
    localStorage.setItem('dbn_user', JSON.stringify(user));
  },
  clearAuth() {
    localStorage.removeItem('dbn_token');
    localStorage.removeItem('dbn_user');
  },
  isLoggedIn() {
    return !!this.getToken();
  },
  getRole() {
    const user = this.getUser();
    return user ? user.role : null;
  }
};

// ===== API Helper =====
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = Auth.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    // Check if the response is actually JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error('Non-JSON Response:', text.substring(0, 200));
      
      if (response.status === 405) {
        throw new Error(`Method Not Allowed (405). You might be using a static file server (like Live Server) instead of the Node.js backend. Please ensure the backend is running on port 5000.`);
      }
      
      throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error Details:', error);
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Network error. Is the backend server running at ' + API_BASE + '? Check console.');
    }
    throw error;
  }
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
  // Remove existing toasts
  const existing = document.querySelector('.toast-custom');
  if (existing) existing.remove();

  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle'
  };

  const colors = {
    success: '#2E7D32',
    error: '#C62828',
    info: '#0277BD',
    warning: '#F57F17'
  };

  const toast = document.createElement('div');
  toast.className = `toast-custom ${type}`;
  toast.innerHTML = `
    <i class="${icons[type] || icons.info}" style="color:${colors[type] || colors.info};font-size:1.4rem"></i>
    <div>
      <strong style="display:block;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.5px;color:${colors[type]}">${type}</strong>
      <span style="color:#495057;font-size:0.95rem">${message}</span>
    </div>
    <button onclick="this.parentElement.classList.remove('show');setTimeout(()=>this.parentElement.remove(),400)" 
      style="background:none;border:none;color:#ADB5BD;font-size:1.2rem;cursor:pointer;margin-left:auto;padding:0 4px">
      <i class="fas fa-times"></i>
    </button>
  `;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto-remove after 5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

// ===== Navbar Injection =====
function injectNavbar() {
  const user = Auth.getUser();
  const isLoggedIn = Auth.isLoggedIn();
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Determine dashboard link based on role
  let dashboardLink = '#';
  if (user) {
    switch (user.role) {
      case 'donor': dashboardLink = './donor-dashboard.html'; break;
      case 'patient': dashboardLink = './patient-dashboard.html'; break;
      case 'hospital': dashboardLink = './hospital-dashboard.html'; break;
      case 'admin': dashboardLink = './admin-dashboard.html'; break;
    }
  }

  // Language dropdown label
  const langLabel = t.langLabel.replace(/^\uD83C\uDF10\s*/, '');
  const langDropdownHtml = `
    <div class="dropdown">
      <button id="langDropdownBtn" class="btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
              data-bs-toggle="dropdown" aria-expanded="false"
              style="background:rgba(211,47,47,0.1);border:1px solid rgba(211,47,47,0.25);color:var(--primary);font-size:0.82rem;font-weight:600;transition:all 0.2s">
        <i class="fas fa-globe me-1"></i>${langLabel}<i class="fas fa-chevron-down ms-1" style="font-size:0.65rem"></i>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow-sm" style="min-width:140px;border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,0.08)">
        <li>
          <button class="dropdown-item d-flex align-items-center gap-2 py-2 ${currentLang==='en'?'active':''}"
                  onclick="applyTranslations('en')" style="font-size:0.9rem">
            <span>🇬🇧</span> English
          </button>
        </li>
        <li>
          <button class="dropdown-item d-flex align-items-center gap-2 py-2 ${currentLang==='hi'?'active':''}"
                  onclick="applyTranslations('hi')" style="font-size:0.9rem">
            <span>🇮🇳</span> हिंदी
          </button>
        </li>
        <li>
          <button class="dropdown-item d-flex align-items-center gap-2 py-2 ${currentLang==='bho'?'active':''}"
                  onclick="applyTranslations('bho')" style="font-size:0.9rem">
            <span>🌾</span> भोजपुरी
          </button>
        </li>
      </ul>
    </div>`;

  const navHtml = `
    <nav class="navbar navbar-expand-lg navbar-custom fixed-top" id="mainNavbar">
      <div class="container">
        <a class="navbar-brand" href="./index.html">
          <i class="fas fa-heartbeat"></i> BloodNet
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <i class="fas fa-bars" style="color:var(--primary)"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item"><a class="nav-link" href="./index.html"><i class="fas fa-home"></i> <span data-nav="home">${t.navHome}</span></a></li>
            <li class="nav-item"><a class="nav-link" href="./find-blood.html"><i class="fas fa-search"></i> <span data-nav="find">${t.navFind}</span></a></li>
            <li class="nav-item"><a class="nav-link" href="./register.html"><i class="fas fa-hand-holding-heart"></i> <span data-nav="donor">${t.navDonor}</span></a></li>
            <li class="nav-item"><a class="nav-link" href="./blood-bank-locator.html"><i class="fas fa-map-marker-alt"></i> <span data-nav="banks">${t.navBanks}</span></a></li>
            <li class="nav-item"><a class="nav-link" href="./emergency-request.html"><i class="fas fa-ambulance"></i> <span data-nav="emergency">${t.navEmergency}</span></a></li>
            <li class="nav-item"><a class="nav-link" href="./compatibility.html"><i class="fas fa-vials"></i> <span data-nav="compat">${t.navCompat}</span></a></li>
            <li class="nav-item"><a class="nav-link" href="./contact.html"><i class="fas fa-phone-alt"></i> <span data-nav="contact">${t.navContact}</span></a></li>
          </ul>
          <div class="d-flex align-items-center gap-2">
            ${langDropdownHtml}
            ${isLoggedIn ? `
              <a href="${dashboardLink}" class="btn btn-sm btn-outline-danger rounded-pill px-3">
                <i class="fas fa-tachometer-alt me-1"></i> <span data-nav="dashboard">${t.navDashboard}</span>
              </a>
              <div class="dropdown">
                <button class="btn btn-sm btn-nav dropdown-toggle" data-bs-toggle="dropdown">
                  <i class="fas fa-user me-1"></i> ${user.name.split(' ')[0]}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="${dashboardLink}"><i class="fas fa-tachometer-alt me-2"></i><span data-nav="dashboard">${t.navDashboard}</span></a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                </ul>
              </div>
            ` : `
              <a href="./login.html" class="btn btn-sm btn-outline-danger rounded-pill px-3">
                <i class="fas fa-sign-in-alt me-1"></i> <span data-nav="login">${t.navLogin}</span>
              </a>
              <a href="./register.html" class="btn btn-sm btn-nav">
                <i class="fas fa-user-plus me-1"></i> <span data-nav="register">${t.navRegister}</span>
              </a>
            `}
          </div>
        </div>
      </div>
    </nav>
  `;

  // Insert navbar at the beginning of body
  document.body.insertAdjacentHTML('afterbegin', navHtml);

  // Highlight active page in nav
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });
}

// ===== Footer Injection =====
function injectFooter() {
  const footerHtml = `
    <footer class="footer">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4 col-md-6">
            <a href="./index.html" class="footer-brand d-flex align-items-center gap-2 mb-3">
              <i class="fas fa-heartbeat"></i> BloodNet
            </a>
            <p class="mb-3" style="font-size:0.95rem">
              Digital Blood Network connects donors, hospitals, and patients to save lives through efficient blood donation management.
            </p>
            <div class="d-flex gap-3">
              <a href="#" class="text-white fs-5"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="text-white fs-5"><i class="fab fa-twitter"></i></a>
              <a href="#" class="text-white fs-5"><i class="fab fa-instagram"></i></a>
              <a href="#" class="text-white fs-5"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div class="col-lg-2 col-md-6">
            <h5>Quick Links</h5>
            <a href="./find-blood.html">Find Blood</a>
            <a href="./register.html">Become Donor</a>
            <a href="./emergency-request.html">Emergency</a>
            <a href="./compatibility.html">Compatibility</a>
          </div>
          <div class="col-lg-3 col-md-6">
            <h5>Support</h5>
            <a href="./contact.html">Contact Us</a>
            <a href="./contact.html#faq">FAQs</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div class="col-lg-3 col-md-6">
            <h5>Emergency Helpline</h5>
            <p class="mb-2"><i class="fas fa-phone-alt me-2 text-danger"></i> +91 9565356383</p>
            <p class="mb-2"><i class="fas fa-envelope me-2 text-danger"></i> radhikagandhi993@gmail.com</p>
            <p class="mb-0"><i class="fas fa-clock me-2 text-danger"></i> 24/7 Available</p>
          </div>
        </div>
        <div class="footer-bottom text-center">
          <p class="mb-0" style="font-size:0.9rem">
            &copy; ${new Date().getFullYear()} Digital Blood Network. Made with <i class="fas fa-heart text-danger"></i> for saving lives.
          </p>
        </div>
      </div>
    </footer>
  `;

  document.body.insertAdjacentHTML('beforeend', footerHtml);
}

// ===== Logout =====
function logout() {
  Auth.clearAuth();
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = './index.html';
  }, 500);
}

// ===== Protect Routes =====
function requireAuth(allowedRoles = []) {
  if (!Auth.isLoggedIn()) {
    showToast('Please login to access this page', 'warning');
    setTimeout(() => {
      window.location.href = './login.html';
    }, 1000);
    return false;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(Auth.getRole())) {
    showToast('You do not have permission to access this page', 'error');
    setTimeout(() => {
      window.location.href = './index.html';
    }, 1000);
    return false;
  }

  return true;
}

// ===== Format Date =====
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// ===== Time Ago =====
function timeAgo(dateStr) {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

// ===== Initialize on every page =====
document.addEventListener('DOMContentLoaded', () => {
  injectNavbar();
  injectFooter();
  // Apply saved language preference (after navbar is injected so data-nav elements exist)
  applyTranslations(currentLang);
});
