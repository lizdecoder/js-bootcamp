const fullName = document.querySelector('#name');
const submitForm = document.querySelector('#submit-form');
const veggieSelector = document.querySelector('#vegSelector');

fullName.addEventListener("input", (e) => {
    console.log("my keypresses", e)
    console.log(e.target.value)
})

veggieSelector.addEventListener("change", (e) => {
    console.log("selected", e)
    console.log(e.target.value)
})

submitForm.addEventListener("submit", (e) => {
    e.preventDefault()
    alert("submitted")
})