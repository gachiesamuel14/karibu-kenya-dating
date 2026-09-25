const app = document.getElementById("app");
let view = state.user ? "discover" : "landing";
let activeChat = null;
let stack = [];

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

function go(next) {
  view = next;
  render();
}

function header() {
  return `
    <div class="topbar">
      <div class="brand"><div class="brand-mark">K</div> KARIBU</div>
      ${state.user ? `
        <div class="nav">
          <button class="${view==="discover"?"active":""}" data-go="discover">Discover</button>
          <button class="${view==="matches"?"active":""}" data-go="matches">Matches</button>
          <button class="${view==="chat"?"active":""}" data-go="chat">Chat</button>
          <button class="${view==="profile"?"active":""}" data-go="profile">Profile</button>
          <button class="${view==="safety"?"active":""}" data-go="safety">Safety</button>
        </div>` : `
        <div class="nav">
          <button data-go="login">Log in</button>
          <button class="primary" data-go="register">Create profile</button>
        </div>`}
    </div>`;
}

function landing() {
  return `
    <div class="shell">
      ${header()}
      <section class="hero">
        <div>
          <div class="kicker">Kenya · location-based matchmaking</div>
          <h1>Meet someone who is actually nearby.</h1>
          <p class="lede">Karibu matches people across Nairobi, Mombasa, Kisumu and every county in between — by distance, vibe, and the life you actually live.</p>
          <div class="cta-row">
            <button class="primary" data-go="register">Start matching</button>
            <button class="ghost" data-go="login">I already have an account</button>
          </div>
        </div>
        <div class="hero-card">
          <div class="hero-photo" style="background-image:url('${PHOTOS[0]}')">
            <div class="chip">Wanjiku · 27 · Westlands · 3 km</div>
          </div>
        </div>
      </section>
      <div class="grid-3">
        <article class="feature"><h3>County + GPS</h3><p class="muted">Use your phone location or pick a county. Distance is calculated from real coordinates.</p></article>
        <article class="feature"><h3>Modes that fit Kenya</h3><p class="muted">Student, Professional, or Church mode — plus tribe, faith, and interest filters if you want them.</p></article>
        <article class="feature"><h3>M-Pesa ready premium</h3><p class="muted">Boosts and extra likes checkout in KSh. Safety tools and reporting are built in.</p></article>
      </div>
    </div>`;
}

function authForm(mode) {
  return `
    <div class="shell">
      ${header()}
      <div class="auth-wrap card">
        <h2>${mode === "login" ? "Welcome back" : "Create your Karibu"}</h2>
        <p class="muted" style="margin:8px 0 16px">Demo accounts live in this browser only.</p>
        <form class="form" id="auth-form" data-mode="${mode}">
          ${mode === "register" ? `
            <label>Name</label><input name="name" required placeholder="Your name" />
            <div class="row-2">
              <div><label>Age</label><input name="age" type="number" min="18" max="70" value="26" required /></div>
              <div><label>Gender</label>
                <select name="gender"><option>F</option><option>M</option><option>Other</option></select>
              </div>
            </div>
            <label>County</label>
            <select name="county">${COUNTIES.map(c=>`<option>${c}</option>`).join("")}</select>
            <label>Bio</label><textarea name="bio" rows="3" placeholder="Who are you when you are not performing?"></textarea>
          ` : ""}
          <label>Email</label><input name="email" type="email" required placeholder="you@email.com" />
          <label>Password</label><input name="password" type="password" required minlength="4" />
          <button class="primary" type="submit">${mode === "login" ? "Log in" : "Create profile"}</button>
        </form>
      </div>
    </div>`;
}

function myCoords() {
  const u = state.user;
  if (u.lat && u.lng) return { lat: u.lat, lng: u.lng };
  const pair = COUNTY_COORDS[u.county] || COUNTY_COORDS.Nairobi;
  return { lat: pair[0], lng: pair[1] };
}

function filteredDeck() {
  const f = state.filters;
  const me = myCoords();
  return PEOPLE
    .filter(p => !state.blocked.includes(p.id) && !state.passes.includes(p.id) && !state.likes.includes(p.id))
    .filter(p => p.age >= f.minAge && p.age <= f.maxAge)
    .filter(p => f.county === "Any" || p.county === f.county)
    .filter(p => f.tribe === "Any" || p.tribe === f.tribe)
    .filter(p => f.religion === "Any" || p.religion === f.religion)
    .filter(p => f.mode === "Any" || p.mode === f.mode)
    .map(p => ({ ...p, km: haversineKm(me, p) }))
    .filter(p => p.km <= Number(f.maxKm))
    .sort((a, b) => a.km - b.km);
}

function discover() {
  stack = filteredDeck();
  const card = stack[0];
  return `
    <div class="shell">
      ${header()}
      <div class="app-layout">
        <aside class="side card">
          <h3>Filters</h3>
          <form class="form" id="filters" style="margin-top:12px">
            <label>County</label>
            <select name="county"><option>Any</option>${COUNTIES.map(c=>`<option ${state.filters.county===c?"selected":""}>${c}</option>`).join("")}</select>
            <label>Max distance (km)</label>
            <input type="number" name="maxKm" value="${state.filters.maxKm}" min="5" max="800" />
            <div class="row-2">
              <div><label>Min age</label><input type="number" name="minAge" value="${state.filters.minAge}" /></div>
              <div><label>Max age</label><input type="number" name="maxAge" value="${state.filters.maxAge}" /></div>
            </div>
            <label>Tribe</label>
            <select name="tribe"><option>Any</option>${TRIBES.map(t=>`<option ${state.filters.tribe===t?"selected":""}>${t}</option>`).join("")}</select>
            <label>Religion</label>
            <select name="religion"><option>Any</option>${RELIGIONS.map(t=>`<option ${state.filters.religion===t?"selected":""}>${t}</option>`).join("")}</select>
            <label>Mode</label>
            <select name="mode"><option>Any</option>${MODES.map(t=>`<option ${state.filters.mode===t?"selected":""}>${t}</option>`).join("")}</select>
            <button class="primary" type="submit">Apply</button>
          </form>
          <button class="ghost" id="use-gps" style="margin-top:10px;width:100%">Use my GPS</button>
        </aside>
        <section>
          ${state.premium ? "" : `<div class="premium-banner">Go Premium — extra likes, see who liked you, and pay with M-Pesa. <button class="primary" data-go="premium" style="margin-left:8px">Unlock</button></div>`}
          <div class="swipe-stage">
            ${card ? `
              <div>
                <div class="profile-card">
                  <img class="photo" src="${card.photo}" alt="${card.name}" />
                  <div class="profile-meta">
                    <h2>${card.name}, ${card.age}</h2>
                    <p>${card.county} · ${card.km} km · ${card.mode}</p>
                    <p style="margin-top:8px">${card.bio}</p>
                    <div class="tags">
                      <span class="tag">${card.tribe}</span>
                      <span class="tag">${card.religion}</span>
                      ${card.interests.map(i=>`<span class="tag">${i}</span>`).join("")}
                    </div>
                  </div>
                </div>
                <div class="actions">
                  <button class="orb no" data-act="pass" data-id="${card.id}">✕</button>
                  <button class="orb info" data-act="report" data-id="${card.id}">!</button>
                  <button class="orb yes" data-act="like" data-id="${card.id}">♥</button>
                </div>
              </div>` : `<div class="card"><h2>No one left in this radius.</h2><p class="muted">Widen distance or change county.</p></div>`}
          </div>
        </section>
      </div>
    </div>`;
}

function matchesView() {
  const matches = PEOPLE.filter(p => state.matches.includes(p.id));
  return `
    <div class="shell">
      ${header()}
      <h2 style="margin-bottom:16px">Matches</h2>
      <div class="match-grid">
        ${matches.length ? matches.map(p => `
          <article class="match-tile">
            <img src="${p.photo}" alt="${p.name}" />
            <div class="pad">
              <strong>${p.name}, ${p.age}</strong>
              <p class="muted">${p.county}</p>
              <button class="primary" data-chat="${p.id}" style="margin-top:8px">Chat</button>
            </div>
          </article>`).join("") : `<p class="muted">Like someone who likes you back and they land here.</p>`}
      </div>
    </div>`;
}

function chatView() {
  const partners = PEOPLE.filter(p => state.matches.includes(p.id));
  const them = PEOPLE.find(p => p.id === activeChat) || partners[0];
  if (them && !activeChat) activeChat = them.id;
  const thread = (them && state.chats[them.id]) || [];
  return `
    <div class="shell">
      ${header()}
      <div class="chat-layout">
        <aside class="card">
          ${partners.map(p => `<button class="ghost" style="width:100%;margin-bottom:8px;text-align:left" data-chat="${p.id}">${p.name}</button>`).join("") || `<p class="muted">No matches yet.</p>`}
        </aside>
        <section class="card thread">
          ${them ? `
            <div style="padding:12px;border-bottom:1px solid var(--line)"><strong>${them.name}</strong> · ${them.county}</div>
            <div class="msgs">${thread.map(m => `<div class="bubble ${m.who}">${m.text}</div>`).join("")}</div>
            <form class="composer" id="chat-form">
              <input name="text" placeholder="Write something kind..." required />
              <button class="primary">Send</button>
            </form>` : `<p class="muted" style="padding:20px">Match first, then talk.</p>`}
        </section>
      </div>
    </div>`;
}

function profileView() {
  const u = state.user;
  return `
    <div class="shell">
      ${header()}
      <div class="card form" style="max-width:560px">
        <h2>${u.name}, ${u.age}</h2>
        <p class="muted">${u.county} ${state.premium ? "· Premium" : ""}</p>
        <form id="profile-form" class="form" style="margin-top:16px">
          <label>Bio</label><textarea name="bio" rows="3">${u.bio || ""}</textarea>
          <label>County</label>
          <select name="county">${COUNTIES.map(c=>`<option ${u.county===c?"selected":""}>${c}</option>`).join("")}</select>
          <label>Tribe</label>
          <select name="tribe">${TRIBES.map(c=>`<option ${u.tribe===c?"selected":""}>${c}</option>`).join("")}</select>
          <label>Religion</label>
          <select name="religion">${RELIGIONS.map(c=>`<option ${u.religion===c?"selected":""}>${c}</option>`).join("")}</select>
          <label>Mode</label>
          <select name="mode">${MODES.map(c=>`<option ${u.mode===c?"selected":""}>${c}</option>`).join("")}</select>
          <button class="primary">Save profile</button>
        </form>
        <button class="ghost" id="logout" style="margin-top:12px">Log out</button>
      </div>
    </div>`;
}

function safetyView() {
  return `
    <div class="shell">
      ${header()}
      <div class="card" style="max-width:640px">
        <h2>Stay safe on Karibu</h2>
        <p class="muted" style="margin:10px 0 16px">Meet in public. Video-call first. Never send M-Pesa to someone you have not met.</p>
        <ul class="muted" style="padding-left:18px;line-height:1.8">
          <li>Report and block from any profile card.</li>
          <li>Reports stored: ${state.reports.length}. Blocked: ${state.blocked.length}.</li>
          <li>For cybercrime in Kenya, use the official KE-CIRT/CC portal.</li>
        </ul>
      </div>
    </div>`;
}

function premiumView() {
  return `
    <div class="shell">
      ${header()}
      <div class="card" style="max-width:520px">
        <h2>Karibu Plus</h2>
        <p class="muted" style="margin:8px 0 16px">KSh 799 / month · M-Pesa STK mock</p>
        <ul class="muted" style="padding-left:18px;line-height:1.8">
          <li>See who already liked you</li>
          <li>5x daily likes</li>
          <li>Boost in your county for 24 hours</li>
        </ul>
        <form id="mpesa" class="form" style="margin-top:16px">
          <label>M-Pesa number</label>
          <input name="phone" placeholder="07xx xxx xxx" required />
          <button class="primary">Pay KSh 799</button>
        </form>
      </div>
    </div>`;
}

function render() {
  const map = {
    landing, login: () => authForm("login"), register: () => authForm("register"),
    discover, matches: matchesView, chat: chatView, profile: profileView, safety: safetyView, premium: premiumView
  };
  app.innerHTML = (map[view] || landing)();
}

app.addEventListener("click", (e) => {
  const goBtn = e.target.closest("[data-go]");
  if (goBtn) go(goBtn.dataset.go);

  const chatBtn = e.target.closest("[data-chat]");
  if (chatBtn) { activeChat = chatBtn.dataset.chat; go("chat"); }

  const act = e.target.closest("[data-act]");
  if (act) {
    const id = act.dataset.id;
    if (act.dataset.act === "pass") {
      setState({ passes: [...state.passes, id] });
      toast("Passed");
    }
    if (act.dataset.act === "like") {
      const likes = [...state.likes, id];
      const mutual = Math.random() > 0.35;
      const matches = mutual && !state.matches.includes(id) ? [...state.matches, id] : state.matches;
      setState({ likes, matches });
      toast(mutual ? "It's a match!" : "Liked");
    }
    if (act.dataset.act === "report") {
      setState({ reports: [...state.reports, { id, at: Date.now() }], blocked: [...state.blocked, id] });
      toast("Reported and hidden");
    }
    render();
  }

  if (e.target.id === "logout") {
    setState({ user: null });
    go("landing");
  }

  if (e.target.id === "use-gps") {
    requestLocation().then((coords) => {
      if (!coords) return toast("Location denied — using county");
      const county = nearestCounty(coords);
      setState({ user: { ...state.user, ...coords, county } });
      toast("Located near " + county);
      render();
    });
  }
});

app.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.id === "auth-form") {
    const fd = new FormData(e.target);
    const mode = e.target.dataset.mode;
    if (mode === "login") {
      if (!state.user || state.user.email !== fd.get("email")) {
        toast("No account in this browser — create one");
        return;
      }
      go("discover");
      return;
    }
    const county = fd.get("county") || "Nairobi";
    const pair = COUNTY_COORDS[county];
    setState({
      user: {
        name: fd.get("name"),
        age: Number(fd.get("age")),
        gender: fd.get("gender"),
        email: fd.get("email"),
        county,
        bio: fd.get("bio"),
        tribe: "Prefer not to say",
        religion: "Prefer not to say",
        mode: "Open",
        lat: pair[0],
        lng: pair[1]
      }
    });
    go("discover");
  }
  if (e.target.id === "filters") {
    const fd = new FormData(e.target);
    setState({ filters: { ...state.filters, ...Object.fromEntries(fd.entries()), minAge: +fd.get("minAge"), maxAge: +fd.get("maxAge"), maxKm: +fd.get("maxKm") } });
    toast("Filters updated");
    render();
  }
  if (e.target.id === "profile-form") {
    const fd = new FormData(e.target);
    const county = fd.get("county");
    const pair = COUNTY_COORDS[county];
    setState({ user: { ...state.user, bio: fd.get("bio"), county, tribe: fd.get("tribe"), religion: fd.get("religion"), mode: fd.get("mode"), lat: pair[0], lng: pair[1] } });
    toast("Profile saved");
    render();
  }
  if (e.target.id === "chat-form" && activeChat) {
    const text = new FormData(e.target).get("text");
    const chats = { ...state.chats };
    chats[activeChat] = [...(chats[activeChat] || []), { who: "me", text }];
    setTimeout(() => {
      chats[activeChat] = [...chats[activeChat], { who: "them", text: "Sasa! That made me smile. Coffee in town this weekend?" }];
      setState({ chats });
      render();
    }, 600);
    setState({ chats });
    render();
  }
  if (e.target.id === "mpesa") {
    setState({ premium: true });
    toast("STK mock sent — Premium unlocked");
    go("discover");
  }
});

render();
