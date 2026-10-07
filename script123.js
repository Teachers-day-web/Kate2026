/*
   HOW THIS FILE WORKS

   1. PHOTOS   - the list of photos and captions
   2. ROWS     - puts the photos into the page
   3. BUTTON   - pause and play
*/


/* =========================
   1. PHOTOS
   ========================= */

// file    = where the picture is (inside the "photos" folder)
// caption = the text under the picture
//
// To add a photo: put it in the "photos" folder
// and copy one line below. To remove one: delete its line.

var photos = [
    { file: "moana.jpeg",  caption: "ay, m4y p4 c13v4g3???" },
    { file: "bebetimes.jpeg",  caption: "p0kp0k y4rN?" },
    { file: "japan.jpeg",  caption: "ooopps oops, d1t0 4ng t1ng1N🤪" },
    { file: "tcdsolo.jpg",  caption: "69" },
    { file: "home.jpg",  caption: "dati sa sofa lang nakaupo, ngayon hindi na" },
    { file: "dinner2.jpg",  caption: "wow, fine dining restaurant" },
    { file: "bthdy.jpg",  caption: "sAkTo nA, mAy fLoWeRs pA 😭" },
    { file: "fingerheart.jpg",  caption: "gumraduate para mag-aral ulit" },
    { file: "dinner.jpg",  caption: "s1mPl3 l4ng p3r0 ma4ng4z" },
    { file: "Feel Like 18.jpg", caption: "tAkAs mUnA sA gUlO 🌿" },
{ file: "babytime.jpg", caption: "sunflower, sabay carfun" },
{ file: "night.jpg", caption: "very cutesyyyy😘😘😘" },
{ file: "montain.jpg", caption: "pinakamashikip na anak ng panginoon, kate🙏🏻" }

];


/* =========================
   2. ROWS
   ========================= */

// Fills one row with photos.
// rowId = the id of the row in index.html
// list  = the photos to put in it

function buildRow(rowId, list) {

    var html = "";

    // We add all the photos TWICE.
    // This lets the row repeat forever with no gap.
    for (var round = 0; round < 2; round++) {

        for (var i = 0; i < list.length; i++) {

            html = html +
                '<div class="photo">' +
                    '<img src="' + list[i].file + '" alt="' + list[i].caption + '">' +
                    '<p>' + list[i].caption + '</p>' +
                '</div>';
        }
    }

    // Put it into the page
    document.getElementById(rowId).innerHTML = html;
}


// Row 1 uses the photos in their order
buildRow("row1", photos);

// Row 2 uses the same photos backwards,
// so the two rows look different
var backwards = photos.slice().reverse();
buildRow("row2", backwards);


/* =========================
   3. BUTTON
   ========================= */

// Is the marquee paused right now?
var isPaused = false;

function toggleMarquee() {

    var button = document.getElementById("pauseButton");

    // Switch between paused and playing
    isPaused = !isPaused;

    if (isPaused) {

        // The CSS stops the rows when body has the "paused" class
        document.body.classList.add("paused");

        button.innerHTML = "▶ Play";

    } else {

        document.body.classList.remove("paused");

        button.innerHTML = "❚❚ Pause";
    }
}
