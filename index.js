const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const todoList = JSON.parse(localStorage.getItem("todoList")) || [];
const addBtn = $(".add-btn");
const todoContainer = $(".todo-list");
const filterInput = $$("input[name='filter']");
const stringInput = $(".item-input");

// two-way binding
var inputObj = (function (e) {
  return {
    set value(v) {
      e.value = v;
    },
    get value() {
      return e.value;
    },
  };
})(stringInput);

function handleAdd() {
  if (inputObj.value === "") return;
  todoList.push({ name: inputObj.value, finished: false });
  inputObj.value = "";
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
  inputObj.value = "";
  stringInput.focus();
  addBtn.onclick = () => {
    addBtn.innerHTML = "Thêm";
    todoList[index] = {
      ...todoList[index],
      name: stringInput.value,
    };

    inputObj.value = "";
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
              <label class="item-label" for="item-${index}">${item.name}</label>
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

function handleEnterPress() {
  function handlekeyUp(e) {
    if (e.key === "Enter") addBtn.click();
  }

  stringInput.addEventListener("keyup", handlekeyUp);
}

function init() {
  addBtn.onclick = handleAdd;
  handleFilter();
  handleEnterPress();
  render(todoList);
}

init();
