// ===== SISTEM AVANSAT DE ANIMAȚII PENTRU SITE =====

class AnimationController {
  constructor() {
    this.animatedElements = new Set();
    this.intersectionObserver = null;
    this.scrollElements = [];
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.bindScrollAnimations();
    this.bindHoverEffects();
    this.bindButtonEffects();
    this.bindFormAnimations();
    this.createParticles();
  }

  // ===== ANIMAȚII LA SCROLL CU INTERSECTION OBSERVER =====
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.animateElement(entry.target);
          this.animatedElements.add(entry.target);
        }
      });
    }, options);

    // Observă toate elementele cu clase de animație
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      this.intersectionObserver.observe(el);
    });
  }

  animateElement(element) {
    const delay = element.dataset.delay || 0;
    
    setTimeout(() => {
      element.classList.add('animated');
      
      // Animație specială pentru carduri
      if (element.classList.contains('card')) {
        this.animateCard(element);
      }
      
      // Animație specială pentru text
      if (element.classList.contains('text-reveal')) {
        this.animateText(element);
      }
    }, delay);
  }

  animateCard(card) {
    // Adaugă efecte hover avansate
    card.classList.add('card-3d', 'card-glow');
    
    // Animație de intrare specială
    card.style.transform = 'translateY(20px) scale(0.95)';
    card.style.opacity = '0';
    
    setTimeout(() => {
      card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.transform = 'translateY(0) scale(1)';
      card.style.opacity = '1';
    }, 100);
  }

  animateText(textElement) {
    const text = textElement.textContent;
    textElement.textContent = '';
    textElement.style.borderRight = '2px solid #FFD700';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        textElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      } else {
        setTimeout(() => {
          textElement.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    setTimeout(typeWriter, 200);
  }

  // ===== ANIMAȚII LA SCROLL MANUALE =====
  bindScrollAnimations() {
    let ticking = false;
    
    const updateScrollAnimations = () => {
      this.scrollElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !element.classList.contains('animated')) {
          element.classList.add('animated');
        }
      });
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ===== EFECTE HOVER AVANSATE =====
  bindHoverEffects() {
    // Carduri cu efect 3D
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.addCardHoverEffect(e.target);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.removeCardHoverEffect(e.target);
      });
      
      card.addEventListener('mousemove', (e) => {
        this.updateCard3DEffect(e.target, e);
      });
    });

    // Iconițe cu animații
    document.querySelectorAll('.icon-spin').forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'rotate(360deg) scale(1.1)';
      });
      
      icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'rotate(0deg) scale(1)';
      });
    });
  }

  addCardHoverEffect(card) {
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.transform = 'translateY(-8px) scale(1.02)';
    card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
  }

  removeCardHoverEffect(card) {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = '';
  }

  updateCard3DEffect(card, event) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }

  // ===== EFECTE PENTRU BUTOANE =====
  bindButtonEffects() {
    document.querySelectorAll('.btn').forEach(button => {
      // Efect ripple
      button.addEventListener('click', (e) => {
        this.createRippleEffect(e);
      });
      
      // Efect glow
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 10px 25px rgba(255, 215, 0, 0.4)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '';
      });
    });
  }

  createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // ===== ANIMAȚII PENTRU FORMULAR =====
  bindFormAnimations() {
    document.querySelectorAll('input, textarea').forEach(input => {
      // Focus effect
      input.addEventListener('focus', () => {
        input.style.transform = 'scale(1.02)';
        input.style.boxShadow = '0 0 0 4px rgba(255, 215, 0, 0.2)';
      });
      
      input.addEventListener('blur', () => {
        input.style.transform = 'scale(1)';
        input.style.boxShadow = '';
      });
      
      // Label animation
      const label = input.previousElementSibling;
      if (label && label.tagName === 'LABEL') {
        input.addEventListener('input', () => {
          if (input.value) {
            label.style.transform = 'translateY(-20px) scale(0.85)';
            label.style.color = '#FFD700';
          } else {
            label.style.transform = 'translateY(0) scale(1)';
            label.style.color = '';
          }
        });
      }
    });
  }

  // ===== PARTICULE ANIMATE =====
  createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    hero.appendChild(particlesContainer);
    
    for (let i = 0; i < 20; i++) {
      this.createParticle(particlesContainer);
    }
  }

  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Poziție aleatorie
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    
    container.appendChild(particle);
    
    // Resetează particula când se termină animația
    particle.addEventListener('animationend', () => {
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = '0s';
    });
  }

  // ===== ANIMAȚII PENTRU SLIDER-URI =====
  enhanceSliders() {
    document.querySelectorAll('.srv-slider, .team-slider').forEach(slider => {
      const viewport = slider.querySelector('.srv-viewport, .ts-viewport');
      const cards = slider.querySelectorAll('.srv-card, .team-card');
      
      if (viewport && cards.length) {
        // Animație pentru slide-uri
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('slide-fade', 'active');
            }
          });
        }, { threshold: 0.3 });
        
        cards.forEach(card => observer.observe(card));
      }
    });
  }

  // ===== ANIMAȚII PENTRU NAVIGAȚIE =====
  enhanceNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.add('nav-link-animated');
    });
  }

  // ===== UTILITARE PENTRU ANIMAȚII CUSTOM =====
  static addAnimationClass(element, className, delay = 0) {
    setTimeout(() => {
      element.classList.add(className);
    }, delay);
  }

  static removeAnimationClass(element, className, delay = 0) {
    setTimeout(() => {
      element.classList.remove(className);
    }, delay);
  }

  // ===== ANIMAȚII PENTRU LOADING =====
  static showLoading(element) {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    element.appendChild(spinner);
    return spinner;
  }

  static hideLoading(spinner) {
    if (spinner && spinner.parentNode) {
      spinner.parentNode.removeChild(spinner);
    }
  }
}

// ===== CSS PENTRU ANIMAȚII (ADAUGAT DINAMIC) =====
const animationStyles = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
  }
  
  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #FFD700;
    border-radius: 50%;
    animation: float 6s infinite linear;
    opacity: 0.6;
  }
  
  @keyframes float {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(-100px) rotate(360deg);
      opacity: 0;
    }
  }
`;

// Adaugă stilurile în document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// ===== INITIALIZARE =====
document.addEventListener('DOMContentLoaded', () => {
  // Inițializează controller-ul de animații
  window.animationController = new AnimationController();
  
  // Îmbunătățește slider-urile
  window.animationController.enhanceSliders();
  
  // Îmbunătățește navigația
  window.animationController.enhanceNavigation();
  
  // Adaugă clase de animație la elemente existente
  document.querySelectorAll('.card').forEach(card => {
    card.classList.add('animate-on-scroll', 'slide-up');
  });
  
  document.querySelectorAll('h1, h2, h3').forEach(heading => {
    heading.classList.add('animate-on-scroll', 'text-reveal');
  });
  
  document.querySelectorAll('.btn').forEach(button => {
    button.classList.add('btn-ripple', 'btn-glow');
  });
  
  document.querySelectorAll('.icon').forEach(icon => {
    icon.classList.add('icon-spin');
  });
});

// ===== EXPORT PENTRU UTILIZARE EXTERNĂ =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationController;
}
