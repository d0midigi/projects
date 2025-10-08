// HTML elements ko select karo
const header = document.getElementById('main-header');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Scroll event listener
window.addEventListener('scroll', () => {
    // Check karo ki user kitna scroll kar chuka hai
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});