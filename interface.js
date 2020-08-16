let clock = null;
let options = {};
let refreshTimer = null;

function discardContents(element) {
    while (element.firstChild != null) {
        element.removeElement(element.firstChild);
    }
}

function setBoolFromCheckBox(map, elementId, mapName=null) {
    let element = document.getElementById(elementId);
    if (mapName == null)
        mapName = elementId;
    map[mapName] = element.checked;
}

function setValueFromSelect(map, elementId, mapName=null) {
    let el = document.getElementById(elementId);
    if (mapName == null)
        mapName = elementId;
    map[mapName] = el.options[el.selectedIndex].value;
}

function setArrayFromColour(map, elementId, defaultValue=null, mapName=null) {
    let el = document.getElementById(elementId);
    if (mapName == null)
        mapName = elementId;

    let value = el.value;
    if (value.length != 7) {
        map[mapName] = defaultValue;
        return;
    }

    let ret = [];
    for (let i = 0; i < 3; ++i) {
        let n = parseInt(value.substring(1 + i * 2, 3 + i * 2), 16);
        if (isNaN(n) || n < 0 || n > 255) {
            map[mapName] = defaultValue;
            return;
        }
        ret.push(n);
    }
    map[mapName] = ret;
}

function setNumberFromInput(map, elementId, defaultValue=null, mapName=null) {
    let el = document.getElementById(elementId);
    if (mapName == null)
        mapName = elementId;

    let f = parseFloat(el.value);
    if (isNaN(f)) {
        f = defaultValue;
    }
    map[mapName] = f;
}

function refreshOptions() {
    setBoolFromCheckBox(options, "displayclock");
    setBoolFromCheckBox(options, "countup");
    setBoolFromCheckBox(options, "leadingzero");
    setValueFromSelect(options, "format");

    let newDirection = options["countup"] ? 1 : -1;

    if (clock.getDirection() != newDirection) {
        clock.setDirection(options["countup"] ? 1 : -1);
        if (clock.isRunning()) {
            setNextSecondTimeout();
        }
    }
}

function refreshAppearance() {
    setArrayFromColour(options, "bgcolor",  [ 128, 128, 255 ]);
    setArrayFromColour(options, "fgcolor", [255, 255, 255]);
    setArrayFromColour(options, "outlinecolor", [0, 0, 0]);
    setNumberFromInput(options, "outlinesize");
    setNumberFromInput(options, "shadowlength");
    setValueFromSelect(options, "shadowdir");

    document.getElementById("screen").style.backgroundColor =
        document.getElementById("bgcolor").value;
}

function refreshPosition() {
    setValueFromSelect(options, "xposanchor");
    setNumberFromInput(options, "xpospc", 66);
    setValueFromSelect(options, "yposanchor");
    setNumberFromInput(options, "ypospc", 75);
    setNumberFromInput(options, "scalefactor", 100);
}

function refreshClock() {
    let canvasDiv = document.getElementById("screen");
    let canvas = document.getElementById("canvas");

    canvas.width = canvasDiv.clientWidth;
    canvas.height = canvasDiv.clientHeight;

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    if (options["displayclock"]) {
        let xPosPercent = options["xpospc"];
        let yPosPercent = options["ypospc"];

        let clockX = Math.floor(canvas.width * xPosPercent / 100.0);
        let clockY = Math.floor(canvas.height * yPosPercent / 100.0);

        let xPosAnchor = options["xposanchor"] === "right";
        let yPosAnchor = options["yposanchor"] === "bottom";

        /* Scale the character up as if the screen size is 576 lines */
        let scaleY = canvas.height / 576.0;
        scaleY *= options["scalefactor"] / 100.0;
        let scaleX = scaleY;

        let timeString = clock.formatValue(parseInt(options["format"]),
                options["leadingzero"], false);

        drawClock(canvas, timeString, clockX, clockY,
                options["fgcolor"],
                xPosAnchor, yPosAnchor,
                scaleX, scaleY,
                options["outlinecolor"],
                options["outlinesize"],
                options["shadowlength"],
                parseInt(options["shadowdir"])
        );
    }

    /* If a backwards-counting clock has reached zero, stop */
    if (clock.isRunning() && clock.getDirection() < 0 && clock.getValueMs() <= 0) {
        stopClock();
    }
}

function setNextSecondTimeout() {
    let ms = clock.getValueMs() % 1000;
    if (clock.getDirection() > 0) {
        ms = 1000 - ms;
    }
    if (ms == 0)
        ms = 1000;
    if (refreshTimer != null)
        clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshClockTimeout, ms);
}

function refreshClockTimeout() {
    refreshClock();
    if (clock.isRunning()) {
        setNextSecondTimeout();
    }
}

function refreshConfiguration() {
    refreshOptions();
    refreshAppearance();
    refreshPosition();
}

function startTimeChanged() {
    let minInput = document.getElementById("minutes");
    let secInput = document.getElementById("seconds");

    let minutes = parseInt(minInput.value);
    let seconds = parseInt(secInput.value);

    if (isNaN(minutes) || minutes < 0) {
        minutes = 0;
    }
    if (isNaN(seconds) || seconds < 0) {
        seconds = 0;
    }

    clock.setInitialValueSeconds(minutes * 60 + seconds);
    refreshClock();
}

function optionsChanged() {
    refreshOptions();
    refreshClock();
}

function appearanceChanged() {
    refreshAppearance();
    refreshClock();
}

function positionChanged() {
    refreshPosition();
    refreshClock();
}

function stopClock() {
    clock.stop();
    if (refreshTimer != null) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
    document.getElementById("start").innerText = "Start";
    refreshClock();
    console.log("stopped on " + clock.getValueMs().toString() + "ms");
}

function startStop() {
    if (clock.isRunning()) {
        stopClock();
    }
    else {
        if (clock.getDirection() > 0 || clock.getValueMs() != 0) {
            document.getElementById("start").innerText = "Stop";
            clock.start();
            setNextSecondTimeout();
            console.log("started on " + clock.getValueMs().toString() + "ms");
        }
    }
}

function resetClock() {
    if (clock.isRunning()) {
        stopClock();
    }
    clock.resetClock();
    refreshClock();
}

function keyListener(e) {
    switch (e.keyCode) {
        case 27:
        case 77:
            let menu = document.getElementById("menu");
            if (menu.style.display === "none") {
                menu.style.display = null;
            }
            else {
                menu.style.display = "none";
            }
            break;

        case 83:
            startStop();
            break;

        case 82:
            resetClock();
            break;

        case 68:
            document.getElementById("displayclock").click();
            break;
    }
}

function initialisePost() {
    let errDiv = document.getElementById("errors");
    try {
        clock = new Clock(30);
        refreshConfiguration();
        refreshClock();
        document.addEventListener("keyup", keyListener);
        errDiv.innerText = "";
    }
    catch (err) {
        errDiv.innerText = "Exception while initialising clock: " + err.message;
    }
}

function initialise() {
    let errDiv = document.getElementById("errors");
    errDiv.innerText = "Loading, please wait...";
    loadFont(initialisePost);
}
