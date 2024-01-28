const gastos = [];

const itemsPerPage = 10;
let currentPage = 1;

const salarioLocalStorage = localStorage.getItem('salario');

function obterElemento(id) {
    return document.getElementById(id);
}

function obterValorElemento(id) {
    return obterElemento(id).value;
}

function alerta(mensagem) {
    alert(mensagem);
}

function adicionarGasto() {
    const nomeGasto = obterValorElemento('nomeGasto');
    const tipoGasto = obterValorElemento('tipoGasto');
    const valorGasto = parseFloat(obterValorElemento('valorGasto')) || 0;
    const mesGasto = obterValorElemento('mesGasto');
    const numParcelas = parseInt(obterValorElemento('numParcelas'), 10) || 0;
    const numParcelaAtual = parseInt(obterValorElemento('numParcelaAtual'), 10) || 0;


    if (!nomeGasto.trim()) {
        alerta('Por favor, informe um nome para o gasto.');
        return;
    }

    if (valorGasto <= 0) {
        alerta('Informe um valor válido para o gasto.');
        return;
    }

    if (numParcelas < numParcelaAtual) {
        alerta('O número total de parcelas deve ser maior ou igual à parcela atual.');
        return;
    }

    gastos.push({
        nome: nomeGasto,
        tipo: tipoGasto,
        valor: valorGasto,
        mes: mesGasto,
        numParcelas: numParcelas,
        numParcelaAtual: numParcelaAtual
    });

    exibirGastos();
    calcularTotal();
    limparCamposGasto();
    salvarNoLocalStorage();
}

function salvarNoLocalStorage() {
    localStorage.setItem('gastos', JSON.stringify(gastos));
}

function carregarDoLocalStorage() {
    const gastosSalvos = JSON.parse(localStorage.getItem('gastos')) || [];
    gastos.length = 0;
    gastos.push(...gastosSalvos);
    exibirGastos();
    calcularTotal();
}

function limparCamposGasto() {
    obterElemento('nomeGasto').value = '';
    obterElemento('valorGasto').value = '';
}

function criarElemento(tag, classe, conteudo) {
    const elemento = document.createElement(tag);
    if (classe) elemento.classList.add(classe);
    if (conteudo) elemento.innerHTML = conteudo;
    return elemento;
}

function mudarOrdem() {
    exibirGastos();
}

function exibirGastos(gastosArray) {
    const listaGastos = obterElemento('listaGastos');
    listaGastos.innerHTML = '';

    const gastosParaExibir = gastosArray || gastos;

    const ordem = obterValorElemento('ordem');

    let gastosOrdenados;
    if (ordem === 'alfabetica-az') {
        gastosOrdenados = gastosParaExibir.slice().sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordem === 'alfabetica-za') {
        gastosOrdenados = gastosParaExibir.slice().sort((a, b) => b.nome.localeCompare(a.nome));
    } else if (ordem === 'maior-menor') {
        gastosOrdenados = gastosParaExibir.slice().sort((a, b) => b.valor - a.valor);
    } else if (ordem === 'menor-maior') {
        gastosOrdenados = gastosParaExibir.slice().sort((a, b) => a.valor - b.valor);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const gastosExibidos = gastosOrdenados.slice(startIndex, endIndex);

    for (const gasto of gastosExibidos) {
        const itemLista = criarElemento('li', 'list-group-item');

        let infoParcelas = '';

        if (gasto.tipo === 'credito') {
            infoParcelas = `, ${gasto.numParcelaAtual}/${gasto.numParcelas} parcelas`;
        }

        itemLista.innerHTML = `
            <span class="font-weight-bold">${gasto.nome}</span> - R$ ${gasto.valor.toFixed(2)} - ${gasto.mes}${infoParcelas}
            <button class="btn-edit" onclick="editarGasto(${gastos.indexOf(gasto)})"><i class="fas fa-edit"></i></button>
            <button class="btn-delete" onclick="excluirGasto(${gastos.indexOf(gasto)})"><i class="fas fa-trash-alt"></i></button>
        `;

        listaGastos.appendChild(itemLista);
    }

    exibirPaginacao();
}


function exibirPaginacao() {
    const totalPages = Math.ceil(gastos.length / itemsPerPage);
    const pagination = obterElemento('pagination');

    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = criarElemento('button', i === currentPage ? 'active' : '');
        button.textContent = i;
        button.addEventListener('click', () => trocarPagina(i));
        pagination.appendChild(button);
    }
}

function trocarPagina(page) {
    currentPage = page;
    exibirGastos();
    filtrarPorMes();
}

function excluirGasto(index) {
    gastos.splice(index, 1);
    exibirGastos();
    calcularTotal();
}

function editarGasto(index) {
    const gasto = gastos[index];

    obterElemento('nomeGasto').value = gasto.nome;
    obterElemento('tipoGasto').value = gasto.tipo;
    obterElemento('valorGasto').value = gasto.valor;
    obterElemento('mesGasto').value = gasto.mes;
    obterElemento('numParcelas').value = gasto.numParcelas;
    obterElemento('numParcelaAtual').value = gasto.numParcelaAtual;

    gastos.splice(index, 1);

    exibirGastos();
    calcularTotal();
}

if (salarioLocalStorage) {
    document.getElementById("salario").value = parseFloat(salarioLocalStorage).toFixed(2);
    calcularTotal();
}

function calcularTotal() {
    const salario = parseFloat(document.getElementById("salario").value) || 0;

    const { totalDebito, totalCredito } = calcularTotais();

    const totalGastos = totalDebito + totalCredito;

    const diferencaSalario = salario - totalGastos;

    obterElemento('totalDebito').textContent = totalDebito.toFixed(2);
    obterElemento('totalCredito').textContent = totalCredito.toFixed(2);
    obterElemento('totalGastos').textContent = totalGastos.toFixed(2);
    obterElemento('diferencaSalario').textContent = diferencaSalario.toFixed(2);
    obterElemento('salarioTotal').textContent = salario.toFixed(2);

    localStorage.setItem('salario', salario);
}

function adicionarSalario() {
    const salarioInput = document.getElementById("salario");
    const salario = parseFloat(salarioInput.value);

    if (!isNaN(salario)) {
        salarioInput.value = salario.toFixed(2);
        calcularTotal();
    } else {
        alert("Por favor, informe um valor válido para o salário.");
    }
}


function apagarSalario() {
    const salarioInput = document.getElementById("salario");
    salarioInput.value = "";
    calcularTotal();
}

function calcularTotais(gastosArray) {
    const gastosParaCalcular = gastosArray || JSON.parse(localStorage.getItem('gastos')) || [];

    let totalDebito = 0;
    let totalCredito = 0;

    for (const gasto of gastosParaCalcular) {
        if (gasto.tipo === 'debito') {
            totalDebito += gasto.valor;
        } else if (gasto.tipo === 'credito') {
            totalCredito += gasto.valor;
        }
    }

    return {
        totalDebito,
        totalCredito,
        totalGeral: totalDebito + totalCredito,
    };
}

function preencherSelect(idSelect, ...values) {
    const select = obterElemento(idSelect);
    select.innerHTML = '';

    for (const value of values) {
        const option = criarElemento('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    }
}

function filtrarPorMes() {
    const selectedMonth = obterValorElemento('selecionarMes');

    if (selectedMonth === 'todos') {
        exibirGastos(gastos);
    } else {
        const gastosFiltrados = gastos.filter(function (gasto) {
            const gastoAnoMes = gasto.mes.substring(0, 7);
            return gastoAnoMes.endsWith(selectedMonth);
        });

        exibirGastos(gastosFiltrados);

    }
}

preencherSelect('numParcelas', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
preencherSelect('numParcelaAtual', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);

carregarDoLocalStorage();

function configurarGrafico() {
    const totais = calcularTotais();

    const ctx = obterElemento("myPieChart").getContext('2d');
    const myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Débito", "Crédito", "Total"],
            datasets: [{
                data: [totais.totalDebito.toFixed(2), totais.totalCredito.toFixed(2), totais.totalGeral],
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },
    });
}

configurarGrafico();

function exportarParaCSV() {
    const totais = calcularTotais();

    let csvContent = "data:text/csv;charset=utf-8," +
        "Nome,Tipo,Valor,Mes,Numero de Parcelas,Numero da Parcela Atual\n";

    gastos.forEach(gasto => {
        const linha = `${gasto.nome},${gasto.tipo},${gasto.valor},${gasto.mes},${gasto.numParcelas},${gasto.numParcelaAtual}\n`;
        csvContent += linha;
    });

    csvContent += `\nGastos Totais, Gastos Credito, Gastos Debito\n${totais.totalGeral},${totais.totalCredito},${totais.totalDebito}`;

    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "dados_gastos.csv");
    document.body.appendChild(link);
    link.click();
}

function limparGastos() {
    gastos.length = 0;
    exibirGastos();
    calcularTotal();
    salvarNoLocalStorage();
}
