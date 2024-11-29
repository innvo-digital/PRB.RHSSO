$.fn.inputtext = function () {
    return this.each(function (_, input) {
        const $input = $(input);
        const after = $input.attr('after');
        const before = $input.attr('before');
        const id = $input.attr('id') || `input_${String(Math.random()).replace('.', '')}`;
        const type = $input.attr('type');
        const placeholder = $input.attr('placeholder');
        const attributesRemove = ['placeholder', 'before', 'after', 'id'];
        $input.wrap('<div class="input"><div class="input__wrapper"></div></div>');
        const $wrapper = $input.parent();
        $wrapper.before(`<label for="${id}" class="input__label">${placeholder}</label>`);
        if (after && type !== 'password') {
            $input.after(`<div class="input__after">${after}</div>`);
        }
        if (before) {
            $input.before(`<div class="input__before">${before}</div>`);
        }
        if (type === 'password') {
            $input.after(`<div class="input__after"><i class="bi bi-eye" /></div>`);
            $('.bi-eye, .bi-eye-slash', $wrapper).on('click', (e) => {
                const $icon = $(e.currentTarget);
                const isPasswordHidden = $icon.hasClass('bi-eye');
                if (isPasswordHidden) {
                    $icon.removeClass('bi-eye').addClass('bi-eye-slash');
                    $input.attr('type', 'text');
                } else {
                    $icon.removeClass('bi-eye-slash').addClass('bi-eye');
                    $input.attr('type', 'password');
                }
            });
        }

        if(input.tagName === 'SELECT') {
            $input.after(`<div class="input__select"><i class="bi bi-chevron-down"></i></div>`);
        }

        $input
            .on('focus', () => $wrapper.addClass('input__wrapper--focus'))
            .on('blur', () => {
                if ($input.val() === '') {
                    $wrapper.removeClass('input__wrapper--focus');
                }
            });
        attributesRemove.forEach((attr) => $input.removeAttr(attr));
        $input.attr('id', id);
        $input.addClass('input__field');
    });
}

$('[data-inputtext]').inputtext()
