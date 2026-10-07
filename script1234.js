/*
   HOW THIS FILE WORKS

   1. SETTINGS   - the size of the hall, the paintings, and WHERE TO PUT YOUR PICTURES
   2. VARIABLES  - things the program needs to remember
   3. PAINTINGS  - draws each painting with code (no photo files needed)
   4. THE HALL   - builds the floor, walls, ceiling and lights
   5. PICTURES   - hangs the paintings on the walls
   6. MOVING     - scrolling walks the camera down the hall
   7. START      - runs everything
*/


/* =========================
   1. SETTINGS
   ========================= */

// Size of the hall (in meters)
var hallLength = 48;
var hallWidth = 8;
var hallHeight = 5.2;

// Color sets for the paintings. Each painting uses one set.
// The first color is the background, the others are the brush strokes.
var colorSets = [
    ["#d9a47a", "#c4452f", "#2c4a6b", "#f1d9a8", "#6f8f5a", "#1d1a1a"],
    ["#1f3a4d", "#e8a33d", "#f2e3c6", "#b5532f", "#5d8aa8", "#0f1b24"],
    ["#efe0c8", "#b9867a", "#8f9e7e", "#3c3b45", "#d7b36a", "#7a4b3a"],
    ["#2b2d42", "#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#f8f1e5"],
    ["#c9b79c", "#8b5e3c", "#3d2b1f", "#e6d5b8", "#a3b18a", "#588157"],
    ["#f4d6cc", "#e07a5f", "#3d405b", "#81b29a", "#f2cc8f", "#faf3e0"]
];

// =========================
// WHERE TO PUT YOUR PICTURES
// =========================
// Every painting on the wall can be a picture of yours. No code needed:
//
// 1. Make a folder called "photos" next to this file.
// 2. Save your pictures in it with these names (png):
//
//        photos/1.png   -> first painting on the left wall
//        photos/2.png   -> first painting on the right wall
//        photos/3.png ... photos/7.png  -> the rest, walking down the hall
//        photos/8.png   -> the big painting at the very end
//
// If a file is missing, that frame keeps the painting the code draws.
// The picture is cropped to fill the frame without stretching.
//
// Want a different file name or a jpg? Change it in the "photo" lines below.

// The big picture at the end of the hall
var bigPhoto = "japethon2.jpeg";

// The paintings on the side walls.
// width, height = size of the painting
// side          = -1 is the left wall, 1 is the right wall
// z             = how far down the hall (more negative = farther)
// colors        = which color set to use (a number from the list above)
// style         = 0 is brush strokes, 1 is a face, 2 is a landscape
// photo         = your own picture file (if the file is missing, the drawn painting shows)
var pictures = [
    { width: 2.6, height: 3.2, side: -1, z: -2,  colors: 0, style: 1, photo: "budol2.jpg" },
    { width: 3.4, height: 2.4, side: 1,  z: -8,  colors: 1, style: 2, photo: "tvl.jpeg" },
    { width: 2.4, height: 3.4, side: -1, z: -14, colors: 2, style: 0, photo: "python.jpeg" },
    { width: 3.6, height: 2.6, side: 1,  z: -20, colors: 3, style: 1, photo: "normal.jpeg" },
    { width: 2.8, height: 2.8, side: -1, z: -26, colors: 4, style: 2, photo: "mothersday.jpeg" },
    { width: 2.4, height: 3.4, side: 1,  z: -32, colors: 5, style: 0, photo: "japethon.jpeg" },
    { width: 3.6, height: 2.5, side: -1, z: -38, colors: 1, style: 2, photo: "class.jpeg" }
];


/* =========================
   2. VARIABLES
   ========================= */

// Find the canvas on the page
var canvas = document.getElementById("museum");

// The tools from three.js
var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120);

// Makes the drawing sharp on phones with sharp screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Light cream background, and a soft fog so the far end fades away
scene.background = new THREE.Color(0xefe3d6);
scene.fog = new THREE.Fog(0xefe3d6, 18, 60);

// How far we have walked (0 = start, 1 = end). It follows the scroll smoothly.
var walked = 0;

// A number used to make "random" brush strokes.
// It always starts the same, so the paintings look the same every time.
var seed = 7;


/* =========================
   3. PAINTINGS
   ========================= */

// Gives a "random" number between 0 and 1
function random() {

    seed = (seed * 16807) % 2147483647;

    return seed / 2147483647;
}


// Draws a pile of brush strokes on a flat canvas
function drawStrokes(ctx, colors, howMany, minLength, maxLength, minThick, maxThick, alpha, startX, startY, areaW, areaH, straight) {

    for (var i = 0; i < howMany; i++) {

        ctx.save();

        // Move to a spot in the area and turn a little
        ctx.translate(startX + random() * areaW, startY + random() * areaH);

        if (straight) {
            ctx.rotate((random() - 0.5) * 1.2);
        } else {
            ctx.rotate((random() - 0.5) * 6.3);
        }

        var length = minLength + random() * (maxLength - minLength);

        ctx.strokeStyle = colors[1 + Math.floor(random() * 5)];
        ctx.globalAlpha = alpha * (0.5 + random() * 0.5);
        ctx.lineWidth = minThick + random() * (maxThick - minThick);

        // One curved brush stroke
        ctx.beginPath();
        ctx.moveTo(-length / 2, 0);
        ctx.quadraticCurveTo(0, (random() - 0.5) * length * 0.4, length / 2, 0);
        ctx.stroke();

        ctx.restore();
    }
}


// Makes a whole painting and gives it back as a texture
function makePainting(width, height, colors, style, photo) {

    var paint = document.createElement("canvas");
    var ctx = paint.getContext("2d");

    // Keep the same shape as the frame
    var big = 640;
    paint.width = Math.round(big * width / Math.max(width, height));
    paint.height = Math.round(big * height / Math.max(width, height));

    var w = paint.width;
    var h = paint.height;

    // Background color
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);
    ctx.lineCap = "round";

    // Big soft strokes first
    var straight = (style != 0);
    drawStrokes(ctx, colors, 70, 80, 260, 30, 90, 0.55, 0, 0, w, h, straight);

    if (style == 1) {

        // A simple face: body, head and two eyes
        ctx.globalAlpha = 0.9;

        ctx.fillStyle = colors[5];
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.62, w * 0.26, h * 0.3, 0, 0, 7);
        ctx.fill();

        ctx.fillStyle = colors[3];
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.38, w * 0.17, h * 0.2, 0, 0, 7);
        ctx.fill();

        ctx.fillStyle = colors[2];
        ctx.beginPath();
        ctx.arc(w * 0.43, h * 0.36, w * 0.025, 0, 7);
        ctx.arc(w * 0.57, h * 0.36, w * 0.025, 0, 7);
        ctx.fill();

        drawStrokes(ctx, colors, 120, 20, 90, 6, 22, 0.7, w * 0.2, h * 0.12, w * 0.6, h * 0.76, straight);

    } else if (style == 2) {

        // A landscape: ground, sun, and strokes for grass and sky
        ctx.globalAlpha = 1;

        ctx.fillStyle = colors[4];
        ctx.fillRect(0, h * 0.58, w, h * 0.42);

        ctx.fillStyle = colors[3];
        ctx.beginPath();
        ctx.arc(w * 0.68, h * 0.32, w * 0.12, 0, 7);
        ctx.fill();

        drawStrokes(ctx, colors, 110, 40, 200, 8, 26, 0.65, 0, h * 0.5, w, h * 0.5, straight);
        drawStrokes(ctx, colors, 40, 40, 160, 10, 30, 0.5, 0, 0, w, h * 0.5, straight);

    } else {

        // Only brush strokes
        drawStrokes(ctx, colors, 160, 20, 120, 5, 24, 0.8, 0, 0, w, h, straight);
    }

    // A little grain on top so it looks like real paint
    ctx.globalAlpha = 0.07;

    for (var i = 0; i < 1400; i++) {

        if (random() > 0.5) {
            ctx.fillStyle = "#ffffff";
        } else {
            ctx.fillStyle = "#000000";
        }

        ctx.fillRect(random() * w, random() * h, 2, 2);
    }

    var texture = new THREE.CanvasTexture(paint);
    texture.anisotropy = 8;

    // If there is a photo, draw it over the painting once it has loaded.
    // If the file is missing, the drawn painting stays (nothing breaks).
    if (photo) {
        loadPhoto(photo, paint, texture);
    }

    return texture;
}


// Loads your picture and fills the frame with it (cropped, not stretched)
function loadPhoto(file, paint, texture) {

    var image = new Image();

    image.onload = function() {

        var ctx = paint.getContext("2d");

        // Pick the biggest part of the photo that has the frame's shape
        var scale = Math.max(paint.width / image.width, paint.height / image.height);
        var cropW = paint.width / scale;
        var cropH = paint.height / scale;
        var cropX = (image.width - cropW) / 2;
        var cropY = (image.height - cropH) / 2;

        ctx.globalAlpha = 1;
        ctx.drawImage(image, cropX, cropY, cropW, cropH, 0, 0, paint.width, paint.height);

        // Tell three.js the picture changed
        texture.needsUpdate = true;
    };

    image.src = file;
}


// Makes the marble floor texture (grey cracks on white stone)
function makeMarble() {

    var stone = document.createElement("canvas");
    var ctx = stone.getContext("2d");

    stone.width = 512;
    stone.height = 512;

    ctx.fillStyle = "#ece6df";
    ctx.fillRect(0, 0, 512, 512);

    // Draw 26 crooked grey lines
    for (var i = 0; i < 26; i++) {

        var x = random() * 512;
        var y = random() * 512;

        ctx.beginPath();
        ctx.moveTo(x, y);

        for (var j = 0; j < 14; j++) {
            x = x + (random() - 0.5) * 110;
            y = y + (random() - 0.35) * 80;
            ctx.lineTo(x, y);
        }

        ctx.strokeStyle = "rgba(90, 90, 100, " + (0.08 + random() * 0.2) + ")";
        ctx.lineWidth = 0.6 + random() * 2.2;
        ctx.stroke();
    }

    var texture = new THREE.CanvasTexture(stone);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 18);
    texture.anisotropy = 8;

    return texture;
}


/* =========================
   4. THE HALL
   ========================= */

// Adds one flat wall to the scene
function addWall(width, height, x, y, z, turn, material) {

    var wall = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);

    wall.position.set(x, y, z);
    wall.rotation.y = turn;

    scene.add(wall);
}


function buildHall() {

    var middleZ = -hallLength / 2 + 7;
    var totalLength = hallLength + 14;

    // The floor
    var floorMaterial = new THREE.MeshStandardMaterial({ map: makeMarble(), roughness: 0.35, metalness: 0.05 });
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, totalLength), floorMaterial);

    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, middleZ);
    scene.add(floor);

    // The four walls (left, right, far end, behind us)
    var wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf0dccb, roughness: 0.95 });

    addWall(totalLength, hallHeight, -hallWidth / 2, hallHeight / 2, middleZ, Math.PI / 2, wallMaterial);
    addWall(totalLength, hallHeight, hallWidth / 2, hallHeight / 2, middleZ, -Math.PI / 2, wallMaterial);
    addWall(hallWidth, hallHeight, 0, hallHeight / 2, -hallLength, 0, wallMaterial);
    addWall(hallWidth, hallHeight, 0, hallHeight / 2, 7, Math.PI, wallMaterial);

    // The dark ceiling
    var ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2624, roughness: 0.9 });
    var ceiling = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, totalLength), ceilingMaterial);

    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, hallHeight, middleZ);
    scene.add(ceiling);

    // A thin strip along the bottom of each side wall
    var stripMaterial = new THREE.MeshStandardMaterial({ color: 0xe6d2c0, roughness: 0.8 });

    for (var side = -1; side <= 1; side += 2) {

        var strip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, totalLength), stripMaterial);

        strip.position.set(side * (hallWidth / 2 - 0.03), 0.09, middleZ);
        scene.add(strip);
    }

    // Soft light everywhere
    scene.add(new THREE.AmbientLight(0xfff1e4, 0.55));
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd9c6b4, 0.35));
}


/* =========================
   5. PICTURES
   ========================= */

// Materials used by every frame
var frameMaterial = new THREE.MeshStandardMaterial({ color: 0x151313, roughness: 0.5 });
var lampMaterial = new THREE.MeshStandardMaterial({ color: 0x0e0e0e, roughness: 0.4 });
var bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xfff2d6 });


// Hangs one painting (with its frame and little lamp) on a side wall
function hangPicture(info) {

    var group = new THREE.Group();

    // The black frame
    var frame = new THREE.Mesh(new THREE.BoxGeometry(info.width + 0.22, info.height + 0.22, 0.12), frameMaterial);
    group.add(frame);

    // The painting itself
    var paintingMaterial = new THREE.MeshBasicMaterial({
        map: makePainting(info.width, info.height, colorSets[info.colors], info.style, info.photo)
    });
    var painting = new THREE.Mesh(new THREE.PlaneGeometry(info.width, info.height), paintingMaterial);
    painting.position.z = 0.065;
    group.add(painting);

    // The lamp above it: a bar, an arm and a glowing bulb
    var barWidth = Math.min(info.width * 0.5, 1.2);

    var bar = new THREE.Mesh(new THREE.BoxGeometry(barWidth, 0.05, 0.05), lampMaterial);
    bar.position.set(0, info.height / 2 + 0.55, 0.35);
    group.add(bar);

    var arm = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.55, 0.03), lampMaterial);
    arm.position.set(0, info.height / 2 + 0.28, 0.12);
    arm.rotation.x = -0.5;
    group.add(arm);

    var bulb = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.06), bulbMaterial);
    bulb.position.set(0, info.height / 2 + 0.52, 0.36);
    group.add(bulb);

    // Put the whole group on the wall, facing into the hall
    group.position.set(info.side * (hallWidth / 2 - 0.07), 1.9, info.z);

    if (info.side > 0) {
        group.rotation.y = -Math.PI / 2;
    } else {
        group.rotation.y = Math.PI / 2;
    }

    scene.add(group);

    // A warm light that shines on this painting
    var light = new THREE.PointLight(0xffe2b8, 0.9, 9, 1.6);
    light.position.set(info.side * (hallWidth / 2 - 1.4), hallHeight - 0.8, info.z);
    scene.add(light);
}


// Hangs the big painting on the far wall
function hangBigPicture() {

    var width = 6;
    var height = 4.2;

    var frame = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, height + 0.3, 0.14), frameMaterial);
    frame.position.set(0, 2.35, -hallLength + 0.08);
    scene.add(frame);

    var paintingMaterial = new THREE.MeshBasicMaterial({ map: makePainting(width, height, colorSets[3], 1, bigPhoto) });
    var painting = new THREE.Mesh(new THREE.PlaneGeometry(width, height), paintingMaterial);
    painting.position.set(0, 2.35, -hallLength + 0.16);
    scene.add(painting);

    var light = new THREE.PointLight(0xffe2b8, 1.1, 10, 1.5);
    light.position.set(0, hallHeight - 0.6, -hallLength + 2.5);
    scene.add(light);
}


/* =========================
   6. MOVING
   ========================= */

// Makes the screen the right size (also on phones turned sideways)
function setupScreen() {

    renderer.setSize(window.innerWidth, window.innerHeight, false);

    camera.aspect = window.innerWidth / window.innerHeight;

    // A wider view on tall phone screens
    if (window.innerWidth < window.innerHeight) {
        camera.fov = 70;
    } else {
        camera.fov = 55;
    }

    camera.updateProjectionMatrix();
}


// Starts slow, speeds up, then slows down again (used for the last zoom)
function smooth(t) {

    if (t < 0.5) {
        return 2 * t * t;
    }

    return 1 - Math.pow(-2 * t + 2, 2) / 2;
}


// Called every frame to move the camera
function moveCamera() {

    // How far down the page are we? (0 = top, 1 = bottom)
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var goal = 0;

    if (maxScroll > 0) {
        goal = window.scrollY / maxScroll;
    }

    if (goal < 0) { goal = 0; }
    if (goal > 1) { goal = 1; }

    // Move 7% of the way each frame (so it glides instead of jumping)
    walked = walked + (goal - walked) * 0.07;

    // The first 90% of the scroll walks down the hall
    var walk = Math.min(1, walked / 0.9);
    var startZ = 5;
    var endZ = -hallLength + 5.2;
    var z = startZ + (endZ - startZ) * walk;

    // The last 10% zooms into the big painting
    var zoom = Math.max(0, (walked - 0.9) / 0.1);
    z = z - smooth(zoom) * 2.4;

    // A gentle left and right sway, so it feels like walking
    var sway = Math.sin(z * 0.28) * (1 - zoom);
    var swayX = sway * 1.1;

    camera.position.set(swayX, 1.75 - zoom * 0.1, z);
    camera.rotation.set(0, -sway * 0.55, 0);

    // Look a little ahead, slightly to the side
    var lookX = swayX + Math.sin(z * 0.28 + 0.6) * 2.2 * (1 - zoom);
    camera.lookAt(lookX, 1.8, z - 6);
}


/* =========================
   7. START
   ========================= */

// This runs again and again, about 60 times every second
function animate() {

    moveCamera();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

// Build everything
buildHall();

for (var i = 0; i < pictures.length; i++) {
    hangPicture(pictures[i]);
}

hangBigPicture();

// Fit the screen, and fit it again if the window changes
setupScreen();
window.addEventListener("resize", setupScreen);

animate();
