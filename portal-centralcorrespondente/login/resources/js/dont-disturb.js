$('[data-dont-disturb]').on('input', (e) => {
    const { currentTarget } = e;
    const { value } = currentTarget;
    $(currentTarget).val(value.replace(/\D/g, ''));
})