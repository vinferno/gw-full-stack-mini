

document.addEventListener('DOMContentLoaded', function () {
    console.log('run');
    const elementUsername = document.querySelector('h1');
    const elementName = document.querySelector('.name');
    const elementEmail = document.querySelector('.email');
    const elementInfo = document.querySelector('.info');
    elementUsername.innerText = 'JS username';
    elementInfo.innerHTML = 'JS Info';
    elementName.innerHTML = 'JS Name';
    elementEmail.innerText = 'JS Email';

    const urlParams = new URLSearchParams(window.location.search);
    const validId = urlParams.get('validId');
    fetch('api-get-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            validId,
        }),
    }).then( res => res.json()).then( res => {
           console.log(res);
           elementEmail.innerText = res.user.email;
           elementUsername.innerText = res.user.username;
        });
});
