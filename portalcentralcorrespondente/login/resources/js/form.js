$('form').on('submit', () => {
    $('[type="submit"]').text('').attr('disabled', 'disabled').addClass('button--loading');
})