// استبدل برقم هاتفك لواتساب
const WHATSAPP_NUMBER = "201000000000";

// قاعدة بيانات المنتجات
const products = [
  { id: 1, name: "مانجو عويس", emoji: "🥭", price: 45, category: "مانجو", discount: "20% خصم", desc: "مانجو طازجة عالية الجودة، ذات طعم سكري مميز ولذيذ." },
  { id: 2, name: "فراولة بلدي", emoji: "🍓", price: 25, category: "فراولة", discount: "15% خصم", desc: "فراولة حمراء طازجة ونظيفة مناسبة للعصائر والتناول المباشر." },
  { id: 3, name: "موز بلدي", emoji: "🍌", price: 20, category: "موز", discount: null, desc: "موز مستوي طازج غني بالبوتاسيوم والطاقة." },
  { id: 4, name: "برتقال أبو سرة", emoji: "🍊", price: 22, category: "برتقال", discount: null, desc: "برتقال طازج كثير العصير ومليء بفيتامين C." },
  { id: 5, name: "تفاح أحمر", emoji: "🍎", price: 40, category: "تفاح", discount: null, desc: "تفاح مقرمش وحلو المذاق منتقى بعناية." },
  { id: 6, name: "عنب بناتي", emoji: "🍇", price: 35, category: "عنب", discount: null, desc: "عنب بدون بذر سكري وطازج من المزرعة." }
];

let cart = JSON.parse(localStorage.getItem("fruity_cart")) || {};
let favorites = JSON.parse(localStorage.getItem("fruity_favs")) || [];
let currentProductDetail = products[0];
let detailCount = 1;
let historyStack = ["screen-splash"];

// نظام التنقل بين الشاشات
function navigateTo(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("active");
    target.scrollTop = 0;
  }

  // إخفاء الـ Bottom Nav في شاشة الترحيب وتأكيد الطلب
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

// عرض المنتجات في الصفحة الرئيسية
function renderHomeProducts(list = products) {
  const container = document.getElementById("homeProductsGrid");
  container.innerHTML = list.map(p => `
    <div class="prod-card" onclick="openDetails(${p.id})">
      ${p.discount ? `<span class="badge-discount">${p.discount}</span>` : ""}
      <div class="prod-thumb">${p.emoji}</div>
      <h5>${p.name}</h5>
      <small>طازة • 1 كجم</small>
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
  const res = products.filter(p => p.category === cat);
  renderHomeProducts(res);
}

// شاشة الأقسام
function renderCategoriesList() {
  const container = document.getElementById("categoriesListContainer");
  const cats = [...new Set(products.map(p => p.category))];
  container.innerHTML = cats.map(c => `
    <div class="cat-item-row" onclick="filterByCategory('${c}'); navigateTo('screen-home')">
      <div><b>${c}</b><br><small>أصناف طازجة ومختارة</small></div>
      <span>‹</span>
    </div>
  `).join("");
}

// تفاصيل المنتج
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
  localStorage.setItem("fruity_favs", JSON.stringify(favorites));
  renderFavorites();
}

// السلة
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
  localStorage.setItem("fruity_cart", JSON.stringify(cart));
  const entries = Object.entries(cart);
  const totalCount = entries.reduce((s, [, q]) => s + q, 0);
  document.getElementById("navCartCount").innerText = totalCount;

  const container = document.getElementById("cartItemsList");
  if (entries.length === 0) {
    container.innerHTML = `<p style="text-align:center;padding:40px;color:#999;">السلة فارغة حالياً 🧺</p>`;
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
          <small>${p.price} ج.م / كجم</small>
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

// المفضلة
function renderFavorites() {
  const container = document.getElementById("favProductsGrid");
  const favList = products.filter(p => favorites.includes(p.id));
  if (favList.length === 0) {
    container.innerHTML = `<p style="grid-column: span 2;text-align:center;padding:40px;color:#999;">لا توجد عناصر في المفضلة</p>`;
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

// تأكيد الطلب
function confirmOrder() {
  const name = document.getElementById("orderName").value.trim();
  const phone = document.getElementById("orderPhone").value.trim();
  const address = document.getElementById("orderAddress").value.trim();
  const notes = document.getElementById("orderNotes").value.trim();

  if (!name || !phone || !address) {
    alert("يرجى ملء الاسم والهاتف والعنوان!");
    return;
  }

  const entries = Object.entries(cart);
  if (entries.length === 0) {
    alert("السلة فارغة!");
    return;
  }

  let total = 0;
  let summary = "";
  entries.forEach(([id, qty]) => {
    const p = products.find(x => x.id === Number(id));
    total += p.price * qty;
    summary += `- ${p.name} × ${qty} كجم (${p.price * qty} ج.م)\n`;
  });

  const msg = `🌿 *طلب جديد من تطبيق Fruity*\n\n` +
    `👤 *الاسم:* ${name}\n` +
    `📞 *الهاتف:* ${phone}\n` +
    `📍 *العنوان:* ${address}\n` +
    (notes ? `📝 *ملاحظات:* ${notes}\n` : "") +
    `\n🛒 *الطلب:*\n${summary}\n` +
    `💰 *الإجمالي:* ${total} ج.م\n` +
    `💵 *طريقة الدفع:* كاش عند الاستلام`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");

  cart = {};
  updateCartUI();
  navigateTo("screen-success");
}

// التهيئة عند التشغيل
renderHomeProducts();
renderCategoriesList();
renderFavorites();
updateCartUI();
                    
