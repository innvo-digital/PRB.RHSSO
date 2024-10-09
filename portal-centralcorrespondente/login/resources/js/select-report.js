$('[data-reports]').each((_, item) => {
    const { selectedOptions } = item;
    const [ currentSelected ] = selectedOptions;
    const { textContent } = currentSelected;
    $('.report-title').text(`Relatório ${textContent.toLowerCase()}`);
});