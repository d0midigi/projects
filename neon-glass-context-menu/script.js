class NeonContextMenu {
    constructor() {
        this.contextMenu = document.getElementById('contextMenu');
        this.isVisible = false;
        this.init();
    }

    init() {
        // Prevent default context menu and show custom menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showMenu(e.clientX, e.clientY);
        });

        // Hide menu when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!this.contextMenu.contains(e.target)) {
                this.hideMenu();
            }
        });

        // Hide menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideMenu();
            }
        });

        // Add click handlers for menu items
        this.addMenuItemHandlers();

        // Add special effects
        this.addSpecialEffects();

        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.isVisible) {
                this.hideMenu();
            }
        });
    }

    showMenu(x, y) {
        // Calculate position to ensure menu stays within viewport
        const menuRect = this.contextMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Adjust x position
        if (x + menuRect.width > viewportWidth) {
            x = viewportWidth - menuRect.width - 10;
        }

        // Adjust y position
        if (y + menuRect.height > viewportHeight) {
            y = viewportHeight - menuRect.height - 10;
        }

        // Ensure minimum margins
        x = Math.max(10, x);
        y = Math.max(10, y);

        this.contextMenu.style.left = `${x}px`;
        this.contextMenu.style.top = `${y}px`;
        this.contextMenu.classList.add('show');
        this.isVisible = true;

        // Add entrance animation with delay for each item
        this.animateMenuItems();

        // Create ripple effect at cursor position
        this.createRippleEffect(x, y);
    }

    hideMenu() {
        this.contextMenu.classList.remove('show');
        this.isVisible = false;

        // Reset submenu visibility
        const submenus = this.contextMenu.querySelectorAll('.submenu');
        submenus.forEach(submenu => {
            submenu.style.opacity = '0';
            submenu.style.visibility = 'hidden';
        });
    }

    animateMenuItems() {
        const menuItems = this.contextMenu.querySelectorAll('.menu-item, .menu-separator');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }

    createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = 'radial-gradient(circle, rgba(0, 255, 255, 0.6) 0%, transparent 70%)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '999';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.transition = 'transform 0.6s ease, opacity 0.6s ease';

        document.body.appendChild(ripple);

        // Trigger animation
        setTimeout(() => {
            ripple.style.transform = 'translate(-50%, -50%) scale(20)';
            ripple.style.opacity = '0';
        }, 10);

        // Remove element after animation
        setTimeout(() => {
            document.body.removeChild(ripple);
        }, 600);
    }

    addMenuItemHandlers() {
        const menuItems = this.contextMenu.querySelectorAll('.menu-item[data-action]');
        
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.getAttribute('data-action');
                this.handleMenuAction(action);
                this.hideMenu();
            });

            // Add hover sound effect (visual feedback)
            item.addEventListener('mouseenter', () => {
                this.addHoverEffect(item);
            });

            // Add click effect
            item.addEventListener('click', () => {
                this.addClickEffect(item);
            });
        });
    }

    addHoverEffect(item) {
        // Create a glowing particle effect on hover
        const rect = item.getBoundingClientRect();
        const particle = document.createElement('div');
        
        particle.style.position = 'fixed';
        particle.style.left = `${rect.left + Math.random() * rect.width}px`;
        particle.style.top = `${rect.top + Math.random() * rect.height}px`;
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = '#00ffff';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1001';
        particle.style.boxShadow = '0 0 10px #00ffff';
        particle.style.animation = 'particleFloat 1s ease-out forwards';

        document.body.appendChild(particle);

        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        }, 1000);
    }

    addClickEffect(item) {
        // Create expanding circle effect on click
        const rect = item.getBoundingClientRect();
        const effect = document.createElement('div');
        
        effect.style.position = 'fixed';
        effect.style.left = `${rect.left + rect.width / 2}px`;
        effect.style.top = `${rect.top + rect.height / 2}px`;
        effect.style.width = '0px';
        effect.style.height = '0px';
        effect.style.border = '2px solid #00ffff';
        effect.style.borderRadius = '50%';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1001';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.transition = 'all 0.4s ease';

        document.body.appendChild(effect);

        setTimeout(() => {
            effect.style.width = '100px';
            effect.style.height = '100px';
            effect.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            if (document.body.contains(effect)) {
                document.body.removeChild(effect);
            }
        }, 400);
    }

    handleMenuAction(action) {
        // Create notification for the action
        this.showNotification(action);

        // Handle different actions
        switch (action) {
            case 'copy':
                console.log('Copy action triggered');
                break;
            case 'paste':
                console.log('Paste action triggered');
                break;
            case 'cut':
                console.log('Cut action triggered');
                break;
            case 'delete':
                console.log('Delete action triggered');
                break;
            case 'select-all':
                console.log('Select All action triggered');
                break;
            case 'properties':
                console.log('Properties action triggered');
                break;
            case 'new-folder':
                console.log('New Folder action triggered');
                break;
            case 'new-file':
                console.log('New File action triggered');
                break;
            case 'new-shortcut':
                console.log('New Shortcut action triggered');
                break;
            case 'refresh':
                console.log('Refresh action triggered');
                this.refreshPage();
                break;
            default:
                console.log(`Unknown action: ${action}`);
        }
    }

    showNotification(action) {
        // Create a beautiful notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">✨</div>
                <div class="notification-text">Action: ${action.replace('-', ' ').toUpperCase()}</div>
            </div>
        `;

        // Add notification styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(15, 15, 35, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 12px;
                padding: 16px 20px;
                z-index: 10000;
                transform: translateX(300px);
                transition: all 0.3s ease;
                box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                color: white;
                font-size: 14px;
                font-weight: 500;
            }
            
            .notification-icon {
                margin-right: 10px;
                font-size: 18px;
            }
            
            @keyframes notificationSlide {
                0% { transform: translateX(300px); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(300px)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
                if (document.head.contains(style)) {
                    document.head.removeChild(style);
                }
            }, 300);
        }, 3000);
    }

    refreshPage() {
        // Add a cool refresh effect before reloading
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)';
        overlay.style.zIndex = '10000';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s ease';

        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            location.reload();
        }, 500);
    }

    addSpecialEffects() {
        // Add CSS for particle animation
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes particleFloat {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-30px) scale(0);
                }
            }
        `;
        document.head.appendChild(particleStyle);

        // Add floating particles around the page
        setInterval(() => {
            if (!this.isVisible) return;
            
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = `${Math.random() * window.innerWidth}px`;
            particle.style.top = `${window.innerHeight}px`;
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = `hsl(${Math.random() * 60 + 180}, 100%, 70%)`;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '999';
            particle.style.boxShadow = `0 0 10px currentColor`;
            particle.style.animation = 'particleFloat 3s linear forwards';

            document.body.appendChild(particle);

            setTimeout(() => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            }, 3000);
        }, 2000);

        // Add CSS for sparkle animation
        const sparkleStyle = document.createElement('style');
        sparkleStyle.textContent = `
            @keyframes sparkleFloat {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(0);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-20px) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-40px) scale(0);
                }
            }
        `;
        document.head.appendChild(sparkleStyle);
    }
}

// Initialize the context menu when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Create the context menu instance and make it globally accessible
    window.neonContextMenu = new NeonContextMenu();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'c':
                    e.preventDefault();
                    window.neonContextMenu.handleMenuAction('copy');
                    if (window.neonContextMenu.isVisible) {
                        window.neonContextMenu.hideMenu();
                    }
                    break;
                case 'v':
                    e.preventDefault();
                    window.neonContextMenu.handleMenuAction('paste');
                    if (window.neonContextMenu.isVisible) {
                        window.neonContextMenu.hideMenu();
                    }
                    break;
                case 'x':
                    e.preventDefault();
                    window.neonContextMenu.handleMenuAction('cut');
                    if (window.neonContextMenu.isVisible) {
                        window.neonContextMenu.hideMenu();
                    }
                    break;
                case 'a':
                    e.preventDefault();
                    window.neonContextMenu.handleMenuAction('select-all');
                    if (window.neonContextMenu.isVisible) {
                        window.neonContextMenu.hideMenu();
                    }
                    break;
            }
        }
        
        if (e.key === 'F5') {
            e.preventDefault();
            window.neonContextMenu.handleMenuAction('refresh');
            if (window.neonContextMenu.isVisible) {
                window.neonContextMenu.hideMenu();
            }
        }
        
        if (e.key === 'Delete') {
            e.preventDefault();
            window.neonContextMenu.handleMenuAction('delete');
            if (window.neonContextMenu.isVisible) {
                window.neonContextMenu.hideMenu();
            }
        }
        
        if (e.altKey && e.key === 'Enter') {
            e.preventDefault();
            window.neonContextMenu.handleMenuAction('properties');
            if (window.neonContextMenu.isVisible) {
                window.neonContextMenu.hideMenu();
            }
        }
    });
    
    // Add some interactive effects to demo cards
    const demoCards = document.querySelectorAll('.demo-card');
    demoCards.forEach(card => {
        card.addEventListener('click', () => {
            // Create a pulse effect
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'translateY(-10px)';
            }, 100);
        });
    });

    // Add interactive effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Create sparkle effect
            createSparkleEffect(card);
        });
    });

    // Add interactive effects to tech items
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('click', () => {
            // Create bounce effect
            item.style.transform = 'translateY(-5px) scale(1.1)';
            setTimeout(() => {
                item.style.transform = 'translateY(-5px) scale(1.05)';
            }, 150);
        });
    });

    // Add scroll reveal animations
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Observe all sections
        document.querySelectorAll('.features-section, .demo-section, .tech-section, .cta-section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.8s ease';
            observer.observe(section);
        });
    };

    // Function to create sparkle effect
    function createSparkleEffect(element) {
        const rect = element.getBoundingClientRect();
        const sparkleCount = 5;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'fixed';
            sparkle.style.left = `${rect.left + Math.random() * rect.width}px`;
            sparkle.style.top = `${rect.top + Math.random() * rect.height}px`;
            sparkle.style.width = '4px';
            sparkle.style.height = '4px';
            sparkle.style.background = '#ffffff';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1001';
            sparkle.style.boxShadow = '0 0 6px #ffffff';
            sparkle.style.animation = 'sparkleFloat 1.5s ease-out forwards';

            document.body.appendChild(sparkle);

            setTimeout(() => {
                if (document.body.contains(sparkle)) {
                    document.body.removeChild(sparkle);
                }
            }, 1500);
        }
    }

    // Initialize scroll reveal
    observeElements();
});