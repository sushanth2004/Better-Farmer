const messageForm = document.getElementById('message-form');
const messagesDiv = document.getElementById('messages');
const recordButton = document.getElementById('record-button');
const audioPlayer = document.getElementById('audio-player');

let mediaRecorder;
let chunks = [];

recordButton.addEventListener('click', () => {
  if (!mediaRecorder) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.addEventListener('dataavailable', e => {
          chunks.push(e.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(chunks);
          const audioUrl = URL.createObjectURL(audioBlob);

          audioPlayer.src = audioUrl;
          audioPlayer.controls = true;

          chunks = [];
        });

        recordButton.textContent = 'Stop Recording';
        mediaRecorder.start();
      })
      .catch(error => {
console.error(error);
});
} else {
recordButton.textContent = 'Record Audio';
mediaRecorder.stop();
}
});

messageForm.addEventListener('submit', event => {
event.preventDefault();

const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');
const imageInput = document.getElementById('image');

const message = {
name: nameInput.value,
message: messageInput.value,
timestamp: new Date().toISOString()
};

if (imageInput.files.length > 0) {
const reader = new FileReader();
reader.addEventListener('load', () => {
  message.image = reader.result;
  sendMessage(message);
});

reader.readAsDataURL(imageInput.files[0]);
} else {
sendMessage(message);
}

nameInput.value = '';
messageInput.value = '';
imageInput.value = '';
});

function sendMessage(message) {
const messageDiv = document.createElement('div');
const nameSpan = document.createElement('span');
const timestampSpan = document.createElement('span');
const messageParagraph = document.createElement('p');

messageDiv.appendChild(nameSpan);
messageDiv.appendChild(timestampSpan);
messageDiv.appendChild(messageParagraph);

if (message.image) {
const image = document.createElement('img');
image.src = message.image;
messageDiv.appendChild(image);
}

nameSpan.textContent = message.name + ': ';
timestampSpan.textContent = message.timestamp;
messageParagraph.textContent = message.message;

messagesDiv.appendChild(messageDiv);
}
