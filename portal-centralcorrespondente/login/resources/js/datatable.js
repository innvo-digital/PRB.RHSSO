$('[data-datatable]').DataTable({
    fixedColumns: {
        start: 1,
        end: 2,
    },
    language: {
        search: 'Buscar',
        info: 'Exibindo _START_ ao _END_ de _TOTAL_ itens',
        infoEmpty: 'Nada encontrado!',
        infoFiltered:   "(_MAX_ itens filtrados)",
    },
    paging: false,
    scrollCollapse: true,
    scrollX: true,
    scrollY: 400
});