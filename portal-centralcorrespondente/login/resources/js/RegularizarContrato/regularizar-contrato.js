$(document).ready(function () {
    function checkTableRows() {
        let tableBody = $('table tbody');
        let numRegistros = tableBody.find('tr').length;

        if (numRegistros === 0) {
            tableBody.append(`
                <tr>
                    <td colspan="8">
                        <p class="alert alert-warning d-flex align-items-center gap-2 mb-0" role="alert">
                            <i class="bi bi-exclamation-triangle"></i>
                            Adicione uma proposta através do filtro acima.
                        </p>
                    </td>
                </tr>
            `);
        } else {
            tableBody.find('.alert-warning').closest('tr').remove();
        }
    }
    checkTableRows();

    function handleButtonClick(event) {
        event.preventDefault();
        let button = $(this);

        let caixaValue = $('#caixaInput').val();

        button.text('').attr('disabled', 'disabled').addClass('button--loading');

        $.ajax({
            url: '/ControleFisico/GetQuantidadeContratos',
            type: 'GET',
            data: { caixa: caixaValue },
            success: function (data) {
                $('#QntContratos').removeClass('d-none').text(data.data);
                $('#caixaValorHidden').val(data.numCaixa);
            },
            error: function () {
                $('#error-text').text('Erro ao buscar quantidade de contratos.');
                $('#error-message').removeClass('d-none');
            },
            complete: function () {
                button.text('Buscar').removeAttr('disabled').removeClass('button--loading');
            }
        });
    }

    function handleIncluirButtonClick(event) {
        event.preventDefault();
        let button = $(this);

        let propostaValue = $('input[name="proposta"]').val();
        let caixaValue = $('#caixaInput').val();
        let proposta = "Proposta";

        if (!caixaValue) {
            $('#error-text').text('Preencher o campo da caixa.');
            $('#error-message').removeClass('d-none');
        }
        if (!propostaValue) {
            $('#error-text').text('Preencher o campo da proposta.');
            $('#error-message').removeClass('d-none');
        }
        button.text('').attr('disabled', 'disabled').addClass('button--loading');
        $.ajax({
            url: '/ControleFisico/GetProposta',
            type: 'GET',
            data: { proposta: propostaValue, filtro: proposta, caixa: caixaValue },
            beforeSend: function () {
                $('#error-message').addClass('d-none');
                $('#success-message').addClass('d-none');
            },
            success: function (data) {
                if (data) {
   
                    let tableBody = $('table tbody');
                    let existProposta = false;
                    let numRegistros = tableBody.find('tr').length;

                    if (numRegistros >= 10) {
                        $('#error-text').text("Limite de propostas atingido.");
                        $('#error-message').removeClass('d-none');
                    }
                    else {
                        tableBody.find('tr').each(function () {
                            let propostaTd = $(this).find('td:eq(3)');
                            if (propostaTd.text() === data.proposta) {
                                existProposta = true;
                                return false;
                            }
                        });
                        if (existProposta) {
                            $('#error-text').text("Proposta já adicionada.");
                            $('#error-message').removeClass('d-none');
                        } else {
                            tableBody.find('.alert-warning').closest('tr').remove();
                            let newRow = `
                            <tr class="table-default align-middle">
                                <td>${data.iD_Contrato}</td>
                                 <td>${data.nomeCompleto}</td>
                                <td>${data.contrato}</td>
                                <td>${data.proposta}</td>
                               <td>
                                <button type="button" class="btn btn-danger btn-sm remove-row">
                                    <i class="bi bi-x"></i>
                                </button>
                            </td>
                            </tr>
                        `;
                            tableBody.append(newRow);
                        }
                    }
                } else {
                    $('#error-text').text('Nenhum contrato encontrado.');
                    $('#error-message').removeClass('d-none');
                }
            },
            error: function (xhr) {
                let errorMessage = xhr.responseText;
                $('#error-text').text(errorMessage);
                $('#error-message').removeClass('d-none');
            },
            complete: function () {
                button.text('Incluir').removeAttr('disabled').removeClass('button--loading');
            }
        });
    }

    function handleRegularizarButtonClick(event) {
        event.preventDefault();
        let button = $(this);
        let caixa = $('#caixaInput').val();
        let filtro = "Proposta";

        let propostas = [];
        $('table tbody tr').each(function () {
            let idContrato = $(this).find('td:eq(0)').text();
            let contrato = $(this).find('td:eq(2)').text();
            let proposta = $(this).find('td:eq(3)').text();

            let propostaObj = {
                ID_Contrato: idContrato,
                Contrato: contrato,
                Proposta: proposta
            };

            propostas.push(propostaObj);
        });

        let data = {
            propostas: propostas,
            filtro: filtro,
            caixa: caixa
        };

        $.ajax({
            url: '/ControleFisico/RegularizarMassa',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            beforeSend: function () {
                $('#error-message').addClass('d-none');
                $('#success-message').addClass('d-none');
            },
            success: function (response) {
                $('#success-text').text(response);
                $('#success-message').removeClass('d-none');
                $('table tbody').empty();
                checkTableRows();
            },
            error: function (xhr) {
                let errorMessage = xhr.responseText;
                $('#error-text').text(errorMessage);
                $('#error-message').removeClass('d-none');
            },
            complete: function () {
                button.text('Regularizar Massa').removeAttr('disabled').removeClass('button--loading');
            }
        });
    }

    $(document).on('click', '.remove-row', function () {
        $(this).closest('tr').remove();
        checkTableRows();
    });

   

    function handleCarregarContratoButtonClick(event) {
        event.preventDefault();
        let button = $(this);
        let filtro = $('select[name="filtro"]');
        let consulta = $('input[name="consulta"]');
        let filtroHidden = $('#filtroHidden');
        let consultaHidden = $('#consultaHidden')
        let caixaValue = $('#caixaInput').val();

        filtroHidden.val(filtro.val());
        consultaHidden.val(consulta.val());

        button.text('').attr('disabled', 'disabled').addClass('button--loading');

        $.ajax({
            url: '/ControleFisico/CarregarContrato',
            type: 'GET',
            contentType: 'application/json',
            data: { caixaValor: caixaValue,filtro: filtro.val(), consulta: consulta.val() },
            beforeSend: function () {
                $('#error-message').addClass('d-none');
                $('#error-message2').addClass('d-none');
                $('#success-message2').addClass('d-none');
            },
            success: function (response) {
                if (response) {

                    
                    $('#contratoCarregarDocumentosScript').remove();

                    
                    $('<script>', {
                        id: 'contratoCarregarDocumentosScript',
                        src: '/js/RegularizarContrato/contratoCarregarDocumentos.js',
                        type: 'text/javascript',
                        defer: true
                    }).appendTo('body');

                    $('#regularizarBtnContainer').removeClass('d-none');
                 
                    filtro.attr('disabled','disabled');
                    consulta.attr('readonly', 'readonly');
                   

                    $('#carregarContratoContainer').html(response);

                } else {
                    $('#error-text').text('Contrato não encontrado.');
                    $('#error-message').removeClass('d-none');
                    filtro.removeAttr('disabled');
                    consulta.removeAttr('readonly');
                }
                button.text('Carregar Contrato').removeClass('button--loading');
            },
            error: function (xhr) {
                let errorMessage = xhr.responseText;
                $('#error-text').text(errorMessage);
                $('#error-message').removeClass('d-none');
                button.text('Carregar Contrato').removeAttr('disabled').removeClass('button--loading');
                filtro.removeAttr('disabled');
                consulta.removeAttr('readonly');
            },
            complete: function () {
            }
        });
    }


    $('#btnRegularizar').click(handleRegularizarButtonClick);
    $('#btnCarregarContrato').click(handleCarregarContratoButtonClick);
    $('.btnBuscar').click(handleButtonClick);
    $('#btnIncluir').click(handleIncluirButtonClick);
    
});