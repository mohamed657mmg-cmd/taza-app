// حط رقم واتسابك هنا بنفس الصيغة (كود مصر 20)
const WHATSAPP_NUMBER = "201000000000";

// منتجات طازة (خضار وفاكهة مع العروض)
const products = [
  { id: 1, name: "طماطم بلدي", emoji: "🍅", price: 15, unit: "كيلو", category: "خضار", discount: "عرض خاص", desc: "طماطم طازجة حمراء ممتازة للسلطة والطبخ." },
  { id: 2, name: "خيار بلدي", emoji: "🥒", price: 18, unit: "كيلو", category: "خضار", discount: null, desc: "خيار طازج ومقرمش من الصوب الزراعية." },
  { id: 3, name: "بطاطس تحمير", emoji: "🥔", price: 20, unit: "كيلو", category: "خضار", discount: null, desc: "بطاطس ممتازة للتحمير شيبسي وصوابع مقرمشة." },
  { id: 4, name: "بصل أحمر", emoji: "🧅", price: 16, unit: "كيلو", category: "خضار", discount: null, desc: "بصل بلدي أحمر عالي الجودة يدوم طويلاً." },
  { id: 5, name: "مانجو عويس", emoji: "🥭", price: 55, unit: "كيلو", category: "فاكهة", discount: "خصم 20%", desc: "مانجو سكرية ممتازة منتقاة واحدة فواحدة." },
  { id: 6, name: "فراولة طازجة", emoji: "🍓", price: 35, unit: "علبة", category: "فاكهة", discount: "خصم 15%", desc: "فراولة حمراء مغسولة ومعبأة بعناية." },
  { id: 7, name: "موز بلدي", emoji: "🍌", price: 25, unit: "كيلو", category: "فاكهة", discount: null, desc: "موز مستوي طازج غني بالطاقة." },
  { id: 8, name: "برتقال بلدي", emoji: "🍊", price: 20, unit: "كيلو", category: "فاكهة", discount: null, desc: "برتقال عصير طازج ومليء بفيتامين سي." }
];

let cart = JSON.parse(localStorage.getItem("taza_cart")) || {};
let favorites = JSON.parse(localStorage.getItem("taza_favs")) || [];
let currentProductDetail = products[0];
let detailCount = 1;
let historyStack = ["screen-splash"];

function navigateTo(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("active");
    target.scrollTop = 0;
  }

  const nav = document.getElementById("mainNavbar");
  if (screenId === "screen-splash" || screenId === "screen-success") {
    nav.style.display = "none";
  } else {
    nav.style.display = "flex";
  }

  historyStack.push(screenId);
}

function goBack() {
  if (historyStack.length > 1) {
    historyStack.pop();
    const prev = historyStack[historyStack.length - 1];
    navigateTo(prev);
  } else {
    navigateTo("screen-home");
  }
}

function navTab(screenId, btn) {
  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  navigateTo(screenId);
}

function renderHomeProducts(list = products) {
  const container = document.getElementById("homeProductsGrid");
  container.innerHTML = list.map(p => `
    <div class="prod-card" onclick="openDetails(${p.id})">
      ${p.discount ? `<span class="badge-discount">${p.discount}</span>` : ""}
      <div class="prod-thumb">${p.emoji}</div>
      <h5>${p.name}</h5>
      <small>طازة • ${p.unit}</small>
      <div class="prod-footer">
        <span class="price">${p.price} ج.م</span>
        <button class="prod-add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">+</button>
      </div>
    </div>
  `).join("");
}

function filterHomeProducts() {
  const q = document.getElementById("homeSearchInput").value.trim().toLowerCase();
  const res = products.filter(p => p.name.includes(q) || p.category.includes(q));
  renderHomeProducts(res);
}

function filterByCategory(cat) {
  if (cat === "الكل") {
    renderHomeProducts(products);
  } else if (cat === "عروض") {
    renderHomeProducts(products.filter(p => p.discount));
  } else {
    renderHomeProducts(products.filter(p => p.category === cat));
  }
}

function renderCategoriesList() {
  const container = document.getElementById("categoriesListContainer");
  const cats = [
    { title: "الخضروات الطازجة", tag: "خضار", icon: "🥦" },
    { title: "الفواكه الموسمية", tag: "فاكهة", icon: "🍎" },
    { title: "عروض وتخفيضات طازة", tag: "عروض", icon: "🏷️" }
  ];

  container.innerHTML = cats.map(c => `
    <div class="cat-item-row" onclick="filterByCategory('${c.tag}'); navigateTo('screen-home')">
      <div><b>${c.icon} ${c.title}</b><br><small>أصناف طازجة ومختارة بعناية</small></div>
      <span>‹</span>
    </div>
  `).join("");
}

function openDetails(id) {
  const p = products.find(x => x.id === id);
  currentProductDetail = p;
  detailCount = 1;
  document.getElementById("detailsName").innerText = p.name;
  document.getElementById("detailsPrice").innerText = p.price;
  document.getElementById("detailsDesc").innerText = p.desc;
  document.getElementById("detailsImg").innerText = p.emoji;
  document.getElementById("detailsQty").innerText = detailCount;
  navigateTo("screen-details");
}

function changeDetailsQty(delta) {
  detailCount += delta;
  if (detailCount < 1) detailCount = 1;
  document.getElementById("detailsQty").innerText = detailCount;
}

function addDetailsToCart() {
  cart[currentProductDetail.id] = (cart[currentProductDetail.id] || 0) + detailCount;
  updateCartUI();
  navigateTo("screen-cart");
}

function toggleDetailsFav() {
  const id = currentProductDetail.id;
  if (favorites.includes(id)) {
    favorites = favorites.filter(x => x !== id);
    alert("تمت الإزالة من المفضلة");
  } else {
    favorites.push(id);
    alert("تمت الإضافة للمفضلة ❤️");
  }
  localStorage.setItem("taza_favs", JSON.stringify(favorites));
  renderFavorites();
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
}

function changeCartQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  updateCartUI();
}

function clearCart() {
  cart = {};
  updateCartUI();
}

function updateCartUI() {
  localStorage.setItem("taza_cart", JSON.stringify(cart));
  const entries = Object.entries(cart);
  const totalCount = entries.reduce((s, [, q]) => s + q, 0);
  document.getElementById("navCartCount").innerText = totalCount;

  const container = document.getElementById("cartItemsList");
  if (entries.length === 0) {
    container.innerHTML = `<p style="text-align:center;padding:40px;color:#999;">سلة طازة لسه فاضية 🧺</p>`;
    document.getElementById("cartTotalPrice").innerText = "0 ج.م";
    return;
  }

  let total = 0;
  container.innerHTML = entries.map(([id, qty]) => {
    const p = products.find(x => x.id === Number(id));
    const sub = p.price * qty;
    total += sub;
    return `
      <div class="cart-row-item">
        <span style="font-size:24px;">${p.emoji}</span>
        <div style="flex:1; margin-right:12px;">
          <b>${p.name}</b><br>
          <small>${p.price} ج.م / ${p.unit}</small>
        </div>
        <div class="counter">
          <button onclick="changeCartQty(${id}, -1)">-</button>
          <span>${qty}</span>
          <button onclick="changeCartQty(${id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("cartTotalPrice").innerText = total + " ج.م";
}

function renderFavorites() {
  const container = document.getElementById("favProductsGrid");
  const favList = products.filter(p => favorites.includes(p.id));
  if (favList.length === 0) {
    container.innerHTML = `<p style="grid-column: span 2;text-align:center;padding:40px;color:#999;">لسه مفيش منتجات في المفضلة</p>`;
    return;
  }
  container.innerHTML = favList.map(p => `
    <div class="prod-card" onclick="openDetails(${p.id})">
      <div class="prod-thumb">${p.emoji}</div>
      <h5>${p.name}</h5>
      <div class="prod-footer">
        <span class="price">${p.price} ج.م</span>
        <button class="prod-add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">+</button>
      </div>
    </div>
  `).join("");
}

function confirmOrder() {
  const name = document.getElementById("orderName").value.trim();
  const phone = document.getElementById("orderPhone").value.trim();
  const address = document.getElementById("orderAddress").value.trim();
  const notes = document.getElementById("orderNotes").value.trim();

  if (!name || !phone || !address) {
    alert("من فضلك أدخل الاسم ورقم التليفون والعنوان بالتفصيل!");
    return;
  }

  const entries = Object.entries(cart);
  if (entries.length === 0) {
    alert("السلة فاضية!");
    return;
  }

  let total = 0;
  let summary = "";
  entries.forEach(([id, qty]) => {
    const p = products.find(x => x.id === Number(id));
    total += p.price * qty;
    summary += `- ${p.name} × ${qty} ${p.unit} (${p.price * qty} ج.م)\n`;
  });

  const msg = `🌿 *طلب جديد من تطبيق طازة ماركت*\n\n` +
    `👤 *الاسم:* ${name}\n` +
    `📞 *رقم التليفون:* ${phone}\n` +
    `📍 *العنوان:* ${address}\n` +
    (notes ? `📝 *ملاحظات:* ${notes}\n` : "") +
    `\n🛒 *المنتجات:*\n${summary}\n` +
    `💰 *الإجمالي النهائي:* ${total} ج.م\n` +
    `💵 *طريقة الدفع:* كاش عند الاستلام`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");

  cart = {};
  updateCartUI();
  navigateTo("screen-success");
}

renderHomeProducts();
renderCategoriesList();
renderFavorites();
updateCartUI();
