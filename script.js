const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");

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
    item?.remove();
    ensureEmptyState();
  }
});

ensureEmptyState();
