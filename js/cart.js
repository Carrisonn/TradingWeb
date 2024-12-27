/* -- Globals -- */
const cart = document.querySelector('#cart');
const containerCart = document.querySelector('#cart-list tbody');
const buttonCartDiv = document.querySelector('#button-cart-div');
const emptyCartBtn = document.querySelector('#empty-cart');
const listCourses = document.querySelector('#list-courses');
let cartItems = [];


listCourses.addEventListener('click', addCourse);
cart.addEventListener('click', deleteCourse);
emptyCartBtn.addEventListener('click', emptyCart);


/* -- Functions -- */
function addCourse(event) {
    if(event.target.classList.contains('add-cart')) {
        const courseSelected = event.target.parentElement;
        
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Añadido al carrito",
            showConfirmButton: false,
            timer: 1500,
            background: '#bbbbbb',
            color: '#000000',
            iconColor: '#02a502'
        })
        
        readDataCourses(courseSelected);
    }
};

function readDataCourses(courseSelected) {
    
    const infoCourse = {
        title: courseSelected.querySelector('#card-title').textContent,
        price: courseSelected.querySelector('.price-div span').textContent,
        id: courseSelected.querySelector('button').getAttribute('data-id'),
        quantity: 1
    }

    const exist = cartItems.some( courseSelected => courseSelected.id === infoCourse.id);
    if(exist) {
        const courses = cartItems.map( course => {
            if(course.id === infoCourse.id) {
                course.quantity++;
                return course;
            } else {
                return course;
            }
        })
        cartItems = [...courses];
        
    } else {
        cartItems = [...cartItems, infoCourse];
    }

    infoCourseToHTML();
};

function deleteCourse(event) {
    if(event.target.classList.contains('button-cart-delete')) {
        const courseID = event.target.getAttribute('data-id');

        Swal.fire({
            title: "¿Estás seguro de que quieres eliminar este artículo?",
            icon: "warning",
            showCancelButton: true,
            iconColor: "#ff902f",
            confirmButtonColor: "#00a3cc",
            cancelButtonColor: "#af0b0b",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
            background: '#bbbbbb',
            color: '#000000',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Articulo eliminado correctamente",
                    icon: "success",
                    background: '#bbbbbb',
                    iconColor: '#02a502',
                    color: '#000000',
                    confirmButtonColor: "#00a3cc",
                    confirmButtonText: "Genial",
                    allowOutsideClick: false
                });
                
                cartItems = cartItems.filter( course => course.id !== courseID);
                infoCourseToHTML();
                buttonPay();
            }
        })
    }
};

function emptyCart() {
    if(cartItems.length > 0) {
        Swal.fire({
            title: "¿Estás seguro de que quieres vaciar el carrito?",
            icon: "warning",
            showCancelButton: true,
            iconColor: "#ff902f",
            confirmButtonColor: "#00a3cc",
            cancelButtonColor: "#af0b0b",
            confirmButtonText: "Si, vaciar",
            cancelButtonText: "Cancelar",
            background: '#bbbbbb',
            color: '#000000',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Has vaciado el carrito",
                    icon: "success",
                    background: '#bbbbbb',
                    iconColor: '#02a502',
                    color: '#000000',
                    confirmButtonColor: "#00a3cc",
                    confirmButtonText: "Genial",
                    allowOutsideClick: false
                });
                
                cartItems = [];
                buttonPay();
                infoCourseToHTML();
            }
        })
    }
};

function infoCourseToHTML() {

    cleanHTML();

    cartItems.forEach( course => {
        const { title, price, quantity, id } = course;

        const trow = document.createElement('tr');
        trow.innerHTML = `
        <td>${title}</td>
        <td>${price}</td>
        <td>${quantity}</td>
        <td><button class="button-cart-delete" data-id="${id}"> X </button></td>
        `;

        containerCart.appendChild(trow);
    });
    buttonPay();
};

function buttonPay() {
    const existingButtonPay = document.querySelector('.button-cart-pay');
    
    if (cartItems.length >= 1) {
        if (!existingButtonPay) {
            const buttonPay = document.createElement('button');
            buttonPay.classList.add('button-cart-pay');
            buttonPay.textContent = 'Pagar';
            buttonPay.onclick =  tokenToStorage;
            
            buttonCartDiv.appendChild(buttonPay);
        }
    } else {
        if (existingButtonPay) {
            existingButtonPay.remove();
        }
    }
};

function tokenToStorage() {
    const token = new Date().getTime();

    localStorage.setItem('paymentToken', token);

    window.location.href = 'payment.html';
};

function cleanHTML() {
    while(containerCart.firstChild) {
        containerCart.removeChild(containerCart.firstChild)
    }
};