// ==========================
// NOTES
// ==========================

const noteTitle = document.getElementById("noteTitle");
const noteText = document.getElementById("noteText");
const saveNote = document.getElementById("saveNote");
const savedNotes = document.getElementById("savedNotes");

let notes = JSON.parse(localStorage.getItem("myhubNotes")) || [];

function displayNotes() {
    savedNotes.innerHTML = "";

    notes.forEach((note, index) => {
        const noteCard = document.createElement("div");

        noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.text}</p>
            <button onclick="deleteNote(${index})">🗑️ Hapus</button>
        `;

        savedNotes.appendChild(noteCard);
    });
}

saveNote.addEventListener("click", () => {
    const title = noteTitle.value.trim();
    const text = noteText.value.trim();

    if (title === "" && text === "") {
        alert("Catatan masih kosong!");
        return;
    }

    notes.push({
        title: title || "Tanpa Judul",
        text: text
    });

    localStorage.setItem("myhubNotes", JSON.stringify(notes));

    noteTitle.value = "";
    noteText.value = "";

    displayNotes();
});

function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem("myhubNotes", JSON.stringify(notes));
    displayNotes();
}

displayNotes();

// ==========================
// TODO LIST
// ==========================

const todoInput = document.getElementById("todoInput");
const addTodo = document.getElementById("addTodo");
const todoList = document.getElementById("todoList");

let todos = JSON.parse(localStorage.getItem("myhubTodos")) || [];

function displayTodos() {
    todoList.innerHTML = "";

    todos.forEach((todo, index) => {
        const item = document.createElement("div");

        item.innerHTML = `
            <label>
                <input type="checkbox" ${todo.done ? "checked" : ""}>
                <span>${todo.text}</span>
            </label>
            <button>🗑️</button>
        `;

        const checkbox = item.querySelector("input");
        const deleteButton = item.querySelector("button");

        checkbox.addEventListener("change", () => {
            todos[index].done = checkbox.checked;
            localStorage.setItem("myhubTodos", JSON.stringify(todos));
            displayTodos();
        });

        deleteButton.addEventListener("click", () => {
            todos.splice(index, 1);
            localStorage.setItem("myhubTodos", JSON.stringify(todos));
            displayTodos();
        });

        todoList.appendChild(item);
    });
}

addTodo.addEventListener("click", () => {
    const text = todoInput.value.trim();

    if (text === "") return;

    todos.push({
        text: text,
        done: false
    });

    localStorage.setItem("myhubTodos", JSON.stringify(todos));

    todoInput.value = "";
    displayTodos();
});

todoInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTodo.click();
    }
});

displayTodos();

// ==========================
// THEME TOGGLE
// ==========================

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeToggle.textContent = "🌙";
        localStorage.setItem("myhubTheme", "light");
    } else {
        themeToggle.textContent = "☀️";
        localStorage.setItem("myhubTheme", "dark");
    }
});

if (localStorage.getItem("myhubTheme") === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "🌙";
}