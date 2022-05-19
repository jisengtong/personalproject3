const get_id = (id) => document.getElementById(id);

let today = new Date();
let min = today.getHours()
if (min >= 7 && min < 19) {
    document.getElementById('toggler').classList.toggle('whitebg')
    document.body.classList.toggle('white')
}
const greeting = get_id('greeting')
const form = get_id('form'),
    quantity = get_id('quantity'),
    time = get_id('time');

var description;
const rendered_list = document.querySelector('.rendered-list');
const deletebtn = document.querySelector('.delete');
const selectionbtn = document.querySelectorAll('.selection');

let stored_list = loadList()
let todo_list = []
if (stored_list) {
    todo_list = stored_list
    renderList()
}

let cur_time;
setInterval(updateDate, 1000)
function updateDate() {
    today = new Date()
    cur_time = `${today.getHours()} : ${(today.getMinutes() < 10 ? '0' : '') + today.getMinutes()} : ${(today.getSeconds() < 10 ? '0' : '') + today.getSeconds()} ${today.getHours() >= 12 && today.getHours() <= 23 ? "PM" : "AM"}`
    time.innerText = cur_time
}

greet()
setInterval(greet, 100000);
function greet() {
    today = new Date()
    if (today.getHours() >= 12 && today.getHours() < 18) {
        greeting.textContent = "Good Afternoon!"
    } else if (today.getHours() >= 0 && today.getHours() < 7) {
        greeting.textContent = "Good Night!"
    }
    else if (today.getHours() >= 7 && today.getHours() < 12) {
        greeting.textContent = "Good Morning!"
    }
    else if (today.getHours() >= 18 && today.getHours() <= 23) {
        greeting.textContent = "Good Evening!"
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    let input = get_id('todo')
    if (input.value.trim().length > 0) {
        todo_list.push({ name: input.value, status: 'Active' })
    }
    input.value = ""
    renderList()
    saveList()
    resetActive()
})

function renderList(status = '') {
    let renderedText = ""
    let text = ''
    let button = ''
    if (status === '') {
        for (let i = 0; i < todo_list.length; i++) {
            if (todo_list[i].status === 'Completed') {
                text = `<p class="text-gray-600 line-through description" data-completed="1"> ${todo_list[i].name}</p>`
                button = `<button data-index="${i}"
                                class="btn-check rounded-full w-7 h-7 xs:w-10 xs:h-10 flex-shrink-0 border border-gray-700 flex items-center justify-center outline-none focus:ring btn">
                                <img src="./image/icon-check (3).svg" width="20 " alt="">
                            </button>`
            } else {
                text = `<p class="text-white description"> ${todo_list[i].name}</p>`
                button = `<button data-index="${i}"
                                class="rounded-full w-7 h-7 xs:w-10 xs:h-10 flex-shrink-0 border border-gray-700 flex items-center justify-center outline-none focus:ring btn">
                            </button>`
            }

            renderedText += `<div class="card flex items-center gap-4 xs:gap-8 py-6 border-b border-gray-700 px-6 relative">
                                    ${button}
                                    ${text}
                                    <button class="absolute right-8 transition duration-300 unlist" data-index="${i}"> <img src="./image/icon-cross.svg" alt="">  </button>
                                </div>`
        }
        updateQuantity()
    } else if (status === 'Active') {
        let count = 0
        for (let i = 0; i < todo_list.length; i++) {
            if (todo_list[i].status === 'Active') {
                count++
                text = `<p class="text-white description" data-completed="0"> ${todo_list[i].name}</p>`
                button = `<button data-index="${i}"
                                class="rounded-full w-7 h-7 xs:w-10 xs:h-10 flex-shrink-0 border border-gray-700 flex items-center justify-center outline-none focus:ring btn">
                            </button>`
                renderedText += `<div class="card flex items-center gap-4 xs:gap-8 py-6 border-b border-gray-700 px-6 relative">
                                    ${button}
                                    ${text}
                                    <button class="absolute right-8 transition duration-300 unlist" data-index="${i}"> <img src="./image/icon-cross.svg" alt="">  </button>
                                </div>`
            }
        }
        quantity.textContent = count
    } else if (status === 'Completed') {
        let count = 0
        for (let i = 0; i < todo_list.length; i++) {
            if (todo_list[i].status === 'Completed') {
                count++
                text = `<p class="text-gray-600 line-through description" data-completed = "1"> ${todo_list[i].name}</p>`
                button = `<button data-index="${i}"
                                class="btn-check rounded-full w-7 h-7 xs:w-10 xs:h-10 flex-shrink-0 border border-gray-700 flex items-center justify-center outline-none focus:ring btn">
                                <img src="./image/icon-check (3).svg" width="20 " alt="">
                            </button>`
                renderedText += `<div class="card flex items-center gap-4 xs:gap-8 py-6 border-b border-gray-700 px-6 relative">
                                    ${button}
                                    ${text}
                                    <button class="absolute right-8 transition duration-300 unlist" data-index="${i}"> <img src="./image/icon-cross.svg" alt="">  </button>
                                </div>`
            }
        }
        quantity.textContent = count
    }
    rendered_list.innerHTML = renderedText
    addEvent()
}

function addEvent() {
    description = document.querySelectorAll('.description')
    document.querySelectorAll('.btn').forEach(x => x.addEventListener('click', () => {
        x.classList.add('btn-check')
        x.innerHTML = `<img src="./image/icon-check (3).svg" width="20 " alt="">`
        description[x.dataset.index].classList.add('line-through', 'text-gray-600')
        description[x.dataset.index].dataset.completed = "1"
        todo_list[x.dataset.index].status = "Completed"
        saveList()
    }))

    document.querySelectorAll('.unlist').forEach(x => x.addEventListener('click', () => {
        x.parentElement.remove()
        todo_list.splice(x.dataset.index, 1);
        renderList()
        saveList()
        updateQuantity()
        resetActive()
    }))
}

function saveList() {
    localStorage.setItem('list', JSON.stringify(todo_list))
}

function loadList() {
    return JSON.parse(localStorage.getItem('list'))
}

function updateQuantity() {
    quantity.textContent = todo_list.length;
    if (todo_list.length === 0) {
        rendered_list.innerHTML = `<div class="card border-b border-gray-700 py-6 px-2 text-center">Psst, Looks Empty Here!</div>`
    }
}

deletebtn.addEventListener('click', () => {
    let slicedList = []
    for (let i = 0; i < todo_list.length; i++) {
        if (todo_list[i].status === 'Active') {
            slicedList.push(todo_list[i])
        }
    }
    todo_list = slicedList
    renderList()
    saveList()
    updateQuantity()
})

selectionbtn.forEach(x => x.addEventListener('click', () => {
    selectionbtn.forEach(x => x.classList.remove("text-blue-500"));
    x.classList.add('text-blue-500')

    if (todo_list.length !== 0) {
        if (x.textContent === 'All') {
            renderList()
        } else if (x.textContent === 'Active') {
            renderList('Active')
        } else if (x.textContent === 'Completed') {
            renderList('Completed')
        }
    }
}))

function resetActive() {
    selectionbtn.forEach(x => x.classList.remove("text-blue-500"));
    selectionbtn[0].classList.add('text-blue-500')
}

document.getElementById('toggler').addEventListener('click', () => {
    document.getElementById('toggler').classList.toggle('whitebg')
    document.body.classList.toggle('white')
})
