// Account-aware storage helper. myhub-plus.js also defines this helper; this fallback
// lets script.js run correctly before that global script is loaded.
function accountKey(key){
    const account = localStorage.getItem("myhubCurrentAccount");
    return account ? "myhub:" + account + ":" + key : key;
}

// ==========================
// MYHUB SCRIPT
// ==========================


// ==========================
// CLOCK
// ==========================

const digitalClock = document.getElementById("digitalClock");
const currentDate = document.getElementById("currentDate");

function updateClock() {
    if (!digitalClock) return;

    const now = new Date();

    digitalClock.textContent = now.toLocaleTimeString("id-ID");

    if (currentDate) {
        currentDate.textContent = now.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }
}

setInterval(updateClock, 1000);
updateClock();


// ==========================
// NOTES
// ==========================

const noteTitle = document.getElementById("noteTitle");
const noteText = document.getElementById("noteText");
const saveNote = document.getElementById("saveNote");
const savedNotes = document.getElementById("savedNotes");

let notes = JSON.parse(localStorage.getItem(accountKey("myhubNotes"))) || [];

function displayNotes() {

    if (!savedNotes) return;

    savedNotes.innerHTML = "";

    notes.forEach((note, index) => {

        const noteCard = document.createElement("div");

        noteCard.className = "note-card";

        noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.text}</p>
            <button onclick="deleteNote(${index})">
                 Hapus
            </button>
        `;

        savedNotes.appendChild(noteCard);
    });
}


if (saveNote) {

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

        localStorage.setItem(
            accountKey("myhubNotes"),
            JSON.stringify(notes)
        );

        noteTitle.value = "";
        noteText.value = "";

        displayNotes();
    });

}


function deleteNote(index) {

    notes.splice(index, 1);

    localStorage.setItem(
        accountKey("myhubNotes"),
        JSON.stringify(notes)
    );

    displayNotes();
}

displayNotes();


// ==========================
// TODO LIST
// ==========================

const todoInput = document.getElementById("todoInput");
const addTodo = document.getElementById("addTodo");
const todoList = document.getElementById("todoList");

let todos = JSON.parse(localStorage.getItem(accountKey("myhubTodos"))) || [];


function displayTodos() {

    if (!todoList) return;

    todoList.innerHTML = "";

    todos.forEach((todo, index) => {

        const item = document.createElement("div");

        item.className = "todo-item";

        item.innerHTML = `
            <label>
                <input
                    type="checkbox"
                    ${todo.done ? "checked" : ""}
                >

                <span class="${todo.done ? "done" : ""}">
                    ${todo.text}
                </span>
            </label>

            <button></button>
        `;


        const checkbox = item.querySelector("input");
        const deleteButton = item.querySelector("button");


        checkbox.addEventListener("change", () => {

            todos[index].done = checkbox.checked;

            localStorage.setItem(
                "myhubTodos",
                JSON.stringify(todos)
            );

            displayTodos();
        });


        deleteButton.addEventListener("click", () => {

            todos.splice(index, 1);

            localStorage.setItem(
                "myhubTodos",
                JSON.stringify(todos)
            );

            displayTodos();
        });


        todoList.appendChild(item);

    });
}


if (addTodo) {

    addTodo.addEventListener("click", () => {

        const text = todoInput.value.trim();

        if (text === "") return;

        todos.push({
            text: text,
            done: false
        });

        localStorage.setItem(
            accountKey("myhubTodos"),
            JSON.stringify(todos)
        );

        todoInput.value = "";

        displayTodos();
    });

}


if (todoInput) {

    todoInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {
            addTodo.click();
        }

    });

}


displayTodos();

// ==========================
// ALARM
// ==========================

const alarmTime = document.getElementById("alarmTime");
const setAlarm = document.getElementById("setAlarm");
const alarmStatus = document.getElementById("alarmStatus");

let activeAlarm = null;

if (setAlarm) {
    setAlarm.addEventListener("click", () => {

        if (!alarmTime.value) {
            alert("Pilih waktu alarm dulu!");
            return;
        }

        activeAlarm = alarmTime.value;

        alarmStatus.textContent =
            "⏰ Alarm aktif pada " + activeAlarm;
    });
}

setInterval(() => {

    if (!activeAlarm) return;

    const now = new Date();

    const currentTime =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");

    if (currentTime === activeAlarm) {

        alert("⏰ WAKTUNYA ALARM!");

        activeAlarm = null;

        if (alarmStatus) {
            alarmStatus.textContent = "Alarm selesai.";
        }
    }

}, 1000);

// ==========================
// FINANCE
// ==========================

const financeName = document.getElementById("financeName");
const financeAmount = document.getElementById("financeAmount");
const financeType = document.getElementById("financeType");
const addFinance = document.getElementById("addFinance");
const financeList = document.getElementById("financeList");
const balance = document.getElementById("balance");

let finances = JSON.parse(localStorage.getItem(accountKey("myhubFinance"))) || [];

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}

function displayFinance() {
    if (!financeList) return;

    financeList.innerHTML = "";

    let total = 0;

    finances.forEach((item, index) => {

        if (item.type === "income") {
            total += item.amount;
        } else {
            total -= item.amount;
        }

        const card = document.createElement("div");

        card.className = "finance-item";

        card.innerHTML = `
            <div>
                <h3>${item.name}</h3>
                <p class="${item.type}">
                    ${item.type === "income" ? "+" : "-"}
                    ${formatRupiah(item.amount)}
                </p>
            </div>

            <button onclick="deleteFinance(${index})">
                
            </button>
        `;

        financeList.appendChild(card);
    });

    if (balance) {
        balance.textContent = formatRupiah(total);
    }
}

if (addFinance) {

    addFinance.addEventListener("click", () => {

        const name = financeName.value.trim();
        const amount = Number(financeAmount.value);
        const type = financeType.value;

        if (!name || amount <= 0) {
            alert("Isi nama dan nominal dulu!");
            return;
        }

        finances.push({
            name: name,
            amount: amount,
            type: type
        });

        localStorage.setItem(
            accountKey("myhubFinance"),
            JSON.stringify(finances)
        );

        financeName.value = "";
        financeAmount.value = "";

        displayFinance();
    });
}

function deleteFinance(index) {

    finances.splice(index, 1);

    localStorage.setItem(
        accountKey("myhubFinance"),
        JSON.stringify(finances)
    );

    displayFinance();
}

displayFinance();

// ==========================
// CERTIFICATES + FOTO
// ==========================

const certificateName = document.getElementById("certificateName");
const certificateInfo = document.getElementById("certificateInfo");
const certificateImage = document.getElementById("certificateImage");
const addCertificate = document.getElementById("addCertificate");
const certificateList = document.getElementById("certificateList");

let certificates =
    JSON.parse(localStorage.getItem(accountKey("myhubCertificates"))) || [];

function displayCertificates() {
    if (!certificateList) return;

    certificateList.innerHTML = "";

    certificates.forEach((item, index) => {

        const card = document.createElement("div");
        card.className = "certificate-item";

        card.innerHTML = `
            ${item.image
                ? `<img src="${item.image}" class="certificate-photo">`
                : `<div class="certificate-icon"></div>`
            }

            <div class="certificate-info">
                <h3>${item.name}</h3>
                <p>${item.info}</p>
            </div>

            <button onclick="deleteCertificate(${index})">
                
            </button>
        `;

        certificateList.appendChild(card);
    });
}

if (addCertificate) {

    addCertificate.addEventListener("click", () => {

        const name = certificateName.value.trim();
        const info = certificateInfo.value.trim();
        const file = certificateImage.files[0];

        if (!name) {
            alert("Isi nama sertifikat dulu!");
            return;
        }

        if (file) {

            const reader = new FileReader();

            reader.onload = function (event) {

                certificates.push({
                    name: name,
                    info: info || "Tanpa keterangan",
                    image: event.target.result
                });

                localStorage.setItem(
                    "myhubCertificates",
                    JSON.stringify(certificates)
                );

                certificateName.value = "";
                certificateInfo.value = "";
                certificateImage.value = "";

                displayCertificates();
            };

            reader.readAsDataURL(file);

        } else {

            certificates.push({
                name: name,
                info: info || "Tanpa keterangan",
                image: ""
            });

            localStorage.setItem(
                "myhubCertificates",
                JSON.stringify(certificates)
            );

            certificateName.value = "";
            certificateInfo.value = "";

            displayCertificates();
        }
    });
}

function deleteCertificate(index) {

    certificates.splice(index, 1);

    localStorage.setItem(
        accountKey("myhubCertificates"),
        JSON.stringify(certificates)
    );

    displayCertificates();
}

displayCertificates();

// ==========================
// SETTINGS
// ==========================

const notificationToggle =
    document.getElementById("notificationToggle");

const animationToggle =
    document.getElementById("animationToggle");

// NOTIFICATION
if (notificationToggle) {

    notificationToggle.checked =
        localStorage.getItem(accountKey("myhubNotifications")) === "true";

    notificationToggle.addEventListener("change", () => {

        localStorage.setItem(
            "myhubNotifications",
            notificationToggle.checked
        );

    });
}

// ANIMATION
if (animationToggle) {

    const savedAnimation =
        localStorage.getItem(accountKey("myhubAnimation"));

    if (savedAnimation !== null) {
        animationToggle.checked =
            savedAnimation === "true";
    }

    animationToggle.addEventListener("change", () => {

        localStorage.setItem(
            "myhubAnimation",
            animationToggle.checked
        );

        document.body.classList.toggle(
            "no-animation",
            !animationToggle.checked
        );

    });
}

// DARK MODE

const darkModeToggle =
    document.getElementById("darkModeToggle");

if (darkModeToggle) {

    const savedDarkMode =
        localStorage.getItem(accountKey("myhubDarkMode"));

    if (savedDarkMode !== null) {
        darkModeToggle.checked =
            savedDarkMode === "true";
    }

    document.body.classList.toggle(
        "light-mode",
        !darkModeToggle.checked
    );

    darkModeToggle.addEventListener("change", () => {

        localStorage.setItem(
            "myhubDarkMode",
            darkModeToggle.checked
        );

        document.body.classList.toggle(
            "light-mode",
            !darkModeToggle.checked
        );

    });
}

// ACCENT COLOR

const accentColor = document.getElementById("accentColor");

const accentColors = {
    blue: "#287cff",
    purple: "#9b59ff",
    green: "#22c55e",
    red: "#ff4d6d"
};

function applyAccentColor(color) {
    const selectedColor = accentColors[color] || accentColors.blue;

    document.documentElement.style.setProperty(
        "--accent",
        selectedColor
    );

    localStorage.setItem(accountKey("myhubAccent"), color);
}

if (accentColor) {

    const savedAccent =
        localStorage.getItem(accountKey("myhubAccent")) || "blue";

    accentColor.value = savedAccent;
    applyAccentColor(savedAccent);

    accentColor.addEventListener("change", () => {
        applyAccentColor(accentColor.value);
    });
}

// RESET ALL DATA

const clearAllData = document.getElementById("clearAllData");

if (clearAllData) {

    clearAllData.addEventListener("click", () => {

        const confirmReset = confirm(
            "Yakin mau menghapus semua data MyHub?"
        );

        if (!confirmReset) return;

        localStorage.removeItem(accountKey("myhubNotes"));
        localStorage.removeItem(accountKey("myhubTodos"));
        localStorage.removeItem(accountKey("myhubFinance"));
        localStorage.removeItem(accountKey("myhubCertificates"));

        alert("Semua data MyHub berhasil dihapus!");

        location.reload();
    });
}

// LOAD PROFILE

const profileName = document.getElementById("profileName");
const profileBio = document.getElementById("profileBio");

const savedName = localStorage.getItem(accountKey("myhubName"));
const savedBio = localStorage.getItem(accountKey("myhubBio"));

if (profileName && savedName) {
    profileName.textContent = savedName;
}

if (profileBio && savedBio) {
    profileBio.textContent = savedBio;
}

// PROFILE PHOTO

const profileImageInput = document.getElementById("profileImageInput");
const profilePhoto = document.getElementById("profilePhoto");

if (profileImageInput && profilePhoto) {

    const savedPhoto = localStorage.getItem(accountKey("myhubProfilePhoto"));

    if (savedPhoto) {
        profilePhoto.src = savedPhoto;
    }

    profileImageInput.addEventListener("change", () => {

        const file = profileImageInput.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            profilePhoto.src = reader.result;
            localStorage.setItem(
                "myhubProfilePhoto",
                reader.result
            );
        };

        reader.readAsDataURL(file);
    });
}

// EDIT PROFILE FORM

const editProfile = document.getElementById("editProfile");
const editProfilePanel = document.getElementById("editProfilePanel");
const editName = document.getElementById("editName");
const editBio = document.getElementById("editBio");
const saveProfile = document.getElementById("saveProfile");
const cancelProfile = document.getElementById("cancelProfile");

if (editProfile) {
    editProfile.addEventListener("click", () => {

        editName.value =
            localStorage.getItem(accountKey("myhubName")) || "Frhn";

        editBio.value =
            localStorage.getItem(accountKey("myhubBio")) ||
            "Welcome to my personal space.";

        editProfilePanel.classList.add("active");
    });
}

if (saveProfile) {
    saveProfile.addEventListener("click", () => {

        const name = editName.value.trim();
        const bio = editBio.value.trim();

        if (!name || !bio) {
            alert("Nama dan bio tidak boleh kosong!");
            return;
        }

        localStorage.setItem(accountKey("myhubName"), name);
        localStorage.setItem(accountKey("myhubBio"), bio);

        location.reload();
    });
}

if (cancelProfile) {
    cancelProfile.addEventListener("click", () => {
        editProfilePanel.classList.remove("active");
    });
}