document.addEventListener('DOMContentLoaded', function () {
    console.log('run');
    getConversation();
    addListeners();
    setInterval(getConversation, 5000)
});

function addListeners() {
    const chatSubmitButton = document.querySelector('#chat-submit');
    const chatInput = document.querySelector('#chat-input');
    chatSubmitButton.addEventListener('click', function () {
        console.log(chatInput.value);
        sendChat(chatInput.value);
    })
}

function getConversation() {
    const urlParams = new URLSearchParams(window.location.search);
    const validId = urlParams.get('validId');
    const myValidId = urlParams.get('myValidId');
    const title = document.querySelector('h3');
    title.style.textTransform = 'capitalize';
    title.innerHTML = `<span class="my-name">${myValidId}</span> : <span class="your-name">${validId}</span> `;
    fetch('api-get-conversation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            validId,
            myValidId,
        }),
    }).then(res => res.json()).then( res=> {
        console.log('chat', res, res.success);
        if (res.success) {
            const chatUl = document.querySelector('#chat-ul');
            if (!res.chats.length) {
                chatUl.innerHTML = `<li>No Chats</li>`
            } else {
                chatUl.innerHTML = ``
            }
            res.chats.forEach( chat => {
                const chatLi = document.createElement('li');
                const chatBubble = document.createElement('div');
                chatBubble.classList.add('chat-bubble');
                chatBubble.innerHTML = `${chat.message}`;
                chatLi.appendChild(chatBubble);
                chatUl.prepend(chatLi);
                if (chat.sender.username === myValidId) {
                    chatBubble.classList.add('my-chat')
                } else {
                    chatBubble.classList.add('your-chat')
                }

            })
        }
    });
}


function sendChat(message) {
    const urlParams = new URLSearchParams(window.location.search);
    const validId = urlParams.get('validId');
    const myValidId = urlParams.get('myValidId');
    fetch('api-add-chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            validId,
            myValidId,
            message,
        }),
    }).then(res => res.json()).then( res=> {
        const chatInput = document.querySelector('#chat-input');
        chatInput.value = '';
        getConversation();
    });
}
