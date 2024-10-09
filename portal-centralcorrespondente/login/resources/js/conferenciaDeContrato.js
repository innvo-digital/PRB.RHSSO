document.addEventListener('DOMContentLoaded', (event) => {
    let entidadesNovas = new Set();

    function addDuplicateButtonListener(button) {
        button.addEventListener('click', function () {
            let row = button.closest('tr');
            let clonedRow = row.cloneNode(true);

            clonedRow.querySelector('input').value = '';

            clonedRow.querySelectorAll('input, select').forEach(input => {
                input.removeAttribute('disabled');
            });

            let idDocumento = row.querySelector('input[name="idDocumento"]').value;
            let idDocumentoInput = document.createElement('input');
            idDocumentoInput.type = 'hidden';
            idDocumentoInput.name = 'IdDocumento';
            idDocumentoInput.value = idDocumento;
            clonedRow.appendChild(idDocumentoInput);

            let idContrato = document.getElementById('codigoContrato').value;
            clonedRow.dataset.idContrato = idContrato;

            let clonedDuplicateButton = clonedRow.querySelector('.duplicate-row');
            clonedDuplicateButton.replaceWith(clonedDuplicateButton.cloneNode(true));

            if (!clonedRow.querySelector('.delete-row')) {
                let deleteButton = document.createElement('button');
                deleteButton.type = 'button';
                deleteButton.className = 'btn btn-danger delete-row mb-1';
                deleteButton.textContent = '-';
                let buttonGroup = clonedRow.querySelector('.button-group');
                if (buttonGroup) {
                    buttonGroup.appendChild(deleteButton);
                }
                addDeleteButtonListener(deleteButton);
            }

            if (!entidadesNovas.has(clonedRow)) {
                entidadesNovas.add(clonedRow);
            }

            addEventListeners(clonedRow);

            row.parentNode.insertBefore(clonedRow, row.nextSibling);
        });
    }

    function addDeleteButtonListener(button) {
        button.addEventListener('click', function () {
            let row = button.closest('tr');
            if (row && row.parentNode) {
                row.parentNode.removeChild(row);
                entidadesNovas.delete(row);
            } else {
                console.error('Erro ao remover a linha:', row);
            }
        });
    }

    function addEventListeners(row) {
        let duplicateButton = row.querySelector('.duplicate-row');
        if (duplicateButton) {
            addDuplicateButtonListener(duplicateButton);
        }
        let deleteButton = row.querySelector('.delete-row');
        if (deleteButton) {
            addDeleteButtonListener(deleteButton);
        }

        row.querySelectorAll('input, select').forEach(input => {
            input.removeAttribute('disabled');
        });

        let originalRow = row.previousElementSibling;
        if (originalRow && !originalRow.querySelector('.delete-row')) {
            originalRow.querySelectorAll('input, select').forEach(input => {
                input.setAttribute('disabled', 'disabled');
            });
        }
    }

    function obterEntidades() {
        let entidadesNovasArray = Array.from(entidadesNovas).map(row => {
            let idDocumento = row.querySelector('input[name="IdDocumento"]').value || '';
            let idContrato = row.dataset.idContrato || '';

            return {
                IdDocumento: idDocumento,
                IdContrato: idContrato,
                MotivoPendencia: row.querySelector('select').value.trim(),
                Observacao: row.querySelector('input[name="observacaoInput"]').value.trim()
            };
        });

        return {
            novas: entidadesNovasArray
        };
    }

    function handleCaixaButtonClick(event) {

        var modal = document.getElementById('myModal');
        var backdrop = document.querySelector('.modal-backdrop');

        var caixaValue = $('#numeroCaixaContrato').val();
        var contratoValue = $('#codigoContrato').val();

        var data = {
            contratoNum: contratoValue,
            caixa: caixaValue
        };

        $.ajax({
            url: '/ControleFisico/ConferenciaDeContrato/TransferirParaCaixa',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                modal.style.visibility = 'hidden';
                backdrop.style.visibility = "hidden";
            },
            error: function (xhr) {
                //var errorMessage = xhr.responseText;
                modal.style.visibility = 'hidden';
                backdrop.style.visibility = "hidden";
            },
        });
    }

    function handleUpdateTableButton(event) {
        let { novas } = obterEntidades();
        if (novas == null) return;

        let contratoValue = $('#codigoContrato').val();

        let data = novas.map(entidade => ({
            IdContrato: entidade.IdContrato,
            IdDocumento: entidade.IdDocumento,
            MotivoPendencia: entidade.MotivoPendencia,
            Observacao: entidade.Observacao
        }));

        $.ajax({
            url: '/ControleFisico/ConferenciaDeContrato/AtualizarDocumentos',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                $('#updateData').submit();
            },
            error: function (xhr) {
                var errorMessage = xhr.responseText;
                $('#updateData').submit();
            },
        });
    }

    $('#transferButton').click(handleCaixaButtonClick);
    $('#updateData').click(handleUpdateTableButton);

    let duplicateButtons = document.querySelectorAll('.duplicate-row');
    duplicateButtons.forEach(button => addDuplicateButtonListener(button));

});