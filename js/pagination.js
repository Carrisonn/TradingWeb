let step = 1
const step1 = 1;
const step3 = 3;
const backButton = document.querySelector('#back-button');
const nextButton = document.querySelector('#next-button');
const opinionStep1 = document.querySelector('#step-1');
const opinionStep2 = document.querySelector('#step-2');
const opinionStep3 = document.querySelector('#step-3');

nextButton.addEventListener('click', nextSection);

function nextSection() {
    if(step <= 1) {
        opinionStep1.classList.remove('display-block')
        opinionStep1.classList.add('display-none')

        opinionStep2.classList.add('display-block')

        backButton.classList.remove('visibility')
        step++
    }
    
}
