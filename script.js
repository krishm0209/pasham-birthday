// Typing Effect for the Welcome Message
document.addEventListener("DOMContentLoaded", function () {
    const typingText = document.getElementById("typing-text");
    const text = typingText.innerText;
    typingText.innerText = ""; // Clear text for animation
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typingText.innerText += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();
});

// Countdown Timer for Midnight
const countdownElement = document.getElementById("countdown");
const birthdayDate = new Date();
birthdayDate.setHours(0, 0, 0, 0);
birthdayDate.setDate(birthdayDate.getDate() + 1); // Midnight of the birthday

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = birthdayDate - now;

    if (timeLeft < 0) {
        countdownElement.innerText = "🎉 Happy Birthday, Pasham! 🎉";
        clearInterval(countdownInterval);
        return;
    }

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    countdownElement.innerText = `${hours}h ${minutes}m ${seconds}s`;
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Run initially

// Slideshow with 5 Images
let slideIndex = 0;

function showSlides() {
    const slides = document.querySelectorAll(".slideshow img");
    if (slides.length === 0) return; // Ensure images exist

    slides.forEach(slide => slide.style.display = "none");
    
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].style.display = "block";

    setTimeout(showSlides, 3000); // Change image every 3 seconds
}

document.addEventListener("DOMContentLoaded", showSlides);

// Play Music
const music = new Audio("music/happy_birthday.mp3");
const musicButton = document.getElementById("playMusic");

musicButton.addEventListener("click", function () {
    if (music.paused) {
        music.play();
        musicButton.innerText = "Pause Music";
    } else {
        music.pause();
        musicButton.innerText = "Play Music";
    }
});

// Firebase database reference
const database = firebase.database();
const messagesRef = database.ref('birthdayMessages');

// Submit message to Firebase
document.getElementById("submitMessage").addEventListener("click", function () {
    const guestName = document.getElementById("guestName").value.trim();
    const guestMessage = document.getElementById("guestMessage").value.trim();

    if (guestName === "" || guestMessage === "") {
        alert("Please enter both your name and message.");
        return;
    }

    // Push new message to Firebase
    messagesRef.push({
        name: guestName,
        message: guestMessage,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    // Clear input fields
    document.getElementById("guestName").value = "";
    document.getElementById("guestMessage").value = "";
});

// Listen for new messages and display them in real-time
messagesRef.on('child_added', function(snapshot) {
    const messageData = snapshot.val();
    displayMessage(messageData, snapshot.key);
});

// Display a message in the guestbook
function displayMessage(messageData, key) {
    const messageList = document.getElementById("messageList");
    
    // Create message element
    const messageItem = document.createElement("div");
    messageItem.className = "message-item";
    messageItem.id = key;
    
    // Format the timestamp
    const date = new Date(messageData.timestamp);
    const formattedDate = date.toLocaleString();
    
    // Add message content
    messageItem.innerHTML = `
        <p><strong>${messageData.name}:</strong> ${messageData.message}</p>
        <small class="timestamp">${formattedDate}</small>
    `;
    
    // Add to the list - newer messages at the top
    messageList.insertBefore(messageItem, messageList.firstChild);
}
