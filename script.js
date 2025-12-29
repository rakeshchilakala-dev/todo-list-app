const todoText = document.getElementById("todoText");
const prioritySelect = document.getElementById("priority");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const filterButtons = document.querySelectorAll(".filters button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

// ADD TODO
addBtn.addEventListener("click", addTodo);
todoText.addEventListener("keypress", e => {
    if (e.key === "Enter") addTodo();
});

function addTodo() {
    if (!todoText.value.trim()) return;

    todos.push({
        id: Date.now(),
        text: todoText.value,
        priority: prioritySelect.value,
        completed: false
    });

    todoText.value = "";
    saveAndRender();
}

// RENDER TODOS
function renderTodos() {
    todoList.innerHTML = "";

    todos
        .filter(todo => {
            if (filter === "active") return !todo.completed;
            if (filter === "completed") return todo.completed;
            return true;
        })
        .forEach(todo => {
            const li = document.createElement("li");
            li.className = todo.completed ? "completed" : "";

            li.innerHTML = `
                <div>
                    <strong>${todo.text}</strong>
                    <span class="priority ${todo.priority}">
                        ${todo.priority.toUpperCase()}
                    </span>
                </div>
                <div class="actions">
                    <button onclick="toggleTodo(${todo.id})">✔</button>
                    <button onclick="deleteTodo(${todo.id})">🗑</button>
                </div>
            `;

            todoList.appendChild(li);
        });
}

// TOGGLE
function toggleTodo(id) {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveAndRender();
}

// DELETE
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveAndRender();
}

// FILTERS
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filter = btn.dataset.filter;
        renderTodos();
    });
});

// SAVE & RENDER
function saveAndRender() {
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

renderTodos();
