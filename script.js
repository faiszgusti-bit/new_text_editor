// Mengambil elemen dari HTML
const editor = document.getElementById("editor");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const newBtn = document.getElementById("newBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const historyList = document.getElementById("historyList");

// Array untuk menyimpan histori undo dan redo
let undoStack = [];
let redoStack = [];

// Variabel untuk menyimpan teks sebelumnya
let lastText = "";

// =========================
// FUNCTION TAMBAH HISTORY
// =========================
function addHistory(action) {

    // Membuat elemen list baru
    const li = document.createElement("li");

    // Mengambil waktu saat ini
    const time = new Date().toLocaleTimeString();

    // Menampilkan aksi dan waktu
    li.textContent = `[${time}] ${action}`;

    // Menambahkan histori ke atas
    historyList.prepend(li);
}

// =========================
// FUNCTION MENYIMPAN STATE
// =========================
function saveState() {

    // Menyimpan teks saat ini ke undoStack
    undoStack.push(editor.value);

    // Membatasi histori maksimal 100
    if (undoStack.length > 100) {
        undoStack.shift();
    }
}

// =========================
// DETEKSI SAAT MENGETIK
// =========================
editor.addEventListener("input", () => {

    // Menyimpan state sebelumnya
    saveState();

    // Menghapus redo saat mengetik baru
    redoStack = [];

    // Menambahkan histori
    addHistory("Mengetik teks");

    // Menyimpan teks terakhir
    lastText = editor.value;
});

// =========================
// UNDO
// =========================
undoBtn.addEventListener("click", () => {

    // Jika tidak ada histori undo
    if (undoStack.length === 0) return;

    // Simpan kondisi sekarang ke redo
    redoStack.push(editor.value);

    // Mengambil histori terakhir undo
    const previousText = undoStack.pop();

    // Mengembalikan teks sebelumnya
    editor.value = previousText;

    // Menambah histori aktivitas
    addHistory("Undo dilakukan");
});

// =========================
// REDO
// =========================
redoBtn.addEventListener("click", () => {

    // Jika redo kosong
    if (redoStack.length === 0) return;

    // Simpan kondisi sekarang ke undo
    undoStack.push(editor.value);

    // Mengambil data redo terakhir
    const redoText = redoStack.pop();

    // Mengembalikan teks redo
    editor.value = redoText;

    // Menambah histori aktivitas
    addHistory("Redo dilakukan");
});

// =========================
// NEW FILE
// =========================
newBtn.addEventListener("click", () => {

    // Simpan state sebelumnya
    saveState();

    // Kosongkan editor
    editor.value = "";

    // Reset redo
    redoStack = [];

    // Tambah histori
    addHistory("Membuat file baru");
});

// =========================
// SAVE FILE
// =========================
saveBtn.addEventListener("click", () => {

    // Membuat file text
    const blob = new Blob([editor.value], {
        type: "text/plain"
    });

    // Membuat link download
    const link = document.createElement("a");

    // Membuat URL file
    link.href = URL.createObjectURL(blob);

    // Nama file download
    link.download = "text-editor.txt";

    // Klik otomatis
    link.click();

    // Tambahkan histori
    addHistory("File berhasil disimpan");
});

// =========================
// HAPUS TEKS
// =========================
clearBtn.addEventListener("click", () => {

    // Simpan state sebelum dihapus
    saveState();

    // Menghapus isi editor
    editor.value = "";

    // Reset redo
    redoStack = [];

    // Tambah histori
    addHistory("Teks dihapus");
});

// =========================
// SHORTCUT KEYBOARD
// =========================
document.addEventListener("keydown", (e) => {

    // CTRL + Z = Undo
    if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undoBtn.click();
    }

    // CTRL + Y = Redo
    if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        redoBtn.click();
    }

    // CTRL + S = Save File
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveBtn.click();
    }

    // CTRL + N = New File
    if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        newBtn.click();
    }
});