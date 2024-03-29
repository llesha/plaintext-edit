import { byClass, byId } from "./utils.js"

console.log("Hello")

const notePrefix = "note-"
const noteCountName = "count-notes"

let tabButton = byId("tab-button")
let editor = byId("editor")
let name = byId("name")
let modified = false
let debounce = 0

let noteCount = initNoteCount()
initNotes()

tabButton.onclick = () => {
    let tab = createTab("unnamed", noteCount)
    localStorage.setItem(notePrefix + noteCount, `{ "name": "unnamed", "value": "" }`)
    localStorage.setItem(noteCountName, ++noteCount)
    setCurrentTab(tab)
}

editor.oninput = () => {
    modified = true
    let setDebounce = () => {
        debounce = setTimeout(() => {
            if (modified) {
                saveCurrentTab()
            }
            debounce = 0
        }, 2000)
    }
    if (debounce == 0) {
        setDebounce()
    } else {
        clearTimeout(debounce)
        setDebounce()
    }
}

name.oninput = () => {
    setTabName(window.current, name.value)
    modified = true
}

function createTab(noteName, num) {
    let addedTab = document.createElement("div")
    addedTab.classList.add("tab")
    addedTab.setAttribute("num", num)
    addedTab.appendChild(createSpan(noteName))
    addedTab.appendChild(createClose())

    tabButton.parentElement.insertBefore(addedTab, tabButton)

    addedTab.onclick = () => {
        setCurrentTab(addedTab)
    }

    name.value = noteName
    name.select()
    name.focus()

    return addedTab
}

function setCurrentTab(tab) {
    if (modified) {
        saveCurrentTab()
    }
    window.current.classList.remove("current")
    window.current = tab
    window.current.classList.add("current")

    name.value = getTabName(window.current)
    editor.value = JSON.parse(localStorage.getItem(notePrefix + tab.getAttribute("num")) ?? `{ "value": "" }`).value
}

function createSpan(value) {
    let span = document.createElement("span")
    span.innerText = value
    return span
}

function createClose() {
    let close = document.createElement("span")
    close.classList.add("close")
    close.innerText = "×"
    close.onclick = (event) => {
        if (byClass("tab").length != 1) {
            close.parentElement.remove()
            deleteNote(close.parentElement)
        }
        event.stopImmediatePropagation()
    }

    return close
}

function getLastTab() {
    let tabs = byClass("tab")
    return tabs[tabs.length - 1]
}

function initNoteCount() {
    let count = localStorage.getItem(noteCountName)
    if (count == null) {
        localStorage.setItem(noteCountName, 1)
        count = 1
    }
    return count
}

function initNotes() {
    let note = JSON.parse(localStorage.getItem(notePrefix + "0") ?? `{ "name": "default", "value": "type note here" }`)
    name.value = note.name
    editor.value = note.value
    window.current = createTab(note.name, 0)

    for (let i = 1; i < noteCount; i++) {
        const note = JSON.parse(localStorage.getItem(notePrefix + i))
        createTab(note.name, i)
    }
    setCurrentTab(window.current)
}

function setTabName(tab, tabName) {
    tab.getElementsByTagName("span")[0].innerText = tabName
}

function getTabName(tab) {
    return tab.getElementsByTagName("span")[0].innerText
}

function saveCurrentTab() {
    if (debounce != 0) {
        clearTimeout(debounce)
        debounce = 0
    }
    modified = false
    let num = window.current.getAttribute("num")
    localStorage.setItem(notePrefix + num, JSON.stringify({ name: name.value, value: editor.value }))
}

function deleteNote(tab) {
    let num = parseInt(tab.getAttribute("num"))
    if (num == noteCount - 1) {
        return
    }
    for (let i = 0; i < noteCount; i++) {
        localStorage.setItem(notePrefix + (i - 1), localStorage.getItem(notePrefix + i))
    }
}