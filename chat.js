const messageContainer = document.querySelector(".chat-messages");
const messageInput = document.querySelector(".chat-input input[type='text']");
const messageForm = document.querySelector(".chat-input form");
const audioButton = document.querySelector(".audio-button");
const audioRecorder = document.querySelector(".audio-recorder");
const audioProgress = document.querySelector(".audio-progress");
const imageInput = document.getElementById("image-input");

let mediaRecorder;
let chunks = [];

// Display message in chat window
function displayMessage(message) {
  const div = document.createElement("div");
  div.classList.add("chat-message");
  div.innerHTML = `
    <p>${message.content}</p>
  `;
  if (message.type === "image") {
    const img = document.createElement("img");
    img.src = message.content;
    img.classList.add("chat-message-image");
    div.appendChild(img);
  } else if (message.type === "audio") {
    const audio = document.createElement("audio");
    audio.src = message.content;
    audio.controls = true;
    audio.classList.add("chat-message-audio");
    div.appendChild(audio);
  }
  messageContainer.appendChild(div);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Handle form submission
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = {
    content: messageInput.value,
    type: "text",
  };
  displayMessage(message);
  messageInput.value = "";
});

// Record audio
audioButton.addEventListener("click", async () => {
  audioProgress.classList.remove("hidden");
  audioButton.disabled = true;
  audioRecorder.innerHTML = "Recording...";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    mediaRecorder.addEventListener("dataavailable", (e) => {
      chunks.push(e.data);
    });
    mediaRecorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      chunks = [];
      const audioUrl = URL.createObjectURL(blob);
      const message = {
        content: audioUrl,
        type: "audio",
      };
      displayMessage(message);
    });
    setTimeout(() => {
      mediaRecorder.stop();
      audioButton.disabled = false;
      audioRecorder.innerHTML = "";
      audioProgress.classList.add("hidden");
    }, 10000);
  } catch (error) {
    console.error(error);
  }
});

// Upload image
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
      const message = {
        content: reader.result,
        type: "image",
      };
      displayMessage(message);
    });
  }
});
