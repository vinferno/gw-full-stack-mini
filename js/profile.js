

document.addEventListener('DOMContentLoaded', function () {
    console.log('run');
    const elementUsername = document.querySelector('h1');
    const elementName = document.querySelector('.name');
    const elementEmail = document.querySelector('.email');
    const elementInfo = document.querySelector('.info');
    elementUsername.innerText = 'JS username';
    elementInfo.innerHTML = 'JS Info';
    elementName.innerHTML = 'JS Name';
    elementEmail.innerText = 'JS Email'
});
