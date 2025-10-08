// ===== Tiny hash router =====
function parseHash() {
  var h = location.hash || "#/landing";
  var [_, route, a, b] = h.split("/");
  var query = new URLSearchParams(h.split("?")[1] || "");
  return { route, a, b, query };
}
function onRoute(cb) {
  window.addEventListener("hashchange", cb);
}

// ===== Store + seed data =====
var Store = {
  users: [],
  products: [],
  orders: [],
  posts: [],
  projects: [],
  notifications: [],
  messages: [],
  cart: [],
  charts: { traffic: null, sales: null, roles: null }
};
(function seed() {
  var firsts = ["Mila", "Ivan", "Sara", "Alex", "Nina", "Mark"];
  var lasts = ["Kovač", "Petrović", "Radić", "Savić", "Tomić", "Uroš"];
  Store.users = Array.from({ length: 18 }, (_, i) => ({
    id: "u" + (i + 1),
    first: firsts[i % firsts.length],
    last: lasts[i % lasts.length],
    email: `user${i + 1}@example.com`,
    role: i % 7 ? "User" : "Manager",
    lastLogin: new Date(Date.now() - 86400000 * i).toISOString().slice(0, 10)
  }));
  var titles = [
    "Glass Mug",
    "Soft Hoodie",
    "Desk Mat",
    "Sticker Pack",
    "Wireless Pad"
  ];
  var tags = ["new", "hot", "gift", "desk", "wear"];
  Store.products = Array.from({ length: 20 }, (_, i) => ({
    id: "p" + (i + 1),
    title: `${titles[i % titles.length]} ${i + 1}`,
    price: Math.floor(Math.random() * 90 + 10),
    tags: [tags[i % tags.length]],
    category: ["Home", "Wear", "Desk"][i % 3],
    desc: "Crisp, minimal and comfy. Looks great in glass.",
    popularity: Math.random()
  }));
  Store.orders = Array.from({ length: 28 }, (_, i) => ({
    no: 100200 + i,
    customer: `${Store.users[i % Store.users.length].first} ${
      Store.users[i % Store.users.length].last
    }`,
    product: Store.products[i % Store.products.length].title,
    total: Math.random() * 200 + 20,
    date: new Date(Date.now() - 86400000 * i).toISOString().slice(0, 10)
  }));
  var postTitles = [
    "Designing with glass",
    "Neumorphism in 2025",
    "Theming tricks",
    "Small SPA patterns"
  ];
  Store.posts = Array.from({ length: 8 }, (_, i) => ({
    slug: "post-" + (i + 1),
    title: `${postTitles[i % postTitles.length]} #${i + 1}`,
    summary: "Quick notes on design & UI systems",
    author: "Alex Doe",
    date: new Date(Date.now() - 86400000 * i * 3).toISOString().slice(0, 10),
    tags: ["design", "ui", "dev"].slice(0, 1 + (i % 3)),
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae."
  }));
  Store.projects = Array.from({ length: 9 }, (_, i) => ({
    id: "pr" + (i + 1),
    title: "Project " + (i + 1),
    blurb: "Short note on what this project is about.",
    tech: ["Figma", "React", "Node"][i % 3]
  }));
  Store.notifications = [
    "Mila liked your post",
    "New comment on Project 3",
    "Server deploy finished",
    "Order #100211 shipped"
  ];
  Store.messages = [
    { from: "Alex", text: "Hey there!" },
    { from: "Me", text: "All good!" },
    { from: "Alex", text: "Check the new layout." }
  ];
})();

// ===== DOM helpers & templating =====
var $ = (sel) => document.querySelector(sel);
var $$ = (sel) => Array.from(document.querySelectorAll(sel));
function mount(selector, html) {
  var el = $(selector);
  if (el) el.innerHTML = html;
}
async function loadTemplate(name) {
  var tpl = document.getElementById("tpl-" + name);
  return tpl
    ? tpl.innerHTML
    : `<div class="page"><div class="glass card">Template <b>${name}</b> not found.</div></div>`;
}

// ===== Shell builders =====
function sidebar() {
  return `
  <div class="brand"><div class="logo">🦖</div> GlassKit</div>
  <nav class="nav-group">
    <h5>General</h5>
    <a class="navlink" href="#/landing">Landing</a>
    <a class="navlink" href="#/login">Login</a>
    <a class="navlink" href="#/register">Register</a>
    <a class="navlink" href="#/forgot">Forgot Password</a>
    <a class="navlink" href="#/user-profile">User Profile</a>
    <a class="navlink" href="#/contact">Contact</a>
    <a class="navlink" href="#/about">About</a>
    <a class="navlink" href="#/forms">Forms Gallery</a>
    <a class="navlink" href="#/search?q=design">Search Results</a>
    <a class="navlink" href="#/404">404</a>
  </nav>
  <nav class="nav-group">
    <h5>Dashboard</h5>
    <a class="navlink" href="#/dashboard">Dashboard Home</a>
    <a class="navlink" href="#/users">User Management</a>
    <a class="navlink" href="#/settings">Settings</a>
    <a class="navlink" href="#/datatables">Data Tables</a>
  </nav>
  <nav class="nav-group">
    <h5>E-Commerce</h5>
    <a class="navlink" href="#/products">Product Grid</a>
    <a class="navlink" href="#/cart">Shopping Cart</a>
    <a class="navlink" href="#/checkout">Checkout</a>
  </nav>
  <nav class="nav-group">
    <h5>Blog</h5>
    <a class="navlink" href="#/blog">Blog Index</a>
  </nav>
  <nav class="nav-group">
    <h5>Social</h5>
    <a class="navlink" href="#/feed">User Feed</a>
    <a class="navlink" href="#/profile/demo">Profile</a>
    <a class="navlink" href="#/notifications">Notifications</a>
    <a class="navlink" href="#/messages">Messages/Chat</a>
  </nav>
  <nav class="nav-group">
    <h5>Portfolio</h5>
    <a class="navlink" href="#/portfolio">Portfolio Home</a>
    <a class="navlink" href="#/projects">Project Gallery</a>
  </nav>
  <div style="margin-top:auto; display:flex; gap:.5rem;">
    <button class="btn small" id="toggleSidebar" title="Toggle">☰</button>
    <a class="btn small ghost" href="#/landing">View Site</a>
  </div>`;
}
function topbar() {
  return `
  <button class="btn small" id="openSidebar" style="display:none">☰</button>
  <form class="search glass" id="searchForm">
    <span>🔎</span>
    <input id="searchInput" placeholder="Search products, posts, users…"/>
    <button class="btn small" type="submit">Search</button>
  </form>
  <div class="glass" style="padding:.4rem .6rem; border-radius:12px; display:flex; align-items:center; gap:.6rem;">
    <span class="badge">v1.0</span>
    <span class="badge">Chart.js</span>
    <span class="pill">Theme: <b id="themeName">light</b></span>
  </div>`;
}
function configPanel() {
  return `
  <h3 class="title">Appearance</h3>
  <div class="row"><span>Theme</span>
    <div>
      <label class="pill"><input type="radio" name="theme" value="light"> Light</label>
      <label class="pill"><input type="radio" name="theme" value="dark"> Dark</label>
      <label class="pill"><input type="radio" name="theme" value="neutral"> Neutral</label>
    </div>
  </div>
  <div class="row"><span>Blur</span><input id="blurCtl" type="range" min="4" max="24" value="12"></div>
  <div class="row"><span>Radius</span><input id="radiusCtl" type="range" min="6" max="28" value="18"></div>
  <div class="row"><span>Accent hue</span><input id="hueCtl" type="range" min="0" max="360" value="210"></div>
  <div class="row"><label class="pill"><input id="compactCtl" type="checkbox"> Compact layout</label></div>`;
}

// ===== Theming =====
function setTheme(name) {
  document.documentElement.setAttribute("data-theme", name);
  localStorage.setItem("glasskit.theme", name);
  var n = document.getElementById("themeName");
  if (n) n.textContent = name;
}
function initThemeToggles() {
  var theme = localStorage.getItem("glasskit.theme") || "light";
  setTheme(theme);
  $$("input[name='theme']").forEach((r) => {
    r.checked = r.value === theme;
    r.onchange = (e) => setTheme(e.target.value);
  });
  $("#blurCtl").oninput = (e) =>
    document.documentElement.style.setProperty("--blur", e.target.value + "px");
  $("#radiusCtl").oninput = (e) =>
    document.documentElement.style.setProperty(
      "--radius",
      e.target.value + "px"
    );
  $("#hueCtl").oninput = (e) =>
    document.documentElement.style.setProperty("--hue", e.target.value);
  $("#compactCtl").onchange = (e) =>
    document.body.style.setProperty(
      "letter-spacing",
      e.target.checked ? "-.1px" : "0"
    );
}

// ===== Charts + KPIs =====
function initCharts() {
  var tc = document.getElementById("trafficChart");
  var sc = document.getElementById("salesChart");
  var rc = document.getElementById("rolesChart");
  if (tc && !Store.charts.traffic) {
    Store.charts.traffic = new Chart(tc.getContext("2d"), {
      type: "line",
      data: {
        labels: Array.from({ length: 12 }, (_, i) => `W${i + 1}`),
        datasets: [
          {
            label: "k visits",
            data: Array.from(
              { length: 12 },
              () => (Math.random() * 12 + 8) | 0
            ),
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: { plugins: { legend: { display: false } } }
    });
  }
  if (sc && !Store.charts.sales) {
    Store.charts.sales = new Chart(sc.getContext("2d"), {
      type: "bar",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        datasets: [
          {
            data: Array.from(
              { length: 12 },
              () => ((Math.random() * 20 + 5) | 0) * 1000
            )
          }
        ]
      },
      options: { plugins: { legend: { display: false } } }
    });
  }
  if (rc && !Store.charts.roles) {
    Store.charts.roles = new Chart(rc.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Admin", "Manager", "User"],
        datasets: [{ data: [5, 12, 83] }]
      },
      options: { plugins: { legend: { position: "bottom" } } }
    });
  }
}
function fillKpis() {
  var r = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  var set = (id, val) => {
    var n = document.getElementById(id);
    if (n) n.textContent = val;
  };
  set("kpiUsers", r(1200, 2200));
  set("kpiSales", "€" + r(25000, 62000).toLocaleString());
  set("kpiTraffic", r(150000, 380000).toLocaleString());
  set("kpiConv", (Math.random() * 4 + 1).toFixed(2) + "%");
  set("kpiUsersDelta", r(2, 14));
  set("kpiSalesDelta", r(3, 18));
  set("kpiTrafficDelta", r(1, 9));
  set("kpiConvDelta", r(1, 7));
}

// ===== Page renderers =====
var Renders = {
  miniOrders() {
    var t = $("#ordersTable");
    if (!t) return;
    t.innerHTML =
      `<tr><th>#</th><th>Customer</th><th>Product</th><th>Total</th><th>Date</th></tr>` +
      Store.orders
        .slice(0, 6)
        .map(
          (o) =>
            `<tr><td>${o.no}</td><td>${o.customer}</td><td>${
              o.product
            }</td><td>€${o.total.toFixed(2)}</td><td>${o.date}</td></tr>`
        )
        .join("");
  },
  activity() {
    var a = $("#activity");
    if (!a) return;
    var items = [
      "User mila.k created an account",
      "Order #" + Store.orders[0].no + " shipped",
      "Price updated for Glass Mug",
      'New blog post "Designing with glass"',
      "New message from Alex"
    ];
    a.innerHTML = items.map((s) => `<li class="muted">${s}</li>`).join("");
  },
  users() {
    var q = ($("#userFilter")?.value || "").toLowerCase();
    var rows = Store.users.filter((u) =>
      `${u.first} ${u.last} ${u.email}`.toLowerCase().includes(q)
    );
    var tbl = $("#usersTable");
    if (!tbl) return;
    tbl.innerHTML =
      `<tr><th>Name</th><th>Email</th><th>Role</th><th>Last login</th><th></th></tr>` +
      rows
        .map(
          (u) =>
            `<tr><td>${u.first} ${u.last}</td><td>${u.email}</td><td><span class="pill">${u.role}</span></td><td>${u.lastLogin}</td><td class="actions"><button class="btn small ghost" data-action="edit" data-id="${u.id}">Edit</button><button class="btn small ghost" data-action="delete" data-id="${u.id}">Delete</button></td></tr>`
        )
        .join("");
  },
  orders() {
    var q = ($("#ordersFilter")?.value || "").toLowerCase();
    var rows = Store.orders.filter((o) =>
      `${o.customer} ${o.product}`.toLowerCase().includes(q)
    );
    var tbl = $("#ordersTable2");
    if (!tbl) return;
    tbl.innerHTML =
      `<tr><th>#</th><th>Customer</th><th>Product</th><th>Total</th><th>Date</th></tr>` +
      rows
        .map(
          (o) =>
            `<tr><td>${o.no}</td><td>${o.customer}</td><td>${
              o.product
            }</td><td>€${o.total.toFixed(2)}</td><td>${o.date}</td></tr>`
        )
        .join("");
  },
  products() {
    var wrap = $("#productGrid");
    if (!wrap) return;
    wrap.innerHTML = "";
    var q = ($("#productFilter")?.value || "").toLowerCase();
    var sort = $("#productSort")?.value || "popular";
    let list = Store.products.filter((p) =>
      `${p.title} ${(p.tags || []).join(" ")}`.toLowerCase().includes(q)
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    list.forEach((p) =>
      wrap.insertAdjacentHTML(
        "beforeend",
        `
      <div class="glass card">
        <img src="https://picsum.photos/seed/${p.id}/600/400" alt="${
          p.title
        }" style="width:100%; height:150px; object-fit:cover; border-radius:12px;"/>
        <div class="title" style="margin-top:.35rem;">${p.title}</div>
        <div class="muted">€${p.price.toFixed(2)}</div>
        <div style="display:flex; justify-content:space-between; margin-top:.6rem;">
          <a class="btn small ghost" href="#/product/${p.id}">View</a>
          <button class="btn small" data-add="${p.id}">Add to cart</button>
        </div>
      </div>`
      )
    );
  },
  productDetail(id) {
    var p = Store.products.find((x) => x.id === id);
    var el = $("#productDetail");
    if (!el) return;
    if (!p) {
      el.innerHTML = '<p class="muted">Not found.</p>';
      return;
    }
    el.innerHTML = `
      <div class="grid cols-2">
        <img src="https://picsum.photos/seed/${
          p.id
        }/900/700" style="width:100%; border-radius:14px;"/>
        <div>
          <div class="badge">${p.category}</div>
          <h2 class="title">${p.title}</h2>
          <p class="muted">${p.desc || "—"}</p>
          <h3>€${p.price.toFixed(2)}</h3>
          <button class="btn" data-add="${p.id}">Add to cart</button>
        </div>
      </div>`;
  },
  cart() {
    var wrap = $("#cartItems");
    if (!wrap) return;
    if (Store.cart.length === 0) {
      wrap.innerHTML = '<p class="muted">Your cart is empty.</p>';
      return;
    }
    let total = 0;
    wrap.innerHTML =
      Store.cart
        .map((c) => {
          var p = Store.products.find((x) => x.id === c.id);
          var line = p.price * c.qty;
          total += line;
          return `<div class="glass card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:.5rem;">
        <div style="display:flex; align-items:center; gap:.6rem;">
          <img src="https://picsum.photos/seed/${
            p.id
          }/120/90" style="width:80px; height:60px; object-fit:cover; border-radius:8px;"/>
          <div><div class="title" style="font-size:1rem;">${
            p.title
          }</div><div class="muted">€${p.price.toFixed(2)}</div></div>
        </div>
        <div style="display:flex; gap:.4rem; align-items:center;">
          <button class="btn small ghost" data-qty="-1" data-id="${
            p.id
          }">−</button>
          <span class="pill">${c.qty}</span>
          <button class="btn small ghost" data-qty="1" data-id="${
            p.id
          }">+</button>
          <div style="width:80px; text-align:right;">€${line.toFixed(2)}</div>
        </div>
      </div>`;
        })
        .join("") +
      `<div style="text-align:right; font-weight:800;">Total: €${total.toFixed(
        2
      )}</div>`;
  },
  checkout() {
    var el = $("#coTotal");
    if (!el) return;
    var total = Store.cart.reduce(
      (s, c) => s + Store.products.find((p) => p.id === c.id).price * c.qty,
      0
    );
    el.textContent = "€" + total.toFixed(2);
  },
  blogIndex() {
    var wrap = $("#blogGrid");
    if (!wrap) return;
    wrap.innerHTML = "";
    Store.posts.forEach((p) =>
      wrap.insertAdjacentHTML(
        "beforeend",
        `
      <article class="glass card">
        <img src="https://picsum.photos/seed/post${
          p.slug
        }/800/400" style="width:100%; height:160px; object-fit:cover; border-radius:12px;"/>
        <h3 class="title" style="margin-top:.35rem;">${p.title}</h3>
        <p class="muted">${p.summary}</p>
        <div style="display:flex; gap:.4rem; flex-wrap:wrap;">${p.tags
          .map(
            (t) =>
              `<a class='pill' href='#/category/${encodeURIComponent(
                t
              )}'>${t}</a>`
          )
          .join("")}</div>
        <div style="display:flex; justify-content:space-between; margin-top:.6rem;">
          <div class="muted">By ${p.author} • ${p.date}</div>
          <a class="btn small ghost" href="#/post/${p.slug}">Read more</a>
        </div>
      </article>`
      )
    );
  },
  post(slug) {
    var p = Store.posts.find((x) => x.slug === slug);
    var el = $("#postView");
    if (!el) return;
    if (!p) {
      el.innerHTML = '<p class="muted">Post not found.</p>';
      return;
    }
    el.innerHTML = `
      <div class="badge">${p.tags.join(" · ")}</div>
      <h1 class="title" style="font-size:2rem;">${p.title}</h1>
      <div class="muted">By ${p.author} • ${p.date}</div>
      <img src="https://picsum.photos/seed/post${
        p.slug
      }/1200/600" style="width:100%; margin:.6rem 0; border-radius:14px;"/>
      <p>${p.content}</p>`;
  },
  category(cat) {
    var wrap = $("#catGrid");
    if (!wrap) return;
    var posts = Store.posts.filter((p) => p.tags.includes(cat));
    wrap.innerHTML = posts
      .map(
        (p) =>
          `<article class="glass card"><h3 class="title">${p.title}</h3><p class="muted">${p.summary}</p><a class="btn small ghost" href="#/post/${p.slug}">Open</a></article>`
      )
      .join("");
    var cn = $("#catName");
    if (cn) cn.textContent = cat;
  },
  feed() {
    var wrap = $("#feedList");
    if (!wrap) return;
    wrap.innerHTML = Array.from(
      { length: 6 },
      (_, i) =>
        `<div class="glass card"><div class="title">Post ${
          i + 1
        }</div><p class="muted">A quick status update appears here.</p><div style="display:flex; gap:.5rem;"><button class="btn small ghost">Like</button><button class="btn small ghost">Comment</button></div></div>`
    ).join("");
  },
  publicProfile(id) {
    var el = $("#profilePublic");
    if (!el) return;
    el.innerHTML = `<div class="grid cols-2"><div><img src="https://picsum.photos/seed/${
      id || "profile"
    }/600/600" style="width:100%; border-radius:14px;"/></div><div><h3 class="title">User ${
      id || "demo"
    }</h3><p class="muted">Bio lorem ipsum dolor sit amet.</p><div class="badge">1.2k followers</div></div></div>`;
  },
  notifications() {
    var ul = $("#notifList");
    if (!ul) return;
    ul.innerHTML = Store.notifications
      .map((n) => `<li class="muted">${n}</li>`)
      .join("");
  },
  messages() {
    var log = $("#chatLog");
    if (!log) return;
    log.innerHTML = Store.messages
      .map(
        (m) =>
          `<div class="msg ${m.from === "Me" ? "me" : "them"}">${m.text}</div>`
      )
      .join("");
  },
  userProfile() {
    var name = "Alex Doe",
      email = "alex@example.com";
    var avatar = `https://picsum.photos/seed/${encodeURIComponent(
      name
    )}/200/200`;
    var since = new Date(Date.now() - 86400000 * 365)
      .toISOString()
      .slice(0, 10);
    var set = (id, val) => {
      var n = document.getElementById(id);
      if (n) n.textContent = val;
    };
    set("profileName", name);
    set("profileEmail", email);
    set("profileSince", since);
    var a = document.getElementById("profileAvatar");
    if (a) a.src = avatar;
  },
  search(q) {
    var wrap = $("#searchResults");
    if (!wrap) return;
    var sq = $("#searchQuery");
    if (sq) sq.textContent = q;
    var inProducts = Store.products.filter((p) =>
      p.title.toLowerCase().includes(q.toLowerCase())
    );
    var inPosts = Store.posts.filter((p) =>
      p.title.toLowerCase().includes(q.toLowerCase())
    );
    var inUsers = Store.users.filter((u) =>
      `${u.first} ${u.last} ${u.email}`.toLowerCase().includes(q.toLowerCase())
    );
    var card = (title, desc, href) =>
      `<a class="glass card" style="text-decoration:none; color:inherit;" href="${href}"><div class="title">${title}</div><div class="muted">${desc}</div></a>`;
    wrap.innerHTML = "";
    inProducts
      .slice(0, 6)
      .forEach((p) =>
        wrap.insertAdjacentHTML(
          "beforeend",
          card(`🛍️ ${p.title}`, `€${p.price.toFixed(2)}`, `#/product/${p.id}`)
        )
      );
    inPosts
      .slice(0, 6)
      .forEach((p) =>
        wrap.insertAdjacentHTML(
          "beforeend",
          card(`📝 ${p.title}`, p.summary, `#/post/${p.slug}`)
        )
      );
    inUsers
      .slice(0, 6)
      .forEach((u) =>
        wrap.insertAdjacentHTML(
          "beforeend",
          card(`👤 ${u.first} ${u.last}`, u.email, `#/profile/${u.id}`)
        )
      );
  }
};

// ===== App bootstrap =====
async function render() {
  var { route, a, b, query } = parseHash();

  if (!$("#sidebar").dataset.ready) {
    mount("#sidebar", sidebar());
    $("#sidebar").dataset.ready = "1";
  }
  if (!$("#topbar").dataset.ready) {
    mount("#topbar", topbar());
    $("#topbar").dataset.ready = "1";
  }
  if (!$("#config").dataset.ready) {
    mount("#config", configPanel());
    $("#config").dataset.ready = "1";
    initThemeToggles();
  }

  // mobile sidebar toggles
  if (window.matchMedia("(max-width: 900px)").matches) {
    $("#openSidebar").style.display = "inline-flex";
    $("#openSidebar").onclick = () => $("#sidebar").classList.add("open");
    $("#toggleSidebar").onclick = () => $("#sidebar").classList.toggle("open");
  }

  // search
  var sf = $("#searchForm");
  if (sf)
    sf.onsubmit = (e) => {
      e.preventDefault();
      var q = $("#searchInput").value.trim();
      location.hash = `#/search?q=${encodeURIComponent(q)}`;
    };

  // mount template
  var tplHtml = await loadTemplate(route || "landing");
  mount("#main", tplHtml);

  // page hooks
  switch (route || "landing") {
    case "landing": {
      var y = $("#year");
      if (y) y.textContent = new Date().getFullYear();
      break;
    }
    case "dashboard":
      fillKpis();
      initCharts();
      Renders.miniOrders();
      Renders.activity();
      break;
    case "users":
      Renders.users();
      break;
    case "datatables":
      Renders.orders();
      break;
    case "products":
      Renders.products();
      break;
    case "product":
      Renders.productDetail(a);
      break;
    case "cart":
      Renders.cart();
      break;
    case "checkout":
      Renders.checkout();
      break;
    case "blog":
      Renders.blogIndex();
      break;
    case "post":
      Renders.post(a);
      break;
    case "category":
      Renders.category(decodeURIComponent(a || ""));
      break;
    case "feed":
      Renders.feed();
      break;
    case "profile":
      Renders.publicProfile(a);
      break;
    case "notifications":
      Renders.notifications();
      break;
    case "messages":
      Renders.messages();
      break;
    case "user-profile":
      Renders.userProfile();
      break;
    case "search":
      Renders.search(query.get("q") || "");
      break;
  }

  // active nav
  $$(".navlink").forEach((el) =>
    el.classList.toggle("active", el.getAttribute("href") === location.hash)
  );

  // delegation (main)
  $("#main").onclick = (e) => {
    var btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.add) {
      addToCart(btn.dataset.add);
    }
    if (btn.dataset.qty) {
      updateQty(btn.dataset.id, parseInt(btn.dataset.qty, 10));
    }
    if (btn.id === "placeOrder") {
      placeOrder();
    }
    if (btn.id === "sortTotal") {
      sortOrders("total");
    }
    if (btn.id === "sortDate") {
      sortOrders("date");
    }
    if (btn.dataset.action === "delete") {
      deleteUser(btn.dataset.id);
    }
    if (btn.dataset.action === "edit") {
      alert("Edit " + btn.dataset.id);
    }
  };
  var oninput = (id, fn) => {
    var el = document.getElementById(id);
    if (el) el.oninput = fn;
  };
  oninput("userFilter", () => Renders.users());
  oninput("ordersFilter", () => Renders.orders());
  oninput("productFilter", () => Renders.products());
  var ps = document.getElementById("productSort");
  if (ps) ps.onchange = () => Renders.products();
  var chatForm = document.getElementById("chatForm");
  if (chatForm) chatForm.onsubmit = sendChat;
}

// helpers used by delegation
function addToCart(id) {
  var item = Store.cart.find((c) => c.id === id);
  if (item) item.qty++;
  else Store.cart.push({ id, qty: 1 });
  alert("Added to cart");
}
function updateQty(id, d) {
  var item = Store.cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) Store.cart = Store.cart.filter((c) => c.id !== id);
  Renders.cart();
  Renders.checkout();
}
function sortOrders(key) {
  Store.orders.sort((a, b) =>
    key === "total"
      ? a.total - b.total
      : Date.parse(a.date) - Date.parse(b.date)
  );
  Renders.orders();
}
function deleteUser(id) {
  Store.users = Store.users.filter((u) => u.id !== id);
  Renders.users();
}
function sendChat(e) {
  e.preventDefault();
  var input = $("#chatInput");
  if (!input.value.trim()) return false;
  Store.messages.push({ from: "Me", text: input.value.trim() });
  input.value = "";
  Renders.messages();
  return false;
}
function placeOrder() {
  if (Store.cart.length === 0) return alert("Cart is empty");
  var orderNo = Math.floor(Math.random() * 900000 + 100000);
  var no = $("#orderNo");
  if (no) no.textContent = "#" + orderNo;
  var eta = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toDateString();
  var e = $("#orderEta");
  if (e) e.textContent = eta;
  Store.cart = [];
  location.hash = "#/order-confirmation";
}

// boot
window.addEventListener("DOMContentLoaded", () => {
  render();
  onRoute(render);
});