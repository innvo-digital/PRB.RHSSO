$(document).ready(function () {
    // Função para fazer a requisição AJAX e atualizar a quantidade de contratos
    function obterQuantidadeContratos(inputId, resultId) {
        var valor = $(inputId).val();

        // A chamada AJAX pode ser mantida ou removida, dependendo da sua necessidade
        $.ajax({
            url: '/ControleFisico/IncluirContratos/ObterContratoCaixa',
            type: 'GET',
            contentType: 'application/json',
            data: { valor: valor },
            success: function (response) {
               
                // O texto já foi atualizado com o valor digitado, mas se necessário, pode-se atualizar novamente com a resposta
                $(resultId).text('Quantidade de contratos: ' + response.quantidade);
            },
            error: function (xhr, status, error) {
                console.error('Erro ao obter contratos:', error);
                $(resultId).text('Erro ao obter contratos');
            }
        });
    }

    // Eventos para os inputs
    $('#caixaImagem').on('keypress', function (e) {
        if (e.which === 13) { // Código da tecla Enter
            e.preventDefault();
            var valorCaixaImg = $('#caixaImagem').val();
            $('#caixaImgHidden').val(valorCaixaImg);

            obterQuantidadeContratos('#caixaImagem', '#contratoImg');
        }
    });

    $('#caixaSemImagem').on('keypress', function (e) {
        if (e.which === 13) { // Código da tecla Enter
            e.preventDefault();
            var valorCaixaSemImg = $('#caixaSemImagem').val();
            $('#caixaSemImgHidden').val(valorCaixaSemImg);
            obterQuantidadeContratos('#caixaSemImagem', '#contratoSemImg');
        }
    });

    $('#caixaOutros').on('keypress', function (e) {
        if (e.which === 13) { // Código da tecla Enter
            e.preventDefault();
            var valorCaixaOutros = $('#caixaOutros').val();
            $('#caixaOutrosHidden').val(valorCaixaOutros);
            obterQuantidadeContratos('#caixaOutros', '#contratoOutros');
        }
    });



    $('#validarCaixasButton').click(handleValidarCaixasButtonClick);

    function handleValidarCaixasButtonClick(event) {
        event.preventDefault();    
        var caixaComImagemValue = $('#caixaImagem').val();
        var caixaSemImagemValue = $('#caixaSemImagem').val();
        var caixaOutrosValue = $('#caixaOutros').val();

        console.log({ caixaComImagemValue }, { caixaSemImagemValue }, { caixaOutrosValue })

        var data = {
            CaixaComImagem: caixaComImagemValue,
            CaixaSemImagem: caixaSemImagemValue,
            CaixaOutros: caixaOutrosValue
        };

        $.ajax({
            url: '/ControleFisico/IncluirContratos/ValidarCaixas',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            beforeSend: function () {
                $('#error-message').addClass('d-none');
                $('#tabelaComImagem').addClass('d-none');
                $('#tabelaSemImagem').addClass('d-none');
                $('#mensagemInclusao').addClass('d-none');
            },
            success: function (response) {              
              
                if (response.retorno) {
                    $('#error-message1').removeClass('d-none');
                    $('#error-text').text(response.retorno);
                } else {
                    $('#error-message1').addClass('d-none');
                    $('#containerFiltro').removeClass('d-none');
                    $('#caixaImgHidden').val(caixaComImagemValue);
                    $('#caixaSemImgHidden').val(caixaSemImagemValue);
                    $('#caixaOutrosHidden').val(caixaOutrosValue);
                }
            },
            error: function (xhr) {

            },
        });
    }



    function functionBtnModal(event,resposta) {
        event.preventDefault();
        // Obter os valores dos campos hidden
        var caixaImg = $('#caixaImgHidden').val();
        var caixaSemImg = $('#caixaSemImgHidden').val();
        var caixaOutros = $('#caixaOutrosHidden').val();
        var filtro = $('#filtro').val();
        var consulta = $('#consulta').val();
        var chamado = $('#chamado').val();

        var data = {
            CaixaComImagem: caixaImg,
            CaixaSemImagem: caixaSemImg,
            caixaOutros: caixaOutros,
            Filtro: filtro,
            Consulta: consulta,
            Resposta: resposta,
            quemChamou: chamado,
        };
        JSON.stringify(data)

        // Fazer a requisição AJAX para o controller IncluirContrato
        $.ajax({
            url: '/ControleFisico/IncluirContratos/ProcessaRespostaModal',
            type: 'POST',
            data: data,
            beforeSend: function () {
                 //Limpar os dados anteriores e ocultar elementos
                $('#mensagemContrato').text('').addClass('d-none');
                $('#mensagemContratoSemImagem').text('').addClass('d-none');
                $('#mensagemContratoOutros').text('').addClass('d-none');

                $('#tabelaComImagem tbody').html('');
                $('#tabelaSemImagem tbody').html('');

                $('#tabelaComImagem').addClass('d-none');
                $('#tabelaSemImagem').addClass('d-none');

                $('#backdrop').addClass('d-none');
                $('#myModal').addClass('d-none');
            },
            success: function (response) {
                console.log({ response });

                // Adaptar a estrutura de retorno para letras minúsculas
                const retorno = response;

                // Exibir as mensagens e remover d-none
                $('#mensagemInclusao').text(retorno.mensagem).removeClass('d-none').css('color', retorno.cor);

                // Populando a tabela de Contratos com Imagem
                let tabelaComImagem = '';
                if (retorno.contratoIncluidoComImagem && retorno.contratoIncluidoComImagem.length > 0) {
                    retorno.contratoIncluidoComImagem.forEach(function (item) {
                        tabelaComImagem += `
                        <tr class="table-default">
                            <td>${item.proposta}</td>
                            <td>${item.contrato}</td>
                            <td>${item.caixa}</td>
                            <td>${item.cliente}</td>
                            <td>${item.cpf}</td>
                            <td>${item.dataIncluido}</td>
                        </tr>`;
                    });
                    // Remover a classe d-none para exibir a tabela
                    $('#tabelaComImagem').removeClass('d-none');
                } else {
                    tabelaComImagem = `
                    <tr>
                        <td colspan="6">
                            <p class="alert alert-warning d-flex align-items-center gap-2 mb-0" role="alert">
                                <i class="bi bi-exclamation-triangle"></i> Nenhum contrato com imagem encontrado.
                            </p>
                        </td>
                    </tr>`;
                }
                $('#tabelaComImagem tbody').html(tabelaComImagem);

                // Populando a tabela de Contratos sem Imagem
                let tabelaSemImagem = '';
                if (retorno.contratoIncluidoSemImagem && retorno.contratoIncluidoSemImagem.length > 0) {
                    retorno.contratoIncluidoSemImagem.forEach(function (item) {
                        tabelaSemImagem += `
                        <tr class="table-default">
                            <td>${item.proposta}</td>
                            <td>${item.contrato}</td>
                            <td>${item.caixa}</td>
                            <td>${item.cliente}</td>
                            <td>${item.cpf}</td>
                            <td>${item.dataIncluido}</td>
                        </tr>`;
                    });
                    // Remover a classe d-none para exibir a tabela
                    $('#tabelaSemImagem').removeClass('d-none');
                } else {
                    tabelaSemImagem = `
                    <tr>
                        <td colspan="6">
                            <p class="alert alert-warning d-flex align-items-center gap-2 mb-0" role="alert">
                                <i class="bi bi-exclamation-triangle"></i> Nenhum contrato sem imagem encontrado.
                            </p>
                        </td>
                    </tr>`;
                }
                $('#tabelaSemImagem tbody').html(tabelaSemImagem);

            },
            error: function () {
                $('#mensagemContrato').text("Erro na comunicação com o servidor.").removeClass('d-none');
            }
        });

    }

    function functionIncluirContrato(event) {
        event.preventDefault();

        // Obter os valores dos campos hidden
        var caixaImg = $('#caixaImgHidden').val();
        var caixaSemImg = $('#caixaSemImgHidden').val();
        var caixaOutros = $('#caixaOutrosHidden').val();
        var filtro = $('#filtro').val();
        var consulta = $('#consulta').val();

        var data = {
            CaixaComImagem: caixaImg,
            CaixaSemImagem: caixaSemImg,
            caixaOutros: caixaOutros,
            Filtro: filtro,
            Consulta: consulta
        };
        JSON.stringify(data)

        // Fazer a requisição AJAX para o controller IncluirContrato
        $.ajax({
            url: '/ControleFisico/IncluirContratos/Incluir',
            type: 'POST',
            data: data,
            beforeSend: function () {
                 //Limpar os dados anteriores e ocultar elementos
                $('#mensagemContrato').text('').addClass('d-none');
                $('#mensagemContratoSemImagem').text('').addClass('d-none');
                $('#mensagemContratoOutros').text('').addClass('d-none');

                $('#tabelaComImagem tbody').html('');
                $('#tabelaSemImagem tbody').html('');

                $('#tabelaComImagem').addClass('d-none');
                $('#tabelaSemImagem').addClass('d-none');

                $('#backdrop').addClass('d-none');
                $('#myModal').addClass('d-none');
                $('#error-message1').addClass('d-none');
                $('#mensagemInclusao').addClass('d-none');
                
            },
            success: function (response) {
                console.log('Incluir',{ response });

                // Adaptar a estrutura de retorno para letras minúsculas
                const retorno = response;

                if (response.status === false)
                {
                    $('#error-message1').removeClass('d-none');
                    $('#error-text').text(response.mensagem);
                    return;
                }
               
                if (retorno.existeModal === true) {
                    // Exibir o modal
                    console.log("Existe Modal!")
                    $('#chamado').val(retorno.quemChamou);
                    $('#modalPergunta').text(retorno.perguntaModal);
                    $('#myModal').removeClass('d-none');
                    $('#backdrop').removeClass('d-none');
                }                
                else {
                    console.log({response})
                    // Exibir a mensagem e remover d-none
                    $('#mensagemInclusao').text(retorno.mensagem).removeClass('d-none').css('color',retorno.corCaixa);
                   

                    // Populando a tabela de Contratos com Imagem
                    let tabelaComImagem = '';
                    if (retorno.contratoIncluidoComImagem && retorno.contratoIncluidoComImagem.length > 0) {
                        retorno.contratoIncluidoComImagem.forEach(function (item) {
                            tabelaComImagem += `
                        <tr class="table-default">
                            <td>${item.proposta}</td>
                            <td>${item.contrato}</td>
                            <td>${item.caixa}</td>
                            <td>${item.cliente}</td>
                            <td>${item.cpf}</td>
                            <td>${item.dataIncluido}</td>
                        </tr>`;
                        });
                        // Remover a classe d-none para exibir a tabela
                        $('#tabelaComImagem').removeClass('d-none');
                    } else {
                        tabelaComImagem = `
                    <tr>
                        <td colspan="6">
                            <p class="alert alert-warning d-flex align-items-center gap-2 mb-0" role="alert">
                                <i class="bi bi-exclamation-triangle"></i> Nenhum contrato com imagem encontrado.
                            </p>
                        </td>
                    </tr>`;
                    }
                    $('#tabelaComImagem tbody').html(tabelaComImagem);

                    // Populando a tabela de Contratos sem Imagem
                    let tabelaSemImagem = '';
                    if (retorno.contratoIncluidoSemImagem && retorno.contratoIncluidoSemImagem.length > 0) {
                        retorno.contratoIncluidoSemImagem.forEach(function (item) {
                            tabelaSemImagem += `
                        <tr class="table-default">
                            <td>${item.proposta}</td>
                            <td>${item.contrato}</td>
                            <td>${item.caixa}</td>
                            <td>${item.cliente}</td>
                            <td>${item.cpf}</td>
                            <td>${item.dataIncluido}</td>
                        </tr>`;
                        });
                        // Remover a classe d-none para exibir a tabela
                        $('#tabelaSemImagem').removeClass('d-none');
                    } else {
                        tabelaSemImagem = `
                    <tr>
                        <td colspan="6">
                            <p class="alert alert-warning d-flex align-items-center gap-2 mb-0" role="alert">
                                <i class="bi bi-exclamation-triangle"></i> Nenhum contrato sem imagem encontrado.
                            </p>
                        </td>
                    </tr>`;
                    }
                    $('#tabelaSemImagem tbody').html(tabelaSemImagem);
                }
            },
            error: function () {
                $('#mensagemContrato').text("Erro na comunicação com o servidor.").removeClass('d-none');
            }
        });
    }

    $('#modalButton').click(functionIncluirContrato);
    // Evento para o botão "Não"
    $('#btnNaoModal').click(function (event) {
        functionBtnModal(event, 'Não');
    });

    // Evento para o botão "Sim"
    $('#btnSimModal').click(function (event) {
        functionBtnModal(event, 'Sim');
    }); 
});