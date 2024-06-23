// Função para adicionar uma nova tarefa
function addTask(categoryId) {
    const taskText = prompt('Digite a nova tarefa:');
    if (taskText) {
        const ul = document.getElementById(categoryId);
        const li = document.createElement('li');
        li.innerHTML = `<span>${taskText}</span> <button onclick="editTask(this)">✏️</button> <button onclick="removeTask(this)">🗑️</button>`;
        ul.appendChild(li);
    }
}

// Função para editar uma tarefa existente
function editTask(button) {
    const li = button.parentNode;
    const span = li.querySelector('span');
    const newText = prompt('Edite a tarefa:', span.textContent);
    if (newText) {
        span.textContent = newText;
    }
}

// Função para remover uma tarefa
function removeTask(button) {
    const li = button.parentNode;
    li.remove();
}
