
document.addEventListener('DOMContentLoaded', function () {
    console.log('run');
    const urlParams = new URLSearchParams(window.location.search);
    const validId = urlParams.get('validId');

    if(validId) {
        getFriends(validId);
        document.querySelector('.title h1').innerHTML = `<span class="high-light"> ${validId}</span>'s Friends List`;
    } else {
        getUsers();
    }
});

function getUsers() {
    fetch('api-get-users', {
        method: 'GET',
    }).then( res => res.json()).then( res => {
        console.log(res);
        const usersUl = document.querySelector('#users-ul');
        usersUl.innerHTML = '';
        res.users.forEach( user => {
            const li = document.createElement('li');
            li.innerHTML = `    <li class="user-card">
                <span class="username">${user.username}</span>
                <span class="status">${user.email}</span>
            </li>`;
            usersUl.appendChild(li);
            li.addEventListener('click', function () {
                window.location.href = window.location.origin + '/profile?validId=' + user.username;
            })
        });
    });
}

function getFriends(validId) {
    console.log('get friends', validId);
    fetch('api-get-friends', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            validId,
        })
    }).then( res => res.json()).then( res => {
        console.log(res);
        const usersUl = document.querySelector('#users-ul');
        usersUl.innerHTML = res.users.length ? '' : 'No Friends? Make Friends!';
        res.users.forEach( user => {
            const li = document.createElement('li');
            li.innerHTML = `    <li class="user-card">
                <span class="username">${user.username}</span>
                <span class="status">${user.email}</span>
            </li>`;
            usersUl.appendChild(li);
            li.addEventListener('click', function () {
                window.location.href = window.location.origin + '/profile?validId=' + user.username;
            })
        });
    });
}
