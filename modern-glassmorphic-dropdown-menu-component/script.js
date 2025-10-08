class ModernDropdown {
    constructor(element, options = {}) {
        this.wrapper = element;
        this.trigger = element.querySelector('.dropdown-trigger');
        this.menu = element.querySelector('.dropdown-menu');
        this.options = {
            openOnHover: window.innerWidth > 768,
            closeOnClickOutside: true,
            animation: true,
            ...options
        };
        
        this.init();
    }
    
    init() {
        // Desktop hover events
        if (this.options.openOnHover) {
            this.wrapper.addEventListener('mouseenter', () => this.open());
            this.wrapper.addEventListener('mouseleave', () => this.close());
        }
        
        // Mobile click events
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        // Close on click outside
        if (this.options.closeOnClickOutside) {
            document.addEventListener('click', (e) => {
                if (!this.wrapper.contains(e.target)) {
                    this.close();
                }
            });
        }
        
        // Handle submenu positioning
        this.handleSubmenuPosition();
        
        // Initialize keyboard navigation
        this.initKeyboardNav();
    }
    
    open() {
        this.wrapper.classList.add('active');
        this.menu.setAttribute('aria-expanded', 'true');
    }
    
    close() {
        this.wrapper.classList.remove('active');
        this.menu.setAttribute('aria-expanded', 'false');
    }
    
    toggle() {
        this.wrapper.classList.contains('active') ? this.close() : this.open();
    }
    
    handleSubmenuPosition() {
        const submenus = this.wrapper.querySelectorAll('.submenu');
        submenus.forEach(submenu => {
            const rect = submenu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                submenu.style.left = 'auto';
                submenu.style.right = '100%';
            }
        });
    }
    
    initKeyboardNav() {
        const items = this.menu.querySelectorAll('.dropdown-item');
        items.forEach((item, index) => {
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        items[index + 1]?.focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        items[index - 1]?.focus();
                        break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        item.click();
                        break;
                }
            });
        });
    }
}

// Initialize dropdowns
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-wrapper');
    dropdowns.forEach(dropdown => {
        new ModernDropdown(dropdown);
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-switch');
    themeToggle.addEventListener('change', () => {
        document.body.setAttribute('data-theme', 
            themeToggle.checked ? 'light' : 'dark');
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        dropdowns.forEach(dropdown => {
            const instance = new ModernDropdown(dropdown, {
                openOnHover: window.innerWidth > 768
            });
        });
    });
});