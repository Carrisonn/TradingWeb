/* -- Globals -- */
import { darkMode } from "./helper-func.js";
import { showAlert } from "./helper-func.js";
import { cleanAlert } from "./helper-func.js";


window.addEventListener('load', () => {
    isAuth();
    showCartItems();
    darkMode();
    form.reset();
    checkPaymentInfo();
});


const userCoursesList = document.querySelector('#user-courses-list');
const inputName =  document.querySelector('#name');
const inputEmail = document.querySelector('#email');
const inputCreditCard = document.querySelector('#credit-card');
const inputCVV = document.querySelector('#cvv');
const inputExpirationDate = document.querySelector('#expiration-date');
const inputTerms = document.querySelector('#terms');
const btnPaymentCancel = document.querySelector('#btn-payment-cancel');
const btnSubmit = document.querySelector('#btn-submit');
const divSpinner = document.querySelector('#div-spinner');
const form = document.querySelector('#form');

inputName.addEventListener('blur', validate);
inputEmail.addEventListener('blur', validate);
inputCreditCard.addEventListener('blur', validate);
inputCVV.addEventListener('blur', validate);
inputExpirationDate.addEventListener('blur', validate);
inputTerms.addEventListener('click', validate);
btnPaymentCancel.addEventListener('click', paymentCancel);
form.addEventListener('submit', submitForm);


const actualDate = new Date();
const actualMonth = actualDate.getMonth() + 1;
const actualYear = actualDate.getFullYear();


const paymentObj = {
    name: '',
    email: '',
    creditCard: '',
    cvv: '',
    expirationDate: '',
    terms: false
};


/* -- Functions -- */
function isAuth() {
    const tokenExist = localStorage.getItem('paymentToken');
    tokenExist === null ? window.location.href = 'index.html' : null;
};

function showCartItems() {
    const cartItemsFromStorage = JSON.parse(localStorage.getItem('cartItems'));
    let totalPrice = 0;
    
    cartItemsFromStorage.forEach( course => {
        const { title, quantity, price } = course;

        const titleCourse = document.createElement('p');
        titleCourse.classList.add('p-results', 'no-margin');
        titleCourse.innerHTML = `Curso: <span class="font-weight">${title}</span>`;

        const priceToNumber = Number(price.slice(1));
        totalPrice += priceToNumber * quantity;
        const priceCourse = document.createElement('p');
        priceCourse.classList.add('p-results', 'no-margin');
        priceCourse.innerHTML = `Precio por curso: <span class="font-weight">${price}</span>`;

        const quantityCourse = document.createElement('p');
        quantityCourse.classList.add('p-results', 'no-margin');
        quantityCourse.innerHTML = `Cantidad: <span class="font-weight">${quantity}</span>`;

        userCoursesList.appendChild(titleCourse);
        userCoursesList.appendChild(priceCourse);
        userCoursesList.appendChild(quantityCourse);

        if(cartItemsFromStorage.length >= 1) {
            const hr = document.createElement('hr');
            userCoursesList.appendChild(hr);
        }
    });
    const totalPriceResum = document.createElement('p');
    totalPriceResum.classList.add('p-results', 'no-margin');
    totalPriceResum.innerHTML = `Total a pagar: <span class="font-weight">$${totalPrice}</span>`;
    userCoursesList.appendChild(totalPriceResum);
};

function validate(event) {
    if(event.target.value.trim() === '') {
        showAlert('Este campo no puede ir vacío', event.target.parentElement);
        checkPaymentInfo();
        return;
    }

    if(event.target.id === 'name' && !validateName(event.target.value)) {
        showAlert('Nombre no válido', event.target.parentElement);
        paymentObj[event.target.name] = '';
        event.target.value = '';
        checkPaymentInfo();
        return;
    } else {
        paymentObj[event.target.name] = event.target.value.trim().toLowerCase();
    }

    if(event.target.id === 'email' && !validateEmail(event.target.value)) {
        showAlert('Email no válido', event.target.parentElement)
        paymentObj[event.target.name] = '';
        event.target.value = '';
        checkPaymentInfo();
        return;
    } else {
        paymentObj[event.target.name] = event.target.value.trim().toLowerCase();
    }

    if(event.target.id === 'credit-card' && !validateCreditCard(event.target.value)) {
        showAlert('Tarjeta no válida', event.target.parentElement)
        paymentObj[event.target.name] = '';
        event.target.value = '';
        checkPaymentInfo();
        return;
    } else {
        paymentObj[event.target.name] = event.target.value.trim().toLowerCase();
    }

    if(event.target.id === 'cvv' && !validateCVV(event.target.value)) {
        showAlert('CVV no válido', event.target.parentElement)
        paymentObj[event.target.name] = '';
        event.target.value = '';
        checkPaymentInfo();
        return;
    } else {
        paymentObj[event.target.name] = event.target.value.trim().toLowerCase();
    }

    if(event.target.id === 'expiration-date') {
        validateExpirationDate(event);
    }

    if(event.target.id === 'terms' ) {
        validateTerms(event);
    } 

    checkPaymentInfo();
};

function validateName(name) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]{1,40}$/;
    const result = regex.test(name);
    return result;
};

function validateEmail(email) {
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    const result = regex.test(email);
    return result;
};

function validateCreditCard(card) {
    const cardsRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/; // Visa, Mastercard, American Express, Diners Club, Discover, JCB
    const cleanCard = card.replace(/\s|-/g, '');
    const result = cardsRegex.test(cleanCard);
    return result;
};

function validateCVV(cvv) {
    const regexCVV = /^\d{3,4}$/;
    const result = regexCVV.test(cvv);
    return result;
};

function validateExpirationDate(event) {
    const onlyDigits = event.target.value.replace(/[^0-9]/g, '');

    if(onlyDigits) {
        const formatedValue = onlyDigits.match(/.{1,4}/g).join('/');
        event.target.value = formatedValue;
    } else {
        showAlert('Debes introducir únicamente números', event.target.parentElement);
        paymentObj[event.target.name] = '';
        event.target.value = '';
        checkPaymentInfo();
        return;
    } 

    if(event.target.value.length === 7) {
        if(event.target.value < `${actualYear}/${actualMonth}`) {
            showAlert('La fecha de expiración no puede ser anterior a la fecha actual', event.target.parentElement);
            paymentObj[event.target.name] = '';
            event.target.value = '';
            checkPaymentInfo();
            return;
        } else if(onlyDigits.slice(0, 4) > actualYear + 20 || onlyDigits.slice(4, 6) > 12) {
            showAlert('Fecha de expiración no válida', event.target.parentElement);
            paymentObj[event.target.name] = '';
            event.target.value = '';
            checkPaymentInfo();
            return;
        }
    } else if(event.target.value.length <= 6) {
        showAlert('Debes introducir únicamente números', event.target.parentElement);
        paymentObj[event.target.name] = '';
        event.target.value = '';
        checkPaymentInfo();
        return;
    }
    paymentObj[event.target.name] = event.target.value.trim().toLowerCase();
    checkPaymentInfo();
};

function validateTerms(event) {
    if(event.target.checked === false) { 
        showAlert('Debes aceptar los términos y condiciones para poder continuar', event.target.parentElement.parentElement);
        paymentObj[event.target.name] = false;
        event.target.checked = false;
        checkPaymentInfo();
        return;
    }
    paymentObj[event.target.name] = event.target.checked;
    checkPaymentInfo();
};

function checkPaymentInfo() {
    const allRequiredFilled = Object.keys(paymentObj).every(key => paymentObj[key] !== '' && paymentObj[key] !== false);

    if(allRequiredFilled) {
        btnSubmit.classList.remove('disabled');
        btnSubmit.disabled = false;
    } else {
        btnSubmit.classList.add('disabled');
        btnSubmit.disabled = true;
    }
};

function submitForm(event) {
    event.preventDefault();

    divSpinner.classList.remove('hide-spinner');

    setTimeout(() => {
        divSpinner.classList.add('hide-spinner');

        Swal.fire({
            title: "Transacción realizada con éxito",
            text: "En breve recibirás un correo con instrucciones",
            icon: "success",
            confirmButtonText: "Genial!",
            background: '#bbbbbb',
            color: '#000000',
            iconColor: '#02a502',
            allowOutsideClick: false
        }).then( result => {
            if(result.isConfirmed) {
                localStorage.removeItem('cartItems');
                localStorage.removeItem('paymentToken');
                
                paymentObj.name = ''
                paymentObj.email = ''
                paymentObj.creditCard = ''
                paymentObj.cvv = ''
                paymentObj.expirationDate = ''
                paymentObj.terms = false

                window.location.href = 'index.html';
            }
        })
    }, 2000);
};

function paymentCancel(event) {
    event.preventDefault();

    Swal.fire({
        title: "¿Estás seguro de que quieres cancelar la transacción?",
        text: "Tus cursos se borrarán del carrito",
        icon: "warning",
        showCancelButton: true,
        iconColor: "#ff902f",
        confirmButtonColor: "#00a3cc",
        cancelButtonColor: "#af0b0b",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "Atrás",
        background: '#bbbbbb',
        color: '#000000',
        allowOutsideClick: false
    }).then( result => {
        if(result.isConfirmed) {
            window.location.href = 'index.html';
        }
    })
};