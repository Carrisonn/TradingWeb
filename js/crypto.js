/* -- Globals -- */
document.addEventListener('DOMContentLoaded', () => {
    checkCryptos();
    formCrypto.reset();
});


const cryptoSelect = document.querySelector('#crypto');
const coinSelect = document.querySelector('#coin');
const formCrypto = document.querySelector('#form-crypto');
const resultsDiv = document.querySelector('#results');

cryptoSelect.addEventListener('change', readValue);
coinSelect.addEventListener('change', readValue);
formCrypto.addEventListener('submit', submitFormCrypto);


const objSearch = {
    coin: '',
    crypto: '',
}


/* -- Functions -- */
const getCryptos = cryptos => new Promise(resolve => {
    resolve(cryptos);
});

function checkCryptos() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    try {
        fetch(url)
            .then(response => response.json())
            .then(result => getCryptos(result.Data))
            .then(cryptos => renderCryptos(cryptos))
    } catch (error) {
        console.log(error);
        showAlertCrypto('Hubo un error al cargar la lista de criptomonedas');
    }
};

function renderCryptos(cryptos) {
    cryptos.forEach(crypto => {
        const { FullName, Name, } = crypto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        cryptoSelect.appendChild(option);
    });
};

function readValue(event) {
    objSearch[event.target.name] = event.target.value;
};

function submitFormCrypto(event) {
    event.preventDefault();

    const { coin, crypto } = objSearch;
    if (coin === '' || crypto === '') {
        showAlertCrypto('Ambos campos son requeridos');
        return;
    }

    checkAPI();
};

function checkAPI() {
    const { coin, crypto } = objSearch;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${coin}`;
    try {
        fetch(url)
            .then(response => response.json())
            .then(result => showCryptoInfo(result.DISPLAY[crypto][coin]))
    } catch (error) {
        console.log(error);
        showAlertCrypto('Hubo un error al obtener la información');
    }
};

function showCryptoInfo(cryptoInfo) {
    removeResults();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE, MARKET } = cryptoInfo;

    const price = document.createElement('p');
    price.classList.add('p-results', 'no-margin');
    price.innerHTML = `El precio es: <span class="font-weight">${PRICE}</span>`;

    const hightDay = document.createElement('p');
    hightDay.classList.add('p-results', 'no-margin');
    hightDay.innerHTML = `El precio mas alto del dia es: <span class="font-weight">${HIGHDAY}</span>`;

    const lowDay = document.createElement('p');
    lowDay.classList.add('p-results', 'no-margin');
    lowDay.innerHTML = `El precio mas bajo del dia es: <span class="font-weight">${LOWDAY}</span>`;

    const change = document.createElement('p');
    change.classList.add('p-results', 'no-margin');
    change.innerHTML = `Variación últimas 24 horas: <span class="font-weight">${CHANGEPCT24HOUR}%</span>`;

    const lastUpdate = document.createElement('p');
    lastUpdate.classList.add('p-results', 'no-margin');
    lastUpdate.innerHTML = `Última actualización: <span class="font-weight">${LASTUPDATE}</span>`;

    const market = document.createElement('p');
    market.classList.add('p-results', 'no-margin');
    market.innerHTML = `Fuente: <span class="font-weight">${MARKET}</span>`;

    resultsDiv.appendChild(price);
    resultsDiv.appendChild(hightDay);
    resultsDiv.appendChild(lowDay);
    resultsDiv.appendChild(change);
    resultsDiv.appendChild(lastUpdate);
    resultsDiv.appendChild(market);
    resultsDiv.classList.remove('display-none');
};

function showAlertCrypto(message) {
    const errorExist = document.querySelector('.error.crypto');
    if (!errorExist) {
        const error = document.createElement('p');
        error.textContent = message;
        error.classList.add('error-crypto', 'no-margin');
        formCrypto.appendChild(error);

        setTimeout(() => {
            error.remove();
        }, 4000);
    }
};

function removeResults() {
    while (resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }
};