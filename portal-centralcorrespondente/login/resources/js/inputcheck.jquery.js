$.fn.inputcheck = function () {
    return this.each(function (_, input) {
        const $input = $(input);
        const id = $input.attr('id') || `input_${String(Math.random()).replace('.', '')}`;
        const placeholder = $input.attr('placeholder');
        const attributesRemove = ['placeholder', 'id'];
        $input.wrap('<div class="input"></div>');
        $input.after(`<label for="${id}" class="input__label">${placeholder}</label>`);
        attributesRemove.forEach((attr) => $input.removeAttr(attr));
        $input.attr('id', id);
        $input.addClass('input__check');
    });
}

$('[data-inputcheck]').inputcheck()
