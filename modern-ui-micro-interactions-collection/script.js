// Magnetic Button
    const magneticWrap = document.querySelector('.magnetic-wrap');
    const magneticButton = document.querySelector('.magnetic-button');

    magneticWrap.addEventListener('mousemove', (e) => {
      const rect = magneticWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / 10;
      const deltaY = (y - centerY) / 10;

      magneticButton.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    magneticWrap.addEventListener('mouseleave', () => {
      magneticButton.style.transform = 'translate(0, 0)';
    });

    // Expandable Search
    const searchContainer = document.querySelector('.search-container');
    const searchButton = document.querySelector('.search-button');

    searchButton.addEventListener('click', () => {
      searchContainer.classList.toggle('active');
      if (searchContainer.classList.contains('active')) {
        searchContainer.querySelector('input').focus();
      }
    });

    // Ripple Button
    const rippleButton = document.querySelector('.ripple-button');

    rippleButton.addEventListener('click', (e) => {
      const rect = rippleButton.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      rippleButton.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });

    // Custom Checkbox
    const checkbox = document.querySelector('.custom-checkbox');
    
    checkbox.addEventListener('click', () => {
      checkbox.classList.toggle('checked');
    });

    // Progress Button
    const progressButton = document.querySelector('.progress-button');
    
    progressButton.addEventListener('click', () => {
      const progress = progressButton.querySelector('.progress');
      let width = 0;
      
      const interval = setInterval(() => {
        if (width >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            progress.style.width = '0%';
          }, 500);
        } else {
          width += 2;
          progress.style.width = width + '%';
        }
      }, 20);
    });

    // Notification Badge
    const notificationButton = document.querySelector('.notification-button');
    const badge = document.querySelector('.notification-badge');

    notificationButton.addEventListener('click', () => {
      badge.classList.toggle('show');
    });

    // Success Button
    const successButton = document.querySelector('.success-button');

    successButton.addEventListener('click', () => {
      successButton.classList.add('completed');
      setTimeout(() => {
        successButton.classList.remove('completed');
      }, 2000);
    });