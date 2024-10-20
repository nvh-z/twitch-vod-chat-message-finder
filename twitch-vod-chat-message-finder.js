const targetUsername = 'STREAMER';
const targetMessagePart = 'MESSAGE';

function playVideo() {
    const playButton = document.querySelector('button[aria-label="Play"]');
    if (playButton) {
        playButton.click();
        console.log('VOD started');
    } else {
        console.log('VOD already playing');
    }
}

// set the last message
let lastMessage = '';

// will skip ahead when new chat windows are loading after skipping
function skipAheadWhenChatLoaded() {
    const videoPlayer = document.querySelector('video');
    const chatMessages = document.querySelectorAll('.seventv-chat-vod-message-patched');
    if (chatMessages.length > 0) {
        const currentLastMessage = chatMessages[chatMessages.length - 1].innerText;

        if (currentLastMessage !== lastMessage && videoPlayer) {
            lastMessage = currentLastMessage;
            videoPlayer.currentTime += 10; // don't up it will crash
            console.log('Skipped ahead');
        }
    }
}

// while skipping this will search for the message you want
function searchForMessage() {
    const chatMessages = Array.from(document.querySelectorAll('.seventv-chat-vod-message-patched'));
    const foundMessage = chatMessages.find(item => {
        const messageText = item.innerText.toLowerCase();
        return messageText.includes(targetMessagePart.toLowerCase()) && messageText.includes(targetUsername.toLowerCase());
    });

    if (foundMessage) {
        console.log("Message found:", foundMessage);
        clearInterval(skipInterval);
        clearInterval(searchInterval);
        foundMessage.scrollIntoView(); // not sure if this does anything
        const timestampElement = foundMessage.querySelector('.seventv-chat-vod-message-timestamp');
        const timestamp = timestampElement ? timestampElement.innerText : 'Timestamp not found';
        console.log("Message timestamp: " + timestamp);
        const videoPlayer = document.querySelector('video');
        if (videoPlayer) videoPlayer.pause();
        console.info("Message found, video paused.");
    }
}

// can be a bit laggy but works better because only skips when new chats are loaded in the dom
playVideo();
const searchInterval = setInterval(searchForMessage, 250);
const skipInterval = setInterval(skipAheadWhenChatLoaded, 250);