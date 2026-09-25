const KEY = "karibu.v1";

const defaultState = () => ({
  user: null,
  likes: [],
  passes: [],
  matches: [],
  blocked: [],
  reports: [],
  chats: {},
  premium: false,
  filters: { county: "Any", maxKm: 80, minAge: 21, maxAge: 40, tribe: "Any", religion: "Any", mode: "Any" }
});

function loadState() {
  try {
    return { ...defaultState(), ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

let state = loadState();

function setState(patch) {
  state = { ...state, ...patch };
  saveState(state);
  return state;
}
