const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const addBtn = $(".add-btn");
const stringInput = $(".item-input");
const todoContainer = $(".todo-list");
const filterInput = $$("input[name='filter']");
const todoList = JSON.parse(localStorage.getItem("todoList")) || [];

function handleAdd() {
  todoList.push({ name: newItem, finished: false });
  stringInput.value = "";
  localStorage.setItem("todoList", JSON.stringify(todoList));
  render(todoList);
}

function handleCheck(index) {
  todoList[index].finished = !todoList[index].finished;
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

function handleUpdate(index) {
  todoList.splice(index, 1);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  render(todoList);
}

function handleDelete(index) {
  todoList.splice(index, 1);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  render(todoList);
}

function handleDeleteAll() {
  todoList.splice(0, todoList.length);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  render(todoList);
}

function handleUpdate(index) {
  addBtn.innerHTML = "Sửa";
  stringInput.value = "";
  stringInput.focus();
  addBtn.onclick = () => {
    addBtn.innerHTML = "Thêm";
    todoList[index] = stringInput.value;
    stringInput.value = "";
    addBtn.onclick = handleAdd;
    localStorage.setItem("todoList", JSON.stringify(todoList));
    render(todoList);
  };
}

function render(todoList = []) {
  const content = todoList
    .map((item, index) => {
      return `
        <div class="todo-item">
            <div class="align-center">
              <input key=${index} type="checkbox" name="todo-item" id="item-${index}" onchange="handleCheck(${index})" ${
        item.finished ? "checked" : ""
      } />
              <label for="item-${index}">${item.name}</label>
            </div>

            <div class="align-center buttons">
              <button class="update-btn" onclick="handleUpdate(${index})">Sửa</button>
              <button class="delete-btn" onclick="handleDelete(${index})">Xóa</button>
            </div>
        </div>
        `;
    })
    .join("");

  todoContainer.innerHTML = content;
}

function handleFilter() {
  const filter = {
    all: handleRenderAll,
    done: handleRenderDone,
    "not-done": handleRenderNotDone,
  };

  function handleRenderAll() {
    render(todoList);
  }

  function handleRenderDone() {
    const doneList = todoList.filter((item) => item.finished === true);
    render(doneList);
  }

  function handleRenderNotDone() {
    const notdoneList = todoList.filter((item) => item.finished === false);
    render(notdoneList);
  }

  Array.from(filterInput).forEach((item) => {
    item.onclick = filter[item.value];
  });
}

function init() {
  stringInput.onchange = (e) => {
    newItem = e.target.value;
  };

  addBtn.onclick = handleAdd;
  handleFilter();
  render(todoList);
}

init();
