// غير الرقم ده برقم واتسابك بكود مصر 20
const MY_WHATSAPP_NUMBER = "201000000000";

const products = [
  {id:1, name:"مانجو", emoji:"🥭", price:55, unit:"كيلو", category:"فاكهة"},
  {id:2, name:"فراولة", emoji:"🍓", price:40, unit:"علبة", category:"فاكهة"},
  {id:3, name:"موز", emoji:"🍌", price:25, unit:"كيلو", category:"فاكهة"},
  {id:4, name:"برتقال", emoji:"🍊", price:22, unit:"كيلو", category:"فاكهة"},
  {id:5, name:"تفاح", emoji:"🍎", price:45, unit:"كيلو", category:"فاكهة"},
  {id:6, name:"عنب", emoji:"🍇", price:35, unit:"كيلو", category:"فاكهة"},
  {id:7, name:"طماطم", emoji:"🍅", price:15, unit:"كيلو", category:"خضار"},
  {id:8, name:"خيار", emoji:"🥒", price:18, unit:"كيلو", category:"خضار"},
  {id:9, name:"بطاطس", emoji:"🥔", price:20, unit:"كيلو", category:"خضار"},
  {id:10, name:"بصل", emoji:"🧅", price:16, unit:"كيلو", category:"خضار"},
  {id:11, name:"جزر", emoji:"🥕", price:18, unit:"كيلو", category:"خضار"},
  {id:12, name:"خس", emoji:"🥬", price:12, unit:"واحدة", category:"خضار"}
];

let cart = JSON.parse(localStorage.getItem("tazaCart")) || {};
let favorites = JSON.parse(localStorage.getItem("tazaFavorites")) || [];
let currentFilter = "الكل";

function startShopping() {
  document.getElementById("welcomeScreen").style.display = "none";
}

function showProducts() {
  const searchEl = document.getElementById("searchInput");
  const query = searchEl ? searchEl.value.trim() : "";

  const filtered = products.filter(p =>
    (currentFilter === "الكل" || p.category === currentFilter) &&
    p.name.includes(query)
  );

  document.getElementById("productsGrid").innerHTML = filtered.map(p => `
    <article class="product">
      <div class="product-img">${p.emoji}</div>
      <h3>${p.name}</h3>
      <small>طازة • ${p.unit}</small>
      <div class="price">${p.price} جنيه</div>
      <button class="add-btn" onclick="addToCart(${p.id})">＋ أضف للسلة</button>
      <button class="close-cart" style="width:100%;margin-top:7px" onclick="toggleFavorite(${p.id})">
        ${favorites.includes(p.id) ? "❤️ في المفضلة" : "♡ أضف للمفضلة"}
      </button>
    </article>
  `).join("") || '<p class="empty-message">مفيش منتجات مطابقة للبحث.</p>';
}

function filterProducts(category) {
  if (category === "عروض") {
    alert("هنضيف العروض والخصومات قريباً!");
    return;
  }
  currentFilter = category;
  document.getElementById("productsTitle").textContent = category === "الكل" ? "منتجات طازة" : category;
  showProducts();
  scrollToProducts();
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
}

function updateCart() {
  localStorage.setItem("tazaCart", JSON.stringify(cart));
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  document.getElementById("cartCount").textContent = count;

  const rows = Object.entries(cart);
  document.getElementById("cartItems").innerHTML = rows.length
    ? rows.map(([id, qty]) => {
        const p = products.find(item => item.id === Number(id));
        return `
          <div class="cart-row">
            <span>${p.emoji} ${p.name}<br>${p.price} جنيه</span>
            <div class="cart-actions">
              <button onclick="changeQty(${id},-1)">−</button>
              <span>${qty}</span>
              <button onclick="changeQty(${id},1)">＋</button>
            </div>
          </div>`;
      }).join("")
    : '<p class="empty-message">السلة لسه فاضية.</p>';

  const total = rows.reduce((sum, [id, qty]) => {
    return sum + (products.find(p => p.id === Number(id)).price * qty);
  }, 0);

  document.getElementById("cartTotal").textContent = total + " جنيه";
}

function changeQty(id, change) {
  cart[id] = (cart[id] || 0) + change;
  if (cart[id] <= 0) delete cart[id];
  updateCart();
}

function openCart() {
  updateCart();
  document.getElementById("cartPanel").style.display = "flex";
}

function closeCart() {
  document.getElementById("cartPanel").style.display = "none";
}

function scrollToProducts() {
  document.getElementById("productsSection").scrollIntoView({ behavior: "smooth" });
}

function goHome(button) {
  setActiveNav(button);
  currentFilter = "الكل";
  document.getElementById("productsTitle").textContent = "منتجات طازة";
  showProducts();
  window.scrollTo({top: 0, behavior: "smooth"});
}

function showCategories(button) {
  setActiveNav(button);
  document.querySelector(".categories").scrollIntoView({ behavior: "smooth" });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("tazaFavorites", JSON.stringify(favorites));
  if (currentFilter === "المفضلة") showFavorites();
  else showProducts();
}

function showFavorites(button) {
  if (button) setActiveNav(button);
  currentFilter = "المفضلة";
  document.getElementById("productsTitle").textContent = "المفضلة";

  const favList = products.filter(p => favorites.includes(p.id));
  document.getElementById("productsGrid").innerHTML = favList.map(p => `
    <article class="product">
      <div class="product-img">${p.emoji}</div>
      <h3>${p.name}</h3>
      <small>طازة • ${p.unit}</small>
      <div class="price">${p.price} جنيه</div>
      <button class="add-btn" onclick="addToCart(${p.id})">＋ أضف للسلة</button>
      <button class="close-cart" style="width:100%;margin-top:7px" onclick="toggleFavorite(${p.id})">إزالة من المفضلة</button>
    </article>
  `).join("") || '<p class="empty-message">لسه مفيش منتجات في المفضلة.</p>';

  scrollToProducts();
}

function showAccount(button) {
  setActiveNav(button);
  alert("صفحة الحساب قيد التطوير!");
}

function setActiveNav(button) {
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  if (button) button.classList.add("active");
}

function checkout() {
  if (Object.keys(cart).length === 0) {
    alert("السلة فاضية!");
    return;
  }
  closeCart();
  document.getElementById("checkoutPanel").style.display = "flex";
}

function closeCheckout() {
  document.getElementById("checkoutPanel").style.display = "none";
}

function sendOrderToWhatsApp() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();

  if (!name || !phone || !address) {
    alert("برجاء إدخال كافة البيانات المطلوبة.");
    return;
  }

  const rows = Object.entries(cart);
  let itemsText = "";
  let total = 0;

  rows.forEach(([id, qty], index) => {
    const p = products.find(item => item.id === Number(id));
    const subtotal = p.price * qty;
    total += subtotal;
    itemsText += `${index + 1}. ${p.emoji} ${p.name} × ${qty} ${p.unit} = ${subtotal} ج.م\n`;
  });

  const msg = `🌿 *طلب جديد من طازة ماركت*\n--------------------------\n👤 *العميل:* ${name}\n📞 *الهاتف:* ${phone}\n📍 *العنوان:* ${address}\n--------------------------\n🛒 *المنتجات:*\n${itemsText}--------------------------\n💰 *الإجمالي:* ${total} جنيه مصري`;

  window.open(`https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  cart = {};
  updateCart();
  closeCheckout();
}

showProducts();
updateCart();
   
