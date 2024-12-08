darkMode();

function darkMode() {
    const btnDarkMode = document.querySelector('.dark-mode-icon');
    const isDarkMode = localStorage.getItem('darkMode');

    if (isDarkMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    btnDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    })
};