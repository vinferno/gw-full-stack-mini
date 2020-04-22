document.addEventListener('DOMContentLoaded', function () {

    const elementLogin = document.querySelector('#login');
    const elementSignUp = document.querySelector('#sign-up');

    const elementsLoginInputs = elementLogin.querySelectorAll('input');
    const elementsSignUpInputs = elementSignUp.querySelectorAll('input');

    const elementLoginButton = elementLogin.querySelector('button');
    const elementSignUpButton = elementSignUp.querySelector('button');

    elementLoginButton.addEventListener('click', function (event) {
        event.preventDefault();
        const userId = elementsLoginInputs[0].value;
        const password = elementsLoginInputs[1].value;
        if (!userId || !password) {
            alert('userId/email and password required to login');
            return;
        }

        fetch('api-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userId,
                password,
            }),
        })
            .then(res => res.json())
            .then(response => {
                console.log('response', response);
                if (response.success) {
                    window.location.href = window.location.origin + '/profile?validId=' + response.user.username;
                    window.localStorage.setItem('myUser', JSON.stringify(response.user));
                } else if(response.message) {
                    alert(response.message);
                }
            });
    });
    elementSignUpButton.addEventListener('click', function () {
        console.log(elementsSignUpInputs);
        const email = elementsSignUpInputs[0].value;
        const username = elementsSignUpInputs[1].value;
        const password = elementsSignUpInputs[2].value;
        const confirm = elementsSignUpInputs[3].value;
        if (!username || !password || !email || !confirm) {
            alert('You need a valid email, username and password + password confirmation to sign up.');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            alert('Please enter a valid email');
            return;
        }
        if ( password !== confirm) {
            alert('Please ensure passwords match');
        }

        fetch('api-sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                email,
            }),
        })
            .then( res => res.json())
            .then(response => {
                console.log('res', response);
                if (response.success) {
                    window.location.href = window.location.origin + '/profile?validId=' + response.user.username;
                    window.localStorage.setItem('myUser', JSON.stringify(response.user));
                } else if(response.message) {
                    alert(response.message);
                }
            });
    });
});

