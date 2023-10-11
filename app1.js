const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let tasks = [];

function showTasks() {
  let taskList = '<h1>Lista de Tareas:</h1><ul>';
  tasks.forEach((task, index) => {
    const status = task.completed ? '[x]' : '[ ]';
    taskList += `<li>${status} ${task.description} <a href="/complete/${index}">Marcar como completada</a> <a href="/remove/${index}">Eliminar</a></li>`;
  });
  taskList += '</ul>';
  return taskList;
}

function addTask(description) {
  tasks.push({ description, completed: false });
  saveTasks();
}

function removeTask(index) {
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    saveTasks();
  }
}

function completeTask(index) {
  if (index >= 0 && index < tasks.length) {
    tasks[index].completed = true;
    saveTasks();
  }
}

function saveTasks() {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
}

// Cargar tareas desde un archivo si existe
if (fs.existsSync('tasks.json')) {
  tasks = JSON.parse(fs.readFileSync('tasks.json'));
}

app.get('/', (req, res) => {
  res.send(showTasks());
});

app.post('/add', (req, res) => {
  const description = req.body.description;
  addTask(description);
  res.redirect('/');
});

app.get('/remove/:index', (req, res) => {
  const index = parseInt(req.params.index);
  removeTask(index);
  res.redirect('/');
});

app.get('/complete/:index', (req, res) => {
  const index = parseInt(req.params.index);
  completeTask(index);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`La aplicación de lista de tareas está funcionando en http://localhost:${port}`);
});
