/* profile.js
   Demo implementation: stores data in localStorage, simulates payments/orders,
   provides UI updates, animations, and all requested behaviors.
*/
(() => {
  // ---- Utilities ----
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const toast = (msg, timeout = 3000) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(t._hide);
    t._hide = setTimeout(() => t.classList.add("hidden"), timeout);
  };

  const formatNaira = (n) => `₦${Number(n || 0).toLocaleString()}`;

  // Intersection Observer for scroll effects
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  // ---- Storage keys & defaults ----
  const KEY = { PROFILE: "bmf_profile", WALLET: "bmf_wallet", TX: "bmf_tx", ORDERS: "bmf_orders" };
  const defaultProfile = { name: "Alice Benson", email: "alice@example.com", phone: "+2348012345678" };
  const defaultWallet = { balance: 4500 }; // initial demo balance
  const defaultTx = []; // transactions: {id, amount, status, date, method}
  const defaultOrders = [
    { id: genId(), items: 3, total: 3200, status: "success", date: Date.now() - 1000 * 60 * 60 * 24 * 2 },
    { id: genId(), items: 1, total: 1200, status: "fail", date: Date.now() - 1000 * 60 * 60 * 24 * 5 },
  ];

  // ---- helpers ----
  function genId() { return Math.random().toString(36).slice(2, 9); }
  function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
    catch { return fallback; }
  }

  // init storage if empty
  if (!localStorage.getItem(KEY.PROFILE)) save(KEY.PROFILE, defaultProfile);
  if (!localStorage.getItem(KEY.WALLET)) save(KEY.WALLET, defaultWallet);
  if (!localStorage.getItem(KEY.TX)) save(KEY.TX, defaultTx);
  if (!localStorage.getItem(KEY.ORDERS)) save(KEY.ORDERS, defaultOrders);

  // ---- DOM refs ----
  const avatar = $("#avatar");
  const navAvatar = $("#navAvatar");
  const displayName = $("#display-name");
  const displayEmail = $("#display-email");
  const walletBalanceEl = $("#wallet-balance");
  const transactionsList = $("#transactionsList");
  const ordersList = $("#ordersList");

  // modal refs
  const editModal = $("#editModal");
  const topupModal = $("#topupModal");
  const inputName = $("#input-name");
  const inputEmail = $("#input-email");
  const inputPhone = $("#input-phone");
  const topupAmount = $("#topup-amount");
  const topupMethod = $("#topup-method");

  // ---- UI update functions ----
  function setAvatarInitials(name) {
    if (!name) { avatar.textContent = "BM"; navAvatar.textContent = "BM"; return; }
    const parts = name.trim().split(/\s+/).filter(Boolean);
    let initials = (parts[0][0] || "").toUpperCase();
    if (parts.length > 1) initials += (parts[parts.length - 1][0] || "").toUpperCase();
    else initials += (parts[0][1] || "").toUpperCase();
    avatar.textContent = initials;
    navAvatar.textContent = initials;
  }

  function animateBalanceTo(amount) {
    // smooth counter from current to target
    const stored = load(KEY.WALLET, defaultWallet);
    const start = Number(stored.balance || 0);
    const target = Number(amount);
    const duration = 700;
    const stepMs = 30;
    const steps = Math.max(1, Math.floor(duration / stepMs));
    const delta = (target - start) / steps;
    let cur = start;
    let i = 0;
    clearInterval(walletBalanceEl._int);
    walletBalanceEl._int = setInterval(() => {
      i++;
      cur = Math.round((start + delta * i));
      if ((delta > 0 && cur >= target) || (delta < 0 && cur <= target) || i >= steps) {
        cur = target;
        clearInterval(walletBalanceEl._int);
      }
      walletBalanceEl.textContent = formatNaira(cur);
    }, stepMs);
  }

  function renderProfile() {
    const p = load(KEY.PROFILE, defaultProfile);
    displayName.textContent = p.name;
    displayEmail.textContent = p.email;
    inputName.value = p.name;
    inputEmail.value = p.email;
    inputPhone.value = p.phone || "";
    setAvatarInitials(p.name);
  }

  function renderWallet() {
    const w = load(KEY.WALLET, defaultWallet);
    walletBalanceEl.textContent = formatNaira(w.balance);
  }

  function renderTransactions() {
    const txs = load(KEY.TX, defaultTx).slice().reverse(); // newest first
    transactionsList.innerHTML = "";
    if (!txs.length) {
      transactionsList.innerHTML = `<li class="muted">No wallet transactions yet</li>`;
      return;
    }
    txs.forEach(t => {
      const li = document.createElement("li");
      li.className = "history-item";
      li.innerHTML = `
        <div class="left">
          <div style="width:42px;height:42px;border-radius:8px;background:linear-gradient(180deg,#0b0b0b,#161616);display:flex;align-items:center;justify-content:center">
            <i class="fa-solid fa-wallet"></i>
          </div>
          <div>
            <div style="display:flex;gap:10px;align-items:center">
              <div style="font-weight:700">${formatNaira(t.amount)}</div>
              <div class="meta">${new Date(t.date).toLocaleString()}</div>
            </div>
            <div class="meta">${t.method || "—"}</div>
          </div>
        </div>
        <div>
          <div class="badge ${t.status === 'success' ? 'success' : 'fail'}">${t.status === 'success' ? 'Success' : 'Failed'}</div>
        </div>
      `;
      transactionsList.appendChild(li);
      // small stagger in
      setTimeout(() => li.classList.add("show"), 80);
    });
  }

  function renderOrders() {
    const orders = load(KEY.ORDERS, defaultOrders).slice().reverse();
    ordersList.innerHTML = "";
    if (!orders.length) {
      ordersList.innerHTML = `<li class="muted">No orders yet</li>`;
      return;
    }
    orders.forEach(o => {
      const li = document.createElement("li");
      li.className = "history-item";
      li.innerHTML = `
        <div class="left">
          <div style="width:42px;height:42px;border-radius:8px;background:linear-gradient(180deg,#100,#151515);display:flex;align-items:center;justify-content:center">
            <i class="fa-solid fa-utensils"></i>
          </div>
          <div>
            <div style="display:flex;gap:10px;align-items:center">
              <div style="font-weight:700">Order #${o.id}</div>
              <div class="meta">${new Date(o.date).toLocaleDateString()}</div>
            </div>
            <div class="meta">${o.items} items · ${formatNaira(o.total)}</div>
          </div>
        </div>
        <div>
          <div class="badge ${o.status === 'success' ? 'success' : 'fail'}">${o.status === 'success' ? 'Delivered' : 'Failed'}</div>
        </div>
      `;
      ordersList.appendChild(li);
      setTimeout(() => li.classList.add("show"), 80);
    });
  }

  // ---- Actions ----
  function openModal(el) { el.classList.remove("hidden"); document.body.style.overflow = "hidden"; }
  function closeModal(el) { el.classList.add("hidden"); document.body.style.overflow = ""; }

  function saveProfileFromModal() {
    const p = { name: inputName.value.trim() || "Unnamed", email: inputEmail.value.trim() || "email@example.com", phone: inputPhone.value.trim() };
    save(KEY.PROFILE, p);
    renderProfile();
    toast("Profile updated");
    closeModal(editModal);
  }

  function simulateTopUp(amount, method) {
    // Create transaction with randomized success
    const tx = { id: genId(), amount: Number(amount), method, date: Date.now(), status: 'pending' };
    const txs = load(KEY.TX, defaultTx);
    txs.push(tx);
    save(KEY.TX, txs);

    // Simulate payment delay & random success
    toast("Processing payment...");
    return new Promise((res) => {
      setTimeout(() => {
        const success = Math.random() > 0.15; // 85% success
        tx.status = success ? 'success' : 'fail';
        // update txs
        const updated = load(KEY.TX, defaultTx).map(t => t.id === tx.id ? tx : t);
        save(KEY.TX, updated);

        if (success) {
          // add to wallet
          const w = load(KEY.WALLET, defaultWallet);
          w.balance = Number(w.balance || 0) + Number(amount);
          save(KEY.WALLET, w);
        }
        res({ success, tx });
      }, 900 + Math.random() * 1200);
    });
  }

  // ---- Event bindings ----
  document.addEventListener("DOMContentLoaded", () => {
    // initial render
    renderProfile();
    renderWallet();
    renderTransactions();
    renderOrders();

    // observe fade-up elements
    $$(".fade-up").forEach(el => io.observe(el));

    // Edit profile
    $("#editProfileBtn").addEventListener("click", () => openModal(editModal));
    $("#closeEdit").addEventListener("click", () => closeModal(editModal));
    $("#saveProfile").addEventListener("click", saveProfileFromModal);

    // Top-up
    $("#topUpBtn").addEventListener("click", () => {
      topupAmount.value = "";
      topupMethod.value = "card";
      openModal(topupModal);
    });
    $("#closeTopup").addEventListener("click", () => closeModal(topupModal));
    $("#confirmTopup").addEventListener("click", async () => {
      const amount = Number(topupAmount.value);
      if (!amount || amount < 100) { toast("Enter an amount ≥ ₦100"); return; }
      closeModal(topupModal);

      const method = topupMethod.value;
      const { success, tx } = await simulateTopUp(amount, method);

      // show result
      if (success) {
        renderWallet();
        animateBalanceTo(load(KEY.WALLET).balance);
        toast(`Top up ${formatNaira(amount)} successful`);
      } else {
        toast("Top up failed. Try again.");
      }
      renderTransactions();
    });

    // Save profile on Enter (modal)
    [inputName, inputEmail, inputPhone].forEach(inp => {
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveProfileFromModal();
      });
    });

    // Simulate order (demo)
    $("#simulateOrderBtn").addEventListener("click", () => {
      const amount = Math.floor(Math.random() * 4000) + 800;
      const order = { id: genId(), items: Math.floor(Math.random() * 4) + 1, total: amount, status: Math.random() > 0.12 ? "success" : "fail", date: Date.now() };
      const orders = load(KEY.ORDERS, defaultOrders);
      orders.push(order);
      save(KEY.ORDERS, orders);
      renderOrders();
      toast("Simulated order added");
    });

    // Avatar click opens edit modal (nice UX)
    avatar.addEventListener("click", () => openModal(editModal));
    navAvatar.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Make some elements 'pop' when wallet changes
    const observer = new MutationObserver(muts => {
      muts.forEach(m => {
        walletBalanceEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 450, easing: 'ease-out' });
      });
    });
    observer.observe(walletBalanceEl, { childList: true, subtree: true, characterData: true });

  });

  // Expose for debugging (optional)
  window.BMF = {
    load, save, renderProfile, renderWallet, renderTransactions, renderOrders, simulateTopUp
  };

})();
