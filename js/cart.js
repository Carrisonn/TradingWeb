const cart = document.querySelector('#cart');
const containerCart = document.querySelector('#cart-list tbody');
const emptyCartBtn = document.querySelector('#empty-cart');
const listCourses = document.querySelector('#list-courses');
let cartItems = [];


loadEventListeners();
function loadEventListeners() {
    listCourses.addEventListener('click', addCourse);
}

function addCourse(event) {
    if(event.target.classList.contains('add-cart')) {
        const courseSelected = event.target.parentElement;
        
        readDataCourses(courseSelected);
    }
    
}

function readDataCourses(courseSelected) {
    
    const infoCourse = {
        title: courseSelected.querySelector('#card-title').textContent,
        price: courseSelected.querySelector('.price-div span').textContent,
        id: courseSelected.querySelector('button').getAttribute('data-id'),
        quantity: 1
    }

    cartItems = [...cartItems, infoCourse];

    infoCourseToHTML();
}

function infoCourseToHTML() {

    cleanHTML();

    cartItems.forEach( course => {
        const trow = document.createElement('tr');
        trow.innerHTML = `
        <td>
            ${course.title}
        </td>
        `;

        containerCart.appendChild(trow);
    })
}

function cleanHTML() {
    while(containerCart.firstChild) {
        containerCart.removeChild(containerCart.firstChild)
    }
}