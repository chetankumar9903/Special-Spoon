const wrapper =document.querySelector('.wrapper');
const registerlink =document.querySelector('.register-link');
const loginlink =document.querySelector('.login-link');

registerlink.onclick=()=>{
    wrapper.classList.add('active');
}
loginlink.onclick=()=>{
    wrapper.classList.remove('active');
}

// document.addEventListener("DOMContentLoaded", () => {
//     const wrapper = document.querySelector('.wrapper');
//     const registerlink = document.querySelector('.register-link');

//     registerlink.addEventListener('click', () => {
//         wrapper.classList.add('active');
//     });
// });

// document.addEventListener("DOMContentLoaded", () => {
//     const wrapper = document.querySelector('.wrapper');
//     const loginlink = document.querySelector('.login-link');

//     loginlink.addEventListener('click', () => {
//         wrapper.classList.remove('active');
//     });
// });
