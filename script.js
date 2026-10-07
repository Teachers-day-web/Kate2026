function openLetter() {

    // Find the envelope
    var envelope = document.getElementById("envelope");

    // Add the "open" class
    envelope.classList.add("open");

}


function openLetter() {

    // Find the envelope
    var envelope = document.getElementById("envelope");

    // Open the envelope
    envelope.classList.add("open");

    // Wait for the animation
    setTimeout(function() {

        // Hide Scene 1
        document.querySelector(".container").style.display = "none";

        // Show Scene 2
        document.getElementById("scene2").style.display = "flex";

    }, 2000);
}


function nextScene() {

    alert("Scene 3 coming next!");

}


function nextScene() {

    // Hide Scene 2
    document.getElementById("scene2").style.display = "none";

    // Show Scene 3
    document.getElementById("scene3").style.display = "flex";

}


function nextToScene4() {

    // Hide Scene 3
    document.getElementById("scene3").style.display = "none";

    // Show Scene 4
    document.getElementById("scene4").style.display = "flex";

}





function nextToScene5() {

    // Hide Scene 4
    document.getElementById("scene4").style.display = "none";

    // Show Scene 5
    document.getElementById("scene5").style.display = "flex";

}


function openNote(number) {

    var box = document.getElementById("messageBox");

    var title = document.getElementById("noteTitle");

    var text = document.getElementById("noteText");


    if (number == 1) {

        title.innerHTML = "Dear Teacher,";

        text.innerHTML =
            "Thank you for believing in us, " +
            "even when we sometimes doubt ourselves.";

    }


    if (number == 2) {

        title.innerHTML = "To our teachers,";

        text.innerHTML =
            "Thank you for your patience, " +
            "guidance, and for helping us become better.";

    }


    if (number == 3) {

        title.innerHTML = "A little thank you,";

        text.innerHTML =
            "Your lessons are more than things we learn " +
            "for school. They are things we carry with us.";

    }


    box.style.display = "block";

}


function closeNote() {

    document.getElementById("messageBox").style.display = "none";

}


function playMusic() {
    var music = document.getElementById("music");
    var record = document.getElementById("record");
    var button = document.getElementById("musicButton");
    var video = document.getElementById("bgVideo");

    if (music.paused) {
        music.play();
        video.play();
        video.classList.add("show");
        record.classList.add("playing");
        button.innerHTML = "❚❚ Pause";
    } else {
        music.pause();
        video.pause();
        video.classList.remove("show");
        record.classList.remove("playing");
        button.innerHTML = "▶ Play";
    }
}

function nextToScene5() {

    document.getElementById("scene4").style.display = "none";

    document.getElementById("scene5").style.display = "flex";

}


function nextToFinal() {

    document.getElementById("scene5").style.display = "none";

    document.getElementById("final").style.display = "flex";

}


