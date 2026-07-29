/**
 * THE HEAVEN CAKE - Premium Web Application Interaction Engine
 * Features: Apple-inspired micro-interactions, scroll reveals, lazy features, WhatsApp automation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide SVG Icons
  try {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (err) {
    console.error("Lucide icons initialization failed:", err);
  }

  const initializers = [
    { name: 'Loader', fn: initLoader },
    { name: 'ScrollEffects', fn: initScrollEffects },
    { name: 'MobileNav', fn: initMobileNav },
    { name: 'AdminSystem', fn: initAdminSystem },
    { name: 'ScrollReveal', fn: initScrollReveal },
    { name: 'StatsCounter', fn: initStatsCounter },
    { name: 'TestimonialsSlider', fn: initTestimonialsSlider },
    { name: 'FaqAccordion', fn: initFaqAccordion },
    { name: 'MouseParallax', fn: initMouseParallax },
    { name: 'Particles', fn: initParticles },
    { name: 'SplitTextAnimation', fn: initSplitTextAnimation },
    { name: 'WhyChooseLoop', fn: initWhyChooseLoop },
    { name: 'HeroScrollAnimation', fn: initHeroScrollAnimation },
    { name: 'CakeCustomizer', fn: initCakeCustomizer },
    { name: 'ActivityToasts', fn: initActivityToasts },
    { name: 'ModalPricingWeight', fn: initModalPricingWeightListener },
    { name: 'BoutiqueMoodSelector', fn: initBoutiqueMoodSelector },
    { name: 'AboutTriptych', fn: initAboutTriptych }
  ];

  initializers.forEach(item => {
    try {
      if (typeof item.fn === 'function') {
        item.fn();
      } else {
        console.warn(`Initializer for ${item.name} is not a function.`);
      }
    } catch (err) {
      console.error(`Failed to initialize ${item.name}:`, err);
    }
  });
});

// 1. PRELOADER SCREEN & LOGO ANIMATION
function initLoader() {
  const loader = document.getElementById('loader');
  const progressBar = document.getElementById('loader-progress');
  
  if (!loader || !progressBar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        document.body.style.overflowY = 'auto'; // Enable scrolling after load
      }, 500);
    }
  }, 100);
}

// 2. SCROLL METRICS (Navbar, Scroll Progress, Scroll-To-Top)
function initScrollEffects() {
  const header = document.getElementById('main-header');
  const scrollProgress = document.getElementById('scroll-progress');
  const scrollTopBtn = document.getElementById('scroll-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;

    // A. Sticky Header Blur
    if (scrollPosition > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }

    // B. Reading Progress
    if (totalHeight > 0) {
      const progressPercent = (scrollPosition / totalHeight) * 100;
      scrollProgress.style.width = `${progressPercent}%`;
    }

    // C. Scroll To Top Visibility
    if (scrollPosition > 500) {
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }

    // D. Active Nav Link on Scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Scroll to Top action
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// 3. MOBILE NAVIGATION DRAWER
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// 4. SCROLL REVEAL (Framer Motion style transitions)
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null, // Viewport
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Adjust bounds
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

// 5. WHY CHOOSE US - STATS COUNT-UP ANIMATION
function initStatsCounter() {
  const statsSection = document.getElementById('stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (!statsSection || statNumbers.length === 0) return;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * target);

      if (target >= 1000) {
        // Format with thousands separator
        element.textContent = currentVal.toLocaleString() + '+';
      } else if (target === 99 || target === 100) {
        element.textContent = currentVal + '%';
      } else {
        element.textContent = currentVal + '+';
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(num => countUp(num));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

// 6. CUSTOM AUTOPLAY TESTIMONIALS SLIDER
function initTestimonialsSlider() {
  const carousel = document.getElementById('reviews-carousel');
  const dots = document.querySelectorAll('.carousel-dot');
  const slides = document.querySelectorAll('.review-slide');

  if (!carousel || slides.length === 0) return;

  let currentIdx = 0;
  let autoplayTimer;

  const updateSlider = (idx) => {
    carousel.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[idx].classList.add('active');
    currentIdx = idx;
  };

  const nextSlide = () => {
    let nextIdx = currentIdx + 1;
    if (nextIdx >= slides.length) nextIdx = 0;
    updateSlider(nextIdx);
  };

  const startAutoplay = () => {
    autoplayTimer = setInterval(nextSlide, 5000); // Shift every 5 seconds
  };

  const stopAutoplay = () => {
    clearInterval(autoplayTimer);
  };

  // Click on Dots handler
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      stopAutoplay();
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      updateSlider(idx);
      startAutoplay();
    });
  });

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

// 7. FAQ ANIMATED ACCORDION
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Collapse all FAQ items first
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Toggle state of clicked item
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
      }
    });
  });
}

// 8. CURSOR PARALLAX FLOATING HERO GRAPHICS
function initMouseParallax() {
  const hero = document.getElementById('home');
  const floatElems = document.querySelectorAll('.float-elem');

  if (!hero || floatElems.length === 0) return;

  hero.addEventListener('mousemove', (e) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Calculate cursor distance from center (-0.5 to 0.5)
    const pageX = (e.clientX / width) - 0.5;
    const pageY = (e.clientY / height) - 0.5;

    floatElems.forEach((elem, index) => {
      const depth = (index + 1) * 20; // Parallax depth multiplier
      const xVal = pageX * depth;
      const yVal = pageY * depth;
      
      // Smooth movement updates
      elem.style.transform = `translate(${xVal}px, ${yVal}px)`;
    });
  });
}

// 9. SEARCH & FILTER DYNAMIC CAKES MENU
function getCategoryPricingInfo(category) {
  switch (category) {
    case 'Classic Cakes':
      return 'Half Kg: ₹350 | 1Kg: ₹650 | Pastry: ₹60';
    case 'Premium Cakes':
      return 'Half Kg: ₹400 | 1Kg: ₹750 | Pastry: ₹60';
    case 'Exotic Cakes':
      return 'Half Kg: ₹450 | 1Kg: ₹850 | Pastry: ₹80';
    case 'Premium Choco Cakes':
      return 'Half Kg: ₹500 | 1Kg: ₹1000 | Pastry: ₹100';
    case 'Premium Exotic':
      return 'Half Kg: ₹550 | 1Kg: ₹1100 | Pastry: ₹100';
    case 'Cheese Cakes':
      return 'Half Kg: ₹550 | 1Kg: ₹1100 | Pastry: ₹110';
    case 'Cupcakes':
      return 'Regular: ₹25 | Large: ₹50 | Customized: ₹100';
    case 'Custom Cakes':
      return 'Photo Cake 1Kg: ₹1050 (Half Kg: ₹650) | Shape Cake 1Kg: ₹1099 | 3D: ₹1500';
    case 'Desserts':
      return 'Muffins: ₹45 | Donuts: ₹50 | Brownies: ₹55 | Glass: ₹65 | Lava: ₹60 | Bar Cake: ₹100 | Tarts: ₹35';
    default:
      return '';
  }
}

window.getCategoryPricingInfo = getCategoryPricingInfo;

function getProductSizesAndPrices(item) {
  const name = item.name ? item.name.toLowerCase() : '';
  const category = item.category || 'Classic Cakes';

  // Cupcakes
  if (category === 'Cupcakes') {
    return [
      { label: 'Regular', price: '25', value: 'Regular' },
      { label: 'Large', price: '50', value: 'Large' },
      { label: 'Customized', price: '100', value: 'Customized' }
    ];
  }

  // Desserts: Tarts only
  if (category === 'Desserts') {
    if (name.includes('tart')) {
      return [
        { label: 'All Fav', price: '35', value: 'All Fav' },
        { label: 'Large', price: '60', value: 'Large' }
      ];
    }
    return null;
  }

  // Custom Cakes
  if (category === 'Custom Cakes') {
    if (name.includes('photo')) {
      return [
        { label: 'Half Kg', price: '650', value: 'Half Kg' },
        { label: '1 Kg', price: '1050', value: '1 Kg' }
      ];
    }
    return null;
  }

  // Standard Cakes
  switch (category) {
    case 'Classic Cakes':
      return [
        { label: 'Half Kg', price: '350', value: 'Half Kg' },
        { label: '1 Kg', price: '650', value: '1 Kg' },
        { label: 'Pastry', price: '60', value: 'Pastry' }
      ];
    case 'Premium Cakes':
      return [
        { label: 'Half Kg', price: '400', value: 'Half Kg' },
        { label: '1 Kg', price: '750', value: '1 Kg' },
        { label: 'Pastry', price: '60', value: 'Pastry' }
      ];
    case 'Exotic Cakes':
      return [
        { label: 'Half Kg', price: '450', value: 'Half Kg' },
        { label: '1 Kg', price: '850', value: '1 Kg' },
        { label: 'Pastry', price: '80', value: 'Pastry' }
      ];
    case 'Premium Choco Cakes':
      return [
        { label: 'Half Kg', price: '500', value: 'Half Kg' },
        { label: '1 Kg', price: '1000', value: '1 Kg' },
        { label: 'Pastry', price: '100', value: 'Pastry' }
      ];
    case 'Premium Exotic':
      return [
        { label: 'Half Kg', price: '550', value: 'Half Kg' },
        { label: '1 Kg', price: '1100', value: '1 Kg' },
        { label: 'Pastry', price: '100', value: 'Pastry' }
      ];
    case 'Cheese Cakes':
      return [
        { label: 'Half Kg', price: '550', value: 'Half Kg' },
        { label: '1 Kg', price: '1100', value: '1 Kg' },
        { label: 'Pastry', price: '110', value: 'Pastry' }
      ];
    default:
      return null;
  }
}
window.getProductSizesAndPrices = getProductSizesAndPrices;

function changeCardSize(pillElement, cardIndex, sizeLabel, price, sizeValue, cakeName, cakeImg, category) {
  // Update active pill state
  const container = pillElement.closest('.card-size-selector');
  if (container) {
    const pills = container.querySelectorAll('.size-pill');
    pills.forEach(p => p.classList.remove('active'));
    pillElement.classList.add('active');
  }

  // Update card displayed price and label
  const card = pillElement.closest('.product-card');
  if (card) {
    const priceValueEl = card.querySelector('.price-value');
    if (priceValueEl) {
      priceValueEl.textContent = `₹${price}`;
    }
    const priceLabelEl = card.querySelector('.price-label');
    if (priceLabelEl) {
      priceLabelEl.textContent = 'Price';
    }

    // Update the Order Now button click handler
    const orderBtn = card.querySelector('.product-btn-order');
    if (orderBtn) {
      const escapedName = cakeName.replace(/'/g, "\\'");
      orderBtn.setAttribute('onclick', `openOrderModal('${escapedName}', '₹${price}', '${cakeImg}', '${sizeValue}', '${category}')`);
    }
  }
}
window.changeCardSize = changeCardSize;

function filterCategory(element, categoryName) {
  // Update Active Pill state
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => pill.classList.remove('active'));
  element.classList.add('active');

  const productsGrid = document.getElementById('products-grid');
  const productCards = document.querySelectorAll('.product-card');
  const searchInput = document.getElementById('cake-search');

  // Update Category Pricing Banner
  const pricingBanner = document.getElementById('category-pricing-banner');
  const pricingText = document.getElementById('category-pricing-text');
  if (pricingBanner && pricingText) {
    const infoText = getCategoryPricingInfo(categoryName);
    if (infoText) {
      pricingText.textContent = `${categoryName} Rates - ${infoText}`;
      pricingBanner.style.display = 'flex';
    } else {
      pricingBanner.style.display = 'none';
    }
  }

  // Clear search field during category shifts
  if (searchInput) searchInput.value = '';

  let visibleCount = 0;

  productCards.forEach(card => {
    const categoriesStr = card.getAttribute('data-category');
    const categoriesArray = categoriesStr.split(',').map(s => s.trim());

    if (categoryName === 'all' || categoriesArray.includes(categoryName)) {
      card.style.display = 'flex';
      visibleCount++;
      // Re-trigger scroll reveal transitions inside visible cards
      setTimeout(() => card.classList.add('revealed'), 50);
    } else {
      card.style.display = 'none';
    }
  });

  manageNoResults(visibleCount);
}

// Category selection helper from categories cards
function filterByCategory(categoryName) {
  // Try exact match first
  let targetPill = Array.from(document.querySelectorAll('.filter-pill'))
    .find(pill => pill.textContent.trim().toLowerCase() === categoryName.toLowerCase());
  
  // Try partial include matches if exact fails
  if (!targetPill) {
    targetPill = Array.from(document.querySelectorAll('.filter-pill'))
      .find(pill => pill.textContent.trim().toLowerCase().includes(categoryName.toLowerCase()) || 
                    categoryName.toLowerCase().includes(pill.textContent.trim().toLowerCase()));
  }

  // Fallback to substring match
  if (!targetPill) {
    targetPill = Array.from(document.querySelectorAll('.filter-pill'))
      .find(pill => pill.textContent.trim().toLowerCase().includes(categoryName.substring(0, 5).toLowerCase()));
  }
  
  if (targetPill) {
    targetPill.click();
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
  } else {
    // If not found in simple pills list, default to first available pill
    const firstPill = document.querySelector('.filter-pill');
    if (firstPill) {
      firstPill.click();
    }
  }
}

// Live Search Input Filter
function filterCakes() {
  const query = document.getElementById('cake-search').value.toLowerCase().trim();
  const productCards = document.querySelectorAll('.product-card');
  const pills = document.querySelectorAll('.filter-pill');

  // Reset active filter pills back to 'All'
  pills.forEach(pill => pill.classList.remove('active'));
  const allPill = Array.from(pills).find(p => p.textContent.includes('All'));
  if (allPill) allPill.classList.add('active');

  let visibleCount = 0;

  productCards.forEach(card => {
    const name = card.getAttribute('data-name').toLowerCase();
    const categories = card.getAttribute('data-category').toLowerCase();
    const description = card.querySelector('.product-desc').textContent.toLowerCase();

    if (name.includes(query) || categories.includes(query) || description.includes(query)) {
      card.style.display = 'flex';
      visibleCount++;
      setTimeout(() => card.classList.add('revealed'), 50);
    } else {
      card.style.display = 'none';
    }
  });

  manageNoResults(visibleCount);
}

// Handles showing / hiding "No Results Found"
function manageNoResults(count) {
  const grid = document.getElementById('products-grid');
  let noResultsEl = document.getElementById('no-results-view');

  if (count === 0) {
    if (!noResultsEl) {
      noResultsEl = document.createElement('div');
      noResultsEl.id = 'no-results-view';
      noResultsEl.className = 'no-results reveal reveal-up revealed';
      noResultsEl.innerHTML = `
        <svg class="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
        <h3>No sweet treats match your query</h3>
        <p>Try searching for Chocolate, Velvet, Truffle, or resetting the category filter.</p>
      `;
      grid.appendChild(noResultsEl);
    }
  } else {
    if (noResultsEl) {
      noResultsEl.remove();
    }
  }
}

// 10. QUICK ORDER MODAL INTERACTION
function openOrderModal(cakeName, cakePrice, cakeImg, selectedWeight = '1 kg', category = 'Classic Cakes') {
  const modal = document.getElementById('order-modal');
  const nameEl = document.getElementById('modal-cake-name');
  const priceEl = document.getElementById('modal-cake-price');
  const imgEl = document.getElementById('modal-cake-img');

  if (!modal || !nameEl || !priceEl || !imgEl) return;

  nameEl.textContent = cakeName;
  priceEl.textContent = cakePrice;
  imgEl.src = cakeImg;
  imgEl.alt = cakeName;

  // Store active category for price updates inside the modal
  modal.setAttribute('data-category', category);

  // Rebuild modal weight dropdown options and pre-select current weight
  updateModalWeightOptions(category, selectedWeight, cakeName);

  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Stop background scrolling
}

function updateModalWeightOptions(category, selectedWeight, cakeName) {
  const weightSelect = document.getElementById('modal-weight');
  if (!weightSelect) return;

  weightSelect.innerHTML = ''; // Clear previous options
  const nameLower = cakeName ? cakeName.toLowerCase() : '';

  if (category === 'Cupcakes') {
    const options = [
      { value: 'Regular', text: 'Regular (₹25)' },
      { value: 'Large', text: 'Large (₹50)' },
      { value: 'Customized', text: 'Customized (₹100)' }
    ];
    options.forEach(opt => {
      const el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.text;
      weightSelect.appendChild(el);
    });
  } else if (category === 'Desserts') {
    if (nameLower.includes('tart')) {
      const options = [
        { value: 'All Fav', text: 'All Fav (₹35)' },
        { value: 'Large', text: 'Large (₹60)' }
      ];
      options.forEach(opt => {
        const el = document.createElement('option');
        el.value = opt.value;
        el.textContent = opt.text;
        weightSelect.appendChild(el);
      });
    } else {
      const el = document.createElement('option');
      el.value = 'Standard';
      el.textContent = 'Standard';
      weightSelect.appendChild(el);
    }
  } else if (category === 'Custom Cakes') {
    if (nameLower.includes('photo')) {
      const options = [
        { value: 'Half Kg', text: 'Half Kg (₹650)' },
        { value: '1 kg', text: '1 kg (₹1050)' }
      ];
      options.forEach(opt => {
        const el = document.createElement('option');
        el.value = opt.value;
        el.textContent = opt.text;
        weightSelect.appendChild(el);
      });
    } else if (nameLower.includes('shape')) {
      const el = document.createElement('option');
      el.value = '1 kg';
      el.textContent = '1 kg (₹1099)';
      weightSelect.appendChild(el);
    } else {
      const el = document.createElement('option');
      el.value = '1 kg';
      el.textContent = '1 kg (₹1500)';
      weightSelect.appendChild(el);
    }
  } else {
    // Standard Cakes: Classic, Premium, Exotic, Premium Choco, Premium Exotic, Cheese Cakes
    let halfPrice = '', onePrice = '', pastryPrice = '';
    if (category === 'Classic Cakes') { halfPrice = '350'; onePrice = '650'; pastryPrice = '60'; }
    else if (category === 'Premium Cakes') { halfPrice = '400'; onePrice = '750'; pastryPrice = '60'; }
    else if (category === 'Exotic Cakes') { halfPrice = '450'; onePrice = '850'; pastryPrice = '80'; }
    else if (category === 'Premium Choco Cakes') { halfPrice = '500'; onePrice = '1000'; pastryPrice = '100'; }
    else if (category === 'Premium Exotic') { halfPrice = '550'; onePrice = '1100'; pastryPrice = '100'; }
    else if (category === 'Cheese Cakes') { halfPrice = '550'; onePrice = '1100'; pastryPrice = '110'; }

    const options = [];
    if (halfPrice) options.push({ value: 'Half Kg', text: `Half Kg (₹${halfPrice})` });
    if (onePrice) options.push({ value: '1 kg', text: `1 kg (₹${onePrice})` });
    
    // Add standard ordering custom weights
    options.push({ value: '1.5 kg', text: '1.5 kg' });
    options.push({ value: '2 kg', text: '2 kg' });
    options.push({ value: '3 kg', text: '3 kg' });
    
    if (pastryPrice) options.push({ value: 'Pastry', text: `Pastry (₹${pastryPrice})` });

    options.forEach(opt => {
      const el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.text;
      weightSelect.appendChild(el);
    });
  }

  // Pre-select the target weight/size
  if (selectedWeight) {
    let selectVal = selectedWeight;
    if (selectedWeight.toLowerCase() === '1 kg') {
      selectVal = '1 kg';
    }
    weightSelect.value = selectVal;
  }
}

function initModalPricingWeightListener() {
  const weightSelect = document.getElementById('modal-weight');
  if (!weightSelect) return;

  weightSelect.addEventListener('change', (e) => {
    const modal = document.getElementById('order-modal');
    if (!modal) return;
    const category = modal.getAttribute('data-category') || 'Classic Cakes';
    const selectedValue = e.target.value;
    const priceEl = document.getElementById('modal-cake-price');
    const cakeName = document.getElementById('modal-cake-name').textContent;
    if (!priceEl) return;

    let price = '';
    const nameLower = cakeName ? cakeName.toLowerCase() : '';

    if (category === 'Cupcakes') {
      if (selectedValue === 'Regular') price = '25';
      else if (selectedValue === 'Large') price = '50';
      else if (selectedValue === 'Customized') price = '100';
    } else if (category === 'Desserts') {
      if (selectedValue === 'All Fav') price = '35';
      else if (selectedValue === 'Large') price = '60';
    } else if (category === 'Custom Cakes') {
      if (nameLower.includes('photo')) {
        if (selectedValue === 'Half Kg') price = '650';
        else if (selectedValue === '1 kg') price = '1050';
      } else if (nameLower.includes('shape')) {
        price = '1099';
      } else {
        price = '1500';
      }
    } else {
      // Standard Cakes
      if (selectedValue === 'Half Kg') {
        if (category === 'Classic Cakes') price = '350';
        else if (category === 'Premium Cakes') price = '400';
        else if (category === 'Exotic Cakes') price = '450';
        else if (category === 'Premium Choco Cakes') price = '500';
        else if (category === 'Premium Exotic') price = '550';
        else if (category === 'Cheese Cakes') price = '550';
      } else if (selectedValue === '1 kg') {
        if (category === 'Classic Cakes') price = '650';
        else if (category === 'Premium Cakes') price = '750';
        else if (category === 'Exotic Cakes') price = '850';
        else if (category === 'Premium Choco Cakes') price = '1000';
        else if (category === 'Premium Exotic') price = '1100';
        else if (category === 'Cheese Cakes') price = '1100';
      } else if (selectedValue === 'Pastry') {
        if (category === 'Classic Cakes') price = '60';
        else if (category === 'Premium Cakes') price = '60';
        else if (category === 'Exotic Cakes') price = '80';
        else if (category === 'Premium Choco Cakes') price = '100';
        else if (category === 'Premium Exotic') price = '100';
        else if (category === 'Cheese Cakes') price = '110';
      }
    }

    if (price) {
      priceEl.textContent = `₹${price}`;
    } else if (selectedValue.includes('kg')) {
      priceEl.textContent = 'Price on Inquiry';
    }
  });
}


function closeOrderModal() {
  const modal = document.getElementById('order-modal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = 'auto'; // Re-enable scroll
}

// Modal Order WhatsApp dispatch
function handleModalSubmit(event) {
  event.preventDefault();

  const cakeName = document.getElementById('modal-cake-name').textContent;
  const cakePrice = document.getElementById('modal-cake-price').textContent;
  const customerName = document.getElementById('modal-name').value;
  const cakeWeight = document.getElementById('modal-weight').value;
  const cakeMessage = document.getElementById('modal-message').value || 'None';
  const specialInstructions = document.getElementById('modal-instructions').value || 'None';

  // Format WhatsApp String
  const phone = '919644553363'; // The Heaven Cake Kumbla WhatsApp
  const textMsg = `*The Heaven Cake - New Order Request*%0A%0A` +
                  `🎂 *Cake:* ${cakeName}%0A` +
                  `💵 *Price:* ${cakePrice}%0A` +
                  `👤 *Name:* ${customerName}%0A` +
                  `⚖️ *Weight:* ${cakeWeight}%0A` +
                  `🌱 *Dietary:* 100% Vegetarian (Eggless)%0A` +
                  `✍️ *Message on Cake:* ${cakeMessage}%0A` +
                  `📝 *Instructions:* ${specialInstructions}`;

  const whatsappUrl = `https://wa.me/${phone}?text=${textMsg}`;
  
  // Open in new tab
  window.open(whatsappUrl, '_blank');
  closeOrderModal();
}

// 11. GENERAL FORMS & NEWSLETTER DISPATCH
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('form-name').value;
  const phone = document.getElementById('form-phone').value;
  const date = document.getElementById('form-date').value || 'Not scheduled';
  const occasion = document.getElementById('form-cake-type').value;
  const notes = document.getElementById('form-notes').value;

  // Build WhatsApp request for Bespoke Inquiry
  const waPhone = '919644553363';
  const textMsg = `*The Heaven Cake - Bespoke Cake Inquiry*%0A%0A` +
                  `👤 *Name:* ${name}%0A` +
                  `📞 *Phone:* ${phone}%0A` +
                  `📅 *Event Date:* ${date}%0A` +
                  `🎉 *Occasion:* ${occasion}%0A` +
                  `📝 *Design Details:* ${notes}`;

  const whatsappUrl = `https://wa.me/${waPhone}?text=${textMsg}`;
  window.open(whatsappUrl, '_blank');
  
  // Reset form
  document.getElementById('contact-form').reset();
}

function handleNewsletterSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById('newsletter-email');
  if (emailInput) {
    alert(`Thank you for subscribing! We've registered ${emailInput.value} for Sweet Alerts.`);
    emailInput.value = '';
  }
}

// 12. FLOATING PARTICLES CANVAS ANIMATION
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  const numberOfParticles = 35;

  // Set canvas size matching the hero layout container
  function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 5 + 1; // size between 1 and 6px
      this.speedX = Math.random() * 0.4 - 0.2; // slow drift
      this.speedY = Math.random() * 0.4 - 0.2;
      
      // Select beautiful brand theme colors
      const colors = ['#C9A227', '#FADADD', '#FFE5D4', '#FFFDF9'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.5 + 0.1; // alpha
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around screen bounds
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();
}

// 13. SPLIT TEXT ANIMATION FOR HERO TITLE
function initSplitTextAnimation() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  // Split text content into spans (preserving any custom nested tags like <span>Heaven</span>)
  splitTextElement(title);

  // Register GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo('.hero-title .split-char', 
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.25,
        ease: 'power3.out',
        stagger: 0.05, // delay of 50ms per letter
        scrollTrigger: {
          trigger: '.hero-title',
          start: 'top 85%',
          once: true,
          fastScrollEnd: true
        }
      }
    );
  }
}

// Text splitter helper preserving inner elements (like <span>Heaven</span>)
function splitTextElement(element) {
  if (!element) return;
  const nodes = Array.from(element.childNodes);
  element.innerHTML = ''; // Clear original content

  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(' ');
      words.forEach((word, wordIdx) => {
        if (word === '' && wordIdx > 0) return;
        
        const wordSpan = document.createElement('span');
        wordSpan.className = 'split-word';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';
        
        Array.from(word).forEach(char => {
          const charSpan = document.createElement('span');
          charSpan.className = 'split-char';
          charSpan.style.display = 'inline-block';
          charSpan.style.willChange = 'transform, opacity';
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
        });
        
        element.appendChild(wordSpan);
        
        if (wordIdx < words.length - 1) {
          element.appendChild(document.createTextNode(' '));
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const wordSpan = document.createElement('span');
      // Inherit original classes (e.g. logo span details)
      wordSpan.className = `split-word ${node.className}`;
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      
      const text = node.textContent;
      Array.from(text).forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.className = 'split-char';
        charSpan.style.display = 'inline-block';
        charSpan.style.willChange = 'transform, opacity';
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
      });
      
      element.appendChild(wordSpan);
    }
  });
}

// 14. LOGO LOOP / MARQUEE ANIMATION FOR WHY CHOOSE CARDS
function initWhyChooseLoop() {
  const container = document.getElementById('why-choose-loop');
  const track = document.getElementById('why-choose-track');
  const list = document.getElementById('why-choose-list');

  if (!container || !track || !list) return;

  const speed = 65; // speed in px per second
  const smoothTau = 0.25; // deceleration damping factor
  
  let listWidth = list.offsetWidth;
  let containerWidth = container.clientWidth;
  
  function setupCopies() {
    listWidth = list.offsetWidth;
    containerWidth = container.clientWidth;
    if (listWidth === 0) return;

    // Clear existing copies
    const existingLists = Array.from(track.querySelectorAll('.logoloop__list'));
    existingLists.forEach((el, idx) => {
      if (idx > 0) el.remove();
    });

    // Calculate copy count matching container size + padding headroom
    const copiesNeeded = Math.ceil(containerWidth / listWidth) + 2;
    const finalCopies = Math.max(2, copiesNeeded);

    // Clone list nodes
    for (let i = 1; i < finalCopies; i++) {
      const clone = list.cloneNode(true);
      clone.removeAttribute('id');
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
  }

  let isHovered = false;
  
  container.addEventListener('mouseenter', () => {
    isHovered = true;
  });
  container.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  window.addEventListener('resize', () => {
    setupCopies();
    listWidth = list.offsetWidth;
    containerWidth = container.clientWidth;
  });

  // Calculate widths after a slight delay to ensure browser paints first
  setTimeout(() => {
    setupCopies();
  }, 100);

  let lastTimestamp = null;
  let offset = 0;
  let velocity = speed;
  let rAF = null;

  function animate(timestamp) {
    if (lastTimestamp === null) {
      lastTimestamp = timestamp;
    }
    const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    const targetVelocity = isHovered ? 0 : speed;

    // Deceleration easing formula
    const easingFactor = 1 - Math.exp(-deltaTime / smoothTau);
    velocity += (targetVelocity - velocity) * easingFactor;

    if (listWidth > 0) {
      offset = offset + velocity * deltaTime;
      offset = ((offset % listWidth) + listWidth) % listWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }

    rAF = requestAnimationFrame(animate);
  }

  rAF = requestAnimationFrame(animate);
}

// 15. INTERACTIVE TAB NAVIGATION FOR ABOUT US SECTION
function switchAboutTab(tabId) {
  const container = document.getElementById('about');
  if (!container) return;

  const buttons = container.querySelectorAll('.about-tab-btn');
  const contents = container.querySelectorAll('.about-tab-content');
  const triptychFrames = container.querySelectorAll('.triptych-frame');

  // Deactivate all buttons & contents & frames
  buttons.forEach(btn => btn.classList.remove('active'));
  contents.forEach(content => content.classList.remove('active'));
  triptychFrames.forEach(frame => frame.classList.remove('active'));

  // Activate target button & content & frame
  const targetBtn = Array.from(buttons).find(btn => btn.getAttribute('data-tab') === tabId);
  const targetContent = document.getElementById(`about-tab-${tabId}`);
  const targetFrame = Array.from(triptychFrames).find(frame => frame.getAttribute('data-triptych-tab') === tabId);

  if (targetBtn && targetContent) {
    targetBtn.classList.add('active');
    targetContent.classList.add('active');
    if (targetFrame) targetFrame.classList.add('active');

    // Trigger Lucide SVG re-creation if needed for icons inside the newly active tab
    try {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    } catch (err) {
      console.warn("Lucide icons recreate failed in about tab:", err);
    }
  }
}

window.switchAboutTab = switchAboutTab;

// 15b. ABOUT TRIPTYCH INTERACTIVE GALLERY CONTROL
function initAboutTriptych() {
  const container = document.getElementById('about');
  if (!container) return;

  const triptychFrames = container.querySelectorAll('.triptych-frame');
  triptychFrames.forEach(frame => {
    const tabId = frame.getAttribute('data-triptych-tab');
    
    // Switch tab on click
    frame.addEventListener('click', () => {
      switchAboutTab(tabId);
    });

    // Also support hover interaction
    frame.addEventListener('mouseenter', () => {
      switchAboutTab(tabId);
    });
  });
}

// 16. HERO IMAGE SCROLL TRIGGER AUTOMATION
function initHeroScrollAnimation() {
  if (window.innerWidth <= 768) return; // Bypass scroll animation on mobile screens
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Smoothly scale down, slide, and fade the main centered hero content as the user scrolls
    if (document.querySelector('.hero-content')) {
      gsap.to('.hero-content', {
        y: 60,
        scale: 0.98,
        opacity: 0.6,
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }
}

// 16b. BOUTIQUE MOOD SELECTOR (SPECIAL FEATURE)
function initBoutiqueMoodSelector() {
  const videoPlayer = document.getElementById('hero-video-player');

  // Setup background video autoplay handling
  if (videoPlayer) {
    const handlePlaying = () => {
      videoPlayer.classList.remove('video-hidden');
      videoPlayer.classList.add('video-playing');
    };

    videoPlayer.addEventListener('playing', handlePlaying);
    
    if (!videoPlayer.paused) {
      handlePlaying();
    } else {
      videoPlayer.play().then(() => {
        handlePlaying();
      }).catch(err => {
        console.warn("Hero video autoplay attempt:", err);
      });
    }

    setTimeout(() => {
      if (videoPlayer.paused) {
        videoPlayer.play().then(handlePlaying).catch(() => {});
      }
    }, 1000);
  }

  const moodSelector = document.querySelector('.hero-mood-selector');
  if (!moodSelector) return;

  const tabs = moodSelector.querySelectorAll('.mood-tab');
  const titleElem = document.getElementById('hero-title');
  const descElem = document.getElementById('hero-desc');
  const imgMain = document.getElementById('hero-img-main');
  if (!titleElem || !descElem || !imgMain) return;

  const HERO_MOODS = {
    classic: {
      title: 'Every Celebration Begins With <span class="title-highlight">Heaven</span>',
      desc: 'Artisanal cakes meticulously designed and baked daily using premium natural ingredients. Elevating your special occasions with absolute culinary elegance.',
      mainImg: 'images/hero_cake.jpg',
      videoLocal: 'video/make_a_video_for_this_to_put_i.mp4',
      videoBackup: 'https://videos.pexels.com/video-files/3125396/3125396-sd_540_960_25fps.mp4',
      composition: 'Madagascar Vanilla Bean & Fresh Cream',
      profile: 'Delicate, Silky, Creamy',
      specs: '1.5 kg • Serves 12-15 Pax'
    },
    decadence: {
      title: 'Indulge in Curated <span class="title-highlight">Decadence</span>',
      desc: 'Rich, intense dark chocolate layers paired with premium cocoa infusions. Crafted meticulously for the ultimate chocolate connoisseur.',
      mainImg: 'images/hero_chocolate.jpg',
      videoLocal: 'images/hero_video_decadence.mp4',
      videoBackup: 'https://videos.pexels.com/video-files/856264/856264-sd_540_960_30fps.mp4',
      composition: 'Belgian Dark Chocolate Ganache & Truffle',
      profile: 'Rich, Bittersweet, Fudgy',
      specs: '1.0 kg • Serves 8-10 Pax'
    },
    harvest: {
      title: 'Savor the Crisp <span class="title-highlight">Harvest</span>',
      desc: 'Light, airy sponge layered with fresh seasonal fruits and delicate creams. A refreshing, natural touch of sweetness for elegant celebrations.',
      mainImg: 'images/mango_cake.png',
      videoLocal: 'images/hero_video_harvest.mp4',
      videoBackup: 'https://videos.pexels.com/video-files/4255556/4255556-sd_540_960_25fps.mp4',
      composition: 'Fresh Alphonso Mango & Velvet Sponge',
      profile: 'Fruity, Refreshing, Zesty',
      specs: '1.2 kg • Serves 10-12 Pax'
    }
  };

  // Helper to safely play video with fallbacks
  function loadAndPlayVideo(localUrl, backupUrl) {
    if (!videoPlayer) return;
    
    videoPlayer.classList.remove('video-playing');
    
    // Set to local source first
    videoPlayer.src = localUrl;
    videoPlayer.load();
    
    const playPromise = videoPlayer.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Successfully playing local video
        videoPlayer.classList.remove('video-hidden');
      }).catch(err => {
        console.warn(`Local video (${localUrl}) failed to play, trying backup...`, err);
        // Try backup URL
        videoPlayer.src = backupUrl;
        videoPlayer.load();
        videoPlayer.play().then(() => {
          videoPlayer.classList.remove('video-hidden');
        }).catch(backupErr => {
          console.error("Backup video also failed to play:", backupErr);
          videoPlayer.classList.add('video-hidden');
          videoPlayer.classList.remove('video-playing');
        });
      });
    }
  }

  // Setup initial load tracking for the video player
  if (videoPlayer) {
    const handlePlaying = () => {
      videoPlayer.classList.remove('video-hidden');
      videoPlayer.classList.add('video-playing');
    };

    videoPlayer.addEventListener('playing', handlePlaying);
    
    // If the video is already playing (e.g. autoplayed before script execution), show it immediately
    if (!videoPlayer.paused) {
      handlePlaying();
    }
    
    videoPlayer.addEventListener('error', () => {
      console.warn("Hero video encountered an error, falling back to static image.");
      videoPlayer.classList.add('video-hidden');
      videoPlayer.classList.remove('video-playing');
    });

    // In some mobile browsers, autoplay is blocked and no error event fires, but the video remains paused.
    // We check after a short delay if it's paused.
    setTimeout(() => {
      if (videoPlayer.paused) {
        videoPlayer.play().then(() => {
          handlePlaying();
        }).catch(() => {
          console.warn("Autoplay was blocked or failed, showing static image.");
          videoPlayer.classList.add('video-hidden');
          videoPlayer.classList.remove('video-playing');
        });
      }
    }, 1500);
  }

  let isTransitioning = false;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (isTransitioning || tab.classList.contains('active')) return;

      const targetMood = tab.getAttribute('data-mood');
      const moodData = HERO_MOODS[targetMood];
      if (!moodData) return;

      isTransitioning = true;

      // Update active tab class immediately
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Add fade-out classes
      titleElem.classList.add('hero-fade-out');
      descElem.classList.add('hero-fade-out');
      imgMain.classList.add('hero-img-fade-out');
      if (videoPlayer) {
        videoPlayer.classList.add('hero-img-fade-out');
      }
      if (compElem) compElem.classList.add('hero-fade-out');
      if (profileElem) profileElem.classList.add('hero-fade-out');
      if (specsElem) specsElem.classList.add('hero-fade-out');

      // Wait for fade-out transition, then swap content and fade back in
      setTimeout(() => {
        titleElem.innerHTML = moodData.title;
        descElem.textContent = moodData.desc;
        imgMain.src = moodData.mainImg;
        if (compElem) compElem.textContent = moodData.composition;
        if (profileElem) profileElem.textContent = moodData.profile;
        if (specsElem) specsElem.textContent = moodData.specs;

        if (videoPlayer) {
          videoPlayer.poster = moodData.mainImg;
          loadAndPlayVideo(moodData.videoLocal, moodData.videoBackup);
        }

        // Remove fade-out classes after updating content
        titleElem.classList.remove('hero-fade-out');
        descElem.classList.remove('hero-fade-out');
        imgMain.classList.remove('hero-img-fade-out');
        if (videoPlayer) {
          videoPlayer.classList.remove('hero-img-fade-out');
        }
        if (compElem) compElem.classList.remove('hero-fade-out');
        if (profileElem) profileElem.classList.remove('hero-fade-out');
        if (specsElem) specsElem.classList.remove('hero-fade-out');

        isTransitioning = false;
      }, 400); // Matches the 0.4s CSS transition time
    });
  });
}

// 17. INTERACTIVE CAKE CUSTOMIZER & PRICE CALCULATIONS
function initCakeCustomizer() {
  const form = document.getElementById('cake-customizer-form');
  if (!form) return;

  // Initialize the values on page load
  updateCustomizer();

  // Attach change listeners to text/message inputs too
  const messageInput = document.getElementById('custom-message');
  const instructionsInput = document.getElementById('custom-instructions');
  
  if (messageInput) messageInput.addEventListener('input', updateCustomizer);
  if (instructionsInput) instructionsInput.addEventListener('input', updateCustomizer);
}

function updateToppingsVisuals(topTierElement) {
  if (!topTierElement) return;
  const topFace = topTierElement.querySelector('.tier-top');
  if (!topFace) return;

  // Clear existing topping spans inside the top face
  const existingToppings = topFace.querySelectorAll('.topping-element');
  existingToppings.forEach(el => el.remove());

  const checkedToppings = document.querySelectorAll('.topping-pill input[type="checkbox"]:checked');
  
  checkedToppings.forEach(checkbox => {
    const toppingVal = checkbox.value;
    let icon = '';
    let count = 0;
    
    if (toppingVal.includes('Gold')) {
      icon = '✨';
      count = 8;
    } else if (toppingVal.includes('Strawberry')) {
      icon = '🍓';
      count = 4;
    } else if (toppingVal.includes('Macarons')) {
      icon = '🌸';
      count = 4;
    } else if (toppingVal.includes('Chocolate')) {
      icon = '🍫';
      count = 9;
    }
    
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'topping-element';
      el.textContent = icon;
      
      // Random coordinates distributed on the oval top face
      const angle = Math.random() * Math.PI * 2;
      const radiusX = 15 + Math.random() * 25; // Percentage offset
      const radiusY = 10 + Math.random() * 15;
      
      const left = 50 + Math.cos(angle) * radiusX;
      const topPos = 40 + Math.sin(angle) * radiusY;
      
      el.style.left = `${left}%`;
      el.style.top = `${topPos}%`;
      el.style.animationDelay = `${Math.random() * 2.5}s`;
      el.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg) scale(${0.75 + Math.random() * 0.45})`;
      
      topFace.appendChild(el);
    }
  });
}

function updateCustomizer() {
  const form = document.getElementById('cake-customizer-form');
  if (!form) return;

  // 1. Read input values
  const selectedFlavorEl = form.querySelector('input[name="flavor"]:checked');
  const flavor = selectedFlavorEl ? selectedFlavorEl.value : 'Belgian Chocolate Truffle';
  const flavorType = selectedFlavorEl ? selectedFlavorEl.parentElement.getAttribute('data-flavor') : 'chocolate';
  
  const selectedTiersEl = form.querySelector('input[name="tiers"]:checked');
  const tiers = selectedTiersEl ? parseInt(selectedTiersEl.value) : 1;
  
  const weight = parseFloat(document.getElementById('custom-weight').value || 1);
  
  // Update visual state for flavor pills
  const flavorPills = document.querySelectorAll('.flavor-pill');
  flavorPills.forEach(pill => {
    pill.classList.remove('active');
    if (pill.querySelector('input').checked) {
      pill.classList.add('active');
    }
  });

  // Update visual state for tier pills
  const tierPills = document.querySelectorAll('.tier-pill');
  tierPills.forEach(pill => {
    pill.classList.remove('active');
    if (pill.querySelector('input').checked) {
      pill.classList.add('active');
    }
  });

  // 2. Run calculations (aligned with official menu rates for 1Kg)
  let baseRate = 1000; // default Chocolate (Premium Choco: 1000)
  if (flavor.includes('Velvet')) baseRate = 1100; // Red Velvet (Premium Exotic: 1100)
  else if (flavor.includes('Butterscotch')) baseRate = 750; // Butterscotch (Premium Cakes: 750)
  else if (flavor.includes('Vanilla')) baseRate = 650; // Vanilla (Classic Cake: 650)
  else if (flavor.includes('Strawberry')) baseRate = 650; // Strawberry (Classic Cake: 650)
  else if (flavor.includes('Mango')) baseRate = 650; // Mango (Classic Cake: 650)

  const baseCost = baseRate * weight;
  const tierCost = tiers === 2 ? 500 : (tiers === 3 ? 1000 : 0);
  const prefCost = 0; // 100% vegetarian shop, no eggless surcharge
  
  let toppingsCost = 0;
  const checkedToppings = form.querySelectorAll('input[name="toppings"]:checked');
  checkedToppings.forEach(checkbox => {
    toppingsCost += parseInt(checkbox.getAttribute('data-price') || 0);
  });

  const totalCost = baseCost + tierCost + prefCost + toppingsCost;

  // 3. Update Text and Price elements
  const summaryFlavor = document.getElementById('summary-flavor-name');
  if (summaryFlavor) summaryFlavor.textContent = flavor;

  const basePriceEl = document.getElementById('summary-base-price');
  if (basePriceEl) basePriceEl.textContent = `₹${baseCost}`;

  const tierPriceEl = document.getElementById('summary-tier-price');
  if (tierPriceEl) tierPriceEl.textContent = `₹${tierCost}`;

  const prefPriceEl = document.getElementById('summary-pref-price');
  if (prefPriceEl) prefPriceEl.textContent = `₹${prefCost}`;

  const toppingsPriceEl = document.getElementById('summary-toppings-price');
  if (toppingsPriceEl) toppingsPriceEl.textContent = `₹${toppingsCost}`;

  const totalEl = document.getElementById('customizer-total-price');
  if (totalEl) totalEl.textContent = `₹${totalCost}`;

  // 4. Handle stacked 3D cylinder active states
  const tier1 = document.getElementById('preview-tier-1');
  const tier2 = document.getElementById('preview-tier-2');
  const tier3 = document.getElementById('preview-tier-3');

  const tiersList = [tier1, tier2, tier3];
  tiersList.forEach(t => {
    if (!t) return;
    // Strip flavor classes
    t.className = 'cake-tier';
  });

  if (tier1) {
    tier1.classList.add('active', 'tier-1', `flavor-${flavorType}`);
  }
  
  if (tier2) {
    if (tiers >= 2) {
      tier2.classList.add('active', 'tier-2', `flavor-${flavorType}`);
    } else {
      tier2.classList.add('tier-2');
    }
  }
  
  if (tier3) {
    if (tiers === 3) {
      tier3.classList.add('active', 'tier-3', `flavor-${flavorType}`);
    } else {
      tier3.classList.add('tier-3');
    }
  }

  // 5. Weight scale formatting
  const assembly = document.getElementById('cake-visual-assembly');
  if (assembly) {
    assembly.className = 'cake-visual-assembly';
    if (weight === 1) assembly.classList.add('weight-1');
    else if (weight === 1.5) assembly.classList.add('weight-1_5');
    else if (weight === 2) assembly.classList.add('weight-2');
    else if (weight === 3) assembly.classList.add('weight-3');
    else if (weight === 5) assembly.classList.add('weight-5');
  }

  // 6. Update Stats bubbles text
  const statWeight = document.getElementById('preview-stat-weight');
  if (statWeight) statWeight.textContent = `${weight} kg`;
  
  const statServings = document.getElementById('preview-stat-servings');
  if (statServings) {
    let servesText = '8-10 Pax';
    if (weight === 1.5) servesText = '12-15 Pax';
    else if (weight === 2) servesText = '16-20 Pax';
    else if (weight === 3) servesText = '24-30 Pax';
    else if (weight === 5) servesText = '40-50 Pax';
    statServings.textContent = servesText;
  }

  const statTiers = document.getElementById('preview-stat-tiers');
  if (statTiers) statTiers.textContent = `${tiers} Tier${tiers > 1 ? 's' : ''}`;

  // 7. Update Toppings visual position on top face of highest active tier
  const activeTiers = document.querySelectorAll('.cake-tier.active');
  if (activeTiers.length > 0) {
    const topTier = activeTiers[activeTiers.length - 1];
    updateToppingsVisuals(topTier);
  }
}

function handleCustomizerSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('cake-customizer-form');
  if (!form) return;

  const flavor = form.querySelector('input[name="flavor"]:checked').value;
  const tiers = form.querySelector('input[name="tiers"]:checked').value;
  const weight = document.getElementById('custom-weight').value;
  
  const toppingsList = [];
  const checkedToppings = form.querySelectorAll('input[name="toppings"]:checked');
  checkedToppings.forEach(cb => toppingsList.push(cb.value));
  const toppingsStr = toppingsList.length > 0 ? toppingsList.join(', ') : 'None';
  
  const message = document.getElementById('custom-message').value || 'None';
  const instructions = document.getElementById('custom-instructions').value || 'None';
  const customerName = document.getElementById('custom-customer-name').value;
  const customerPhone = document.getElementById('custom-customer-phone').value;
  const totalPrice = document.getElementById('customizer-total-price').textContent;

  const phone = '919644553363';
  
  const textMsg = `*The Heaven Cake - Custom Cake Order Request*%0A%0A` +
                  `👤 *Customer Name:* ${customerName}%0A` +
                  `📞 *Contact Phone:* ${customerPhone}%0A%0A` +
                  `🍰 *Cake Specifications:*%0A` +
                  `- *Base Flavor:* ${flavor}%0A` +
                  `- *Tiers:* ${tiers} Tier(s)%0A` +
                  `- *Weight:* ${weight} kg%0A` +
                  `- *Dietary Pref:* 100% Vegetarian (Eggless)%0A` +
                  `- *Luxury Toppings:* ${toppingsStr}%0A` +
                  `- *Writing on Cake:* "${message}"%0A%0A` +
                  `📝 *Instructions:* ${instructions}%0A%0A` +
                  `💰 *Estimated Price:* ${totalPrice}%0A%0A` +
                  `Please confirm my custom order reservation. Thank you!`;

  const whatsappUrl = `https://wa.me/${phone}?text=${textMsg}`;
  window.open(whatsappUrl, '_blank');
}

// 18. LIVE ACTIVITY TOAST NOTIFICATION SYSTEM
function initActivityToasts() {
  const toastContainer = document.getElementById('live-activity-toast');
  if (!toastContainer) return;

  const names = ['Aysha', 'Fatima', 'Priya Nair', 'Deekshith', 'Muhammed', 'Anjali', 'Shruthi', 'Rahul', 'Zainaba', 'Karthik', 'Mariyam', 'Siddharth'];
  const locations = ['Kumbla Town', 'Shiriya', 'Mogral', 'Uppala', 'Kasaragod', 'Badiadka', 'Kanwatheera', 'Naikapu', 'Kumble Bridge', 'Koipady'];
  const cakes = [
    { name: 'Heavenly Red Velvet Cake', price: '₹699' },
    { name: 'Belgian Chocolate Truffle', price: '₹799' },
    { name: 'Classic Black Forest Cake', price: '₹599' },
    { name: 'Premium Butterscotch Cake', price: '₹649' },
    { name: 'Bespoke 2-Tier Wedding Cake', price: '₹2200' },
    { name: 'Gourmet Cupcakes Box', price: '₹350' },
    { name: 'Mango Royale Pastry', price: '₹120' }
  ];
  
  const times = ['just now', '2 mins ago', '5 mins ago', '10 mins ago', '15 mins ago'];

  function showRandomToast() {
    if (toastContainer.querySelector('.activity-toast')) return;

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];
    const randomCake = cakes[Math.floor(Math.random() * cakes.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];

    const toast = document.createElement('div');
    toast.className = 'activity-toast';
    
    toast.innerHTML = `
      <div class="toast-avatar">
        <i data-lucide="shopping-bag" style="width: 20px; height: 20px;"></i>
      </div>
      <div class="toast-content">
        <p class="toast-message"><strong>${randomName}</strong> from ${randomLoc} ordered <strong>${randomCake.name}</strong> (${randomCake.price})</p>
        <div class="toast-meta">
          <span class="toast-time">${randomTime}</span>
          <a href="#featured" class="toast-action">View Menu <i data-lucide="chevron-right" style="width: 12px; height: 12px; display: inline;"></i></a>
        </div>
      </div>
      <button class="toast-close" aria-label="Close Notification">
        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
      </button>
    `;

    toastContainer.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({
        attrs: {
          class: 'lucide'
        },
        nameAttr: 'data-lucide',
        node: toast
      });
    }

    setTimeout(() => {
      toast.classList.add('active');
    }, 100);

    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.remove('active');
        setTimeout(() => {
          toast.remove();
        }, 500);
      });
    }

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove('active');
        setTimeout(() => {
          toast.remove();
        }, 500);
      }
    }, 6000);
  }

  // Trigger first toast after 8 seconds
  setTimeout(showRandomToast, 8000);

  // Set interval to check and show every 22 seconds
  setInterval(showRandomToast, 22000);
}

// Bind handlers to window for inline calls
window.updateCustomizer = updateCustomizer;
window.handleCustomizerSubmit = handleCustomizerSubmit;

// 19. ADMIN LOGIN & CATALOG MANAGEMENT SYSTEM
// Safe storage wrapper to prevent SecurityErrors in iframes or sandboxed environments
const safeStorage = {
  _local: {},
  _session: {},
  getItem(key, isSession = false) {
    try {
      const storage = isSession ? window.sessionStorage : window.localStorage;
      return storage.getItem(key);
    } catch (e) {
      console.warn(`Storage read blocked for key "${key}". Using in-memory fallback.`, e);
      const fallback = isSession ? this._session : this._local;
      return fallback[key] !== undefined ? fallback[key] : null;
    }
  },
  setItem(key, value, isSession = false) {
    try {
      const storage = isSession ? window.sessionStorage : window.localStorage;
      storage.setItem(key, value);
    } catch (e) {
      console.warn(`Storage write blocked for key "${key}". Using in-memory fallback.`, e);
      const fallback = isSession ? this._session : this._local;
      fallback[key] = String(value);
    }
  },
  removeItem(key, isSession = false) {
    try {
      const storage = isSession ? window.sessionStorage : window.localStorage;
      storage.removeItem(key);
    } catch (e) {
      console.warn(`Storage remove blocked for key "${key}". Using in-memory fallback.`, e);
      const fallback = isSession ? this._session : this._local;
      delete fallback[key];
    }
  }
};

let tempImageBase64 = '';
let editProductIndex = -1;
let isSupabaseEnabled = false;
let supabaseClient = null;
let globalInitialItems = [];

function checkSupabaseConfig() {
  if (typeof supabaseConfig !== 'undefined' && 
      supabaseConfig.url && 
      supabaseConfig.url !== "YOUR_SUPABASE_URL" && 
      supabaseConfig.anonKey && 
      supabaseConfig.anonKey !== "YOUR_SUPABASE_ANON_KEY") {
    return true;
  }
  return false;
}

function initializeSupabaseApp() {
  if (checkSupabaseConfig()) {
    try {
      supabaseClient = supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
      isSupabaseEnabled = true;
      console.log("Supabase Client initialized successfully.");

      // Set up auth state listener
      supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session) {
          console.log("Supabase Admin Authenticated:", session.user.email);
          safeStorage.setItem('admin_logged_in', 'true', true);
        }
      });
    } catch (error) {
      console.error("Supabase initialization failed:", error);
      isSupabaseEnabled = false;
    }
  } else {
    console.log("Supabase is not configured. Falling back to Local Storage mode.");
    isSupabaseEnabled = false;
  }
}

function updateDatabaseStatusUI() {
  const statusBadge = document.getElementById('db-status-badge');
  const statusDot = document.getElementById('db-status-dot');
  const statusText = document.getElementById('db-status-text');
  if (!statusBadge || !statusDot || !statusText) return;

  if (isSupabaseEnabled) {
    statusBadge.style.color = '#81c784'; // Soft light green
    statusDot.style.backgroundColor = '#4caf50'; // Vibrant green
    statusDot.style.boxShadow = '0 0 8px #4caf50';
    statusText.textContent = 'Database: Cloud Connected (Supabase)';
  } else {
    statusBadge.style.color = '#ffb74d'; // Soft orange
    statusDot.style.backgroundColor = '#ff9800'; // Vibrant orange
    statusDot.style.boxShadow = '0 0 8px #ff9800';
    statusText.textContent = 'Database: Local Storage Fallback';
  }
}

async function refreshCatalogFromSupabase(catalogKey) {
  try {
    const { data, error } = await supabaseClient
      .from('catalog')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;

    if (data && data.length > 0) {
      // Map old placeholder paths to the new premium generated assets for default items
      const mappedData = data.map(item => {
        if (item.name === "Vanilla Cake" && (item.img === "images/about_display.jpg" || !item.img)) {
          return { ...item, img: "images/vanilla_cake.png" };
        }
        if (item.name === "Black Forest Cake" && (item.img === "images/about_crafting.jpg" || !item.img)) {
          return { ...item, img: "images/black_forest_cake.png" };
        }
        if (item.name === "Pineapple Cake" && (item.img === "images/cat_kids.jpg" || !item.img)) {
          return { ...item, img: "images/pineapple_cake.png" };
        }
        if (item.name === "Mango Cake" && (item.img === "images/prod_strawberry.jpg" || !item.img)) {
          return { ...item, img: "images/mango_cake.png" };
        }
        return item;
      });
      safeStorage.setItem(catalogKey, JSON.stringify(mappedData));
      renderCatalog();
    } else {
      console.log("Supabase catalog table is empty. Seeding defaults...");
      const itemsToInsert = globalInitialItems.map(item => ({
        name: item.name,
        category: item.category,
        price: item.price,
        desc: item.desc,
        img: item.img
      }));
      const { error: seedError } = await supabaseClient.from('catalog').insert(itemsToInsert);
      if (seedError) throw seedError;
      
      // Fetch seeded data to get IDs
      const { data: seededData, error: fetchError } = await supabaseClient
        .from('catalog')
        .select('*')
        .order('id', { ascending: true });
      if (fetchError) throw fetchError;
      
      safeStorage.setItem(catalogKey, JSON.stringify(seededData));
      renderCatalog();
    }
  } catch (err) {
    console.error("Failed to load catalog from Supabase:", err);
    // Fallback load from local storage
    let catalogVal = safeStorage.getItem(catalogKey);
    if (!catalogVal) {
      safeStorage.setItem(catalogKey, JSON.stringify(globalInitialItems));
    }
    renderCatalog();
  }
}

function initAdminSystem() {
  initializeSupabaseApp();
  updateDatabaseStatusUI();

  const catalogKey = 'theheavencakes_catalog_v5';
  
  const initialItems = [
      // CLASSIC CAKES (1Kg = 650, Half Kg = 350, Pastry = 60)
      { name: "Vanilla Cake", category: "Classic Cakes", price: "650", desc: "Classic fresh cream vanilla cake with soft sponge layers and sweet vanilla frosting.", img: "cakeimages/vanilla.jpeg" },
      { name: "Black Forest Cake", category: "Classic Cakes", price: "650", desc: "Traditional German chocolate sponge layered with whipped cream, cherries, and dark chocolate flakes.", img: "images/black_forest_cake.png" },
      { name: "Pineapple Cake", category: "Classic Cakes", price: "650", desc: "Tropical fresh cream cake with juicy pineapple chunks and light vanilla sponge.", img: "images/pineapple_cake.png" },
      { name: "Mango Cake", category: "Classic Cakes", price: "650", desc: "Delectable fresh cream cake filled with sweet mango pulp and layered with premium cream.", img: "images/mango_cake.png" },
      { name: "Strawberry Cake", category: "Classic Cakes", price: "650", desc: "Fluffy vanilla sponge filled with sweet and fruity strawberry compote.", img: "images/prod_strawberry.jpg" },
      { name: "Chocolate Vanilla Cake", category: "Classic Cakes", price: "650", desc: "A perfect dual-layer sponge combining rich chocolate and smooth vanilla creams.", img: "images/hero_chocolate.jpg" },

      // PREMIUM CAKES (1Kg = 750, Half Kg = 400, Pastry = 60)
      { name: "Butterscotch Cake", category: "Premium Cakes", price: "750", desc: "Soft vanilla sponge layered with caramelized butterscotch chips and fresh buttercream.", img: "images/butterscotch_cake.png" },
      { name: "Blue Berry Cake", category: "Premium Cakes", price: "750", desc: "Light vanilla sponge filled with sweet and tangy imported wild blueberry compote.", img: "images/blueberry_cake.png" },
      { name: "Rasmalai Cake", category: "Premium Cakes", price: "750", desc: "Fusion cake infused with cardamom-spiced milk, saffron, and fresh Rasmalai pieces.", img: "images/rasmalai_cake.png" },
      { name: "Mixed Fruit Cake", category: "Premium Cakes", price: "750", desc: "Fresh cream cake loaded with a colorful assortment of seasonal fresh fruits.", img: "images/mixed_fruit_cake.png" },
      { name: "Honey Cake", category: "Premium Cakes", price: "750", desc: "Traditional bakery-style honey-infused sponge topped with mixed fruit jam and desiccated coconut.", img: "images/cat_cookies.jpg" },
      { name: "Mango Blue Berry Cake", category: "Premium Cakes", price: "750", desc: "A premium combination of sweet mangoes and tangy blueberries in fresh cream layers.", img: "images/prod_strawberry.jpg" },
      { name: "White Forest Cake", category: "Premium Cakes", price: "750", desc: "Delicate vanilla sponge layered with white chocolate shavings, cherries, and fresh cream.", img: "images/about_crafting.jpg" },
      { name: "Caramel White Choco Chip Cake", category: "Premium Cakes", price: "750", desc: "Creamy white chocolate sponge infused with rich caramel drizzle and crunchy chips.", img: "images/cat_cookies.jpg" },
      { name: "Cassata Cake", category: "Premium Cakes", price: "750", desc: "Colorful layered cake inspired by Italian Cassata flavors and loaded with nuts and candied peel.", img: "images/cat_kids.jpg" },
      { name: "Black Current Cake", category: "Premium Cakes", price: "750", desc: "Spongy vanilla cake filled with rich black currant syrup and juicy berries.", img: "images/prod_strawberry.jpg" },

      // EXOTIC CAKES (1Kg = 850, Half Kg = 450, Pastry = 80)
      { name: "Cherry Mousse Cake", category: "Exotic Cakes", price: "850", desc: "Light and airy cherry mousse layered between moist vanilla sponge cakes.", img: "images/prod_strawberry.jpg" },
      { name: "Tiramisu Cake", category: "Exotic Cakes", price: "850", desc: "Italian-style espresso-soaked sponge layered with creamy mascarpone cheese and cocoa.", img: "images/cat_photo.jpg" },
      { name: "Chocolate Mousse Cake", category: "Exotic Cakes", price: "850", desc: "Fluffy and rich chocolate mousse layered over a dark chocolate sponge base.", img: "images/hero_chocolate.jpg" },
      { name: "Swiss Chocolate Cake", category: "Exotic Cakes", price: "850", desc: "Smooth and creamy milk chocolate frosting enveloping a dark chocolate sponge.", img: "images/hero_chocolate.jpg" },
      { name: "Vancho Cake", category: "Exotic Cakes", price: "850", desc: "A perfect blend of vanilla and chocolate sponge layered with white and dark chocolate ganache.", img: "images/cat_kids.jpg" },
      { name: "Oreo Cake", category: "Exotic Cakes", price: "850", desc: "Vanilla and chocolate sponge loaded with crushed Oreo cookies and fresh whipped cream.", img: "images/cat_cookies.jpg" },
      { name: "Chocolate Zebra Cake", category: "Exotic Cakes", price: "850", desc: "Striking zebra-striped chocolate and vanilla marbled sponge with light frosting.", img: "images/hero_chocolate.jpg" },
      { name: "German Blue Forest Cake", category: "Exotic Cakes", price: "850", desc: "Chocolate sponge layered with fresh cream, sweet cherries, and blue-tinted chocolate accents.", img: "images/about_crafting.jpg" },
      { name: "Chocolate Celebration Cake", category: "Exotic Cakes", price: "850", desc: "Rich festive chocolate cake decorated with ganache swirls and celebratory toppings.", img: "images/hero_chocolate.jpg" },
      { name: "Chocolate Strawberry Cake", category: "Exotic Cakes", price: "850", desc: "Decadent chocolate sponge layered with fresh strawberry compote and chocolate glaze.", img: "images/prod_strawberry.jpg" },
      { name: "Choco Pineapple Cake", category: "Exotic Cakes", price: "850", desc: "A unique pairing of chocolate sponge with tropical pineapple chunks and fresh cream.", img: "images/hero_chocolate.jpg" },

      // PREMIUM CHOCO CAKES (1Kg = 1000, Half Kg = 500, Pastry = 100)
      { name: "Chocolate Overload Cake", category: "Premium Choco Cakes", price: "1000", desc: "Ultimate chocolate experience with layers of ganache, chips, and chocolate shavings.", img: "images/hero_chocolate.jpg" },
      { name: "Chocolate Globe Cake", category: "Premium Choco Cakes", price: "1000", desc: "Spectacular round chocolate cake covered in a spherical glaze of premium chocolate.", img: "images/hero_chocolate.jpg" },
      { name: "Chocolate Fantasy Cake", category: "Premium Choco Cakes", price: "1000", desc: "Moist chocolate fudge sponge layered with rich dark chocolate fantasy cream.", img: "images/hero_chocolate.jpg" },
      { name: "Choco Truffle Cake", category: "Premium Choco Cakes", price: "1000", desc: "Rich chocolate sponge layered with dense chocolate ganache and chocolate chips.", img: "images/hero_chocolate.jpg" },
      { name: "Chocolate Excess Cake", category: "Premium Choco Cakes", price: "1000", desc: "A luxurious overdose of dark chocolate fudge and premium cocoa layers.", img: "images/hero_chocolate.jpg" },
      { name: "Belgian Chocolate Cake", category: "Premium Choco Cakes", price: "1000", desc: "Rich, moist dark chocolate sponge layers smothered in luxury Belgian chocolate ganache.", img: "images/hero_chocolate.jpg" },
      { name: "Dark Choco Chip Cake", category: "Premium Choco Cakes", price: "1000", desc: "Dark chocolate cake filled with crunchy bittersweet chocolate chips and fudge.", img: "images/hero_chocolate.jpg" },
      { name: "Dutch Truffle Cake", category: "Premium Choco Cakes", price: "1000", desc: "Creamy Dutch-style dark chocolate truffle icing over layers of moist cocoa sponge.", img: "images/hero_chocolate.jpg" },

      // PREMIUM EXOTIC (1Kg = 1100, Half Kg = 550, Pastry = 100)
      { name: "Red Velvet Cake", category: "Premium Exotic", price: "1100", desc: "Indulgent layers of classic red velvet sponge, infused with authentic cream cheese frosting.", img: "images/prod_red_velvet.jpg" },
      { name: "Roasted Almond Cake", category: "Premium Exotic", price: "1100", desc: "Fragrant vanilla sponge layered with caramelized almond pieces and almond cream.", img: "images/about_display.jpg" },
      { name: "Red Velvet Chocolate Cake", category: "Premium Exotic", price: "1100", desc: "Fusion sponge combining red velvet and dark chocolate layers with cream cheese frosting.", img: "images/prod_red_velvet.jpg" },
      { name: "Chocolate Crunch Cake", category: "Premium Exotic", price: "1100", desc: "Crunchy praline and cornflake chocolate layers paired with rich milk chocolate ganache.", img: "images/hero_chocolate.jpg" },
      { name: "Nutty Bubble Cake", category: "Premium Exotic", price: "1100", desc: "A playful bubble-shaped cake layered with white chocolate cream and mixed roasted nuts.", img: "images/cat_cookies.jpg" },
      { name: "Heaven Spacial Cake", category: "Premium Exotic", price: "1100", desc: "The Heaven's signature chef-special cake featuring secret exotic fruits and creams.", img: "images/about_display.jpg" },
      { name: "Tender Coconut Cake", category: "Premium Exotic", price: "1100", desc: "Soft vanilla sponge layered with fresh tender coconut pulp and coconut whipped cream.", img: "images/about_display.jpg" },
      { name: "Kit Kat Cake", category: "Premium Exotic", price: "1100", desc: "Chocolate cake surrounded by a fence of Kit Kat bars and topped with chocolate gems.", img: "images/cat_cookies.jpg" },
      { name: "Fresh Fruits Cake", category: "Premium Exotic", price: "1100", desc: "Luxury fresh cream cake layered and topped with a lavish amount of fresh seasonal fruits.", img: "images/cat_birthday.jpg" },
      { name: "Mango (Seasonal) Cake", category: "Premium Exotic", price: "1100", desc: "Seasonal masterpiece filled with premium local Alphonso mangoes and fresh cream.", img: "images/prod_strawberry.jpg" },
      { name: "Kit Kat Gems Cake", category: "Premium Exotic", price: "1100", desc: "Fun party cake decorated with Kit Kat pieces and loaded with colorful Cadbury Gems.", img: "images/cat_cookies.jpg" },
      { name: "Dark by Chocolate Cake", category: "Premium Exotic", price: "1100", desc: "Super dark cocoa cake filled with bittersweet chocolate cream and dark glaze.", img: "images/hero_chocolate.jpg" },
      { name: "Nuttela Hazel Nut Cake", category: "Premium Exotic", price: "1100", desc: "Rich chocolate sponge infused with genuine Nutella spread and crunchy roasted hazelnuts.", img: "images/cat_birthday.jpg" },
      { name: "Ferror Rocher Cake", category: "Premium Exotic", price: "1100", desc: "Delectable premium chocolate sponge layered with hazelnut cream and topped with original Ferrero Rocher.", img: "images/cat_cookies.jpg" },
      { name: "Lotus Biscoff Cake", category: "Premium Exotic", price: "1100", desc: "Moist sponge layers covered in Lotus Biscoff whipped cream and topped with original Biscoff biscuits.", img: "images/cat_cookies.jpg" },
      { name: "Pistachio Cake", category: "Premium Exotic", price: "1100", desc: "Premium ground pistachio nut sponge layered with real pistachio butter cream.", img: "images/about_display.jpg" },

      // CHEESE CAKE (1Kg = 1100, Half Kg = 550, Pastry = 110)
      { name: "Original Newyork Cheesecake", category: "Cheese Cakes", price: "1100", desc: "Rich and dense classic baked New York style cheesecake with a graham cracker crust.", img: "images/cat_photo.jpg" },
      { name: "Blue Berry Cheesecake", category: "Cheese Cakes", price: "1100", desc: "Smooth cream cheesecake topped with sweet and tangy imported wild blueberry glaze.", img: "images/cat_photo.jpg" },
      { name: "Mango Cheesecake", category: "Cheese Cakes", price: "1100", desc: "Silky baked cheesecake topped with fresh tropical mango puree glaze.", img: "images/cat_photo.jpg" },
      { name: "Strawberry Cheesecake", category: "Cheese Cakes", price: "1100", desc: "Creamy classic cheesecake topped with a sweet strawberry glaze and berry chunks.", img: "images/cat_photo.jpg" },
      { name: "Pineapple Cheesecake", category: "Cheese Cakes", price: "1100", desc: "Baked cream cheesecake layered with caramelized pineapple compote.", img: "images/cat_photo.jpg" },
      { name: "Lotus Biscoff Cheesecake", category: "Cheese Cakes", price: "1100", desc: "Silky smooth New York style cheesecake topped with premium Lotus Biscoff spread and cookie crumbs.", img: "images/cat_photo.jpg" },

      // DESSERTS (Cupcakes, Muffins, Donuts, Brownies, Glass Desserts, Lava, Tarts, Bar Cakes)
      // CUPCAKES (Regular = 25, Large = 50, Customized = 100)
      { name: "Red Velvet Cup Cake", category: "Cupcakes", price: "25", desc: "Freshly baked premium Red Velvet cupcake topped with silky cream cheese frosting.", img: "images/cat_cupcakes.jpg" },
      { name: "Blue Berry Cup Cake", category: "Cupcakes", price: "25", desc: "Fluffy cupcake loaded with wild blueberries and topped with blueberry buttercream.", img: "images/cat_cupcakes.jpg" },
      { name: "Vanilla Cup Cake", category: "Cupcakes", price: "25", desc: "Sweet vanilla sponge cupcake with a swirl of classic Madagascar vanilla cream.", img: "images/cat_cupcakes.jpg" },
      { name: "Strawberry Cup Cake", category: "Cupcakes", price: "25", desc: "Soft strawberry-infused cupcake topped with fresh strawberry cream.", img: "images/cat_cupcakes.jpg" },
      { name: "Truffle Cup Cake", category: "Cupcakes", price: "25", desc: "Dense chocolate cupcake filled and frosted with rich dark chocolate ganache truffle.", img: "images/cat_cupcakes.jpg" },
      { name: "Oreo Cup Cake", category: "Cupcakes", price: "25", desc: "Cookies and cream cupcake topped with whipped cream and a mini Oreo cookie.", img: "images/cat_cupcakes.jpg" },
      
      // MUFFINS (Rs. 45)
      { name: "Chunky Chocolate Muffin", category: "Desserts", price: "45", desc: "Baked chocolate muffin loaded with huge chunks of semisweet chocolate.", img: "images/cat_desserts.jpg" },
      { name: "Blue Berry Muffin", category: "Desserts", price: "45", desc: "Moist bakery muffin filled with fresh bursting blueberries and coarse sugar.", img: "images/cat_desserts.jpg" },
      { name: "Vanilla Chocolate Muffin", category: "Desserts", price: "45", desc: "Marbled muffin combining classic vanilla sponge with rich chocolate swirls.", img: "images/cat_desserts.jpg" },
      
      // DONUTS (Rs. 50)
      { name: "Chocolates Ring Donut", category: "Desserts", price: "50", desc: "Fresh yeast donut ring glazed in a premium milk chocolate shell.", img: "images/cat_desserts.jpg" },
      { name: "Dark Chocolate Ring Donut", category: "Desserts", price: "50", desc: "Glazed donut ring topped with bittersweet dark chocolate icing.", img: "images/cat_desserts.jpg" },
      { name: "Choco Filled Donut", category: "Desserts", price: "50", desc: "Soft shell donut stuffed with rich liquid chocolate ganache filling.", img: "images/cat_desserts.jpg" },
      
      // BROWNIES (Rs. 55)
      { name: "Walnut Brownie", category: "Desserts", price: "55", desc: "Rich, dense fudge brownie loaded with dark chocolate chunks and premium walnuts.", img: "images/cat_brownies.jpg" },
      { name: "Choco Chip Brownie", category: "Desserts", price: "55", desc: "Decadent fudge brownie loaded with double chocolate chips.", img: "images/cat_brownies.jpg" },
      { name: "Oreo Brownie", category: "Desserts", price: "55", desc: "Fudgy chocolate brownie topped with whole and crushed Oreo cookie pieces.", img: "images/cat_brownies.jpg" },

      // GLASS DESSERTS (Rs. 65)
      { name: "Pineapple Pudding Glass", category: "Desserts", price: "65", desc: "Layers of vanilla custard, sponge, and sweet pineapple compote in a dessert glass.", img: "images/cat_desserts.jpg" },
      { name: "Strawberry Pudding Glass", category: "Desserts", price: "65", desc: "Creamy strawberry custard layered with sponge and strawberry jelly.", img: "images/cat_desserts.jpg" },
      { name: "Blueberry Pudding Glass", category: "Desserts", price: "65", desc: "Velvety pudding glass layered with wild blueberry sauce and whipped cream.", img: "images/cat_desserts.jpg" },
      { name: "Mango Pudding Glass", category: "Desserts", price: "65", desc: "Seasonal mango custard layered with fresh mango pulp in a dessert glass.", img: "images/cat_desserts.jpg" },

      // LAVA CAKE (Rs. 60)
      { name: "Choco Lava Cake", category: "Desserts", price: "60", desc: "Warm chocolate cake with a molten, liquid chocolate center that flows when cut.", img: "images/cat_desserts.jpg" },

      // BAR CAKE (Rs. 100)
      { name: "Chunky Bar Cake", category: "Desserts", price: "100", desc: "Moist rectangular sliced bar cake packed with chocolate chunks.", img: "images/cat_desserts.jpg" },
      { name: "Blue Berry Bar Cake", category: "Desserts", price: "100", desc: "Moist butter bar cake marbled with wild blueberry fruit fillings.", img: "images/cat_desserts.jpg" },
      { name: "Butterscotch Bar Cake", category: "Desserts", price: "100", desc: "Sweet bar cake layered with crunch butterscotch chips and caramel frosting.", img: "images/cat_desserts.jpg" },

      // TARTS (All Fav: 35, Large: 60)
      { name: "Strawberry Tart", category: "Desserts", price: "35", desc: "Crisp buttery tart pastry shell filled with custard and fresh strawberries.", img: "images/cat_desserts.jpg" },
      { name: "Truffle Tart", category: "Desserts", price: "35", desc: "Crisp pastry tart filled with rich, smooth dark chocolate ganache truffle.", img: "images/cat_desserts.jpg" },

      // CUSTOM CAKES
      { name: "Photo Cake", category: "Custom Cakes", price: "1050", desc: "Send us any photo or artwork and we will print it in edible sugar sheets on your choice of flavor.", img: "images/cat_photo.jpg" },
      { name: "Shape Cake (Semi Fondant)", category: "Custom Cakes", price: "1099", desc: "Semi-fondant customized theme cakes shaped as numbers, letters, or designs.", img: "images/cat_photo.jpg" },
      { name: "3D Customised Cake (Full Fondant)", category: "Custom Cakes", price: "1500", desc: "Stunning fully customized 3D fondant masterpieces made to order.", img: "images/cat_photo.jpg" }
    ];

    globalInitialItems = initialItems;
    safeStorage.setItem(catalogKey, JSON.stringify(initialItems));
    renderCatalog();
}

function renderCatalog() {
  const catalogKey = 'theheavencakes_catalog_v5';
  let catalog = globalInitialItems;
  try {
    const catalogJson = safeStorage.getItem(catalogKey);
    if (catalogJson) catalog = JSON.parse(catalogJson);
  } catch (e) {
    catalog = globalInitialItems;
  }
  if (!catalog || catalog.length === 0) catalog = globalInitialItems;

  try {
    // Populate public storefront products grid
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
      productsGrid.innerHTML = '';
      
      catalog.forEach((item, index) => {
        const card = document.createElement('article');
        const delayClass = index % 4 === 0 ? '' : ` delay-${index % 4}`;
        card.className = `product-card reveal reveal-up${delayClass}`;
        card.setAttribute('data-category', item.category || 'Premium Exotic');
        card.setAttribute('data-name', item.name || 'Signature Cake');

        const pricingInfo = getCategoryPricingInfo(item.category || 'Classic Cakes');
        const sizes = getProductSizesAndPrices(item);
        let sizeSelectorHtml = '';
        let initialPrice = item.price || '999';
        let initialLabel = '1 kg';

        if (sizes && sizes.length > 0) {
          // Find the active index by matching the catalog item price
          let activeIndex = sizes.findIndex(s => s.price === item.price);
          if (activeIndex === -1) {
            // Default to '1 Kg' or first option
            const oneKgIndex = sizes.findIndex(s => s.label.toLowerCase() === '1 kg');
            activeIndex = oneKgIndex !== -1 ? oneKgIndex : 0;
          }
          
          initialPrice = sizes[activeIndex].price;
          initialLabel = sizes[activeIndex].value;

          sizeSelectorHtml = `<div class="card-size-selector">`;
          sizes.forEach((s, sIdx) => {
            const isActive = sIdx === activeIndex ? 'active' : '';
            const escapedName = (item.name || 'Signature Cake').replace(/'/g, "\\'");
            const imgPath = item.img || 'images/hero_chocolate.jpg';
            const cat = item.category || 'Classic Cakes';
            sizeSelectorHtml += `
              <button type="button" class="size-pill ${isActive}" onclick="changeCardSize(this, '${index}', '${s.label}', '${s.price}', '${s.value}', '${escapedName}', '${imgPath}', '${cat}')">
                ${s.label}
              </button>
            `;
          });
          sizeSelectorHtml += `</div>`;
        }

        const priceLabel = sizes ? 'Price' : 'Starts from';

        card.innerHTML = `
          <div class="product-img-wrapper">
            <img src="${item.img || 'images/hero_chocolate.jpg'}" alt="${item.name || 'Cake'} image">
            ${(item.name && (item.name.toLowerCase().includes('biscoff') || item.name.toLowerCase().includes('velvet') || item.name.toLowerCase().includes('truffle'))) ? '<span class="product-badge">Premium</span>' : ''}
          </div>
          <div class="product-content">
            <h3 class="product-name">${item.name || 'Signature Cake'}</h3>
            <p class="product-desc">${item.desc || 'Fresh cream cake.'}</p>
            ${sizeSelectorHtml}
            <div class="product-footer">
              <div class="product-price">
                <span class="price-label">${priceLabel}</span>
                <span class="price-value">₹${initialPrice}</span>
              </div>
              <button type="button" class="btn btn-primary product-btn-order" onclick="openOrderModal('${(item.name || 'Signature Cake').replace(/'/g, "\\'")}', '₹${initialPrice}', '${item.img || 'images/hero_chocolate.jpg'}', '${initialLabel}', '${item.category || 'Classic Cakes'}')">Order Now</button>
            </div>
          </div>
        `;
        productsGrid.appendChild(card);
      });

      // Filter products by the currently active filter pill
      const activePill = document.querySelector('.filter-pill.active');
      if (activePill) {
        const onclickAttr = activePill.getAttribute('onclick');
        const match = onclickAttr ? onclickAttr.match(/'([^']+)'/) : null;
        const categoryName = match ? match[1] : 'Classic Cakes';
        filterCategory(activePill, categoryName);
      }

      // Reinitialize scroll reveal triggers for active nodes
      if (typeof initScrollReveal === 'function') {
        setTimeout(initScrollReveal, 100);
      }
    }

    // Populate Admin Catalog Manager Table list
    const adminTbody = document.getElementById('admin-catalog-tbody');
    if (adminTbody) {
      adminTbody.innerHTML = '';
      
      catalog.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><img src="${item.img || 'images/hero_chocolate.jpg'}" alt="${item.name || 'Cake'}" class="catalog-img-thumb"></td>
          <td>
            <span class="catalog-name">${item.name || 'Signature Cake'}</span>
            <span class="catalog-category">${item.category || 'Premium Exotic'}</span>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.desc || ''}</div>
          </td>
          <td><span class="catalog-price">₹${item.price || '999'}</span></td>
          <td>
            <div class="admin-actions-cell">
              <button type="button" class="btn-edit-prod" onclick="handleEditProduct(${index})" title="Edit Product">
                <i data-lucide="edit" style="width: 16px; height: 16px;"></i>
              </button>
              <button type="button" class="btn-delete-prod" onclick="handleDeleteProduct(${index})" title="Delete Product">
                <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
              </button>
            </div>
          </td>
        `;
        adminTbody.appendChild(tr);
      });

      if (typeof lucide !== 'undefined') {
        lucide.createIcons({
          attrs: { class: 'lucide' },
          nameAttr: 'data-lucide',
          node: adminTbody
        });
      }
    }
  } catch (err) {
    console.error("Failed to parse catalog from localStorage:", err);
    safeStorage.removeItem(catalogKey);
    location.reload();
  }
}

// Menu Modal Toggle Hooks
function openMenuModal() {
  const modal = document.getElementById('menu-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenuModal() {
  const modal = document.getElementById('menu-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Modal Toggle Hooks
function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (!modal) return;

  document.getElementById('admin-username').value = '';
  document.getElementById('admin-password').value = '';
  document.getElementById('login-error-msg').style.display = 'none';

  const isLoggedIn = safeStorage.getItem('admin_logged_in', true) === 'true';
  const loginView = document.getElementById('admin-login-view');
  const dashView = document.getElementById('admin-dashboard-view');
  const title = document.getElementById('admin-title');

  if (isLoggedIn) {
    loginView.style.display = 'none';
    dashView.style.display = 'block';
    title.textContent = 'Admin Control Panel';
  } else {
    loginView.style.display = 'block';
    dashView.style.display = 'none';
    title.textContent = 'Admin Login';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Admin login session validation
function handleAdminLogin(event) {
  if (event) event.preventDefault();
  const errorMsg = document.getElementById('login-error-msg');

  safeStorage.setItem('admin_logged_in', 'true', true);
  if (errorMsg) errorMsg.style.display = 'none';
  
  const loginView = document.getElementById('admin-login-view');
  const dashView = document.getElementById('admin-dashboard-view');
  const title = document.getElementById('admin-title');

  if (loginView) loginView.style.display = 'none';
  if (dashView) dashView.style.display = 'block';
  if (title) title.textContent = 'Admin Control Panel';
  
  renderCatalog();
}

function handleAdminLogout() {
  safeStorage.removeItem('admin_logged_in', true);
  if (isSupabaseEnabled) {
    supabaseClient.auth.signOut().catch(err => console.error("Supabase sign-out failed:", err));
  }
  document.getElementById('admin-login-view').style.display = 'block';
  document.getElementById('admin-dashboard-view').style.display = 'none';
  document.getElementById('admin-title').textContent = 'Admin Login';
}

// Compress uploaded files to tiny base64 jpegs using canvas to respect localstorage storage limits
function handleImageFileSelect(event) {
  const file = event.target.files[0];
  const filenameLabel = document.getElementById('upload-filename');
  const previewContainer = document.getElementById('image-preview-container');
  const previewImg = document.getElementById('admin-image-preview');

  if (!file) {
    tempImageBase64 = '';
    filenameLabel.textContent = 'Click to upload image file';
    previewContainer.style.display = 'none';
    return;
  }

  filenameLabel.textContent = file.name;
  
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 400;
      const MAX_HEIGHT = 400;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      tempImageBase64 = canvas.toDataURL('image/jpeg', 0.75);
      
      previewImg.src = tempImageBase64;
      previewContainer.style.display = 'block';
    };
  };
}

// Database push and deletion operations
function handleAdminAddProduct(event) {
  event.preventDefault();
  
  const name = document.getElementById('admin-prod-name').value.trim();
  const category = document.getElementById('admin-prod-category').value;
  const price = document.getElementById('admin-prod-price').value.replace('₹', '').trim();
  const desc = document.getElementById('admin-prod-desc').value.trim();

  if (!tempImageBase64) {
    alert('Please upload a product photo.');
    return;
  }

  const catalogKey = 'theheavencakes_catalog_v5';
  const catalogJson = safeStorage.getItem(catalogKey);
  const catalog = catalogJson ? JSON.parse(catalogJson) : [];

  const handleSuccess = (msg) => {
    if (editProductIndex > -1) {
      cancelProductEdit();
    } else {
      document.getElementById('admin-add-product-form').reset();
      document.getElementById('upload-filename').textContent = 'Click to upload image file';
      document.getElementById('image-preview-container').style.display = 'none';
      tempImageBase64 = '';
    }
    alert(msg);
    if (isSupabaseEnabled) {
      refreshCatalogFromSupabase(catalogKey);
    } else {
      renderCatalog();
    }
  };

  const updatedItem = {
    name,
    category,
    price,
    desc,
    img: tempImageBase64
  };

  if (editProductIndex > -1) {
    catalog[editProductIndex] = updatedItem;
  } else {
    catalog.push(updatedItem);
  }

  if (isSupabaseEnabled) {
    if (editProductIndex > -1) {
      // Update existing item
      const originalItem = catalog[editProductIndex];
      const query = supabaseClient.from('catalog').update(updatedItem);
      
      if (originalItem && originalItem.id) {
        query.eq('id', originalItem.id);
      } else if (originalItem && originalItem.name) {
        query.eq('name', originalItem.name);
      } else {
        alert("Error: Product does not have a valid Database ID or Name.");
        return;
      }

      query.then(({ error }) => {
        if (error) throw error;
        handleSuccess('Product successfully updated in Cloud Database!');
      })
      .catch((err) => {
        console.error("Supabase update failed:", err);
        alert("Failed to sync changes to Cloud Database: " + err.message);
      });
    } else {
      // Add new item
      supabaseClient
        .from('catalog')
        .insert([updatedItem])
        .then(({ error }) => {
          if (error) throw error;
          handleSuccess('Product successfully added to Cloud Database!');
        })
        .catch((err) => {
          console.error("Supabase insert failed:", err);
          alert("Failed to sync changes to Cloud Database: " + err.message);
        });
    }
  } else {
    safeStorage.setItem(catalogKey, JSON.stringify(catalog));
    handleSuccess(editProductIndex > -1 ? 'Product successfully updated!' : 'Product successfully added to the active menu catalog!');
  }
}

function handleDeleteProduct(index) {
  if (!confirm('Are you sure you want to delete this product from the menu catalog?')) return;

  const catalogKey = 'theheavencakes_catalog_v5';
  const catalogJson = safeStorage.getItem(catalogKey);
  if (!catalogJson) return;

  const catalog = JSON.parse(catalogJson);
  const itemToDelete = catalog[index];

  if (isSupabaseEnabled) {
    const query = supabaseClient.from('catalog').delete();
    
    if (itemToDelete && itemToDelete.id) {
      query.eq('id', itemToDelete.id);
    } else if (itemToDelete && itemToDelete.name) {
      query.eq('name', itemToDelete.name);
    } else {
      alert("Error: Product does not have a valid Database ID or Name.");
      return;
    }

    query.then(({ error }) => {
      if (error) throw error;
      alert('Product successfully deleted from Cloud Database!');
      refreshCatalogFromSupabase(catalogKey);
    })
    .catch((err) => {
      console.error("Supabase delete failed:", err);
      alert("Failed to sync deletion to Cloud Database: " + err.message);
    });
  } else {
    catalog.splice(index, 1);
    safeStorage.setItem(catalogKey, JSON.stringify(catalog));
    renderCatalog();
  }
}

// Bind admin hooks to window scope for inline HTML calls
window.openMenuModal = openMenuModal;
window.closeMenuModal = closeMenuModal;
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.handleAdminLogin = handleAdminLogin;
window.handleAdminLogout = handleAdminLogout;
window.handleImageFileSelect = handleImageFileSelect;
window.handleAdminAddProduct = handleAdminAddProduct;
window.handleDeleteProduct = handleDeleteProduct;
window.initAdminSystem = initAdminSystem;

function handleEditProduct(index) {
  const catalogKey = 'theheavencakes_catalog_v5';
  const catalogJson = safeStorage.getItem(catalogKey);
  if (!catalogJson) return;

  const catalog = JSON.parse(catalogJson);
  const item = catalog[index];
  if (!item) return;

  editProductIndex = index;

  // Populate form inputs
  document.getElementById('admin-prod-name').value = item.name;
  document.getElementById('admin-prod-category').value = item.category;
  document.getElementById('admin-prod-price').value = item.price;
  document.getElementById('admin-prod-desc').value = item.desc;

  // Setup image preview
  tempImageBase64 = item.img;
  const previewContainer = document.getElementById('image-preview-container');
  const previewImg = document.getElementById('admin-image-preview');
  const filenameLabel = document.getElementById('upload-filename');

  previewImg.src = item.img;
  previewContainer.style.display = 'block';
  filenameLabel.textContent = 'Existing Image Kept';

  // Remove required attribute from file input since we have an existing image
  document.getElementById('admin-prod-image').removeAttribute('required');

  // Toggle edit states in UI
  document.getElementById('admin-form-title').textContent = 'Edit Product';
  document.getElementById('admin-submit-btn').textContent = 'Update Product';
  document.getElementById('admin-cancel-edit-btn').style.display = 'block';
}

function cancelProductEdit() {
  editProductIndex = -1;
  tempImageBase64 = '';

  // Reset form and file inputs
  document.getElementById('admin-add-product-form').reset();
  document.getElementById('admin-prod-image').setAttribute('required', 'required');
  document.getElementById('upload-filename').textContent = 'Click to upload image file';
  document.getElementById('image-preview-container').style.display = 'none';

  // Restore UI states
  document.getElementById('admin-form-title').textContent = 'Add New Product';
  document.getElementById('admin-submit-btn').textContent = 'Add Product to Menu';
  document.getElementById('admin-cancel-edit-btn').style.display = 'none';
}

window.handleEditProduct = handleEditProduct;
window.cancelProductEdit = cancelProductEdit;

// ==========================================================================
// 20. CHATBOT ASSISTANT CONTROLLER
// ==========================================================================
function toggleChatbot() {
  const panel = document.getElementById('chatbot-panel');
  if (!panel) return;
  panel.classList.toggle('active');

  // Trigger Lucide icons rebuild for the panel if needed
  if (panel.classList.contains('active') && typeof lucide !== 'undefined') {
    lucide.createIcons({
      attrs: { class: 'lucide' },
      nameAttr: 'data-lucide',
      node: panel
    });
  }
}

function addMessageToChat(text, sender) {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${sender}`;
  msgDiv.innerHTML = text.replace(/\n/g, '<br>');
  container.appendChild(msgDiv);

  // Auto scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('chatbot-messages');
  if (!container) return null;

  const indicatorDiv = document.createElement('div');
  indicatorDiv.className = 'chat-message bot typing-indicator-wrapper';
  indicatorDiv.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  container.appendChild(indicatorDiv);
  container.scrollTop = container.scrollHeight;
  return indicatorDiv;
}

function generateBotResponse(userMsg) {
  const text = userMsg.toLowerCase().trim();

  // Pattern Matching Rules
  if (text.includes('menu') || text.includes('flavor') || text.includes('category') || text.includes('what cake') || text.includes('types')) {
    return `We offer a wide variety of premium, fresh cakes! 🎂<br><br>` +
           `1. <strong>Classic Cakes</strong>: Vanilla, Black Forest, Pineapple, Mango, Strawberry (₹650/kg)<br>` +
           `2. <strong>Premium Cakes</strong>: Butterscotch, Blueberry, Rasmalai, Mixed Fruit, Honey, White Forest (₹750/kg)<br>` +
           `3. <strong>Exotic Cakes</strong>: Mousse, Tiramisu, Oreo, Vancho, Swiss Chocolate (₹850/kg)<br>` +
           `4. <strong>Premium Choco Cakes</strong>: Truffle, Belgian Chocolate, Dutch Truffle (₹1000/kg)<br>` +
           `5. <strong>Premium Exotic</strong>: Red Velvet, Roasted Almond, Nutella Hazelnut, Ferrero Rocher, Lotus Biscoff (₹1100/kg)<br>` +
           `6. <strong>Cheese Cakes</strong>: Blueberry, Lotus Biscoff, Original NY Cheesecake (₹1100/kg)<br>` +
           `7. <strong>Custom Cakes</strong>: Photo print cakes, shape theme cakes, 3D fondant masterpieces.<br><br>` +
           `Which category would you like to explore? Click <strong>Cakes</strong> in the main navigation menu to see pictures!`;
  }
  
  if (text.includes('price') || text.includes('cost') || text.includes('how much') || text.includes('rate') || text.includes('pricing')) {
    return `Here is our official pricing guide (per Kg):<br><br>` +
           `• <strong>Classic Cakes</strong>: ₹650 (Half Kg: ₹350)<br>` +
           `• <strong>Premium Cakes</strong>: ₹750 (Half Kg: ₹400)<br>` +
           `• <strong>Exotic Cakes</strong>: ₹850 (Half Kg: ₹450)<br>` +
           `• <strong>Premium Choco Cakes</strong>: ₹1000 (Half Kg: ₹500)<br>` +
           `• <strong>Premium Exotic / Cheesecakes</strong>: ₹1100 (Half Kg: ₹550)<br>` +
           `• <strong>Cupcakes</strong>: ₹25 (Large: ₹50, Customized: ₹100)<br>` +
           `• <strong>Desserts (Brownies, Muffins, Donuts)</strong>: ₹45 - ₹100<br><br>` +
           `<em>*Customized theme cakes are quoted depending on design. Note that all cake cards have interactive weight options!</em>`;
  }

  if (text.includes('order') || text.includes('buy') || text.includes('purchase') || text.includes('how can i')) {
    return `Ordering is super easy and fully integrated with WhatsApp! 🛍️<br><br>` +
           `1. Scroll to the <strong>Cakes</strong> catalog section.<br>` +
           `2. Click on different weight selector pills (e.g. <strong>Half Kg</strong>, <strong>1 Kg</strong>, <strong>Pastry</strong>) directly on the product card to see its price.<br>` +
           `3. Click the <strong>Order Now</strong> button.<br>` +
           `4. A customization modal will open where you can select size, write a cake message (e.g., "Happy Birthday"), and confirm.<br>` +
           `5. Click <strong>Submit Order on WhatsApp</strong>. This automatically builds your order ticket and launches WhatsApp chat directly with our chef to finalize details!`;
  }

  if (text.includes('where') || text.includes('location') || text.includes('address') || text.includes('find') || text.includes('map') || text.includes('shop') || text.includes('store') || text.includes('directions')) {
    return `We are located in Kumbla (Kumble), Kerala! 📍<br><br>` +
           `• <strong>Boutique Address</strong>: Muliyadka Complex, Police Station Road, next to Kumbla Co-operative Bank, Kumbla (Kumble), Kerala - 671321.<br>` +
           `• <strong>Google Maps Plus Code</strong>: HWVV+RH Kumbla (Kumble), Kerala.<br><br>` +
           `You can click the <strong>Get Directions</strong> button in our address section or view our location on the map at the bottom of the page!`;
  }

  if (text.includes('deliver') || text.includes('delivery') || text.includes('home delivery') || text.includes('charge')) {
    return `Yes, we offer home delivery! 🚗<br><br>` +
           `• <strong>Free Delivery</strong>: Within Kumbla town limits.<br>` +
           `• <strong>Nearby Areas</strong>: Delivery charges apply based on the distance (Kasaragod area).<br><br>` +
           `Please share your delivery location on WhatsApp during checkout, and we will confirm delivery options and timings immediately!`;
  }

  if (text.includes('veg') || text.includes('eggless') || text.includes('vegetarian') || text.includes('egg')) {
    return `Good news! 🌱 <strong>All our cakes and desserts are 100% Vegetarian (Eggless)</strong> by default. We do not use eggs or any animal fats in our sponges, frosting, or toppings. You can enjoy them with absolute peace of mind!`;
  }

  if (text.includes('custom') || text.includes('photo') || text.includes('design') || text.includes('birthday cake') || text.includes('anniversary')) {
    return `Yes! We specialize in custom-designed theme cakes! 🎨<br><br>` +
           `• <strong>Photo Cakes</strong>: We can print any photo or design in edible sugar sheets on top of your favorite cake flavor (Starts at ₹1050/kg).<br>` +
           `• <strong>Semi-Fondant / Shape Cakes</strong>: Number shapes, basic 2D theme decorations (Starts at ₹1099/kg).<br>` +
           `• <strong>3D Custom Cakes</strong>: Full fondant themed shapes (Starts at ₹1500/kg).<br><br>` +
           `To order a custom design, please send us a reference photo or your ideas on WhatsApp (using the float button below) and we will quote a price!`;
  }

  if (text.includes('time') || text.includes('hours') || text.includes('open') || text.includes('timing')) {
    return `We are open and accepting orders:<br><br>` +
           `• <strong>Monday to Sunday</strong>: 9:00 AM - 9:00 PM<br><br>` +
           `<em>*Tip: We recommend placing orders for custom theme cakes at least 24 to 48 hours in advance!</em>`;
  }

  if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('hola') || text.includes('assist')) {
    return `Hello there! I'm here to help you. Ask me about our <strong>Menu</strong>, <strong>Prices</strong>, <strong>How to Order</strong>, or <strong>Custom Cakes</strong>!`;
  }

  // Fallback default response
  return `I'd love to help you with that! For specific requests, custom design cake orders, or to check chef availability, please click the <strong>WhatsApp</strong> floating icon directly below. Our chef will be happy to assist you directly! 👩‍🍳`;
}

function handleQuickQuestion(questionText) {
  addMessageToChat(questionText, 'user');
  
  // Show typing indicator
  const indicator = showTypingIndicator();
  
  setTimeout(() => {
    // Remove typing indicator
    if (indicator) indicator.remove();
    
    // Generate and send response
    const response = generateBotResponse(questionText);
    addMessageToChat(response, 'bot');
  }, 800 + Math.random() * 600);
}

function handleChatSubmit(event) {
  event.preventDefault();
  const inputEl = document.getElementById('chatbot-input');
  if (!inputEl) return;

  const text = inputEl.value.trim();
  if (!text) return;

  addMessageToChat(text, 'user');
  inputEl.value = '';

  // Show typing indicator
  const indicator = showTypingIndicator();

  setTimeout(() => {
    // Remove typing indicator
    if (indicator) indicator.remove();

    // Generate response
    const response = generateBotResponse(text);
    addMessageToChat(response, 'bot');
  }, 1000 + Math.random() * 800);
}

window.toggleChatbot = toggleChatbot;
window.handleQuickQuestion = handleQuickQuestion;
window.handleChatSubmit = handleChatSubmit;

