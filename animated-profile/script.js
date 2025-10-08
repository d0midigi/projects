document.addEventListener('DOMContentLoaded', function() {
  // Check if required elements exist
  const card = document.querySelector('.profile-card');
  const edge = document.querySelector('.profile-card-edge');
  const socialLinks = document.querySelectorAll('.social-links a');
  const contactBtn = document.getElementById('contactBtn');
  const particlesContainer = document.getElementById('particles');
  const typingText = document.querySelector('.typing-text');
  const skillTags = document.querySelectorAll('.skill-tag');

  if (!card || !edge || !particlesContainer || !typingText) {
    console.error('Required elements not found in the DOM');
    return;
  }

  // Create floating particles
  function createParticles() {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        // Random colors
        const colors = ['rgba(0, 219, 222, 0.6)', 'rgba(252, 0, 255, 0.6)', 'rgba(255, 255, 0, 0.6)'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
          particle.remove();
        }, 15000);
      }, i * 300);
    }
  }

  // Start particle animation if container exists
  if (particlesContainer) {
    createParticles();
    setInterval(createParticles, 15000);
  }

  // Initial animations with GSAP
  if (typeof gsap !== 'undefined') {
    gsap.from(card, { duration: 1, y: 50, opacity: 0, ease: "power3.out" });
    gsap.from('.profile-image', { 
      duration: 1, 
      scale: 0.5, 
      opacity: 0, 
      delay: 0.3, 
      ease: "back.out(1.7)" 
    });
    gsap.from('.profile-content > *', { 
      duration: 0.8, 
      y: 20, 
      opacity: 0, 
      stagger: 0.1, 
      delay: 0.5, 
      ease: "power2.out" 
    });
  } else {
    console.warn('GSAP library not loaded');
  }

  // 3D card rotation effect
  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    if (typeof gsap !== 'undefined') {
      gsap.to(card, { 
        duration: 0.3, 
        rotateX: rotateX, 
        rotateY: rotateY, 
        ease: "power2.out" 
      });
    }

    // Edge lighting effect
    const xPos = x / rect.width;
    const yPos = y / rect.height;
    edge.style.backgroundPosition = `${xPos * 100}% ${yPos * 100}%`;
  });

  // Reset card position when mouse leaves
  card.addEventListener('mouseleave', function() {
    if (typeof gsap !== 'undefined') {
      gsap.to(card, { 
        duration: 0.5, 
        rotateY: 0, 
        rotateX: 0, 
        ease: "power3.out" 
      });
    }
  });

  // Social icons animation
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      if (typeof gsap !== 'undefined') {
        gsap.to(this, { 
          duration: 0.3, 
          scale: 1.2, 
          ease: "back.out(1.7)" 
        });
      }
    });
    
    link.addEventListener('mouseleave', function() {
      if (typeof gsap !== 'undefined') {
        gsap.to(this, { 
          duration: 0.3, 
          scale: 1, 
          ease: "power2.out" 
        });
      }
    });
  });

  // Ripple effect for contact button
  if (contactBtn) {
    contactBtn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      // Clean up ripple after animation
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  }

  // Typing effect for title
  if (typingText) {
    const texts = ['UI/UX Designer', 'Creative Developer', 'Digital Artist', 'Problem Solver'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    function typeEffect() {
      const currentText = texts[textIndex];
      
      typingText.textContent = isDeleting 
        ? currentText.substring(0, charIndex - 1)
        : currentText.substring(0, charIndex + 1);
      
      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingTimeout = setTimeout(typeEffect, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingTimeout = setTimeout(typeEffect, 200);
      } else {
        const speed = isDeleting ? 100 : 200;
        typingTimeout = setTimeout(typeEffect, speed);
      }
    }

    // Start typing effect after 1 second
    typingTimeout = setTimeout(typeEffect, 1000);

    // Clean up timeout when page unloads
    window.addEventListener('beforeunload', () => {
      clearTimeout(typingTimeout);
    });
  }

  // Skill tags hover effect
  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      if (typeof gsap !== 'undefined') {
        gsap.to(this, { 
          duration: 0.3, 
          scale: 1.1, 
          ease: "back.out(1.7)" 
        });
      }
    });
    
    tag.addEventListener('mouseleave', function() {
      if (typeof gsap !== 'undefined') {
        gsap.to(this, { 
          duration: 0.3, 
          scale: 1, 
          ease: "power2.out" 
        });
      }
    });
  });
});