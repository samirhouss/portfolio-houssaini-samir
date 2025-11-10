
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const mobileBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileBtn?.addEventListener('click', () => {
    const opened = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    mobileBtn.setAttribute('aria-expanded', String(!opened));
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 72;
          const elementPosition = target.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

          if (!mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
        }
      }
    });
  });

  const progressBars = document.querySelectorAll('.progress-bar');
  const skillsSection = document.getElementById('skills');
  if (skillsSection && progressBars.length) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressBars.forEach(bar => {
            const w = bar.getAttribute('data-width') || '0';
            setTimeout(() => bar.style.width = w + '%', 150 * Array.prototype.indexOf.call(progressBars, bar));
          });
          setTimeout(buildSkillsAnalysis, 900);
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });
    obs.observe(skillsSection);
  }

  function buildSkillsAnalysis() {
    const bars = Array.from(document.querySelectorAll('.progress-bar'));
    if (!bars.length) return;
    const values = bars.map(b => parseInt(b.getAttribute('data-width')||0,10));
    const avg = Math.round(values.reduce((s,v)=>s+v,0)/values.length);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const strong = bars.filter(b => parseInt(b.getAttribute('data-width')) >= 85).map(b => {
      const label = b.closest('div')?.querySelector('span')?.textContent?.trim() || '';
      return label;
    }).filter(Boolean);
    const weak = bars.filter(b => parseInt(b.getAttribute('data-width')) < 80).map(b => {
      const label = b.closest('div')?.querySelector('span')?.textContent?.trim() || '';
      return label;
    }).filter(Boolean);

    const summary = [];
    summary.push(`Moyenne : ${avg}%.`);
    summary.push(`Plus fort : ${max}% — ${strong.join(', ') || '—'}.`);
    summary.push(`À développer : ${weak.join(', ') || 'Aucun point faible notable.'}`);

    const container = document.getElementById('skills-summary');
    const analysisBox = document.getElementById('skills-analysis');
    if (container && analysisBox) {
      container.textContent = summary.join(' ');
      analysisBox.classList.remove('hidden');
    }
  }

  (function() {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({
        publicKey: '4eBOkOZ518SKK7css'
      });
      console.log('EmailJS initialisé avec succès');
    } else {
      console.error('EmailJS non chargé');
    }
  })();

  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  const mailtoBtn = document.getElementById('mailto-btn');

  if (mailtoBtn) {
    mailtoBtn.addEventListener('click', () => {
      const name = document.getElementById('name').value || '';
      const email = document.getElementById('email').value || '';
      const subject = document.getElementById('subject').value || 'Contact portfolio';
      const message = document.getElementById('message').value || '';
      const body = `${message}\n\n---\nDe: ${name}\nEmail: ${email}`;
      const emailTo = 'samir.hssn84@gmail.com';
      const mailto = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!formMessage) return;

      formMessage.classList.remove('hidden');
      formMessage.style.color = '#9CA3AF';
      formMessage.textContent = 'Envoi en cours...';

      const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };

      if (typeof emailjs === 'undefined') {
        console.error('EmailJS non disponible');
        formMessage.textContent = 'EmailJS non disponible — utilisez le bouton "Ouvrir mail".';
        formMessage.style.color = '#F59E0B';
        if (mailtoBtn) mailtoBtn.classList.remove('hidden');
        return;
      }

      try {
        const response = await emailjs.send(
          'service_8vx4owd',
          'template_xjkobia',
          templateParams
        );
        
        console.log('Email envoyé avec succès!', response.status, response.text);

        formMessage.textContent = 'Message envoyé avec succès !';
        formMessage.style.color = '#10B981';

        contactForm.reset();

        if (mailtoBtn) mailtoBtn.classList.add('hidden');
        
      } catch (error) {
        console.error('Erreur EmailJS:', error);

        formMessage.textContent = 'Échec de l\'envoi — utilisez le bouton "Ouvrir mail".';
        formMessage.style.color = '#F87171';

        if (mailtoBtn) mailtoBtn.classList.remove('hidden');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
    }
  });

  const navContactBtn = document.getElementById('nav-contact-btn');
  navContactBtn?.addEventListener('click', (e) => {
    setTimeout(() => document.getElementById('name')?.focus(), 600);
  });
});

const btnContact = document.querySelector(".btn-contact");
if (btnContact) {
  btnContact.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  });
}

const techItems = document.querySelectorAll('.tech-item');
const techName = document.getElementById('tech-name');

if (techName && techItems.length) {
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
    });
  });
}