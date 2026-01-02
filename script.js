const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const themeToggleText = themeToggle?.querySelector(".theme-toggle-text");
const THEME_KEY = "todo-theme";
const mediaQuery = window.matchMedia
  ? window.matchMedia("(prefers-color-scheme: dark)")
  : null;
let userThemeLocked = false;

const readStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
};

const applyTheme = (theme, { persist = false } = {}) => {
  const next = theme === "dark" ? "dark" : "light";
  root.dataset.theme = next;
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(next === "dark"));
  }
  if (themeToggleText) {
    themeToggleText.textContent = next === "dark" ? "Dark" : "Light";
  }
  if (persist) {
    userThemeLocked = true;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // no-op
    }
  }
};

const initTheme = () => {
  const stored = readStoredTheme();
  userThemeLocked = stored !== null;
  if (stored) {
    applyTheme(stored);
    return;
  }
  const fallback = mediaQuery?.matches ? "dark" : "light";
  applyTheme(fallback);
};

initTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = root.dataset.theme === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next, { persist: true });
  });
}

const handleSystemThemeChange = (event) => {
  if (userThemeLocked) {
    return;
  }
  applyTheme(event.matches ? "dark" : "light");
};

// Listen for system theme changes (supports older browsers with fallback)
if (mediaQuery?.addEventListener) {
  mediaQuery.addEventListener("change", handleSystemThemeChange);
} else if (mediaQuery?.addListener) {
  // Fallback for legacy browsers (pre-2020)
  mediaQuery.addListener(handleSystemThemeChange);
}

const ensureEmptyState = () => {
  if (!list.children.length) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "Nothing here yet. What will you tackle first?";
    list.appendChild(empty);
  }
};

const clearEmptyState = () => {
  const empty = list.querySelector(".empty-state");
  if (empty) {
    list.removeChild(empty);
  }
};

const createTodoItem = (text) => {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = text;

  const actions = document.createElement("div");
  actions.className = "todo-actions";

  const completeBtn = document.createElement("button");
  completeBtn.type = "button";
  completeBtn.className = "complete-btn";
  completeBtn.dataset.toggle = "true";
  completeBtn.textContent = "Complete";
  completeBtn.setAttribute("aria-pressed", "false");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "delete-btn";
  button.dataset.delete = "true";
  button.textContent = "Delete";

  actions.append(completeBtn, button);
  li.append(span, actions);
  return li;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) {
    input.focus();
    return;
  }

  clearEmptyState();
  const todo = createTodoItem(value);
  list.appendChild(todo);
  input.value = "";
  input.focus();
});

list.addEventListener("click", (event) => {
  const target = event.target;

  if (target.dataset.toggle) {
    const item = target.closest("li");
    if (!item) {
      return;
    }

    const isCompleted = item.classList.toggle("completed");
    target.textContent = isCompleted ? "Undo" : "Complete";
    target.setAttribute("aria-pressed", String(isCompleted));
    return;
  }

  if (target.dataset.delete) {
    const item = target.closest("li");
    if (item) {
      item.style.animation = "slide-out 250ms ease forwards";
      item.addEventListener("animationend", () => {
        item.remove();
        ensureEmptyState();
      }, { once: true });
    }
  }
});

ensureEmptyState();
