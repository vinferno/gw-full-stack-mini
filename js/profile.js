document.addEventListener('DOMContentLoaded', function () {
    console.log('run');
    const myUser = window.localStorage.getItem('myUser');
    const elementEditLink = document.querySelector('#edit');
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
    elementEditLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = window.location.origin + '/edit-profile?validId=' + validId;
    });
    fetch('api-get-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            validId,
        }),
    }).then(res => res.json()).then(res => {
        elementEmail.innerText = res.user.email;
        elementUsername.innerText = res.user.username;

        if (myUser && JSON.parse(myUser).email === res.user.email) {
            document.querySelector('#chat-li').style.display = 'none';
            document.querySelector('#add-friend-li').style.display = 'none';

        } else if (myUser && JSON.parse(myUser).email) {
            document.querySelector('#edit').style.display = 'none';
            document.querySelector('#add-friend-li').addEventListener('click', function () {
                addFriend(JSON.parse(myUser).email, res.user.email);
            });
            document.querySelector('#chat-li').addEventListener('click', function () {
                gotoChat(JSON.parse(myUser).username, res.user.username);
            });
        }
        document.querySelector('#friends-li').addEventListener('click', function (e) {
            console.log('friends clicked');
            window.location.href = window.location.origin + '/users?validId=' + validId;
        });

        findIsFriend(res.user._id, JSON.parse(myUser).email);

    });


});

function findIsFriend(validId, myValidId) {
    fetch('api-get-isFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            validId,
            myValidId,
        }),
    }).then(res => res.json()).then(res => {
        console.log('res', res)
        if (res.isFriends) {
            disableAddFriend();
        }

    });
}

function addFriend(myValidId, friendValidId) {
    fetch('api-add-friend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            friendValidId,
            myValidId,
        }),
    }).then(res => res.json()).then(res => {
        if (res.success) {
            disableAddFriend();
        }
    });
}


function disableAddFriend() {
    const addFriendLi = document.querySelector('#add-friend-li');
    addFriendLi.style.pointerEvents = 'none';
    addFriendLi.classList.add('disabled')
}

function gotoChat(myValidId, validId) {
    window.location.href = window.location.origin + '/chat?myValidId=' + myValidId + '&validId=' + validId;
}
