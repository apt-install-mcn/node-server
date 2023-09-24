const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let tasks = [];

function showTasks() {
  console.log('Lista de tareas:');
  tasks.forEach((task, index) => {
    const status = task.completed ? '[x]' : '[ ]';
    console.log(`${index + 1}. ${status} ${task.description}`);
  });
}

function addTask(description) {
  tasks.push({ description, completed: false });
  saveTasks();
  console.log('Tarea añadida correctamente.');
  showTasks();
}

function removeTask(index) {
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    saveTasks();
    console.log('Tarea eliminada correctamente.');
  } else {
    console.log('Índice de tarea no válido.');
  }
  showTasks();
}

function completeTask(index) {
  if (index >= 0 && index < tasks.length) {
    tasks[index].completed = true;
    saveTasks();
    console.log('Tarea completada.');
  } else {
    console.log('Índice de tarea no válido.');
  }
  showTasks();
}

function saveTasks() {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
}

// Cargar tareas desde un archivo si existe
if (fs.existsSync('tasks.json')) {
  tasks = JSON.parse(fs.readFileSync('tasks.json'));
}

rl.question('¿Qué acción deseas realizar? (add/remove/complete/exit): ', (action) => {
  if (action === 'add') {
    rl.question('Escribe la descripción de la tarea: ', (description) => {
      addTask(description);
      rl.close();
    });
  } else if (action === 'remove') {
    showTasks();
    rl.question('Escribe el número de tarea que deseas eliminar: ', (index) => {
      removeTask(index - 1);
      rl.close();
    });
  } else if (action === 'complete') {
    showTasks();
    rl.question('Escribe el número de tarea que deseas marcar como completada: ', (index) => {
      completeTask(index - 1);
      rl.close();
    });
  } else if (action === 'exit') {
    rl.close();
  } else {
    console.log('Acción no válida. Debes elegir entre add, remove, complete o exit.');
    rl.close();
  }
});