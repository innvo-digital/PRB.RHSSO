function inicializarModalCaixas() {
    // Inicializa o DataTable
    $('#caixaTable').DataTable({
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

            "zeroRecords": "Nenhum registro encontrado",
        },
        "pagingType": "simple_numbers",

        "ordering": false, // Remove o sorting das colunas
        "drawCallback": function () {
            $(".visualizar-caixa").on("click", function () {
                let numeroCaixa = $(this).data("id");
                $('#caixaValorHidden').val(numeroCaixa);

                // Exibe o modal
                const modalCaixas = document.getElementById('modalCaixas');
                modalCaixas.classList.remove('d-none');
                modalCaixas.classList.add('d-block');

                const modalBackdrop = document.getElementById('modalCaixaBackdrop');
                modalBackdrop.classList.remove('d-none');
                modalBackdrop.classList.add('d-block');

                // Faz a requisição AJAX para o controlador
                $.ajax({
                    url: '/ControleFisico/Caixas/VisualizarCaixa', // Certifique-se de que o URL esteja correto
                    type: 'POST',
                    data: { numeroCaixa: numeroCaixa },
                    success: function (response) {
                        // Converte o valor booleano em "Sim" ou "Não"
                        function boolToYesNo(value) {
                            return value ? 'Sim' : 'Não';
                        }
                        console.log({ response });

                        // Atualiza o conteúdo do modal com os dados recebidos
                        $('#modalBodyCaixas').html(`
                    <p><strong>Caixa:</strong>  ${response.caixa[0].numeroCaixa} <br> <strong>Descrição:</strong> ${response.caixa[0].descricaoCaixa}</p>
                    <p><strong>Tipo de Caixa:</strong> ${response.tipoCaixa[0].descricaoTipoCaixa} <br> <strong>Situação da Caixa:</strong> ${response.situacaoCaixa[0].descricaoSituacaoCaixa}</p>
                    <p><strong>Quantidade de Contratos:</strong> <span id="quantidadeContratos">${response.quantidade}</span></p>
                    <table id="tabelaContratos" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Proposta</th>
                                <th>Contrato</th>
                                <th>Cliente</th>
                                <th>CPF</th>
                                <th>Situação</th>
                                <th>Digitalizado</th>
                                <th></th> <!-- Coluna adicional sem nome -->
                            </tr>
                        </thead>
                        <tbody>
                            ${response.contratos.map(item => `
                                <tr id="${item.iD_Contrato}">
                                    <td>${item.proposta}</td>
                                    <td>${item.contrato}</td>
                                    <td>${item.nomeCompleto}</td>
                                    <td>${item.cpf}</td>
                                    <td>${item.situacao}</td>
                                    <td>${boolToYesNo(item.digitalizado)}</td>
                                    <td>
                                        <button class="btn btn-danger btn-sm delete-btn" data-contrato="${item.contrato}">
                                            <i class="bi bi-trash"></i> <!-- Ícone de lixeira -->
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `);

                        $('#tabelaContratos').DataTable({
                            "pageLength": 10,
                            "bLengthChange": false,
                            "zeroRecords": "Nenhum Registro encontrado",
                            "bFilter": false,
                            "info": false,
                            "ordering": false,
                            language: {
                                "oPaginate": {
                                    "sFirst": "Primeiro",
                                    "sLast": "Último",
                                    "sNext": "Próximo",
                                    "sPrevious": "Anterior",

                                },
                            },
                            "oLanguage": {
                                "sEmptyTable": "Nenhum contrato encontrado"
                            },
                            initComplete: function () {
                                //Exporta o excel depois que a tabela está carregada
                                $('#excelBtn').on('click', exportarParaExcel);
                            }
                        });

                        // Usa event delegation para capturar o clique no botão de exclusão
                        $('#tabelaContratos').on('click', '.delete-btn', function () {
                            let row = $(this).closest('tr');
                            let contratoId = row.attr('id'); // Extrai o ID do contrato


                            let contrato = $(this).data('contrato');

                            // Limpa o campo de input de justificativa ao abrir o modal
                            $('#justificativaExclusaoInput').val('');

                            // Atualiza o título do modal com o número do contrato
                            $('#modalCaixasExcluirContrato .modal-title').text(`Excluir Contrato - ${contrato}`);

                            // Exibe o modal de exclusão
                            $('#modalCaixasExcluirContrato').removeClass('d-none').addClass('d-block');

                            // Armazena o contratoId e o numeroCaixa para usar ao confirmar a exclusão
                            $('#confirmarExcluirContratoBtn').data('contratoId', contratoId);
                        });

                        // Evento para o botão de confirmação no modal de exclusão
                        $('#confirmarExcluirContratoBtn').on('click', function () {
                            let contratoId = $(this).data('contratoId');
                            let numeroCaixa = $('#caixaValorHidden').val();
                            let motivoExclusao = $('#justificativaExclusaoInput').val();

                            if (!motivoExclusao) {
                                $('#error-textExcluirContrato').text('A justificativa é obrigatória.');
                                $('#error-messageExcluirContrato').removeClass('d-none');
                                return;
                            }

                            // Faz a requisição AJAX para excluir o contrato
                            $.ajax({
                                url: '/ControleFisico/Caixas/ExcluirContrato',
                                type: 'POST',
                                data: { idContrato: contratoId, numeroCaixa: numeroCaixa, motivoExclusao: motivoExclusao },
                                success: function (response) {
                                    if (response.status === true) {
                                        console.log({ response });
                                        // Remove a linha da tabela
                                        $(`#${contratoId}`).remove();

                                        $('#quantidadeContratos').text(response.quantidadeContratos.qtd_Contratos);

                                        // Fecha o modal
                                        $('#modalCaixasExcluirContrato').removeClass('d-block').addClass('d-none');
                                    } else {
                                        $('#error-textExcluirContrato').text('Erro ao excluir o contrato.');
                                        $('#error-messageExcluirContrato').removeClass('d-none');
                                    }
                                },
                                error: function () {
                                    $('#error-textExcluirContrato').text('Erro ao excluir o contrato.');
                                    $('#error-messageExcluirContrato').removeClass('d-none');
                                }
                            });
                        });

                        // Fechar o modal de exclusão
                        $('#btnFecharModalCaixaExcluirContrato').on('click', function () {
                            $('#modalCaixasExcluirContrato').removeClass('d-block').addClass('d-none');
                            $('#error-messageExcluirContrato').addClass('d-none'); // Oculta a mensagem de erro, se houver
                        });
                    },
                    error: function () {
                        $('#modalBodyCaixas').html('<p>Erro ao carregar os dados da caixa.</p>');
                    }
                });
            });

            $(".editar-caixa").on("click", function () {
                let numeroCaixa = $(this).data("id");

                // Exibe o modal
                const modalCaixas = document.getElementById('modalCaixasEditar');
                modalCaixas.classList.remove('d-none');
                modalCaixas.classList.add('d-block');

                const modalBackdrop = document.getElementById('modalCaixaBackdrop');
                modalBackdrop.classList.remove('d-none');
                modalBackdrop.classList.add('d-block');

                $.ajax({
                    url: '/ControleFisico/Caixas/VisualizarDadosCaixa', // Certifique-se de que o URL esteja correto
                    type: 'GET',
                    data: { numeroCaixa: numeroCaixa },
                    success: function (response) {
                        console.log({ response })
                        function boolToYesNo(value) {
                            return value ? 'Sim' : 'Não';
                        }
                        // Atualiza o conteúdo do modal com os dados recebidos
                        $('#modalBodyCaixasEditar').html(`
    <p><strong>Caixa:</strong>  ${response.caixa.numeroCaixa}</p>
    <div class="d-flex align-items-center mb-3">
        <strong class="me-2">Descrição:</strong>
        <input type="text" id="descricaoCaixaInput" value="${response.caixa.descricaoCaixa}" class="form-control" style="flex: 1;" />
    </div>
    <p><strong>Tipo de Caixa:</strong> ${response.tipoCaixa.descricaoTipoCaixa}</p>  
    <p><strong>Qtd Máxima de Contratos:</strong> ${response.caixa.qtdMaximaContratos}</p> 
    <p><strong>Quantidade de Contratos:</strong> ${response.contratos.qtd_Contratos}</p>
    <p><strong>Contratos Conferidos:</strong> ${response.contratos.qtd_Conferidos}</p>
    <p><strong>Contratos Não Conferidos:</strong> ${response.contratos.qtd_Nao_Conferidos}</p>
    <p><strong>Situação da Caixa:</strong> ${response.situacaoCaixa.descricaoSituacaoCaixa}</p>
    <p><strong>Digitalizada:</strong> ${boolToYesNo(response.caixa.digitalizada)}</p>
`);

                        // Armazena o número da caixa no botão Confirmar    
                        $("#confirmarEditBtn").data("id", response.caixa.numeroCaixa);
                    },
                    error: function () {
                        $('#modalBodyCaixasEditar').html('<p>Erro ao carregar os dados da caixa.</p>');
                    }
                });

            });

            $(".excluir-caixa").on("click", function () {
                let numeroCaixa = $(this).data("id");
                let buttonExcluir = $(this);

                $("#modalBodyCaixasExcluir").html("<p>Deseja excluir a caixa " + numeroCaixa + "?</p>");

                // Exibe o modal
                const modalCaixas = document.getElementById('modalCaixasExcluir');
                modalCaixas.classList.remove('d-none');
                modalCaixas.classList.add('d-block');

                const modalBackdrop = document.getElementById('modalCaixaBackdrop');
                modalBackdrop.classList.remove('d-none');
                modalBackdrop.classList.add('d-block');

                $("#confirmarExcluirBtn").off("click").on("click", function () {
                    $.ajax({
                        url: '/ControleFisico/Caixas/ExcluirCaixa', // URL do seu controller
                        type: 'POST',
                        data: { numeroCaixa: numeroCaixa },
                        beforeSend: function () {
                            $('#error-messageExcluir').addClass('d-none');
                            $('#error-textExcluir').addClass('d-none');
                        },
                        success: function (response) {
                            console.log({ response })
                            if (response.status === true) {
                                buttonExcluir.closest('tr').remove();
                                // Fechar o modal
                                modalCaixas.classList.add('d-none');
                                modalCaixas.classList.remove('d-block');
                                modalBackdrop.classList.add('d-none');
                                modalBackdrop.classList.remove('d-block');
                            }
                            else {
                                $('#error-messageExcluir').removeClass('d-none');
                                $('#error-textExcluir').text(response.mensagem).removeClass('d-none');
                            }


                        },
                        error: function (xhr, status, error) {
                            // Lógica para lidar com erros
                            alert("Erro ao excluir a caixa.");
                        }
                    });
                });

            });

            $("#confirmarEditBtn").on("click", function () {
                let numeroCaixa = $(this).data("id");
                let descricaoCaixa = $("#descricaoCaixaInput").val();
                // Exibe o modal
                const modalCaixas = document.getElementById('modalCaixasEditar');
                const modalBackdrop = document.getElementById('modalCaixaBackdrop');

                $.ajax({
                    url: '/ControleFisico/Caixas/EditarCaixa',
                    type: 'POST',
                    data: { numeroCaixa: numeroCaixa, descricaoCaixa: descricaoCaixa },
                    beforeSend: function () {
                        $('#error-messageEditar').addClass('d-none');
                    },
                    success: function (response) {
                        if (response === true) {
                            $(`#${numeroCaixa}`).text(descricaoCaixa).text();
                            modalBackdrop.classList.remove('d-block');
                            modalBackdrop.classList.add('d-none');
                            modalCaixas.classList.remove('d-nlock');
                            modalCaixas.classList.add('d-none');
                        }
                        else {
                            $('#error-messageEditar').removeClass('d-none');
                        }
                    },
                    error: function () {
                        alert("Erro ao editar a caixa.");
                    }
                });
            });
            //evento Excel
            function exportarParaExcel() {
                let tabela = $('#tabelaContratos').DataTable();
                let numeroCaixaHidden = $('#caixaValorHidden').val();
                // Obtenha todos os dados, ignorando a paginação
                let dados = tabela.rows().data().toArray();
                let linhas = [];
                linhas.push(["Proposta", "Contrato", "Cliente", "CPF", "Situação", "Digitalizado"]);
                dados.forEach(function (item) {
                    console.log({ item })
                    linhas.push([
                        item[0],
                        item[1],
                        item[2],
                        item[3],
                        item[4],
                        item[5] ? 'Sim' : 'Não'
                    ]);
                });

                // Converta o array de dados para um worksheet e crie o arquivo Excel
                let wb = XLSX.utils.book_new();
                let ws = XLSX.utils.aoa_to_sheet(linhas);
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

                let nomeArquivo = `ContratosPorCaixa_${numeroCaixaHidden}.xlsx`;
                XLSX.writeFile(wb, nomeArquivo);
            }

            // Evento para fechar o modal - Visualizar
            $("#btnFecharModalCaixa").on("click", function () {
                const modalCaixas = document.getElementById('modalCaixas');
                modalCaixas.classList.remove('d-block');
                modalCaixas.classList.add('d-none');

                const modalBackdrop = document.getElementById('modalCaixaBackdrop');
                modalBackdrop.classList.remove('d-block');
                modalBackdrop.classList.add('d-none');
            });
            // Evento para fechar o modal - editar
            $("#btnFecharModalCaixaEditar").on("click", function () {
                const modalCaixas = document.getElementById('modalCaixasEditar');
                modalCaixas.classList.remove('d-block');
                modalCaixas.classList.add('d-none');

                const modalBackdrop = document.getElementById('modalCaixaBackdrop');
                modalBackdrop.classList.remove('d-block');
                modalBackdrop.classList.add('d-none');
            });

            // Evento para fechar o modal - Excluir
            $("#btnFecharModalCaixaExcluir").on("click", function () {
                const modalCaixas = document.getElementById('modalCaixasExcluir');
                modalCaixas.classList.remove('d-block');
                modalCaixas.classList.add('d-none');

                const modalBackdrop = document.getElementById('modalCaixaBackdrop');
                modalBackdrop.classList.remove('d-block');
                modalBackdrop.classList.add('d-none');
            });
        }
    });
}