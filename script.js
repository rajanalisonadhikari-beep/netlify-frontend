const internalLinks = document.querySelectorAll('a[href^="#"]');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (internalLinks.length) {
  internalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const typewriter = document.getElementById('typewriter');
if (typewriter) {
  const phrases = ['SEO Manager', 'Mountain Trekking Guide', 'Storyteller of the Hills'];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeLoop = () => {
    const currentPhrase = phrases[phraseIndex];
    if (!isDeleting) {
      typewriter.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex += 1;
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1200);
        return;
      }
    } else {
      typewriter.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex -= 1;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? 55 : 100);
  };

  typeLoop();
}

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const payload = {
      name: formData.get('name')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      message: formData.get('message')?.toString().trim() || ''
    };

    contactStatus.textContent = 'Sending...';
    contactStatus.style.color = '#2563eb';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Unable to send message.');
      contactForm.reset();
      contactStatus.textContent = 'Thanks! Your message was sent.';
      contactStatus.style.color = '#166534';
    } catch (error) {
      contactStatus.textContent = error.message || 'Something went wrong.';
      contactStatus.style.color = '#b91c1c';
    }
  });
}

const blogForm = document.getElementById('blog-form');
const blogPostsContainer = document.getElementById('blog-posts');

let blogPosts = [
  {
    title: 'Why SEO still matters in adventure travel',
    date: 'July 12, 2026',
    category: 'SEO',
    excerpt: 'A simple look at how trust, clarity, and storytelling shape high-intent travel searches.',
    content: 'Travel readers are searching with intent. The right SEO strategy helps an adventure business show up when people are ready to plan a trip. That means building useful pages, clear calls to action, and a content rhythm that answers real questions.',
  },
  {
    title: 'The calm discipline of mountain leadership',
    date: 'June 28, 2026',
    category: 'Trekking',
    excerpt: 'The lessons that guide a safe summit and a lasting client relationship are often the same.',
    content: 'Mountain leadership requires preparation, calm under pressure, and deep respect for changing weather and terrain. The same qualities shape strong client relationships and professional service.',
  },
];

function renderBlogPosts() {
  if (!blogPostsContainer) return;
  blogPostsContainer.innerHTML = '';
  blogPosts.forEach((post) => {
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.tabIndex = 0;
    article.innerHTML = `
      <p class="meta">${post.category} • ${post.date}</p>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="content">
        <p>${post.content}</p>
      </div>
    `;

    article.addEventListener('click', () => {
      article.classList.toggle('active');
    });

    article.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        article.classList.toggle('active');
      }
    });

    blogPostsContainer.appendChild(article);
  });
}

async function loadPosts() {
  if (!blogPostsContainer) return;
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Unable to load posts.');
    const posts = await response.json();
    blogPosts = posts.map((post) => ({
      title: post.title,
      date: new Date(post.publishedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: 'Blog',
      excerpt: post.excerpt || (post.body || '').slice(0, 120),
      content: post.body || ''
    }));
    renderBlogPosts();
  } catch (error) {
    renderBlogPosts();
  }
}

if (blogForm && blogPostsContainer) {
  loadPosts();

  blogForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(blogForm);
    const newPost = {
      title: formData.get('title')?.toString().trim() || 'Untitled Post',
      date: new Date().toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: formData.get('category')?.toString().trim() || 'Story',
      excerpt: (formData.get('content')?.toString().trim() || '').slice(0, 120) + '…',
      content: formData.get('content')?.toString().trim() || 'A new post will appear here soon.',
    };
    blogPosts.unshift(newPost);
    renderBlogPosts();
    blogForm.reset();
  });
}

const barberEntries = [
  {
    name: 'Fade Cut',
    description: 'A crisp low fade with soft texture for a clean, modern finish.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Classic Pompadour',
    description: 'Polished volume and shape made for a confident, timeless look.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Crew Cut',
    description: 'Low-maintenance and sharp, designed for everyday ease and structure.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  },
];

const galleryContainer = document.getElementById('barber-gallery');
const barberForm = document.getElementById('barber-form');

function renderBarberGallery() {
  if (!galleryContainer) return;
  galleryContainer.innerHTML = '';
  barberEntries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${entry.image}" alt="${entry.name}" />
      <h3>${entry.name}</h3>
      <p>${entry.description}</p>
    `;
    galleryContainer.appendChild(card);
  });
}

if (barberForm && galleryContainer) {
  renderBarberGallery();
  barberForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(barberForm);
    const imageValue = formData.get('image')?.toString().trim();
    barberEntries.unshift({
      name: formData.get('name')?.toString().trim() || 'New Style',
      description: formData.get('description')?.toString().trim() || 'Freshly added to the gallery.',
      image: imageValue || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    });
    renderBarberGallery();
    barberForm.reset();
  });
}

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');

if (lightbox && lightboxImage) {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.gallery-card button');
    if (!button) return;
    const img = button.querySelector('img');
    if (!img) return;
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add('active');
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.tagName === 'BUTTON') {
      lightbox.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      lightbox.classList.remove('active');
    }
  });
}

/* Hero slider behavior */
(() => {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;
  const slidesWrap = slider.querySelector('.slides');
  const prev = slider.querySelector('.slider-arrow.prev');
  const next = slider.querySelector('.slider-arrow.next');
  const dotsWrap = slider.querySelector('.slider-dots');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  let dots = Array.from(slider.querySelectorAll('.dot'));
  let index = slides.findIndex(s => s.classList.contains('active')) || 0;
  let interval = 4000;
  let timer = null;

  const rebuildDots = () => {
    dotsWrap.innerHTML = '';
    slides.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.className = 'dot' + (i === index ? ' active' : '');
      btn.dataset.index = i;
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
      dotsWrap.appendChild(btn);
    });
    dots = Array.from(dotsWrap.querySelectorAll('.dot'));
    dots.forEach((dot) => dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); resetTimer(); }));
  };

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    slidesWrap.style.transform = `translateX(${-index * 100}%)`;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === index));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
  };

  const nextSlide = () => goTo(index + 1);
  const prevSlide = () => goTo(index - 1);

  next?.addEventListener('click', () => { nextSlide(); resetTimer(); });
  prev?.addEventListener('click', () => { prevSlide(); resetTimer(); });

  // click slide to advance
  slidesWrap.addEventListener('click', (e) => {
    // don't advance when clicking controls
    if (e.target.closest('.slider-arrow') || e.target.closest('.slider-dots')) return;
    nextSlide(); resetTimer();
  });

  const startTimer = () => { timer = setInterval(nextSlide, interval); };
  const resetTimer = () => { clearInterval(timer); startTimer(); };

  // keyboard support
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextSlide(); resetTimer(); }
    if (e.key === 'ArrowLeft') { prevSlide(); resetTimer(); }
  });

  // initialize
  rebuildDots();
  goTo(index);
  startTimer();
})();
