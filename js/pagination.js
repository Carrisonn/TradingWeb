/* -- Globals -- */

import { darkMode } from "./helper-func.js";

let currentStep = 1;
const totalSteps = 3;

const backButton = document.querySelector('#back-button');
const nextButton = document.querySelector('#next-button');

backButton.addEventListener('click', () => {
    if(currentStep > 1) {
        currentStep--;
        updateOpinions()
        visibilityButtons()
    }
});

nextButton.addEventListener('click', () => {
    if(currentStep < totalSteps) {
        currentStep++;
        updateOpinions()
        visibilityButtons()
    }
});

window.addEventListener('load', () => {
    darkMode();
    visibilityButtons();
    localStorage.removeItem('cartItems');
    localStorage.removeItem('paymentToken');
})



/* -- Functions -- */
function updateOpinions() {
    for( let i = 1; i <= totalSteps; i++ ) {
        const opinionDiv = document.querySelector(`#step-${i}`)
        
        if(i === currentStep) {
            opinionDiv.classList.add('display-block')
            opinionDiv.classList.remove('display-none')
        } else {
            opinionDiv.classList.add('display-none')
            opinionDiv.classList.remove('display-block')
        }
    }
};

function visibilityButtons() {
    if(currentStep === 1) {
        backButton.classList.add('visibility');
    } else if(currentStep === totalSteps) {
        nextButton.classList.add('visibility');
    } else {
        backButton.classList.remove('visibility');
        nextButton.classList.remove('visibility');
    }
};
