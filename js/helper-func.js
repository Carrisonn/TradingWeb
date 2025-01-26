export function darkMode() {
    const btnDarkMode = document.querySelector('.dark-mode-icon');
    const isDarkMode = localStorage.getItem('darkMode');
    isDarkMode === 'enabled' ? document.body.classList.add('dark-mode') : null;

    btnDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    })
};

export function showAlert(message, reference) {
    cleanAlert(reference);

    const error = document.createElement('p');
    error.textContent = message;
    error.classList.add('error');
    reference.appendChild(error);

    setTimeout(() => {
        error.remove();
    }, 4000);
};

export function cleanAlert(reference) {
    const cleanMessage = reference.querySelector('.error');
    cleanMessage ? reference.removeChild(cleanMessage) : null;
};