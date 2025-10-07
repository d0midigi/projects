const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

// Sidebar toggle işlemi
menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
});

// Sayfa yüklendiğinde ve boyut değişimlerinde sidebar durumunu ayarlama
function adjustSidebar() {
    if (window.innerWidth <= 576) {
        sidebar.classList.add('hide');  // 576px ve altı için sidebar gizli
        sidebar.classList.remove('show');
    } else {
        sidebar.classList.remove('hide');  // 576px'den büyükse sidebar görünür
        sidebar.classList.add('show');
    }
}

// Sayfa yüklendiğinde ve pencere boyutu değiştiğinde sidebar durumunu ayarlama
window.addEventListener('load', adjustSidebar);
window.addEventListener('resize', adjustSidebar);

// Arama butonunu toggle etme
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
    if (window.innerWidth < 768) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
})

// Dark Mode Switch
const switchMode = document.getElementById('switch-mode');

if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark');
    switchMode.checked = true;
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
    document.getElementById('switch-mode').checked = true;
}

switchMode.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('dark-mode', 'disabled');
    }
});


const categoriesLink = document.getElementById('categoriesLink');
const categoriesMenu = document.getElementById('categoriesMenu');

categoriesLink.addEventListener('click', function (e) {
    e.preventDefault(); // Linkin varsayılan davranışını engelle
    categoriesMenu.classList.toggle('show');

    // Diğer menüleri kapat
    document.querySelector('.notification-menu').classList.remove('show');
    document.querySelector('.profile-menu').classList.remove('show');
});

// Menü dışına tıklandığında menüyü kapat
window.addEventListener('click', function (e) {
    if (!e.target.closest('#categoriesLink') && !e.target.closest('.categories-menu')) {
        categoriesMenu.classList.remove('show');
    }
});

// Notification Menu Toggle
document.querySelector('.notification').addEventListener('click', function () {
    document.querySelector('.notification-menu').classList.toggle('show');
    document.querySelector('.profile-menu').classList.remove('show'); // Close profile menu if open
});

// Profile Menu Toggle
document.querySelector('.profile').addEventListener('click', function () {
    document.querySelector('.profile-menu').classList.toggle('show');
    document.querySelector('.notification-menu').classList.remove('show'); // Close notification menu if open
});

// Close menus if clicked outside
window.addEventListener('click', function (e) {
    if (!e.target.closest('.notification') && !e.target.closest('.profile')) {
        document.querySelector('.notification-menu').classList.remove('show');
        document.querySelector('.profile-menu').classList.remove('show');
    }
});

// Menülerin açılıp kapanması için fonksiyon
    function toggleMenu(menuId) {
      var contentMenu = document.getElementById(menuId);
      var allMenus = document.querySelectorAll('.content-menu');

      // Diğer tüm menüleri kapat
      allMenus.forEach(function(m) {
        if (m !== contentMenu) {
          m.style.display = 'none';
        }
      });

      // Tıklanan menü varsa aç, yoksa kapat
      if (contentMenu.style.display === 'none' || contentMenu.style.display === '') {
        contentMenu.style.display = 'block';
      } else {
        contentMenu.style.display = 'none';
      }
    }

    // Başlangıçta tüm menüleri kapalı tut
    document.addEventListener("DOMContentLoaded", function() {
      var allMenus = document.querySelectorAll('.content-menu');
      allMenus.forEach(function(contentMenu) {
        contentMenu.style.display = 'none';
      });
    });
	
document.querySelectorAll('.todo-list li').forEach(function(item) {
    var progress = item.getAttribute('data-progress'); // 'data-progress' attribute'u alınıyor
    item.style.setProperty('--progress-width', progress + '%'); // Dinamik olarak CSS değişkeni ayarlanıyor
});	

document.querySelectorAll('.menu-icon').forEach(function(icon) {
    icon.addEventListener('click', function(e) {
        // Menü öğesinin görünürlük durumunu değiştir
        var menu = icon.querySelector('.content-menu');
        var isVisible = menu.style.display === 'block';
        
        // Diğer menüler kapalıysa sadece tıklanan menüyü aç
        document.querySelectorAll('.content-menu').forEach(function(otherMenu) {
            if (otherMenu !== menu) {
                otherMenu.style.display = 'none';
            }
        });
        
        // Menü görünürse gizle, değilse göster
        menu.style.display = isVisible ? 'none' : 'block';
        
        // Tıklama olayının başka yerlere yayılmasını engelle
        e.stopPropagation();
    });
});

// Menü dışında bir yere tıklanınca menüyü kapatma
document.addEventListener('click', function() {
    document.querySelectorAll('.content-menu').forEach(function(menu) {
        menu.style.display = 'none';
    });
});
function filterTodos(status) {
    const todos = document.querySelectorAll('.todo-list li');
    todos.forEach(todo => {
        if (status === 'all' || (status === 'completed' && todo.classList.contains('completed')) || (status === 'pending' && todo.classList.contains('not-completed'))) {
            todo.style.display = 'flex';
        } else {
            todo.style.display = 'none';
        }
    });
}

document.querySelectorAll('.notification-menu li').forEach(notification => {
    notification.addEventListener('click', function() {
        this.classList.add('read');
        updateNotificationCount();
    });
});

function updateNotificationCount() {
    const unreadNotifications = document.querySelectorAll('.notification-menu li:not(.read)').length;
    document.querySelector('.notification .num').textContent = unreadNotifications;
}

document.getElementById('searchUser').addEventListener('input', filterOrders);
document.getElementById('filterStatus').addEventListener('change', filterOrders);

function filterOrders() {
    const searchText = document.getElementById('searchUser').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;

    document.querySelectorAll('.order table tbody tr').forEach(row => {
        const user = row.querySelector('td:nth-child(2) span').textContent.toLowerCase();
        const status = row.querySelector('td:nth-child(4) .status').textContent.toLowerCase();

        const matchesSearch = user.includes(searchText);
        const matchesStatus = statusFilter === 'all' || status === statusFilter;

        if (matchesSearch && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}