

document.addEventListener('DOMContentLoaded', function () {
    console.log('run');

    const inputName = document.querySelector('#name');
    const inputEmail = document.querySelector('#email');
    const inputAbout = document.querySelector('#about');
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
        inputName.value = res.user.name || '';
        inputEmail.value = res.user.email || '';
        inputAbout.value = res.user.about || '';
    });
});
