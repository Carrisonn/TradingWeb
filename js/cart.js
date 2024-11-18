const cart = document.querySelector('#cart');
const containerCart = document.querySelector('#cart-list tbody');
const emptyCartBtn = document.querySelector('#empty-cart');
const listCourses = document.querySelector('#list-courses');
let cartItems = [];


loadEventListeners();
function loadEventListeners() {
    listCourses.addEventListener('click', addCourse);

    cart.addEventListener('click', deleteCourse);

    emptyCartBtn.addEventListener('click', () => {
        cartItems = [];

        cleanHTML();
    })
}

function addCourse(event) {
    if(event.target.classList.contains('add-cart')) {
        const courseSelected = event.target.parentElement;
        
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Añadido al carrito",
            showConfirmButton: false,
            timer: 2000,
            background: '#bbbbbb',
            color: '#000000',
            iconColor: '#02a502'
        });
        
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

        cartItems = cartItems.filter( course => course.id !== courseID)
        infoCourseToHTML();
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
    })
};

function cleanHTML() {
    while(containerCart.firstChild) {
        containerCart.removeChild(containerCart.firstChild)
    }
};