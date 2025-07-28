// Main JavaScript for Spirit Barber site.
// Handles hero slider, testimonial carousel, responsive navigation and scroll behaviours.

// =====================
// Google Reviews Configuration
//
// To enable live Google reviews, provide your business's Place ID and a
// valid Google Places API key below. These are left blank by default. When
// populated, the script will fetch reviews directly from your Google
// Business Profile and overwrite the hardcoded testimonials. You can find
// your Place ID using the Places API or Google Maps Place ID Finder.
const GOOGLE_PLACE_ID = '';
const GOOGLE_API_KEY = '';

document.addEventListener('DOMContentLoaded', () => {
  /* =====================
   * HERO SLIDER
   * ===================== */
  const heroSlides = document.querySelectorAll('.hero .slide');
  const heroPrev = document.querySelector('.hero .prev');
  const heroNext = document.querySelector('.hero .next');
  const heroDotsContainer = document.querySelector('.hero .dots');
  let heroIndex = 0;
  let heroTimer;

  // Create dot indicators dynamically
  heroSlides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      switchHeroSlide(index);
    });
    heroDotsContainer.appendChild(dot);
  });

  const heroDots = heroDotsContainer.querySelectorAll('.dot');

  function switchHeroSlide(newIndex) {
    heroSlides[heroIndex].classList.remove('active');
    heroDots[heroIndex].classList.remove('active');
    heroIndex = newIndex;
    heroSlides[heroIndex].classList.add('active');
    heroDots[heroIndex].classList.add('active');
  }

  function nextHero() {
    const nextIndex = (heroIndex + 1) % heroSlides.length;
    switchHeroSlide(nextIndex);
  }

  function prevHero() {
    const prevIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
    switchHeroSlide(prevIndex);
  }

  function startHeroTimer() {
    heroTimer = setInterval(nextHero, 7000);
  }

  function stopHeroTimer() {
    clearInterval(heroTimer);
  }

  heroNext.addEventListener('click', nextHero);
  heroPrev.addEventListener('click', prevHero);

  // Pause on hover
  const heroSection = document.querySelector('.hero');
  heroSection.addEventListener('mouseenter', stopHeroTimer);
  heroSection.addEventListener('mouseleave', startHeroTimer);

  startHeroTimer();

  /* =====================
   * TESTIMONIAL SLIDER
   * ===================== */
  let testimonials = document.querySelectorAll('.testimonial-slider .testimonial');
  const testiPrev = document.querySelector('.testi-btn.prev');
  const testiNext = document.querySelector('.testi-btn.next');
  let testiIndex = 0;

  function switchTestimonial(newIndex) {
    testimonials[testiIndex].classList.remove('active');
    testiIndex = newIndex;
    testimonials[testiIndex].classList.add('active');
  }

  function nextTestimonial() {
    testimonials = document.querySelectorAll('.testimonial-slider .testimonial');
    const nextIdx = (testiIndex + 1) % testimonials.length;
    switchTestimonial(nextIdx);
  }

  function prevTestimonial() {
    testimonials = document.querySelectorAll('.testimonial-slider .testimonial');
    const prevIdx = (testiIndex - 1 + testimonials.length) % testimonials.length;
    switchTestimonial(prevIdx);
  }

  testiNext.addEventListener('click', nextTestimonial);
  testiPrev.addEventListener('click', prevTestimonial);

  // Dynamically load Google reviews if place ID and API key are provided. When
  // successful, this function replaces the existing testimonials with the
  // latest reviews from your Google Business Profile. Only the first five
  // reviews are shown to keep the slider concise.
  async function loadGoogleReviews() {
    if (!GOOGLE_PLACE_ID || !GOOGLE_API_KEY) {
      return;
    }
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=rating,reviews&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const reviews = data.result && data.result.reviews ? data.result.reviews : [];
      if (reviews.length > 0) {
        const slider = document.querySelector('.testimonial-slider');
        slider.innerHTML = '';
        reviews.slice(0, 5).forEach((review, idx) => {
          const div = document.createElement('div');
          div.classList.add('testimonial');
          if (idx === 0) div.classList.add('active');
          // Escape double quotes to prevent HTML breakage
          const safeText = review.text.replace(/"/g, '\\"');
          div.innerHTML = `<p>“${safeText}”</p><h4>&mdash; ${review.author_name}</h4>`;
          slider.appendChild(div);
        });
        // Update testimonials NodeList and reset index
        testimonials = document.querySelectorAll('.testimonial-slider .testimonial');
        testiIndex = 0;
      }
    } catch (err) {
      console.error('Error loading Google reviews:', err);
    }
  }

  // Trigger loading of Google reviews once the page has initialised
  loadGoogleReviews();

  /* =====================
   * MOBILE NAVIGATION
   * ===================== */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* =====================
   * BACK TO TOP BUTTON
   * ===================== */
  const toTopBtn = document.querySelector('.to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      toTopBtn.classList.add('show');
    } else {
      toTopBtn.classList.remove('show');
    }
  });
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =====================
   * FOOTER YEAR
   * ===================== */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});