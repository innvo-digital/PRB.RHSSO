let propostasSelecionadas = [];
document.addEventListener('DOMContentLoaded', (event) => {
    //Configura o campo de CPF
    let cpf = document.querySelector("#cpf");
    cpf.addEventListener("input", function () {
        let cpfValue = cpf.value.replace(/\D/g, "");
        cpfValue = cpfValue.replace(/(\d{3})(\d)/, "$1.$2");
        cpfValue = cpfValue.replace(/(\d{3})(\d)/, "$1.$2");
        cpfValue = cpfValue.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        cpf.value = cpfValue;
    });

    document.getElementById('proposta').addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10));

    //Desabilita o campo de buscar
    if (!validarDatas()) {
        $('#Buscar').prop('disabled', true);
        $('input[name="DataBaseInicial"], input[name="DataBaseFinal"], #situacao').on('change', function () {
            $('#Buscar').prop('disabled', !validarDatas());
        });
        $('form').on('submit', function (e) {
            if (!validarDatas()) {
                e.preventDefault();
                alert("A diferença entre as datas não pode ser maior que 6 meses.");
            }
        });
    }
});

//Função para exportar Excel
function exportarParaExcel() {
    let tabela = document.getElementById("tabela-dados");
    let rows = tabela.querySelectorAll("tr");

    let tabelaFiltrada = [];
    rows.forEach(function (row) {
        let cells = row.querySelectorAll("th, td");
        let rowData = [];
        for (let i = 0; i < Math.min(5, cells.length); i++) {
            rowData.push(cells[i].innerText);
        }
        tabelaFiltrada.push(rowData);
    });
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(tabelaFiltrada);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "dados.xlsx");
}

//Prepara a paginação
$(document).ready(function () {
    // Inicializa a tabela com DataTables
    let tabela = $('#tabela-dados').DataTable({
        "pageLength": 10,
        "bLengthChange": false,
        "bFilter": false,
        "info": false,
        "ordering": false,
        "language": {
            "paginate": {
                "previous": "Anterior",
                "next": "Próximo"
            },
            "zeroRecords": "Nenhum registro encontrado"
        },
        "oLanguage": {
            "sEmptyTable": "Nenhum contrato encontrado"
        },
    });


    $('#tabela-dados').on('change', '.checkbox-item', function () {
        const proposta = $(this).closest('tr').find('td:first').text().trim();

        if ($(this).is(':checked')) {
            // Adiciona ao array se não estiver presente
            if (!propostasSelecionadas.includes(proposta)) {
                propostasSelecionadas.push(proposta);
            }
        } else {
            // Remove do array se estiver desmarcado
            const index = propostasSelecionadas.indexOf(proposta);
            if (index > -1) {
                propostasSelecionadas.splice(index, 1);
            }
        }
    });
    // Ao desenhar (trocar de página), restaura o estado dos checkboxes
    tabela.on('draw.dt', function () {
        $('#tabela-dados .checkbox-item').each(function () {
            const proposta = $(this).closest('tr').find('td:first').text().trim();
            if (propostasSelecionadas.includes(proposta)) {
                $(this).prop('checked', true);
            } else {
                $(this).prop('checked', false);
            }
        });
    });


    // Configura regras nas linhas após cada redesenho da tabela
    tabela.on('draw.dt', function () {
        configurarLinhas();
        verificarCheckboxes();
    });

    // Evento que ocorre quando a página é carregada
    configurarLinhas();
    verificarCheckboxes();
});

//Separa as regras do cargo
function configurarLinhas() {
    let role = document.getElementById("role").value;
    const linhas = document.querySelectorAll('table tbody tr');

    linhas.forEach(linha => {
        const situacaoCell = linha.querySelector('td:nth-child(3)');
        const checkbox = linha.querySelector('input[type="checkbox"]');
        const excluirButton = linha.querySelector('button.btn-danger');

        if (situacaoCell) {
            const situacaoTexto = situacaoCell.textContent.trim();

            // Aplica formatação geral para situações pendentes
            if (situacaoTexto === "Pendente Recebimento" || situacaoTexto === "Pendente Documentação") {
                const cells = linha.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.color = "#ED1C24";
                    cell.style.fontWeight = 600;
                });
            }

            if (role === "grp-portalconsig-controlefisico") { //Correspondente
                if (checkbox) {
                    checkbox.disabled = !(situacaoTexto === "Pendente Recebimento" || situacaoTexto === "Pendente Documentação");
                }
                if (excluirButton) {
                    excluirButton.disabled = (situacaoTexto !== "Em Trânsito Matriz" && situacaoTexto !== "Em Trânsito Plataforma");
                }

            } else if (role === "grp-portalconsig-master") { //Plataforma
                if (checkbox) {
                    checkbox.disabled = !(situacaoTexto === "Pendente Recebimento" || situacaoTexto === "Pendente Documentação");
                }
                if (excluirButton) {
                    excluirButton.disabled = (situacaoTexto !== "Em Trânsito Matriz");
                }

            } else if (role === "grp-portalconsig-controlefisico-interno") { //Matriz
                if (excluirButton) {
                    excluirButton.disabled = !(situacaoTexto === "Em Trânsito Matriz" || situacaoTexto === "Em Trânsito Plataforma");
                }
                if (checkbox) {
                    checkbox.disabled = true;
                }
            }
        }
    });
}



function verificarCheckboxes() {
    let role = document.getElementById("role").value;
    if ((role != "grp-portalconsig-controlefisico-interno")) {
        const algumSelecionado = document.querySelectorAll('.checkbox-item:checked').length > 0;
        document.getElementById('RealizarEnvio').disabled = !algumSelecionado;
    }
}

const checkboxes = document.querySelectorAll('.checkbox-item');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', verificarCheckboxes);
});


//Carregar documentos
function CarregarDocumento(button) {
    let role = document.getElementById("role").value;
    let modal = $('#visualizarModal');
    let propostaVal = $(button).data('proposta');
    let data = { proposta: propostaVal };

    $('#modal-docs').html('<h1>Carregando...</h1>');
    modal.modal('show');

    $.ajax({
        url: '/ControleFisico/PosicaoFisico/VisualizarDocumentos',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {

            // Mapeia IDs para nomes
            const tipoDocumentosMap = response.tipoDocumentos.reduce((map, doc) => {
                map[doc.iD_Documento] = doc.nomeDocumento.trim();
                return map;
            }, {});

            const motivosPendenciaMap = response.motivosPendencia.reduce((map, motivo) => {
                map[motivo.iD_MotivoPendencia] = motivo.descricaoMotivoPendencia;
                return map;
            }, {});

            // Popula os dados do cliente nos campos da <div>
            $('#modal-docs').html(`
            <div class="d-flex justify-content-start align-items-center gap-5 pb-4"> 
                <h1> Proposta: ${propostaVal} </h1>
                <h1> Nome Cliente: ${response.cliente.nomeCompleto || 'N/A'} </h1>
                <h1> Usuario: ${response.cliente.usuarioUltimaAlteracao || 'N/A'} </h1>

            </div>
            <div class="d-flex justify-content-start align-items-center gap-5 pb-4"> 
                <h1> Data Base: ${new Date(response.cliente.dataCadastro).toLocaleDateString() || 'N/A'} </h1>
                <h1> CPF: ${response.cliente.cpf || 'N/A'} </h1>
            </div>
            <table id="tabelaDocumentos" class="table table-bordered">
                <thead>
                    <tr>
                        <th>Documento</th>
                        <th>Motivo Pendência</th>
                        <th>Observação</th>
                        ${role !== 'grp-portalconsig-controlefisico' ? `
                        <th>Data Situação</th>
                        <th>Situação</th>
                        <th>Usuário</th>` : ''}
                    </tr>
                </thead>
                <tbody>
                    ${response.documentos.map(item => {
                // Encontra a pendência correspondente
                const pendente = response.documentosPendentes.find(p => p.iD_Documento === item.id_Documento);
                const motivoPendencia = pendente ? motivosPendenciaMap[pendente.iD_MotivoPendencia] || '' : '';
                const observacao = pendente ? pendente.observacao : '';
                let cssClass = pendente ? 'text-danger' : '';
                let dateValue = pendente ? pendente.dataUltimaAlteracao : "";
                let pendenteText = pendente ? 'Pendente' : ''
                let pendenteUsuario = pendente ? pendente.usuarioUltimaAlteracao : ''

                return `
                            <tr>
                                <td class="text-center font-weight-bold ${cssClass} ">${tipoDocumentosMap[item.id_Documento] || ''}</td>
                                <td class="text-center ${cssClass} font-weight-bold">${motivoPendencia}</td>
                                <td class="text-center ${cssClass} font-weight-bold">${observacao}</td>
                                ${role !== 'grp-portalconsig-controlefisico' ? `
                                <td class="text-center ${cssClass} font-weight-bold">${dateValue}</td>
                                <td class="text-center ${cssClass} font-weight-bold">${pendenteText}</td>
                                <td class="text-center ${cssClass} font-weight-bold">${pendenteUsuario}</td>` : ''}
                            </tr>
                        `;
            }).join('')}
                </tbody>
            </table>
        `);
        },
        error: function (xhr) {
            $('#modal-docs').html(`
            <h2>Erro ao carregar informações</h2>
        `);
        }
    });
}


function showTooltip() {
    document.getElementById('tooltip-text').style.display = 'inline';
}

function hideTooltip() {
    document.getElementById('tooltip-text').style.display = 'none';
}

function validarDatas() {
    let situacao = $('#situacao').val();
    // Se a situação for "Pendente Documentação" ou "Pendente Recebimento", ignorar a validação
    if (situacao == 1 || situacao == 2) {
        return true;
    }
    let dataInicial = new Date($('input[name="DataBaseInicial"]').val());
    let dataFinal = new Date($('input[name="DataBaseFinal"]').val());
    if (isNaN(dataInicial) || isNaN(dataFinal)) return false;
    let diffInMonths = (dataFinal.getFullYear() - dataInicial.getFullYear()) * 12 + dataFinal.getMonth() - dataInicial.getMonth();
    return diffInMonths <= 6;


}

function CarregarPropostaNoModal(button) {
    // Obter o valor da proposta a partir do botão clicado
    const proposta = button.getAttribute('data-proposta');

    // Definir o valor da proposta no campo oculto do modal
    document.getElementById('propostaValue').value = proposta;

    // Exibir o modal
    const modal = new bootstrap.Modal(document.getElementById('modalCancelar'));
    modal.show();
}

function AlterarSituacaoPendente() {
    // Obter o valor da proposta
    const proposta = document.getElementById('propostaValue').value;
    let data = { proposta: proposta };

    // Selecionar o botão
    const botaoPendente = document.getElementById('botaopendente');

    // Alterar o texto e desabilitar o botão para indicar carregamento
    botaoPendente.innerHTML = 'Carregando...'; // Ou você pode usar um ícone de carregamento
    botaoPendente.disabled = true;

    // Fazer requisição AJAX para alterar a situação da proposta
    $.ajax({
        url: '/ControleFisico/PosicaoFisico/AlterarSituacao',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            location.reload();
        },
        error: function (xhr) {
            $('#errorDiv').html(`
                <p class="alert alert-danger d-flex align-items-center gap-3 mb-2" role="alert">
                    <i class="bi bi-x-circle"></i>
                    ${xhr.responseText}
                </p>
            `);

            // Fechar o modal
            let modalElement = document.getElementById('modalCancelar');
            let modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
        },
        complete: function () {
            // Reverter o estado do botão após a conclusão da requisição
            botaoPendente.innerHTML = 'Confirmar';
            botaoPendente.disabled = false;
        }
    });
}



async function EnviarPropostas() {
    let botaoEnviar = document.getElementById('botaoEnviar');
    botaoEnviar.disabled = true;
    botaoEnviar.classList.add('loading');

    let tipoEnvio = document.getElementById('tipoEnvio').value;
    let destinoEnvio = document.getElementById('destinoEnvio').value;

    let data = {
        proposta: propostasSelecionadas,
        tipoEnvio: tipoEnvio,
        destinoEnvio: destinoEnvio,
        codigoEnvio: "",
    };

    try {
        // Enviar a requisição AJAX
        let response = await $.ajax({
            url: '/ControleFisico/PosicaoFisico/EnviarProposta',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        });

        // Primeiro, popular os campos HTML com a resposta
        PopularCamposHTML(response);

        // Em seguida, gerar o PDF
        await GerarBorderoPdf(response);

        // Após gerar o PDF, recarregar a página
        location.reload();
    } catch (error) {
        alert("Erro ao enviar proposta");
        location.reload();
    } finally {
        botaoEnviar.disabled = false;
        botaoEnviar.classList.remove('loading');
    }
}

// Função para popular os campos no HTML
function PopularCamposHTML(data, pagina = 1) {
    // Substituir os valores dos elementos <p> com base nos dados da resposta
    document.getElementById('codigoDeBarrasTexto').innerText = data.codigoGerado;
    document.getElementById('codigoDeBarras').innerText = data.codigoGerado;
    document.getElementById('codigpromotora').innerText = data.codigoPromotora;
    document.getElementById('datahoje').innerText = new Date().toLocaleDateString(); // Substitui com a data de hoje
    document.getElementById('razaosocial').innerText = data.razaoSocial;

    // Definir o limite de contratos por página
    const contratosPorPagina = 10;
    const inicio = (pagina - 1) * contratosPorPagina;
    const fim = Math.min(inicio + contratosPorPagina, data.contratos.length);

    // Limpar a tabela ANTES de popular uma nova página
    const tabelaBordero = document.getElementById('borderoTabela');
    tabelaBordero.innerHTML = '';

    // Preencher a tabela com os contratos recebidos (máximo de 10 por página)
    for (let i = inicio; i < fim; i++) {
        const contrato = data.contratos[i];
        const nomeCliente = data.nomes[i].nomeCompleto;
        const cpfCliente = data.nomes[i].cpf;
        const codEmpregador = contrato.codEmpregador;

        const row = `
            <tr align="center">
                <td class="p-2">${contrato.proposta}</td>
                <td class="p-2">${nomeCliente}</td>
                <td class="p-2">${cpfCliente}</td>
                <td class="p-2">${codEmpregador}</td>
                <td class="p-2"></td>
                <td class="p-2"></td>
            </tr>
        `;
        tabelaBordero.innerHTML += row;
    }
}

// Função para gerar o PDF
async function GerarBorderoPdf(data) {
    const contratosPorPagina = 10;
    const totalPaginas = Math.ceil(data.contratos.length / contratosPorPagina);

    // Configurar e gerar o PDF com todas as páginas
    const opt = {
        filename: 'bordero.pdf',
        image: { type: 'png', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Criar um único contêiner para armazenar o HTML
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Gerar múltiplas páginas no mesmo PDF
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        // Popular os campos HTML para a página atual
        PopularCamposHTML(data, pagina);

        // Clonar a página atual e adicionar ao contêiner
        const pageClone = document.getElementById('borderoPage').cloneNode(true);
        pageClone.id = `borderoPage-${pagina}`;
        pageClone.style.pageBreakAfter = 'always'; // Garantir que cada página seja separada
        container.appendChild(pageClone);
    }

    // Gerar o PDF de uma vez só, a partir do contêiner com todas as páginas
    await html2pdf().from(container).set(opt).save();

    // Remover o contêiner temporário após gerar o PDF
    document.body.removeChild(container);
}


// Listener para habilitar o botão somente quando houver propostas selecionadas
document.addEventListener('DOMContentLoaded', function () {


    preventDefault();
    const checkboxes = document.querySelectorAll('.checkbox-item');
    const enviarButton = document.getElementById('RealizarEnvio');

    function verificarCheckboxes() {
        const selecionados = Array.from(checkboxes).some(checkbox => checkbox.checked);
        enviarButton.disabled = !selecionados;
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', verificarCheckboxes);
    });

});




