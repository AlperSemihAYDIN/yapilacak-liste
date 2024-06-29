const form = document.querySelector("form");
const inputTaskName = document.querySelector("#txtTaskName");
const inputTaskDate = document.querySelector("#txtTaskDate");
const inputTaskTime = document.querySelector("#txtTaskTime");
const btnAddNewTask = document.querySelector("#btnAddNewTask");
const btnDeleteAll = document.querySelector("#btnDeleteAll");
const taskList = document.querySelector("#task-list");
let todos;

// Listeyi yükle
loadItems();

// Olay dinleyicileri
eventListeners();

function eventListeners() {
    // Görev Ekleme
    form.addEventListener("submit", addNewItem);
    // Görev Silme
    taskList.addEventListener("click", deleteItem);
    // Görev Tamamlama
    taskList.addEventListener("change", toggleComplete);
    // Tüm Görevleri Silme
    btnDeleteAll.addEventListener("click", deleteAllItems);
}

function loadItems() {
    todos = getItemsFromLS();
    todos.forEach(function(item) {
        createItems(item.name, item.date, item.time, item.completed);
    });
}

function getItemsFromLS() {
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function setItemToLS(newTodo) {
    todos = getItemsFromLS();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function createItems(taskName, taskDate, taskTime, completed = false) {
    const li = document.createElement("li");
    li.className = `list-group-item list-group-item-secondary d-flex justify-content-between align-items-center ${completed ? 'completed' : ''}`;
    li.innerHTML = `
        <div>
            <input type="checkbox" class="mr-2" ${completed ? 'checked' : ''}>
            <strong>${taskName}</strong> - <em>${taskDate} ${taskTime}</em>
        </div>
        <a href="#" class="delete-item">
            <i class="fas fa-times"></i>
        </a>`;
    taskList.appendChild(li);
}

function addNewItem(e) {
    e.preventDefault();
    if (inputTaskName.value === '' || inputTaskDate.value === '' || inputTaskTime.value === '') {
        alert("Bir görev adı, tarih ve saat seçmelisiniz.");
        return;
    }

    // Yeni Görev Oluştur
    const newTodo = {
        name: inputTaskName.value,
        date: inputTaskDate.value,
        time: inputTaskTime.value,
        completed: false
    };
    createItems(newTodo.name, newTodo.date, newTodo.time, newTodo.completed);
    setItemToLS(newTodo);

    // Formu Temizle
    inputTaskName.value = "";
    inputTaskDate.value = "";
    inputTaskTime.value = "";
}

function deleteItem(e) {
    if (e.target.classList.contains("fa-times")) {
        const taskItem = e.target.parentElement.parentElement;
        deleteTodoFromStorage(taskItem);
        taskItem.remove();
    }
    e.preventDefault();
}

function deleteTodoFromStorage(taskItem) {
    let todos = getItemsFromLS();
    const taskName = taskItem.querySelector('strong').textContent;
    const taskDateTime = taskItem.querySelector('em').textContent;
    todos = todos.filter(todo => `${todo.name} - ${todo.date} ${todo.time}` !== `${taskName} - ${taskDateTime}`);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteAllItems(e) {
    e.preventDefault();
    if (confirm("Tüm elemanları silmek istediğinize emin misiniz?")) {
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
        localStorage.clear();
    }
}

function toggleComplete(e) {
    if (e.target.type === "checkbox") {
        const taskItem = e.target.parentElement.parentElement;
        taskItem.classList.toggle('completed');
        const taskName = taskItem.querySelector('strong').textContent;
        const taskDateTime = taskItem.querySelector('em').textContent;
        let todos = getItemsFromLS();
        todos.forEach(function(todo) {
            const todoText = `${todo.name} - ${todo.date} ${todo.time}`;
            if (todoText === `${taskName} - ${taskDateTime}`) {
                todo.completed = e.target.checked;
            }
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}
