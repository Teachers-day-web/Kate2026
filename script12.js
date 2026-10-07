/*
   HOW THIS FILE WORKS

   1. PLACES     - the list of places (name, position, picture)
   2. LAND       - rough outlines of the continents
   3. VARIABLES  - things the program needs to remember
   4. MATH       - turns a longitude/latitude into a point on the screen
   5. DRAWING    - draws the globe on the canvas
   6. PICTURE    - puts the picture on top of the dot
   7. BUTTONS    - Next and Back
   8. MOVING     - spinning, flying to a place, dragging
   9. START      - runs everything
*/


/* =========================
   1. PLACES
   ========================= */

// lat   = latitude  (up/down:    north is +, south is -)
// lon   = longitude (left/right: east is +, west is -)
// photo = the picture file for this place (inside the "photos" folder)
//
// To use your own picture: put your photo in the "photos" folder
// and change the file name here (or save it with the same name).

var places = [

    {
        name: "Side Eye", lat: 30, lon: 31,
        photo: "sideeye.jpeg"
    },

    {
        name: "Mga Pokpok", lat: 48.9, lon: 2.35,
        photo: "pokpok.jpeg"
    },

    {
        name: "Bless Po!", lat: 35.7, lon: 139.7,
        photo: "tcdblesspo.jpg"
    },

    {
        name: "j3j3m0N 3r4", lat: -33.9, lon: 151.2,
        photo: "jejemonera.jpg"
    },

    {
        name: " Sleepy Picture", lat: 40.7, lon: -74,
        photo: "Sleepy Picture.jpg"
    },

    {
        name: "Pa Cute", lat: -22.9, lon: -43.2,
        photo: "pabebe.jpg"
    },

    {
        name: "Feel Like 18", lat: 27.2, lon: 78,
        photo: "Feel Like 18.jpg"
    },

    {
        name: "Baby Time", lat: -33.9, lon: 18.4,
        photo: "babytime.jpg"
    },

    {
        name: "Miming", lat: 64.1, lon: -21.9,
        photo: "Miming.jpg"
    },

    {
        name: "Family Picture", lat: -3.07, lon: 37.35,
        photo: "Familypic.jpg"
    },

    {
        name: "Family Picture Part  2", lat: 51.2, lon: -115.6,
        photo: "Familypart2.jpg"
    },

    {
        name: "Unexpected Order", lat: 40, lon: 116.4,
        photo: "unexpectedorder.jpg"
    }

];


/* =========================
   2. LAND
   ========================= */

// Each continent is a list of [longitude, latitude] points.
// Joining the points with lines makes the shape of the continent.

var northAmerica = [[-168,66],[-150,71],[-125,70],[-95,72],[-80,68],[-62,58],[-56,52],[-66,44],[-76,36],[-81,30],[-80,25],[-84,30],[-90,29],[-97,26],[-97,20],[-90,21],[-87,21],[-83,15],[-80,9],[-85,10],[-92,15],[-105,20],[-110,24],[-115,30],[-117,33],[-124,40],[-124,48],[-135,58],[-150,60],[-165,60]];

var greenland = [[-55,60],[-45,60],[-20,70],[-20,80],[-60,82],[-70,76]];

var southAmerica = [[-78,8],[-72,12],[-62,10],[-52,5],[-35,-5],[-39,-15],[-48,-26],[-58,-38],[-65,-42],[-68,-52],[-72,-52],[-74,-40],[-71,-20],[-81,-6],[-80,0]];

var eurasia = [[-10,36],[-9,43],[-2,48],[5,52],[10,57],[20,70],[40,68],[70,73],[100,77],[140,72],[180,68],[170,60],[160,55],[142,52],[135,43],[127,38],[122,30],[110,20],[105,10],[100,13],[103,1],[98,8],[93,20],[88,22],[80,15],[77,8],[72,20],[66,25],[58,23],[52,16],[43,13],[39,21],[35,28],[35,36],[27,37],[24,38],[20,40],[15,38],[12,44],[8,44],[3,43],[-5,36]];

var africa = [[-17,21],[-10,30],[-5,36],[10,37],[20,32],[32,31],[35,28],[43,12],[51,12],[40,-3],[40,-15],[33,-26],[20,-35],[18,-32],[12,-17],[13,-6],[9,4],[-8,4],[-17,14]];

var australia = [[114,-22],[122,-18],[130,-12],[142,-11],[146,-19],[153,-26],[150,-37],[140,-38],[131,-31],[115,-34]];

var japan = [[130,32],[135,34],[140,36],[142,40],[141,45],[140,40],[135,36]];

var uk = [[-5,50],[1,51],[0,54],[-3,58],[-6,56]];

var indonesia = [[95,4],[105,-6],[115,-8],[120,-5],[110,-2],[100,2]];

// Antarctica is a ring of points around the bottom of the world
var antarctica = [];
for (var lon = -180; lon <= 180; lon += 20) {
    antarctica.push([lon, -72]);
}

// All the green land in one list
var landMasses = [northAmerica, greenland, southAmerica, eurasia, africa, australia, japan, uk, indonesia];


/* =========================
   3. VARIABLES
   ========================= */

// Find the things on the page
var canvas = document.getElementById("globe");
var ctx = canvas.getContext("2d");
var picture = document.getElementById("picture");
var placeName = document.getElementById("placeName");

// Size of the canvas on the screen, and the radius of the globe
var size = 300;
var radius = 120;

// Makes the drawing sharp on phones with sharp screens
var ratio = window.devicePixelRatio || 1;

// The point of the Earth that faces us right now
var centerLon = 20;
var centerLat = 20;

// Which place is chosen. -1 means none yet.
var current = -1;

// Where the globe is flying to (null means it is not flying)
var targetLon = null;
var targetLat = null;

// For dragging with the mouse or finger
var dragging = false;
var lastX = 0;
var lastY = 0;

// A counter used to make the ring around the dot pulse
var pulse = 0;


/* =========================
   4. MATH
   ========================= */

// Takes a longitude and latitude.
// Gives back x, y (where it is on the globe, from -1 to 1)
// and z (how much it faces us: above 0 = front side, below 0 = back side)

function project(lon, lat) {

    var toRadians = Math.PI / 180;

    var dLon = (lon - centerLon) * toRadians;
    var phi = lat * toRadians;
    var phi0 = centerLat * toRadians;

    var x = Math.cos(phi) * Math.sin(dLon);

    var y = Math.cos(phi0) * Math.sin(phi)
          - Math.sin(phi0) * Math.cos(phi) * Math.cos(dLon);

    var z = Math.sin(phi0) * Math.sin(phi)
          + Math.cos(phi0) * Math.cos(phi) * Math.cos(dLon);

    return { x: x, y: y, z: z };
}

// Turns a projected point into a pixel position on the canvas
function screenX(p) {
    return size / 2 + radius * p.x;
}

function screenY(p) {
    return size / 2 - radius * p.y;
}


/* =========================
   5. DRAWING
   ========================= */

// Set the canvas size to match how big it is on the screen
function setupCanvas() {

    size = canvas.clientWidth;
    radius = size * 0.4;

    canvas.width = size * ratio;
    canvas.height = size * ratio;
}


// Draw the whole globe (called many times every second)
function drawGlobe() {

    var cx = size / 2;
    var cy = size / 2;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, size, size);

    pulse = pulse + 1;


    // 1) Soft shadow around the globe
    var glow = ctx.createRadialGradient(cx, cy, radius, cx, cy, radius * 1.15);
    glow.addColorStop(0, "rgba(60, 40, 20, 0.28)");
    glow.addColorStop(1, "rgba(60, 40, 20, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
    ctx.fill();


    // 2) The ocean (a blue ball, lighter at the top left)
    var ocean = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
    ocean.addColorStop(0, "#9bbccb");
    ocean.addColorStop(1, "#4f7a93");

    ctx.fillStyle = ocean;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();


    // 3) Everything below is only drawn INSIDE the circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    drawGrid();

    for (var i = 0; i < landMasses.length; i++) {
        drawLand(landMasses[i], "#e8dfc9");
    }
    drawLand(antarctica, "#fffaf1");

    // Dark edges so it looks round
    var shade = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.5, cx, cy, radius);
    shade.addColorStop(0, "rgba(60, 40, 20, 0)");
    shade.addColorStop(1, "rgba(60, 40, 20, 0.35)");

    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, size, size);

    ctx.restore();


    // 4) The dots for each place
    drawDots();
}


// Add one point to the current line.
// Points on the back of the globe are skipped.
var penDown = false;

function addToLine(lon, lat) {

    var p = project(lon, lat);

    if (p.z > 0) {

        if (penDown) {
            ctx.lineTo(screenX(p), screenY(p));
        } else {
            ctx.moveTo(screenX(p), screenY(p));
        }

        penDown = true;

    } else {
        penDown = false;
    }
}


// The thin grid lines (longitude and latitude)
function drawGrid() {

    ctx.strokeStyle = "rgba(75, 59, 44, 0.15)";
    ctx.lineWidth = 1;

    // Lines that go from the top to the bottom
    for (var lon = -180; lon < 180; lon += 30) {

        ctx.beginPath();
        penDown = false;

        for (var lat = -90; lat <= 90; lat += 5) {
            addToLine(lon, lat);
        }

        ctx.stroke();
    }

    // Lines that go around the globe
    for (var lat = -60; lat <= 60; lat += 30) {

        ctx.beginPath();
        penDown = false;

        for (var lon = -180; lon <= 180; lon += 5) {
            addToLine(lon, lat);
        }

        ctx.stroke();
    }
}


// Draw one continent
function drawLand(points, color) {

    ctx.fillStyle = color;
    ctx.strokeStyle = "#a9824d";
    ctx.lineWidth = 1;

    ctx.beginPath();

    for (var i = 0; i < points.length; i++) {

        var p = project(points[i][0], points[i][1]);

        var x = p.x;
        var y = p.y;

        // A point on the back side is pushed to the edge of the circle
        if (p.z < 0) {
            var length = Math.sqrt(x * x + y * y) || 1;
            x = x / length;
            y = y / length;
        }

        var px = size / 2 + radius * x;
        var py = size / 2 - radius * y;

        if (i == 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}


// Draw a small dot on every place on the front side
function drawDots() {

    for (var i = 0; i < places.length; i++) {

        var p = project(places[i].lon, places[i].lat);

        // Skip places on the back side
        if (p.z < 0.05) {
            continue;
        }

        var x = screenX(p);
        var y = screenY(p);

        if (i == current) {

            // Chosen place: gold ring with a dark center
            ctx.strokeStyle = "#a9824d";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 6 + 3 * Math.sin(pulse * 0.1), 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = "#5b3f0e";
            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fill();

        } else {

            // Other places: small brown dot
            ctx.fillStyle = "#6b5137";
            ctx.beginPath();
            ctx.arc(x, y, 2.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}


/* =========================
   6. PICTURE
   ========================= */

// Builds the little picture (the photo + the name)
function buildPicture(place) {

    return '<img src="' + place.photo + '" alt="' + place.name + '" ' +
           'onerror="this.style.display=\'none\'">' +
           '<span>' + place.name + '</span>';
}


// Move the picture so its center is exactly on the dot
function updatePicture() {

    // No place chosen yet: keep the picture hidden
    if (current < 0) {
        picture.style.opacity = 0;
        return;
    }

    var p = project(places[current].lon, places[current].lat);

    // The canvas sits inside the stage, so add its offset
    picture.style.left = (canvas.offsetLeft + screenX(p)) + "px";
    picture.style.top = (canvas.offsetTop + screenY(p)) + "px";

    // Fade: 0 when the dot is on the back side, 1 when it faces us
    var fade = (p.z - 0.05) / 0.25;

    if (fade < 0) { fade = 0; }
    if (fade > 1) { fade = 1; }

    picture.style.opacity = fade;
}


/* =========================
   7. BUTTONS
   ========================= */

// Choose a place by its number in the list
function goToPlace(index) {

    var place = places[index];

    current = index;

    // Fly the globe so the dot is in the middle
    targetLon = place.lon;
    targetLat = place.lat;

    // Don't tilt the globe too far up or down
    if (targetLat > 80) { targetLat = 80; }
    if (targetLat < -80) { targetLat = -80; }

    // Show the picture and the name
    picture.innerHTML = buildPicture(place);
    placeName.innerHTML = place.name;
}


function nextPlace() {

    if (current < 0) {
        // First click: start with the first place
        goToPlace(0);
    } else {
        // Go to the next one (after the last, go back to the first)
        goToPlace((current + 1) % places.length);
    }
}


function backPlace() {

    if (current < 0) {
        // First click: start with the last place
        goToPlace(places.length - 1);
    } else {
        // Go to the one before (before the first, go to the last)
        goToPlace((current - 1 + places.length) % places.length);
    }
}


// The left and right arrow keys also work
document.addEventListener("keydown", function(event) {

    if (event.key == "ArrowRight") { nextPlace(); }
    if (event.key == "ArrowLeft") { backPlace(); }

});


/* =========================
   8. MOVING
   ========================= */

// Called every frame to move the globe
function moveGlobe() {

    if (targetLon !== null && !dragging) {

        // Shortest way to turn left or right (between -180 and 180)
        var turn = ((targetLon - centerLon + 540) % 360) - 180;

        // Move 8% of the way each frame (starts fast, slows down)
        centerLon = centerLon + turn * 0.08;
        centerLat = centerLat + (targetLat - centerLat) * 0.08;

        // Close enough? Stop flying.
        if (Math.abs(turn) < 0.2 && Math.abs(targetLat - centerLat) < 0.2) {
            targetLon = null;
        }

    } else if (!dragging && current < 0) {

        // Nothing chosen yet: spin slowly
        centerLon = centerLon + 0.15;
    }
}


// Mouse or finger goes down on the globe
canvas.addEventListener("pointerdown", function(event) {

    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;

    // Stop any flying
    targetLon = null;

    canvas.setPointerCapture(event.pointerId);
});


// Mouse or finger moves: turn the globe
canvas.addEventListener("pointermove", function(event) {

    if (!dragging) {
        return;
    }

    centerLon = centerLon - (event.clientX - lastX) * 0.5;
    centerLat = centerLat + (event.clientY - lastY) * 0.5;

    // Don't tilt too far
    if (centerLat > 80) { centerLat = 80; }
    if (centerLat < -80) { centerLat = -80; }

    lastX = event.clientX;
    lastY = event.clientY;
});


// Mouse or finger lets go
canvas.addEventListener("pointerup", function() {
    dragging = false;
});

canvas.addEventListener("pointercancel", function() {
    dragging = false;
});


/* =========================
   9. START
   ========================= */

// This runs again and again, about 60 times every second
function animate() {

    // If the screen size changed, resize the canvas
    if (canvas.clientWidth != size) {
        setupCanvas();
    }

    moveGlobe();
    drawGlobe();
    updatePicture();

    requestAnimationFrame(animate);
}

setupCanvas();
animate();


