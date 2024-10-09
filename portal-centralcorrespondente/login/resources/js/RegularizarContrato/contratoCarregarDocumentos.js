$(document).ready(function () {

    // Função para lidar com o clique do botão Adicionar Pendencia
    function handleAdicionarPendenciaClick(event) {
        event.preventDefault();

        let linha = $(this).closest('tr');
        let documentoId = linha.find('select[name="Documento"]').val();
        let motivoPendenciaId = linha.find('select[name="MotivoPendencia"]').val();
        let observacao = linha.find('textarea[name="observacaoInput"]').val();
        let idContrato = $('#idContrato').val();
        let data = {
            IdContrato: idContrato,
            IdDocumento: documentoId,
            MotivoPendencia: motivoPendenciaId,
            Observacao: observacao
        };

        $.ajax({
            url: '/ControleFisico/AdicionarDocumentos',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                linha.css({
                    'background-color': '#f1aeb5',
                    'color': 'white'
                })
                linha.find('select, input').prop('disabled', true);
                linha.find('.adicionar-pendencia').prop('disabled', true);
            },
            error: function (xhr, status, error) {
                alert('Erro ao adicionar documento: ' + xhr.responseText);
            }
        });
    }

    // Função para lidar com o clique do botão Regularizar Documento
    function handleRegularizarDocumentoClick(event) {
        event.preventDefault();
        let linha = $(this).closest('tr');
        let documentoId = linha.find('select[name="Documento"]').val();
        let motivoPendenciaId = linha.find('select[name="MotivoPendencia"]').val();
        let observacao = linha.find('textarea[name="observacaoInput"]').val();
        let idContrato = $('#idContrato').val();
        let caixa = $('#caixa').val();
        let filtro = $('#filtro').val();
        let consulta = $('#consulta').val();

        let data = {
            IdContrato: idContrato,
            IdDocumento: documentoId,
            MotivoPendencia: motivoPendenciaId,
            Observacao: observacao,
            Caixa: caixa,
            filtro: filtro,
            consulta: consulta
        };

        $.ajax({
            url: '/ControleFisico/RegularizarDocumento',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                if (response.includes("Contrato regularizado")) {
                    // Mostra mensagem de sucesso
                    $('#success-text').text(response);
                    $('#success-message').removeClass('d-none');
                    $('#btnNovoHidden').removeClass('d-none');
                    // Oculta a tabela
                    $('#containerTabela').hide();
                } else {
                    // Remove a linha da tabela
                    linha.remove();
                }
            },
            error: function (xhr, status, error) {
                alert('Erro ao regularizar documento: ' + xhr.responseText);
            }
        });
    }

    // Delegação de eventos para elementos dinâmicos
    $(document).on('click', '.adicionar-pendencia', handleAdicionarPendenciaClick);
    $(document).on('click', '.regularizar-documento', handleRegularizarDocumentoClick);

    // Função para criar nova pendência
    function handleNovaPendenciaButtonClick(event) {
        event.preventDefault();
        let tableBody = $('table tbody');
        console.log("clicou no btnNovaPen");

        function criarOpcao(value, text, selected = false) {
            let option = $('<option></option>').val(value).text(text);
            if (selected) {
                option.attr('selected', 'selected');
            }
            return option;
        }

        function criarNovaLinha() {
            let novaLinha = $('<tr class="table-default align-middle"></tr>');

            let selectDocumento = $('<select class="form-select form-select-lg " name="Documento"></select>');
            selectDocumento.append(criarOpcao("", "Selecione um Documento"));
            documentos.forEach(function (doc) {
                selectDocumento.append(criarOpcao(doc.id_Documento, doc.nomeDocumento));
            });

            let selectValidade = $('<select class="form-select form-select-lg " name="validade"></select>');
            selectValidade.append(criarOpcao("True", "Sim"));
            selectValidade.append(criarOpcao("False", "Não"));

            let selectMotivoPendencia = $('<select class="form-select form-select-lg " name="MotivoPendencia"></select>');
            motivosPendencia.forEach(function (motivo) {
                selectMotivoPendencia.append(criarOpcao(motivo.iD_MotivoPendencia, motivo.descricaoMotivoPendencia));
            });

           
            let
                inputObservacao = $(
                    '<textarea class="form-control" name="observacaoInput" rows="1" style="resize: none; overflow-y: auto; height:4.5vh"></textarea>'
                );
            novaLinha.append($('<td></td>').append(selectDocumento));
            novaLinha.append($('<td></td>').append(selectValidade));
            novaLinha.append($('<td></td>').append(selectMotivoPendencia));
            novaLinha.append($('<td></td>').append(inputObservacao));
            novaLinha.append(`
                <td>
                    <div class="button-group m-2 text-align-top" style="text-align: center;">
                        <button class="adicionar-pendencia btn btn-danger duplicate-row mb-1" type="button" title="Adicionar Pendencia">✔</button>
                    </div>
                </td>
            `);

            tableBody.append(novaLinha);
        }

        criarNovaLinha();
    }

    $('#btnNovaPen').click(handleNovaPendenciaButtonClick);
});