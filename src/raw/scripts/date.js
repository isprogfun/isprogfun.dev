// Setting date
const $footer = document.getElementById('js-footer');

if ($footer) {
    $footer.textContent = `2013 - ${new Date().getFullYear()}`;
}