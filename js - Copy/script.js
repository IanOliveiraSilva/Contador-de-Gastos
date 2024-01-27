var gastos = [];

function adicionarGasto() {
    var nomeGasto = document.getElementById('nomeGasto').value;
    var tipoGasto = document.getElementById('tipoGasto').value;
    var valorGasto = parseFloat(document.getElementById('valorGasto').value) || 0;
    var mesGasto = document.getElementById('mesGasto').value;
    var numParcelas = document.getElementById('numParcelas').value;
    var numParcelaAtual = document.getElementById('numParcelaAtual').value;

    if (valorGasto > 0) {
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
    } else {
        alert('Informe um valor válido para o gasto.');
    }
}

function limparCamposGasto() {
    document.getElementById('nomeGasto').value = '';
    document.getElementById('valorGasto').value = '';
}

function exibirGastos() {
    var listaGastos = document.getElementById('listaGastos');
    listaGastos.innerHTML = '';

    for (var i = 0; i < gastos.length; i++) {
        var itemLista = document.createElement('div');
        itemLista.classList.add('list-group-item');

        var infoParcelas = '';

        if (gastos[i].tipo === 'credito') {
            infoParcelas = `, ${gastos[i].numParcelaAtual}/${gastos[i].numParcelas} parcelas`;
        }

        itemLista.innerHTML = `<span class="font-weight-bold">${gastos[i].nome}</span> - R$ ${gastos[i].valor.toFixed(2)} - ${gastos[i].mes}${infoParcelas}`;

        listaGastos.appendChild(itemLista);
    }
}



function calcularTotal() {
    // Obter os valores informados pelo usuário
    var salario = parseFloat(document.getElementById('salario').value) || 0;

    // Calcular os totais de débito e crédito
    var totalDebito = 0;
    var totalCredito = 0;

    for (var i = 0; i < gastos.length; i++) {
        if (gastos[i].tipo === 'debito') {
            totalDebito += gastos[i].valor;
        } else if (gastos[i].tipo === 'credito') {
            totalCredito += gastos[i].valor;
        }
    }

    // Atualizar os elementos HTML com os resultados
    document.getElementById('totalDebito').textContent = totalDebito.toFixed(2);
    document.getElementById('totalCredito').textContent = totalCredito.toFixed(2);

    // Calcular o total geral
    var totalGastos = totalDebito + totalCredito;

    // Calcular a diferença com o salário
    var diferencaSalario = salario - totalGastos;

    // Atualizar os elementos HTML com os resultados restantes
    document.getElementById('totalGastos').textContent = totalGastos.toFixed(2);
    document.getElementById('diferencaSalario').textContent = diferencaSalario.toFixed(2);
    document.getElementById('salarioTotal').textContent = salario.toFixed(2);
}

// Função para preencher os selects
function preencherSelect(idSelect, start, end) {
    var select = document.getElementById(idSelect);
    select.innerHTML = '';

    for (var i = start; i <= end; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
}

// Chamada da função para preencher os selects de parcelas
preencherSelect('numParcelas', 1, 12);
preencherSelect('numParcelaAtual', 1, 12);
