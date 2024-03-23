

console.log("Hello");

let debounce = 0;
let editor = document.getElementById("editor");

editor.value = localStorage.getItem("editor-value") ?? "";

editor.oninput = () => {
    if (debounce == 0) {
        debounce = setTimeout(() => {
            localStorage.setItem("editor-value", editor.value);
            debounce = 0;
        }, 1000);
    } else {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            localStorage.setItem("editor-value", editor.value);
            debounce = 0;
        }, 1000);
    }
}