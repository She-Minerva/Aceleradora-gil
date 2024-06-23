const readlineSync = require('readline-sync');
const fs = require('fs');

// Array para armazenar os pacientes cadastrados
let pacientes = [];

// Array para armazenar os agendamentos de consultas
let agendamentos = [];

// Função para cadastrar um novo paciente
function cadastrarPaciente() {
    console.log("\nCadastro de Paciente:");
    let nome = readlineSync.question("Nome do paciente: ");
    let telefone = readlineSync.question("Telefone do paciente: ");

    // Verificar se o paciente já está cadastrado pelo telefone
    const pacienteExistente = pacientes.find(paciente => paciente.telefone === telefone);
    if (pacienteExistente) {
        console.log("Paciente já cadastrado!");
        return;
    }

    // Criar objeto do paciente e adicionar ao array de pacientes
    let paciente = {
        nome: nome,
        telefone: telefone
    };
    pacientes.push(paciente);

    // Salvar a lista de pacientes em um arquivo (simulando um banco de dados local)
    salvarDados();

    console.log("Paciente cadastrado com sucesso!");
}

// Função para salvar os dados de pacientes e agendamentos em arquivos JSON
function salvarDados() {
    fs.writeFileSync('pacientes.json', JSON.stringify(pacientes, null, 2), 'utf-8');
    fs.writeFileSync('agendamentos.json', JSON.stringify(agendamentos, null, 2), 'utf-8');
}

// Função para carregar os dados de pacientes e agendamentos dos arquivos JSON
function carregarDados() {
    try {
        const pacientesData = fs.readFileSync('pacientes.json', 'utf-8');
        pacientes = JSON.parse(pacientesData);
    } catch (err) {
        pacientes = [];
    }

    try {
        const agendamentosData = fs.readFileSync('agendamentos.json', 'utf-8');
        agendamentos = JSON.parse(agendamentosData);
    } catch (err) {
        agendamentos = [];
    }
}

// Função para marcar uma consulta
function marcarConsulta() {
    if (pacientes.length === 0) {
        console.log("Nenhum paciente cadastrado.");
        return;
    }

    console.log("\nPacientes cadastrados:");
    pacientes.forEach((paciente, index) => {
        console.log(`${index + 1}. ${paciente.nome} - ${paciente.telefone}`);
    });

    let pacienteIndex = readlineSync.questionInt("Escolha o número do paciente: ") - 1;
    if (pacienteIndex < 0 || pacienteIndex >= pacientes.length) {
        console.log("Paciente inválido!");
        return;
    }

    let dia = readlineSync.question("Dia da consulta (DD/MM/AAAA): ");
    let hora = readlineSync.question("Hora da consulta (HH:MM): ");
    let especialidade = readlineSync.question("Especialidade: ");

    // Verificar se a data e a hora são válidas
    let [diaConsulta, mesConsulta, anoConsulta] = dia.split('/').map(Number);
    let [horaConsulta, minutoConsulta] = hora.split(':').map(Number);
    let dataConsulta = new Date(anoConsulta, mesConsulta - 1, diaConsulta, horaConsulta, minutoConsulta);

    if (isNaN(dataConsulta.getTime())) {
        console.log("Data e hora inválidas!");
        return;
    }

    // Verificar se a data é no passado
    let dataAtual = new Date();
    if (dataConsulta < dataAtual) {
        console.log("Não é possível marcar consulta para uma data passada.");
        return;
    }

    // Verificar se o horário está dentro do horário comercial (08:00 - 16:30)
    if (horaConsulta < 8 || (horaConsulta === 16 && minutoConsulta > 30) || horaConsulta > 16 || (horaConsulta === 16 && minutoConsulta > 0 && minutoConsulta < 30)) {
        console.log("Horário fora do intervalo permitido (08:00 - 16:30).");
        return;
    }

    // Verificar se a hora é múltipla de 30 minutos
    if (minutoConsulta !== 0 && minutoConsulta !== 30) {
        console.log("Os horários disponíveis são de 30 em 30 minutos.");
        return;
    }

    // Verificar se já existe uma consulta marcada para o mesmo dia e hora
    const conflito = agendamentos.find(agendamento =>
        agendamento.dia === dia &&
        agendamento.hora === hora
    );

    if (conflito) {
        console.log("Já existe uma consulta marcada para essa data e hora.");
        return;
    }

    // Criar e salvar o agendamento
    let agendamento = {
        paciente: pacientes[pacienteIndex],
        dia: dia,
        hora: hora,
        especialidade: especialidade
    };
    agendamentos.push(agendamento);
    salvarDados();

    console.log("Consulta marcada com sucesso!");
}

// Função para cancelar uma consulta
function cancelarConsulta() {
    if (agendamentos.length === 0) {
        console.log("Nenhuma consulta agendada.");
        return;
    }

    console.log("\nConsultas agendadas:");
    agendamentos.forEach((agendamento, index) => {
        console.log(`${index + 1}. ${agendamento.paciente.nome} - ${agendamento.dia} ${agendamento.hora} - ${agendamento.especialidade}`);
    });

    let agendamentoIndex = readlineSync.questionInt("Escolha o número da consulta para cancelar: ") - 1;
    if (agendamentoIndex < 0 || agendamentoIndex >= agendamentos.length) {
        console.log("Consulta inválida!");
        return;
    }

    agendamentos.splice(agendamentoIndex, 1);
    salvarDados();
    console.log("Consulta cancelada com sucesso!");
}

// Menu principal
function exibirMenu() {
    console.log("\nMenu Principal");
    console.log("1. Cadastrar Paciente");
    console.log("2. Marcar Consulta");
    console.log("3. Cancelar Consulta");
    console.log("4. Sair");

    let opcao = readlineSync.question("Escolha uma opcao: ");

    switch (opcao) {
        case '1':
            cadastrarPaciente();
            break;
        case '2':
            marcarConsulta();
            break;
        case '3':
            cancelarConsulta();
            break;
        case '4':
            console.log("Saindo do programa.");
            process.exit(0); // Finaliza o programa
            break;
        default:
            console.log("Opcao invalida. Tente novamente.");
            break;
    }

    exibirMenu();
}

// Carregar os dados ao iniciar o programa
carregarDados();

// Iniciar o programa
exibirMenu();
