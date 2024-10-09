function carregarScript(url, callback) {
    let script = document.createElement('script');
    script.src = url;
    script.onload = callback; // Chama o callback quando o script é carregado
    document.head.appendChild(script);
}

$(document).ready(function () {
    $("#pesquisarBtn").on("click", function () {
        // Captura os valores dos campos
        let dataInicial = $("#DataInicial").val();
        let dataFinal = $("#DataFinal").val();
        let caixa = $("#caixaInput").val();
        let tipoCaixa = $("#TipoCaixa").val();
        let digitalizada = $("#Digitalizada").val();
        let situacao = $("#Situacao").val();
        let button = $(this);
        button.text('').attr('disabled', 'disabled').addClass('button--loading');

        let digitalizadaValue = null;
        if (digitalizada === 'true') {
            digitalizadaValue = true;
        } else if (digitalizada === 'false') {
            digitalizadaValue = false;
        }

        let dados = {
            DataInicial: dataInicial || null,
            DataFinal: dataFinal || null,
            Caixa: caixa || null,
            TipoCaixa: tipoCaixa ? parseInt(tipoCaixa) : null,
            Digitalizada: digitalizadaValue,
            Situacao: situacao ? parseInt(situacao) : null
        };

        let data = JSON.stringify(dados);

        // Carrega o script caixasPartial.js antes de carregar a partial view
        carregarScript('/js/Caixas/caixasPartial.js', function () {
            // Faz a requisição AJAX após o script ser carregado
            $.ajax({
                url: '/ControleFisico/Caixas/GetDadosCaixa',
                type: "POST",
                contentType: "application/json",
                data: data,
                beforeSend: function () {
                    $('#error-message').addClass('d-none');
                    $('#success-message').addClass('d-none');
                },
                success: function (response) {
                    // Atualiza o contêiner com a partial view retornada
                    $("#caixasContainer").html(response);

                    // Após carregar a partial, chama a função que inicializa o comportamento do modal
                    if (typeof inicializarModalCaixas === 'function') {
                        inicializarModalCaixas();
                    } else {
                        console.error("Função inicializarModalCaixas não está definida.");
                    }
                },
                complete: function () {
                    button.text('Pesquisar').removeAttr('disabled').removeClass('button--loading');
                },
                error: function (xhr) {
                    let errorMessage = xhr.responseText;
                    $('#error-text').text(errorMessage);
                    $('#error-message').removeClass('d-none');
                }
            });
        });
    });
});