// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initMobileMenu();
  initSmoothScroll();
  initTechHover();
  initEmailJS();
  initContactForm();
  initAccessibility();
});

// ===== ANNÉE DANS LE FOOTER =====
function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ===== MENU MOBILE =====
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!mobileBtn || !mobileMenu) return;

  mobileBtn.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    mobileBtn.setAttribute('aria-expanded', String(!isOpen));
    
    // Changement d'icône
    const icon = mobileBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });

  // Fermeture avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      mobileBtn.setAttribute('aria-expanded', 'false');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
  });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        e.preventDefault();
        
        // Offset pour le header fixe
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Fermeture du menu mobile si ouvert
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          const mobileBtn = document.getElementById('mobile-menu-button');
          if (mobileBtn) {
            mobileBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
              icon.classList.add('fa-bars');
              icon.classList.remove('fa-times');
            }
          }
        }

        // Focus sur la cible pour l'accessibilité
        setTimeout(() => {
          target.focus({ preventScroll: true });
        }, 500);
      }
    });
  });
}

// ===== HOVER SUR LES TECHNOLOGIES =====
function initTechHover() {
  const techItems = document.querySelectorAll('.tech-item');
  const techName = document.getElementById('tech-name');

  if (!techName || techItems.length === 0) return;

  techItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const name = item.dataset.name;
      if (name) {
        techName.textContent = name;
        techName.style.opacity = '1';
      }
    });

    item.addEventListener('mouseleave', () => {
      techName.style.opacity = '0';
      // Reset après transition
      setTimeout(() => {
        if (techName.style.opacity === '0') {
          techName.textContent = '';
        }
      }, 300);
    });

    // Accessibilité clavier
    item.setAttribute('tabindex', '0');
    item.addEventListener('focus', () => {
      const name = item.dataset.name;
      if (name) {
        techName.textContent = name;
        techName.style.opacity = '1';
      }
    });

    item.addEventListener('blur', () => {
      techName.style.opacity = '0';
    });
  });
}

// ===== EMAILJS INITIALISATION =====
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: '4eBOkOZ518SKK7css'
    });
    console.log('EmailJS initialisé avec succès');
  } else {
    console.error('EmailJS non chargé - vérifiez la connexion internet');
  }
}

// ===== FORMULAIRE DE CONTACT =====
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  const mailtoBtn = document.getElementById('mailto-btn');

  if (!contactForm || !formMessage) return;

  // Bouton mailto alternatif
  if (mailtoBtn) {
    mailtoBtn.addEventListener('click', () => {
      const name = document.getElementById('name')?.value || '';
      const email = document.getElementById('email')?.value || '';
      const subject = document.getElementById('subject')?.value || 'Contact depuis le portfolio';
      const message = document.getElementById('message')?.value || '';
      
      const body = `${message}\n\n---\nDe: ${name}\nEmail: ${email}`;
      const emailTo = 'samir.hssn84@gmail.com';
      const mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      window.location.href = mailtoLink;
    });
  }

  // Soumission du formulaire
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset du message
    formMessage.classList.remove('hidden', 'success', 'error', 'info');
    formMessage.classList.add('info');
    formMessage.textContent = 'Envoi en cours...';

    // Vérification d'EmailJS
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS non disponible');
      showFormMessage('EmailJS non disponible. Utilisez le bouton "Ouvrir mail" ci-dessous.', 'error');
      if (mailtoBtn) mailtoBtn.classList.remove('hidden');
      return;
    }

    // Récupération des données
    const templateParams = {
      from_name: document.getElementById('name')?.value || '',
      from_email: document.getElementById('email')?.value || '',
      subject: document.getElementById('subject')?.value || '',
      message: document.getElementById('message')?.value || ''
    };

    // Validation basique
    if (!templateParams.from_name || !templateParams.from_email || !templateParams.message) {
      showFormMessage('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(templateParams.from_email)) {
      showFormMessage('Veuillez entrer une adresse e-mail valide.', 'error');
      return;
    }

    // Désactivation du formulaire pendant l'envoi
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
    }

    try {
      const response = await emailjs.send(
        'service_8vx4owd',
        'template_xjkobia',
        templateParams
      );

      console.log('Email envoyé avec succès', response.status, response.text);
      
      showFormMessage('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
      
      // Reset du formulaire
      contactForm.reset();
      
      // Masquage du bouton mailto
      if (mailtoBtn) mailtoBtn.classList.add('hidden');

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      
      showFormMessage(
        'Échec de l\'envoi. Utilisez le bouton "Ouvrir mail" ou contactez-moi directement à samir.hssn84@gmail.com',
        'error'
      );
      
      // Affichage du bouton mailto
      if (mailtoBtn) mailtoBtn.classList.remove('hidden');
      
    } finally {
      // Réactivation du bouton
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    }
  });
}

// ===== AFFICHAGE DES MESSAGES DE FORMULAIRE =====
function showFormMessage(message, type) {
  const formMessage = document.getElementById('form-message');
  if (!formMessage) return;

  formMessage.classList.remove('hidden', 'success', 'error', 'info');
  formMessage.classList.add(type);
  formMessage.textContent = message;
  
  // Scroll vers le message si nécessaire
  setTimeout(() => {
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);

  // Auto-masquage des messages de succès après 10s
  if (type === 'success') {
    setTimeout(() => {
      formMessage.classList.add('hidden');
    }, 10000);
  }
}

// ===== ACCESSIBILITÉ =====
function initAccessibility() {
  // Rendre les sections focusables pour la navigation clavier
  document.querySelectorAll('section[id]').forEach(section => {
    section.setAttribute('tabindex', '-1');
  });

  // Gestion du focus visible
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('using-keyboard');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
  });

  // Skip to main content (si besoin d'ajouter un lien dans le HTML)
  const skipLink = document.querySelector('a[href="#main"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
      }
    });
  }
}

// ===== AMÉLIORATION: LAZY LOADING DES IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== AMÉLIORATION: DÉTECTION DU SCROLL POUR LE HEADER =====
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (header) {
    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scroll vers le bas - masquer le header
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scroll vers le haut - afficher le header
      header.style.transform = 'translateY(0)';
    }
  }

  lastScroll = currentScroll;
});

// ===== AMÉLIORATION: ANIMATION AU SCROLL =====
if ('IntersectionObserver' in window) {
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        animObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('section').forEach(section => {
    animObserver.observe(section);
  });
}

// ===== UTILITIES: DEBOUNCE =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}