/**
 * PRAMRISH PRABHASAN - PORTFOLIO INTERACTIVITY & TEST RUNNER SIMULATOR
 * Vanilla JavaScript (High-performance, zero dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvas();
  initMouseAnimations();
  initTypewriter();
  initSimulator();
  initSkillsFilter();
  initModals();
  initClipboardAndContact();
  initScrollspy();
  initScrollAnimations();
  initAudioFX();
});

/* ==========================================================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      const nextTheme = active === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      updateThemeIcon(nextTheme);
      showToast(`Switched to ${nextTheme.toUpperCase()} mode`);
      playAudioBeep(600, 0.05);
    });
  }
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  if (theme === 'light') {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    btn.setAttribute('aria-label', 'Switch to Dark Mode');
  } else {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    btn.setAttribute('aria-label', 'Switch to Light Mode');
  }
}

/* ==========================================================================
   2. INTERACTIVE PARTICLES & CONSTELLATION BACKGROUND
   ========================================================================== */
function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  let sparks = [];
  const particleCount = 55;
  const maxDistance = 140;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const mouse = { x: null, y: null, radius: 170, prevX: null, prevY: null };
  
  window.addEventListener('mousemove', (e) => {
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Emit trailing glowing micro-sparks on mouse movement
    if (Math.random() < 0.6) {
      sparks.push(new Spark(mouse.x, mouse.y));
      if (sparks.length > 25) sparks.shift();
    }
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Mobile Touch Support for Canvas Particles & Sparks
  const handleTouch = (e) => {
    if (e.touches && e.touches.length > 0) {
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;

      if (Math.random() < 0.75) {
        sparks.push(new Spark(mouse.x, mouse.y));
        if (sparks.length > 30) sparks.shift();
      }
    }
  };

  window.addEventListener('touchstart', handleTouch, { passive: true });
  window.addEventListener('touchmove', handleTouch, { passive: true });
  window.addEventListener('touchend', () => {
    setTimeout(() => {
      mouse.x = null;
      mouse.y = null;
    }, 450);
  }, { passive: true });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.75;
      this.vy = (Math.random() - 0.5) * 0.75;
      this.radius = Math.random() * 2.2 + 1;
      this.baseAlpha = Math.random() * 0.4 + 0.3;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Elastic mouse push and pull
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }
    draw(isDark) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(0, 242, 254, ${this.baseAlpha})`
        : `rgba(2, 132, 199, ${this.baseAlpha * 0.75})`;
      ctx.fill();
    }
  }

  class Spark {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 8;
      this.y = y + (Math.random() - 0.5) * 8;
      this.vx = (Math.random() - 0.5) * 1.8;
      this.vy = (Math.random() - 0.5) * 1.8;
      this.radius = Math.random() * 2.5 + 1.2;
      this.life = 1.0;
      this.decay = Math.random() * 0.03 + 0.02;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }
    draw(isDark) {
      if (this.life <= 0) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * this.life, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(16, 185, 129, ${this.life * 0.8})`
        : `rgba(5, 150, 105, ${this.life * 0.6})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = isDark ? '#00f2fe' : '#0284c7';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    // Update & draw sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].update();
      sparks[i].draw(isDark);
      if (sparks[i].life <= 0) sparks.splice(i, 1);
    }

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(isDark);

      // Connect to mouse cursor with dynamic neon beams
      if (mouse.x !== null) {
        const dxMouse = mouse.x - particles[i].x;
        const dyMouse = mouse.y - particles[i].y;
        const distMouse = Math.hypot(dxMouse, dyMouse);
        if (distMouse < 130) {
          const mAlpha = (1 - distMouse / 130) * (isDark ? 0.45 : 0.25);
          ctx.beginPath();
          ctx.strokeStyle = isDark
            ? `rgba(0, 242, 254, ${mAlpha})`
            : `rgba(2, 132, 199, ${mAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Connect to neighboring particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * (isDark ? 0.25 : 0.12);
          ctx.beginPath();
          ctx.strokeStyle = isDark
            ? `rgba(0, 242, 254, ${alpha})`
            : `rgba(2, 132, 199, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2.1 MOUSE & MOBILE TOUCH-DRIVEN PARALLAX, AMBIENT WAVE & 3D TILT
   ========================================================================== */
function initMouseAnimations() {
  const spotlight = document.getElementById('cursorSpotlight');
  const orb1 = document.getElementById('orb1');
  const orb2 = document.getElementById('orb2');
  const orb3 = document.getElementById('orb3');
  const heroWrapper = document.getElementById('heroImageWrapper');
  const heroArea = document.getElementById('heroVisualArea') || document.getElementById('hero');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;
  let lastInteractionTime = Date.now();
  let isInteracting = false;

  function updateParallax(x, y) {
    const normX = (x / window.innerWidth - 0.5) * 2;
    const normY = (y / window.innerHeight - 0.5) * 2;

    if (orb1) {
      orb1.style.transform = `translate3d(${normX * 60}px, ${normY * 45}px, 0)`;
    }
    if (orb2) {
      orb2.style.transform = `translate3d(${-normX * 55}px, ${-normY * 40}px, 0)`;
    }
    if (orb3) {
      orb3.style.transform = `translate3d(${normX * 45}px, ${-normY * 50}px, 0)`;
    }
  }

  // Desktop Mouse Movement
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastInteractionTime = Date.now();
    isInteracting = true;
    updateParallax(mouseX, mouseY);
  });

  // Mobile Touch Movement & Parallax Tracking
  const handleTouchParallax = (e) => {
    if (e.touches && e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      lastInteractionTime = Date.now();
      isInteracting = true;
      updateParallax(mouseX, mouseY);
    }
  };

  window.addEventListener('touchstart', handleTouchParallax, { passive: true });
  window.addEventListener('touchmove', handleTouchParallax, { passive: true });
  window.addEventListener('touchend', () => {
    isInteracting = false;
    lastInteractionTime = Date.now();
  }, { passive: true });

  // Mobile Gyroscope / Device Tilt Parallax (when supported)
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null && !isInteracting) {
        // gamma: left-to-right tilt [-90, 90]
        // beta: front-to-back tilt [-180, 180] (standard viewing around 35-50 deg)
        const tiltX = Math.max(-25, Math.min(25, e.gamma));
        const tiltY = Math.max(-25, Math.min(25, e.beta - 40));

        if (heroWrapper && window.innerWidth <= 768) {
          heroWrapper.style.transform = `perspective(1000px) rotateX(${-tiltY * 0.4}deg) rotateY(${tiltX * 0.4}deg) scale3d(1.01, 1.01, 1.01)`;
        }

        if (orb1) orb1.style.transform = `translate3d(${tiltX * 2}px, ${tiltY * 1.8}px, 0)`;
        if (orb2) orb2.style.transform = `translate3d(${-tiltX * 1.8}px, ${-tiltY * 1.5}px, 0)`;
        if (orb3) orb3.style.transform = `translate3d(${tiltX * 1.5}px, ${-tiltY * 2}px, 0)`;
      }
    });
  }

  // Smooth Spotlight Loop with Organic Ambient Float on Mobile / Idle
  let ambientTime = 0;
  function renderSpotlight() {
    ambientTime += 0.02;

    // When idle (common on mobile reading or tablets), float gracefully
    if (!isInteracting && Date.now() - lastInteractionTime > 1200) {
      const ambientX = (window.innerWidth / 2) + Math.sin(ambientTime * 0.6) * (window.innerWidth * 0.28);
      const ambientY = (window.innerHeight * 0.38) + Math.cos(ambientTime * 0.8) * (window.innerHeight * 0.18);
      mouseX = ambientX;
      mouseY = ambientY;
      updateParallax(ambientX, ambientY);
    }

    curX += (mouseX - curX) * 0.1;
    curY += (mouseY - curY) * 0.1;

    if (spotlight) {
      spotlight.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(renderSpotlight);
  }
  renderSpotlight();

  // 3D Tilt for Hero Photo Card (Mouse & Touch Drag Support)
  if (heroArea && heroWrapper) {
    function applyCardTilt(clientX, clientY) {
      const rect = heroWrapper.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const rotateY = ((clientX - cardCenterX) / (rect.width / 2)) * 14;
      const rotateX = -((clientY - cardCenterY) / (rect.height / 2)) * 14;

      heroWrapper.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;

      const badges = heroWrapper.querySelectorAll('.floating-badge');
      badges.forEach((b, i) => {
        const factor = i === 0 ? 1.5 : -1.5;
        b.style.transform = `translate3d(${rotateY * factor}px, ${-rotateX * factor}px, 35px)`;
      });
    }

    function resetCardTilt() {
      heroWrapper.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      const badges = heroWrapper.querySelectorAll('.floating-badge');
      badges.forEach(b => {
        b.style.transform = '';
      });
    }

    // Desktop Mouse Handlers
    heroArea.addEventListener('mousemove', (e) => applyCardTilt(e.clientX, e.clientY));
    heroArea.addEventListener('mouseleave', resetCardTilt);

    // Mobile Touch Drag Tilt on Hero Image Card
    heroArea.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        applyCardTilt(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    heroArea.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        applyCardTilt(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    heroArea.addEventListener('touchend', resetCardTilt, { passive: true });
  }
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typingRole');
  if (!el) return;

  const roles = [
    'Quality Engineer (QA / SDET)',
    'Manual & Automation Testing Specialist',
    'Selenium WebDriver & TestNG Engineer',
    'Postman API Testing Strategist',
    'Healthcare (HIS) & Matrimonial QA Lead',
    'Agile STLC & UAT Sign-off Coordinator'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 40;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }
  type();
}

/* ==========================================================================
   4. INTERACTIVE QA AUTOMATION SIMULATOR
   ========================================================================== */
const testSuites = {
  matrimonial: {
    name: 'MakeYourJodi Smoke & Regression Suite',
    framework: 'Selenium WebDriver + TestNG + Maven',
    domain: 'Matrimonial Platform',
    tests: [
      { id: 'MYJ-001', name: 'Browser Session Initialization (Chrome Headless)', ms: 140, type: 'INIT' },
      { id: 'MYJ-002', name: 'User Authentication & JWT Token Verification', ms: 95, type: 'AUTH' },
      { id: 'MYJ-003', name: 'Profile Matching Filter Algorithm Validation (Age, Religion, City)', ms: 165, type: 'FILTER' },
      { id: 'MYJ-004', name: 'Profile Photo Upload & Image Dimension Boundary Check', ms: 120, type: 'UPLOAD' },
      { id: 'MYJ-005', name: 'Real-time WebSocket Chat & Instant Notification Delivery', ms: 190, type: 'CHAT' },
      { id: 'MYJ-006', name: 'Premium Membership Checkout & Payment Gateway Mock', ms: 210, type: 'CHECKOUT' },
      { id: 'MYJ-007', name: 'Exploratory Edge Case: Special Characters in Bio Field', ms: 80, type: 'SECURITY' },
      { id: 'MYJ-008', name: 'Live Production Smoke Test: DNS & Health Endpoint /actuator/health', ms: 90, type: 'SMOKE' }
    ],
    codeSnippet: `// Selenium + TestNG Profile Matching Test
@Test(priority = 1, groups = {"smoke", "regression"})
public void verifyProfileFilterMatches() {
    LoginPage login = new LoginPage(driver);
    login.loginWithCredentials("pramrish.test@domain.com", "EncryptedPass123");
    
    MatchPage matchPage = new MatchPage(driver);
    matchPage.selectAgeRange(24, 30);
    matchPage.selectCity("Bengaluru");
    matchPage.clickApplyFilters();
    
    List<WebElement> results = matchPage.getResultCards();
    Assert.assertTrue(results.size() > 0, "Matched profile list must not be empty");
    for (WebElement card : results) {
        Assert.assertTrue(card.getText().contains("Bengaluru"));
    }
    ExtentLogger.pass("Profile matching filter validated successfully across 40+ profiles");
}`
  },
  healthcare: {
    name: 'Hospital Information System (HIS) API Suite',
    framework: 'Postman Collection Runner + REST Assertions',
    domain: 'Enterprise Healthcare',
    tests: [
      { id: 'HIS-101', name: 'POST /api/v1/patients/register (New Patient Onboarding)', ms: 85, type: 'API' },
      { id: 'HIS-102', name: 'POST /api/v1/admissions (Bed Allocation & Department Lock)', ms: 110, type: 'API' },
      { id: 'HIS-103', name: 'GET /api/v1/patients/{id}/vitals (Response JSON Schema Validation)', ms: 75, type: 'SCHEMA' },
      { id: 'HIS-104', name: 'PUT /api/v1/transfers (ICU to General Ward Workflow)', ms: 140, type: 'WORKFLOW' },
      { id: 'HIS-105', name: 'POST /api/v1/discharge (Billing Clearance & Summary Report)', ms: 180, type: 'AUDIT' },
      { id: 'HIS-106', name: 'ClearQuest Bug Fix Regression: Zero Patient ID Duplication Under Load', ms: 130, type: 'REGRESSION' },
      { id: 'HIS-107', name: 'Security Header Assertion (HSTS, X-Content-Type-Options, CORS)', ms: 65, type: 'SECURITY' },
      { id: 'HIS-108', name: 'UAT Sign-off Flow: Doctor E-Prescription & Pharmacy Dispatch', ms: 160, type: 'UAT' }
    ],
    codeSnippet: `// Postman Tests Script: HIS Patient Discharge Verification
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

pm.test("Discharge summary payload contains all mandatory clinical metrics", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.dischargeStatus).to.eql("APPROVED");
    pm.expect(jsonData.billingCleared).to.be.true;
    pm.expect(jsonData.bedNumber).to.not.be.null;
    pm.expect(jsonData.doctorNotes).to.be.a('string');
});

pm.test("Response time is acceptable for hospital throughput (<200ms)", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});`
  },
  crossbrowser: {
    name: 'Cross-Browser & Jenkins CI Automation Suite',
    framework: 'Jenkins CI/CD + Maven Surefire + Selenium Grid',
    domain: 'Cross-Platform Quality',
    tests: [
      { id: 'CI-201', name: 'Jenkins Webhook Triggered from Git Repository', ms: 90, type: 'CI' },
      { id: 'CI-202', name: 'Maven Build & Dependency Resolution (pom.xml)', ms: 110, type: 'BUILD' },
      { id: 'CI-203', name: 'Chrome v126 Headless Execution (Viewport 1920x1080)', ms: 130, type: 'CROSS' },
      { id: 'CI-204', name: 'Firefox GeckoDriver Parallel Test Execution', ms: 150, type: 'CROSS' },
      { id: 'CI-205', name: 'Microsoft Edge Chromium Compatibility Validation', ms: 140, type: 'CROSS' },
      { id: 'CI-206', name: 'Responsive Mobile Breakpoints (iPhone, Pixel Viewports)', ms: 125, type: 'LAYOUT' },
      { id: 'CI-207', name: 'ExtentReports HTML Artifact Archiving & Email Dispatch', ms: 105, type: 'REPORT' }
    ],
    codeSnippet: `<!-- Jenkins CI / Maven Surefire Configuration -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.1.2</version>
    <configuration>
        <suiteXmlFiles>
            <suiteXmlFile>testng.xml</suiteXmlFile>
        </suiteXmlFiles>
        <properties>
            <property>
                <name>usedefaultlisteners</name>
                <value>false</value>
            </property>
            <property>
                <name>listener</name>
                <value>com.pramrish.qa.reports.ExtentTestNGListener</value>
            </property>
        </properties>
    </configuration>
</plugin>`
  }
};

let currentSuiteKey = 'matrimonial';
let isRunning = false;
let testTimer = null;

function initSimulator() {
  const terminalBody = document.getElementById('terminalBody');
  const runBtn = document.getElementById('runTestBtn');
  const clearBtn = document.getElementById('clearTerminalBtn');
  const viewCodeBtn = document.getElementById('viewTestCodeBtn');
  const progressBar = document.getElementById('testProgressBar');
  const progressText = document.getElementById('progressText');
  const suiteTabs = document.querySelectorAll('.suite-tab');

  if (!terminalBody || !runBtn) return;

  // Tab switching
  suiteTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (isRunning) return;
      suiteTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSuiteKey = tab.getAttribute('data-suite');
      renderInitialTerminal();
      playAudioBeep(520, 0.04);
    });
  });

  // Run Button
  runBtn.addEventListener('click', () => {
    if (isRunning) return;
    executeTestSuite();
    playAudioBeep(700, 0.08);
  });

  // Clear Button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (isRunning) return;
      renderInitialTerminal();
    });
  }

  // View Code Snippet Button
  if (viewCodeBtn) {
    viewCodeBtn.addEventListener('click', () => {
      openCodeSnippetModal();
    });
  }

  renderInitialTerminal();
}

function renderInitialTerminal() {
  const terminalBody = document.getElementById('terminalBody');
  const progressBar = document.getElementById('testProgressBar');
  const progressText = document.getElementById('progressText');
  const suite = testSuites[currentSuiteKey];

  if (!terminalBody) return;
  if (progressBar) progressBar.style.width = '0%';
  if (progressText) progressText.textContent = 'Ready to execute';

  terminalBody.innerHTML = `
    <div class="log-line">
      <span class="log-time">[${getTimestamp()}]</span>
      <span class="log-tag-info">[SUITE]</span>
      <span class="log-msg">Selected Suite: <strong>${suite.name}</strong></span>
    </div>
    <div class="log-line">
      <span class="log-time">[${getTimestamp()}]</span>
      <span class="log-tag-step">[STACK]</span>
      <span class="log-msg">Framework: ${suite.framework} | Domain: ${suite.domain}</span>
    </div>
    <div class="log-line">
      <span class="log-time">[${getTimestamp()}]</span>
      <span class="log-tag-info">[STATUS]</span>
      <span class="log-msg">Environment Ready. Click <strong>"▶ Run Test Suite"</strong> to execute tests.</span>
    </div>
  `;

  updateReportSummary(suite.tests.length, 0, 0, '0.00s');
}

function executeTestSuite() {
  isRunning = true;
  const suite = testSuites[currentSuiteKey];
  const terminalBody = document.getElementById('terminalBody');
  const runBtn = document.getElementById('runTestBtn');
  const progressBar = document.getElementById('testProgressBar');
  const progressText = document.getElementById('progressText');

  runBtn.disabled = true;
  runBtn.innerHTML = `<span>Running Suite...</span>`;

  terminalBody.innerHTML = `
    <div class="log-line">
      <span class="log-time">[${getTimestamp()}]</span>
      <span class="log-tag-info">[START]</span>
      <span class="log-msg">Executing ${suite.name}...</span>
    </div>
  `;

  let idx = 0;
  let passedCount = 0;
  let totalTime = 0;
  const total = suite.tests.length;

  function runNextTest() {
    if (idx < total) {
      const test = suite.tests[idx];
      totalTime += test.ms;
      passedCount++;
      const percent = Math.round(((idx + 1) / total) * 100);

      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) progressText.textContent = `Running ${idx + 1}/${total} (${percent}%)`;

      const line = document.createElement('div');
      line.className = 'log-line';
      line.innerHTML = `
        <span class="log-time">[${getTimestamp()}]</span>
        <span class="log-tag-pass">[PASS]</span>
        <span class="log-msg"><strong>[${test.id}]</strong> ${test.name} — <span style="color:#00f2fe;">${test.ms}ms</span></span>
      `;
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;

      playAudioBeep(850 + idx * 30, 0.03);

      updateReportSummary(total, passedCount, 0, (totalTime / 1000).toFixed(2) + 's');

      idx++;
      setTimeout(runNextTest, 320);
    } else {
      // Completed!
      const finishLine = document.createElement('div');
      finishLine.className = 'log-line';
      finishLine.innerHTML = `
        <span class="log-time">[${getTimestamp()}]</span>
        <span class="log-tag-pass">[SUCCESS]</span>
        <span class="log-msg" style="color:#10b981;font-weight:700;">All ${total} tests PASSED with 0 defects! ExtentReport HTML generated & archived.</span>
      `;
      terminalBody.appendChild(finishLine);
      terminalBody.scrollTop = terminalBody.scrollHeight;

      if (progressBar) progressBar.style.width = '100%';
      if (progressText) progressText.textContent = 'Suite Executed Successfully (100% Passed)';

      runBtn.disabled = false;
      runBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <span>Re-run Suite</span>
      `;
      isRunning = false;
      showToast(`Suite Execution Finished: ${total}/${total} Passed!`);
      playAudioSuccess();
    }
  }

  setTimeout(runNextTest, 300);
}

function updateReportSummary(total, passed, failed, timeStr) {
  const sumTotal = document.getElementById('sumTotal');
  const sumPassed = document.getElementById('sumPassed');
  const sumFailed = document.getElementById('sumFailed');
  const sumTime = document.getElementById('sumTime');

  if (sumTotal) sumTotal.textContent = total;
  if (sumPassed) sumPassed.textContent = passed;
  if (sumFailed) sumFailed.textContent = failed;
  if (sumTime) sumTime.textContent = timeStr;
}

function getTimestamp() {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
}

/* ==========================================================================
   5. SKILLS FILTERING
   ========================================================================== */
function initSkillsFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.skill-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const itemCat = card.getAttribute('data-category');
        if (cat === 'all' || itemCat.includes(cat)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
      playAudioBeep(580, 0.04);
    });
  });
}

/* ==========================================================================
   6. MODALS (ATS RESUME, QA ARTIFACTS, CODE SNIPPETS)
   ========================================================================== */
function initModals() {
  const resumeModal = document.getElementById('resumeModal');
  const artifactsModal = document.getElementById('artifactsModal');
  const codeModal = document.getElementById('codeModal');

  // Open Resume Modal
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');
  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(resumeModal);
    });
  });

  // Open Project QA Artifacts
  const projectArtifactBtns = document.querySelectorAll('.open-artifacts-btn');
  projectArtifactBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-project');
      loadArtifactModalContent(proj);
      openModal(artifactsModal);
    });
  });

  // Close modals
  document.querySelectorAll('.modal-close-trigger').forEach(el => {
    el.addEventListener('click', () => {
      closeAllModals();
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Print button in resume modal
  const printBtn = document.getElementById('printResumeBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Copy ATS text button
  const copyAtsBtn = document.getElementById('copyAtsBtn');
  if (copyAtsBtn) {
    copyAtsBtn.addEventListener('click', () => {
      const text = getPlainTextResume();
      navigator.clipboard.writeText(text).then(() => {
        showToast('ATS Resume text copied to clipboard!');
      });
    });
  }
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

function openCodeSnippetModal() {
  const codeModal = document.getElementById('codeModal');
  const codeSnippetEl = document.getElementById('codeSnippetContent');
  const suite = testSuites[currentSuiteKey];

  if (codeSnippetEl && suite) {
    codeSnippetEl.textContent = suite.codeSnippet;
    document.getElementById('codeModalTitle').textContent = `${suite.name} — Test Implementation`;
  }
  openModal(codeModal);
}

function loadArtifactModalContent(projKey) {
  const container = document.getElementById('artifactsModalBody');
  const title = document.getElementById('artifactsModalTitle');
  if (!container) return;

  if (projKey === 'makeyourjodi') {
    title.textContent = 'MakeYourJodi QA Test Architecture & Deliverables';
    container.innerHTML = `
      <div style="font-family: var(--font-body); font-size: 0.95rem; line-height: 1.7;">
        <h3 style="color:var(--accent-cyan); margin-bottom: 8px;">1. Test Strategy & Scope</h3>
        <p style="margin-bottom: 16px;">Comprehensive test plan covering end-to-end user journeys for matchmaking: registration, profile approval, matching algorithms (filters for age, location, occupation), real-time messaging, and subscription checkout.</p>
        
        <h3 style="color:var(--accent-cyan); margin-bottom: 8px;">2. Defect Lifecycle & Triage Process</h3>
        <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:8px; border:1px solid var(--border-subtle); margin-bottom:16px;">
          <ul style="padding-left: 20px; display:flex; flex-direction:column; gap:8px;">
            <li><strong>Jira Workflow:</strong> Open ➔ In Triage ➔ Assigned to Dev ➔ Fix Ready ➔ QA Regression ➔ Closed.</li>
            <li><strong>Severity S1 (Blocker):</strong> Immediate halt, root-cause analysis with Product Owner & Lead Dev.</li>
            <li><strong>Production Smoke Testing:</strong> Executed post-release checklist across live servers to guarantee 100% stability.</li>
          </ul>
        </div>

        <h3 style="color:var(--accent-cyan); margin-bottom: 8px;">3. Sample Test Case Format Executed</h3>
        <div style="overflow-x:auto; -webkit-overflow-scrolling:touch; width:100%; margin-top:8px; border:1px solid var(--border-subtle); border-radius:8px;">
          <table style="width:100%; min-width:550px; border-collapse:collapse; font-size:0.85rem;">
            <thead>
              <tr style="background:rgba(255,255,255,0.06); text-align:left;">
                <th style="padding:8px 12px; border-bottom:1px solid var(--border-subtle);">TC ID</th>
                <th style="padding:8px 12px; border-bottom:1px solid var(--border-subtle);">Test Scenario</th>
                <th style="padding:8px 12px; border-bottom:1px solid var(--border-subtle);">Pre-conditions</th>
                <th style="padding:8px 12px; border-bottom:1px solid var(--border-subtle);">Expected Result</th>
                <th style="padding:8px 12px; border-bottom:1px solid var(--border-subtle);">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:8px 12px; border-bottom:1px solid var(--border-subtle); font-family:var(--font-mono);">TC_MYJ_042</td>
                <td style="padding:8px 12px; border-bottom:1px solid var(--border-subtle);">Verify age filter boundaries (18 to 70)</td>
                <td style="padding:8px 12px; border-bottom:1px solid var(--border-subtle);">User logged in</td>
                <td style="padding:8px 12px; border-bottom:1px solid var(--border-subtle);">Displays only profiles within boundary</td>
                <td style="padding:8px 12px; border-bottom:1px solid var(--border-subtle); color:var(--accent-emerald); font-weight:700;">PASS</td>
              </tr>
              <tr>
                <td style="padding:8px 12px; font-family:var(--font-mono);">TC_MYJ_088</td>
                <td style="padding:8px 12px;">Validate concurrent chat messaging over WebSockets</td>
                <td style="padding:8px 12px;">Mutual match established</td>
                <td style="padding:8px 12px;">Messages sync within &lt;200ms latency</td>
                <td style="padding:8px 12px; color:var(--accent-emerald); font-weight:700;">PASS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else {
    title.textContent = 'HIS Hospital Information System QA Deliverables';
    container.innerHTML = `
      <div style="font-family: var(--font-body); font-size: 0.95rem; line-height: 1.7;">
        <h3 style="color:var(--accent-emerald); margin-bottom: 8px;">1. Healthcare Compliance & Module Coverage</h3>
        <p style="margin-bottom: 16px;">Rigorous validation of patient workflows: Inpatient/Outpatient admissions, bed transfers, electronic health records (EHR), lab investigations, and billing discharge summaries. High emphasis on data integrity and Zero Patient Record Duplication.</p>
        
        <h3 style="color:var(--accent-emerald); margin-bottom: 8px;">2. API Testing Suites (Postman Collections)</h3>
        <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:8px; border:1px solid var(--border-subtle); margin-bottom:16px;">
          <ul style="padding-left: 20px; display:flex; flex-direction:column; gap:8px;">
            <li><strong>80+ Endpoint Tests:</strong> Status code 200/201 checks, token validation, response schema JSON assertions.</li>
            <li><strong>ClearQuest & HP ALM:</strong> Logged and triaged over 150 defects with detailed trace logs and screenshots.</li>
            <li><strong>Regression Protocol:</strong> Re-tested every bug fix and performed automated regression runs prior to deployment.</li>
          </ul>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   7. CLIPBOARD, TOAST & CONTACT FORM
   ========================================================================== */
function initClipboardAndContact() {
  // Copy buttons
  document.querySelectorAll('.copy-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied "${text}" to clipboard!`);
        playAudioBeep(650, 0.05);
      });
    });
  });

  // Contact Form - Direct Email Delivery to pramrish.prabhashan@gmail.com
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim() || 'Inquiry regarding Quality Engineer role';
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields');
        return;
      }

      // Show sending spinner state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spinPulse 0.9s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        <span>Sending Message...</span>
      `;

      try {
        const response = await fetch('https://formsubmit.co/ajax/pramrish.prabhashan@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            "Recruiter Name": name,
            "Professional Email": email,
            "Subject / Opportunity": subject,
            "Message": message,
            _subject: `[QA Portfolio Lead] ${subject} — ${name}`,
            _replyto: email,
            _template: 'table',
            _captcha: 'false'
          })
        });

        const data = await response.json();

        if (response.ok || data.success === 'true' || data.success === true) {
          showToast('Message sent! I will reply to your email shortly.');
          form.reset();
          playAudioSuccess();
        } else {
          throw new Error(data.message || 'Delivery request failed');
        }
      } catch (err) {
        console.warn('Direct delivery error, falling back to mail client:', err);
        // Fallback to mailto if user is offline or service has an error
        const mailtoUrl = `mailto:pramrish.prabhashan@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent(
          `Hi Pramrish,\n\n${message}\n\nFrom: ${name} (${email})`
        )}`;
        window.open(mailtoUrl, '_blank');
        showToast('Opening email client with pre-filled message...');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }

  // Mobile menu button with animated icon, sound feedback, and outside-click dismiss
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileBtn && navLinks) {
    function toggleMobileMenu(forceClose = false) {
      const isOpen = forceClose ? false : !navLinks.classList.contains('mobile-open');
      if (isOpen) {
        navLinks.classList.add('mobile-open');
        mobileBtn.classList.add('active');
        mobileBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        mobileBtn.setAttribute('aria-expanded', 'true');
      } else {
        navLinks.classList.remove('mobile-open');
        mobileBtn.classList.remove('active');
        mobileBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        mobileBtn.setAttribute('aria-expanded', 'false');
      }
    }

    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
      playAudioBeep(580, 0.04);
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggleMobileMenu(true));
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
        toggleMobileMenu(true);
      }
    });
  }
}

function showToast(msg) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--accent-cyan);"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${msg}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   8. SCROLLSPY & NAVBAR
   ========================================================================== */
function initScrollspy() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (navbar) {
      if (scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }

    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   8.1 SCROLL REVEAL & MOBILE STAGGERED ENTRANCE ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.stlc-step-card, .project-card, .skill-card, .metric-item, .terminal-window, .timeline-item, .contact-card, .hero-availability'
  );

  animatedElements.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    const delay = (index % 3) * 0.08;
    el.style.transitionDelay = `${delay}s`;
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -25px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   9. WEB AUDIO API SYNTHESIZER (CLICK & TEST SOUNDS)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioFX() {
  const audioBtn = document.getElementById('audioToggleBtn');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
      showToast('Sound effects enabled');
      playAudioBeep(660, 0.08);
    } else {
      audioBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      showToast('Sound muted');
    }
  });
}

function playAudioBeep(freq = 600, duration = 0.05) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {}
}

function playAudioSuccess() {
  if (!soundEnabled || !audioCtx) return;
  playAudioBeep(523.25, 0.08);
  setTimeout(() => playAudioBeep(659.25, 0.08), 80);
  setTimeout(() => playAudioBeep(783.99, 0.15), 160);
}

function getPlainTextResume() {
  return `PRAMRISH PRABHASAN
Phone: +91 8292694318 | Email: pramrish.prabhashan@gmail.com
LinkedIn: https://linkedin.com/in/pramrish-prabhasan

PROFESSIONAL SUMMARY
Quality Engineer with 2+ years testing web applications across the healthcare and matrimonial domains, covering the full STLC from test planning through UAT sign-off and live/production validation. Strong track record designing and executing functional, regression, integration, and exploratory test suites, and driving defects to closure in Jira, HP ALM, and ClearQuest. Comfortable working directly with developers, BAs, and product owners in Agile teams to catch issues early and keep releases on schedule. Automation-capable with Selenium WebDriver, TestNG, and Jenkins CI/CD.

CORE COMPETENCIES
Manual & Automation Testing | UAT Coordination | Live/Production Support Testing | Regression & Integration Testing | Defect Management | Agile/Scrum | Cross-functional Collaboration

TECHNICAL SKILLS
- Testing Types: Manual, Functional, Regression, Smoke, Sanity, Integration, System, UAT, Exploratory
- Test Management: Jira, HP ALM, ClearQuest
- Automation: Selenium WebDriver, TestNG, Maven, ExtentReports
- CI/CD: Jenkins
- Programming Languages: Java
- Version Control: Git, Bitbucket
- Methodologies: Agile, Scrum, Sprint Planning, Daily Stand-up, Sprint Retrospective
- Operating Systems: Windows

PROFESSIONAL EXPERIENCE
Quality Engineer | July 2026 – Present
Techostinger India Private Limited (MakeYourJodi - Matrimonial Application)
- Own manual testing for the MakeYourJodi matrimonial platform, running functional, regression, and exploratory test cycles across core modules such as profile matching and messaging.
- Lead UAT cycles, validating features against business requirements and securing stakeholder sign-off before release.
- Perform testing and validation on the live/production environment, confirming release stability and catching issues that surface post-deployment.
- Design and execute test cases from user stories and requirements to catch defects early and protect the end-user experience.
- Log, triage, and track defects to resolution, working closely with developers and product stakeholders to confirm fixes.

Quality Engineer | December 2023 – February 2026
AU Technology Consulting (HIS - Hospital Information System)
- Validated core HIS modules — registration, admissions, discharge/transfer, and reporting — ensuring functional correctness and data consistency across web application workflows.
- Designed, reviewed, and executed test cases from business requirements and use cases across functional and regression cycles.
- Ran functional, regression, and integration testing, plus exploratory sessions that surfaced edge cases and usability gaps before release.
- Built and maintained Postman collections for API testing, validating response payloads, status codes, and headers.
- Managed the full defect lifecycle in Jira, HP ALM, and ClearQuest, using sprint boards for real-time visibility and partnering with developers, BAs, and product owners on root-cause analysis.
- Reviewed requirements and design specs to flag ambiguities and testing gaps early, reducing downstream rework.
- Maintained test data, environment configurations, and pre-conditions to keep test execution consistent and repeatable across cycles.
- Re-tested and regression-checked bug fixes to confirm no impact on existing functionality.
- Coordinated UAT and release activities, supporting cross-functional teams through deployment.
- Led knowledge-sharing sessions and feature walkthroughs to bring the team up to speed on new functionality.

EDUCATION
Master of Computer Applications (MCA) (2021 – 2023)
New Horizon College of Engineering, Bengaluru

ADDITIONAL INFORMATION
Languages: English, Hindi | Nationality: Indian`;
}
