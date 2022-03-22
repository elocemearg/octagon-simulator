let clock = null;
let optionsValues = {};
let countValue = 0;
let countControl = null;
let counterModeCheckbox = null;
let clockInstructions = null;
let counterInstructions = null;

let optionsDesc = {
    "countermode" : {
        "type" : "checkbox",
        "id" : "countermode",
        "category" : "options",
        "default" : false
    },
    "displayclock" : {
        "type" : "checkbox",
        "id" : "displayclock",
        "category" : "options",
        "default" : true
    },
    "startminutes" : {
        "type" : "number",
        "id" : "minutes",
        "category" : "options",
        "default" : 0
    },
    "startseconds" : {
        "type" : "number",
        "id" : "seconds",
        "category" : "options",
        "default" : 30
    },
    "countup" : {
        "type" : "checkbox",
        "id" : "countup",
        "category" : "options",
        "default" : false
    },
    "leadingzero" : {
        "type" : "checkbox",
        "id" : "leadingzero",
        "category" : "options",
        "default" : false
    },
    "showtenths" : {
        "type" : "checkbox",
        "id" : "showtenths",
        "category" : "options",
        "default" : false
    },
    "showborder" : {
        "type" : "checkbox",
        "id" : "showborder",
        "category" : "options",
        "default" : true
    },
    "format" : {
        "type" : "select",
        "id" : "format",
        "category" : "options",
        "default" : "-1"
    },
    "counterwidth" : {
        "type" : "number",
        "id" : "counterwidth",
        "category" : "options",
        "default" : 2
    },
    "bgcolor" : {
        "type" : "color",
        "id" : "bgcolor",
        "category" : "appearance",
        "default" : [ 0, 177, 64 ]
    },
    "fgcolor" : {
        "type" : "color",
        "id" : "fgcolor",
        "category" : "appearance",
        "default" : [ 255, 255, 255 ]
    },
    "outlinecolor" : {
        "type" : "color",
        "id" : "outlinecolor",
        "category" : "appearance",
        "default" : [ 0, 0, 0 ]
    },
    "outlinesize" : {
        "type" : "number",
        "id" : "outlinesize",
        "category" : "appearance",
        "default" : 1
    },
    "scalefactor" : {
        "type" : "number",
        "id" : "scalefactor",
        "category" : "position",
        "default" : 100
    },
    "shadowdir" : {
        "type" : "select",
        "id" : "shadowdir",
        "category" : "appearance",
        "default" : "3"
    },
    "shadowlength" : {
        "type" : "number",
        "id" : "shadowlength",
        "category" : "appearance",
        "default" : 3
    },
    "xposanchor" : {
        "type" : "select",
        "id" : "xposanchor",
        "category" : "position",
        "default" : "right"
    },
    "yposanchor" : {
        "type" : "select",
        "id" : "yposanchor",
        "category" : "position",
        "default" : "bottom"
    },
    "xpospc" : {
        "type" : "number",
        "id" : "xpospc",
        "category" : "position",
        "default" : 85
    },
    "ypospc" : {
        "type" : "number",
        "id" : "ypospc",
        "category" : "position",
        "default" : 85
    },
    "bgdisable" : {
        "type" : "checkbox",
        "id" : "bgdisable",
        "category" : "appearance",
        "default" : false
    }
};
let refreshTimer = null;

function setBoolFromCheckBox(map, elementId, mapName=null) {
    let element = document.getElementById(elementId);
    if (mapName == null)
        mapName = elementId;
    map[mapName] = element.checked;
}

function setCheckBoxInput(elementId, value) {
    if (value != null) {
        let element = document.getElementById(elementId);
        if (element) {
            element.checked = value;
        }
    }
}

function setValueFromSelect(map, elementId, mapName=null) {
    let el = document.getElementById(elementId);
    if (mapName == null)
        mapName = elementId;
    map[mapName] = el.options[el.selectedIndex].value;
}

function setSelectValue(elementId, value) {
    if (value != null) {
        let el = document.getElementById(elementId);
        if (el) {
            for (let i = 0; i < el.options.length; ++i) {
                if (value == el.options[i].value) {
                    el.selectedIndex = i;
                    break;
                }
            }
        }
    }
}

/* Convert an RGB hex string of the form "#rrggbb" to a three-element array.
 * rr, gg and bb must be hex digits. The returned array will contain three
 * integers 0-255.
 * For example, HexToRGBArray("#00b140") returns [ 0, 177, 64 ].
 */
function HexToRGBArray(value) {
    let ret = [];
    if (value == null || value.length != 7) {
        return null;
    }
    for (let i = 0; i < 3; ++i) {
        let n = parseInt(value.substring(1 + i * 2, 3 + i * 2), 16);
        if (isNaN(n) || n < 0 || n > 255) {
            return null;
        }
        ret.push(n);
    }
    return ret;
}

function setArrayFromColour(map, elementId, defaultValue=null, mapName=null) {
    let el = document.getElementById(elementId);
    if (mapName == null)
        mapName = elementId;

    let ret = HexToRGBArray(el.value);
    if (ret == null)
        map[mapName] = defaultValue;
    else
        map[mapName] = ret;
}

function numberTo2Hex(v) {
    let s;
    v &= 255;

    s = v.toString(16);
    if (s.length == 1)
        s = "0" + s;
    return s;
}

/* Convert an array [red, green, blue] to an RGB hex string value. The three
 * elements of the array must be integers 0-255.
 * For example, if arr = [ 0, 177, 64 ], the function returns "#00b140".
 */
function RGBArrayToHex(arr) {
        return "#" + numberTo2Hex(arr[0]) + numberTo2Hex(arr[1]) + numberTo2Hex(arr[2]);
}

function setColourInput(elementId, value) {
    if (value != null && value.length >= 3) {
        let hexString = RGBArrayToHex(value);
        let element = document.getElementById(elementId);
        if (element) {
            element.value = hexString;
        }
    }
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

function setNumberInput(elementId, value) {
    let el = document.getElementById(elementId);
    if (el != null) {
        if (value != null) {
            el.value = value.toString();
        }
        else {
            el.value = "";
        }
    }
}

/* Read one form control (id specified by elementId) and save its value to
 * valueMap[mapKey]. This is the opposite of setControlFromOptionValue().
 * elementType must be one of "number", "select", "checkbox" and "color", and
 * this must match the input's "type" value. The value saved to
 * valueMap[mapKey] is formatted accordingly. If the value cannot be read
 * from the control, or if it is invalid, valueMap[mapKey] is set to
 * defaultValue instead. */
function setOptionValueFromControl(valueMap, elementType, elementId, defaultValue, mapKey) {
    if (elementType === "number") {
        setNumberFromInput(valueMap, elementId, defaultValue, mapKey);
    }
    else if (elementType === "select") {
        setValueFromSelect(valueMap, elementId, mapKey);
    }
    else if (elementType === "checkbox") {
        setBoolFromCheckBox(valueMap, elementId, mapKey);
    }
    else if (elementType === "color") {
        setArrayFromColour(valueMap, elementId, defaultValue, mapKey);
    }
}

/* Update one form control with an option value looked up from valueMap.
 * descMap[mapKey] must be an object containing "type" (e.g. "number",
 * "checkbox" etc), and "id" (the id of the <input> tag). The input element's
 * value will change to reflect the value in valueMap[mapKey]. */
function setControlFromOptionValue(valueMap, descMap, mapKey) {
    let desc = descMap[mapKey];
    let t = desc["type"];
    let elementId = desc["id"];
    let value = valueMap[mapKey];

    if (t === "number") {
        setNumberInput(elementId, value);
    }
    else if (t === "select") {
        setSelectValue(elementId, value);
    }
    else if (t === "checkbox") {
        setCheckBoxInput(elementId, value);
    }
    else if (t === "color") {
        setColourInput(elementId, value);
    }
}

/* For all options listed in optionsDesc whose category attribute equals the
 * given category argument, read the associated form control and update
 * optionsValues[name] to match. */
function setOptionValuesInCategory(category) {
    for (let name in optionsDesc) {
        let desc = optionsDesc[name];
        if (desc["category"] === category) {
            setOptionValueFromControl(optionsValues, desc["type"], desc["id"], desc["default"], name);
        }
    }
}

/* Save the cookie octagonsimulator_<name>=value with an expiry of 1 year. */
function saveOptionToCookie(name, value) {
    let fullName = "octagonsimulator_" + name;
    let encodedValue = encodeURIComponent(value);
    document.cookie = fullName + "=" + encodedValue + ";max-age=31536000";
}

/* Read the cookie named octagonsimulator_<name> and return its string value. */
function readOptionFromCookie(name) {
    let cookies = document.cookie.split(";");
    let soughtName = "octagonsimulator_" + name;
    for (let i = 0; i < cookies.length; ++i) {
        let nv = cookies[i].trim();
        if (nv.startsWith(soughtName + "=")) {
            return decodeURIComponent(nv.substring(soughtName.length + 1).trim());
        }
    }
    return null;
}

function optionValueToString(type, value) {
    if (type === "color") {
        return RGBArrayToHex(value);
    }
    else if (value != null) {
        return value.toString();
    }
    else {
        return null;
    }
}

/* Take the entries in optionsValues and save their values to the browser
 * cookie in the form octagonsimulator_<name>=value. Values are converted
 * to strings before writing to the cookie. */
function saveOptionsToCookies() {
    for (let name in optionsValues) {
        let desc = optionsDesc[name];
        if (desc == null)
            continue;
        let value = optionValueToString(desc["type"], optionsValues[name]);
        if (value != null) {
            saveOptionToCookie(name, value);
        }
    }
}

function makeOptionsQueryString() {
    let qs = "";
    for (let name in optionsValues) {
        let desc = optionsDesc[name];
        if (desc == null)
            continue;
        let value = optionValueToString(desc["type"], optionsValues[name]);
        if (value != null) {
            if (qs != "") {
                qs += "&";
            }
            qs += encodeURIComponent(name);
            qs += "=";
            qs += encodeURIComponent(value);
        }
    }

    let additionalOptions = "";
    let checkbox = document.getElementById("exportmenuon");
    if (checkbox && !checkbox.checked) {
        additionalOptions += "&menu=false";
    }
    else {
        additionalOptions += "&menu=true";
    }
    checkbox = document.getElementById("exportstart");
    if (checkbox && checkbox.checked) {
        additionalOptions += "&start=true";
    }
    else {
        additionalOptions += "&start=false";
    }
    if (qs == "") {
        /* Trim the first & from additionalOptions if we don't need it */
        additionalOptions = additionalOptions.substring(1);
    }

    return qs + additionalOptions;
}

function makeOptionsURL() {
    let url = window.location.href;
    let qpos = url.indexOf('?');
    if (qpos >= 0) {
        url = url.substring(0, qpos);
    }
    return url + "?" + makeOptionsQueryString();
}

function exportSettingsAsURL() {
    let inputElement = document.getElementById("exporturl");
    inputElement.value = makeOptionsURL();
}

function exportSettingsAsURLAndCopy() {
    let inputElement = document.getElementById("exporturl");
    exportSettingsAsURL();
    inputElement.select();
    inputElement.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function stringToBool(value) {
    /* Possibly unnecessary attempt to accommodate as many ways
     * of saying "true" and "false" as possible... */
    if (value == null)
        return null;
    value = value.toLowerCase();
    if (value == "true" || value == "t" || value == "1" || value == "y" || value == "yes") {
        return true;
    }
    else if (value == "false" || value == "f" || value == "0" || value == "n" || value == "no") {
        return false;
    }
    else {
        return null;
    }
}

function stringValueToUsefulValue(desc, value) {
    if (value == null) {
        return value;
    }
    else {
        let t = desc["type"];
        if (t === "color") {
            value = HexToRGBArray(value);
        }
        else if (t === "number") {
            value = parseFloat(value);
            if (isNaN(value))
                value = null;
        }
        else if (t === "checkbox") {
            value = stringToBool(value);
        }
        return value;
    }
}

/* Read the octagonsimulator_xxx entries from the browser cookie, convert them
 * from their string representation to whatever the option type requires
 * (number, [r,g,b], bool, etc), and save them in optionsValues. Any option
 * whose name does not appear in the cookie does not have its value changed. */
function restoreOptionsFromCookies() {
    for (let name in optionsValues) {
        let value = readOptionFromCookie(name);
        if (value != null) {
            let desc = optionsDesc[name];
            value = stringValueToUsefulValue(desc, value);
            optionsValues[name] = value;
            setControlFromOptionValue(optionsValues, optionsDesc, name);
        }
    }
}

function restoreOptionsFromURL() {
    let queryString = window.location.href;
    let qpos = queryString.indexOf('?');
    if (qpos < 0)
        return;

    queryString = queryString.substring(qpos + 1);

    let namesValues = queryString.split("&");
    let menuOn = true;
    let menuOnGiven = false;
    let autoStart = false;
    let autoStartGiven = false;
    let startTimeSet = false;

    for (let i = 0; i < namesValues.length; ++i) {
        let nameValue = namesValues[i].split('=');
        let name, value;
        if (nameValue.length > 0) {
            name = decodeURIComponent(nameValue[0]);
            if (nameValue.length > 1)
                value = decodeURIComponent(nameValue[1].replace(/\+/g, " "));
            else
                value = null;
            if (name in optionsDesc) {
                let usefulValue = stringValueToUsefulValue(optionsDesc[name], value);
                optionsValues[name] = usefulValue;
                setControlFromOptionValue(optionsValues, optionsDesc, name);
            }
            else if (name == "menu") {
                menuOn = stringToBool(value);
                menuOnGiven = true;
            }
            else if (name == "start") {
                autoStart = stringToBool(value);
                autoStartGiven = true;
            }
            else {
                console.log("restoreOptionsFromURL: " + name + " unrecognised, ignored.");
            }

            if (name == "startminutes" || name == "startseconds") {
                startTimeSet = true;
            }
        }
    }

    if (startTimeSet) {
        startTimeChanged();
    }
    if (menuOnGiven) {
        let menu = document.getElementById("menu");
        let checkbox = document.getElementById("exportmenuon");
        if (checkbox) {
            checkbox.checked = menuOn;
        }
        if (menu) {
            menu.style.display = (menuOn ? null : "none");
        }
    }
    if (autoStartGiven && autoStart) {
        let checkbox = document.getElementById("exportstart");
        if (checkbox) {
            checkbox.checked = autoStart;
        }
        if (!clock.isRunning()) {
            startStop();
        }
    }
}

/* Set all the values in optionsValues to their defaults, and update the
 * form controls accordingly. */
function initialiseOptions() {
    for (let name in optionsDesc) {
        let desc = optionsDesc[name];

        /* First, set this option to the default value... */
        optionsValues[name] = desc["default"];

        /* Then if the control on the form says something different, set it
         * to that. */
        setControlFromOptionValue(optionsValues, optionsDesc, name);
    }
}

function refreshOptions() {
    setOptionValuesInCategory("options");

    let newDirection = optionsValues["countup"] ? 1 : -1;

    if (clock.getDirection() != newDirection) {
        clock.setDirection(optionsValues["countup"] ? 1 : -1);
        if (clock.isRunning()) {
            setNextSecondTimeout();
        }
    }

    if (optionsValues["showtenths"]) {
        setNextSecondTimeout();
    }
}

function changeMode() {
    let counterMode = counterModeCheckbox.checked;
    let counterModeControls = document.getElementsByClassName("countermodecontrols");
    let clockModeControls = document.getElementsByClassName("clockmodecontrols");
    for (let i = 0; i < counterModeControls.length; ++i) {
        counterModeControls[i].style.display = counterMode ? "block" : "none";
    }
    for (let i = 0; i < clockModeControls.length; ++i) {
        clockModeControls[i].style.display = counterMode ? "none" : "block";
    }

    if (counterMode) {
        if (refreshTimer != null) {
            clearTimeout(refreshTimer);
            refreshTimer = null;
        }
        clockInstructions.style.display = "none";
        counterInstructions.style.display = "block";
    }
    else {
        clockInstructions.style.display = "block";
        counterInstructions.style.display = "none";
        setNextSecondTimeout();
    }

    optionsChanged();
}

function countChanged() {
    let newValue = parseInt(countControl.value);
    if (!isNaN(newValue)) {
        setCounter(newValue);
    }
}

function refreshAppearance() {
    setOptionValuesInCategory("appearance");

    if (optionsValues["bgdisable"]) {
        document.body.style.backgroundColor = null;
    }
    else {
        document.body.style.backgroundColor = document.getElementById("bgcolor").value;
    }
}

function refreshPosition() {
    setOptionValuesInCategory("position");
}

function refreshClock() {
    if (clock == null)
        return;

    let canvasDiv = document.getElementById("screen");
    let canvas = document.getElementById("canvas");

    canvas.width = canvasDiv.clientWidth;
    canvas.height = canvasDiv.clientHeight;

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    if (optionsValues["displayclock"]) {
        let xPosPercent = optionsValues["xpospc"];
        let yPosPercent = optionsValues["ypospc"];

        let clockX = Math.floor(canvas.width * xPosPercent / 100.0);
        let clockY = Math.floor(canvas.height * yPosPercent / 100.0);

        let xPosAnchor = optionsValues["xposanchor"] === "right";
        let yPosAnchor = optionsValues["yposanchor"] === "bottom";

        /* Scale the character up as if the screen size is 576 lines */
        let scaleY = canvas.height / 576.0;
        scaleY *= optionsValues["scalefactor"] / 100.0;
        let scaleX = scaleY;

        let timeString;
        if (optionsValues["countermode"]) {
            timeString = formatNumber(countValue, optionsValues["counterwidth"],
                optionsValues["leadingzero"]);
        }
        else {
            timeString = clock.formatValue(parseInt(optionsValues["format"]),
                optionsValues["leadingzero"], false, optionsValues["showtenths"] ? 1 : 0);
        }

        drawClock(canvas, timeString, clockX, clockY,
                optionsValues["fgcolor"],
                xPosAnchor, yPosAnchor,
                scaleX, scaleY,
                optionsValues["outlinecolor"],
                optionsValues["outlinesize"],
                optionsValues["shadowlength"],
                parseInt(optionsValues["shadowdir"]),
                optionsValues["showborder"]
        );
    }

    /* If a backwards-counting clock has reached zero, stop */
    if (clock.isRunning() && clock.getDirection() < 0 && clock.getValueMs() <= 0) {
        stopClock();
    }
}

function setNextSecondTimeout() {
    let timeoutInterval = optionsValues["showtenths"] ? 100 : 1000;
    let ms = clock.getValueMs() % timeoutInterval;
    if (clock.getDirection() > 0) {
        ms = timeoutInterval - ms;
    }
    if (ms == 0)
        ms = timeoutInterval;
    if (refreshTimer != null)
        clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshClockTimeout, ms);
}

function refreshClockTimeout() {
    //console.log("refreshClockTimeout(): clock value is " + clock.getValueMs().toString());
    refreshClock();
    if (clock.isRunning()) {
        setNextSecondTimeout();
    }
}

/* Reread all the settings on the options form, apply them to optionsValues,
 * and redraw anything that needs redrawing because of this. */
function refreshConfiguration() {
    startTimeChanged();
    changeMode();
    refreshOptions();
    refreshAppearance();
    refreshPosition();
}

/* Enable the save settings button and set its text to the floppy disk icon
 * followed by "Save settings". */
function enableSaveButton() {
    let button = document.getElementById("savesettings");
    if (button) {
        button.innerHTML = "&#x1F4BE; Save settings";
        button.disabled = false;
    }
}

/* Disable the save settings button and set its text to the floppy disk
 * character plus the given HTML. */
function disableSaveButton(buttonHTML) {
    let button = document.getElementById("savesettings");
    if (button) {
        button.innerHTML = "&#x1F4BE; " + buttonHTML;
        button.disabled = true;
    }
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

    optionsValues["startminutes"] = minutes;
    optionsValues["startseconds"] = seconds;

    clock.setInitialValueSeconds(minutes * 60 + seconds);
    enableSaveButton();
    refreshClock();
}

function optionsChanged() {
    enableSaveButton();
    refreshOptions();
    refreshClock();
}

function appearanceChanged() {
    enableSaveButton();
    refreshAppearance();
    refreshClock();
}

function positionChanged() {
    enableSaveButton();
    refreshPosition();
    refreshClock();
}

function enableReset() {
    let resetButton = document.getElementById("reset");
    resetButton.disabled = false;
}

function disableReset() {
    let resetButton = document.getElementById("reset");
    resetButton.disabled = true;
}

function stopClock() {
    clock.stop();
    if (refreshTimer != null) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
    let startButton = document.getElementById("start");
    startButton.innerHTML = "&#x25B6; Start";
    startButton.style.backgroundColor = "#ddffdd";
    refreshClock();
    console.log("stopped on " + clock.getValueMs().toString() + "ms");
    enableReset();
}

function startStop() {
    if (clock.isRunning()) {
        stopClock();
    }
    else {
        if (clock.getDirection() > 0 || clock.getValueMs() != 0) {
            let startButton = document.getElementById("start");
            startButton.innerHTML = "&#x25FC; Stop";
            startButton.style.backgroundColor = "#ffdddd";
            clock.start();
            setNextSecondTimeout();
            console.log("started on " + clock.getValueMs().toString() + "ms");
        }
        enableReset();
    }
}

function resetClock() {
    if (clock.isRunning()) {
        stopClock();
    }
    clock.resetClock();
    refreshClock();

    disableReset();
}

function adjustCounter(delta) {
    setCounter(countValue + delta);
    refreshClock();
}

function setCounter(value) {
    countValue = value;
    countControl.value = countValue.toString();
    refreshClock();
}

function resetCounter() {
    setCounter(0);
    refreshClock();
}

function setInitialTime(seconds) {
    let minInput = document.getElementById("minutes");
    let secInput = document.getElementById("seconds");

    minInput.value = Math.floor(seconds / 60).toString();
    secInput.value = Math.floor(seconds % 60).toString();

    startTimeChanged();
}

function keyListener(e) {
    let active = document.activeElement;
    if (active.tagName.toUpperCase() == "INPUT" &&
            (active.getAttribute("type").toUpperCase() == "NUMBER" ||
            active.getAttribute("type").toUpperCase() == "TEXT")) {
        return;
    }
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
            if (optionsValues["countermode"]) {
                resetCounter();
            }
            else {
                resetClock();
            }
            break;

        case 68:
            document.getElementById("displayclock").click();
            break;

        case 189:
        case 109:
            adjustCounter(-1);
            break;

        case 187:
        case 107:
            adjustCounter(1);
            break;
    }
}

function windowSizeChanged() {
    refreshClock();
}

function initialisePost() {
    let errDiv = document.getElementById("errors");
    try {
        let mins, secs;
        initialiseOptions();
        restoreOptionsFromCookies();
        mins = optionsValues["startminutes"];
        secs = optionsValues["startseconds"];
        if (mins == null)
            mins = 0;
        if (secs == null)
            secs = 0;

        clock = new Clock(mins * 60 + secs);
        errDiv.innerText = "";

        /* If the user clicks on any of the number inputs, highlight the
         * contents if not already highlighted. */
        let inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; ++i) {
            if (inputs[i].getAttribute("type") === "number") {
                inputs[i].addEventListener("focus", function() {
                    if (this.selectionStart == this.selectionEnd) {
                        this.select();
                    }
                });
            }
        }

        window.addEventListener("resize", windowSizeChanged);

        restoreOptionsFromURL();

        refreshConfiguration();
        refreshClock();

        document.addEventListener("keyup", keyListener);
    }
    catch (err) {
        errDiv.innerText = "Exception while initialising clock: " + err.message;
        throw err;
    }
}

function initialise() {
    let errDiv = document.getElementById("errors");
    errDiv.innerText = "Loading, please wait...";

    /* Start with all menu sections collapsed */
    hideOptionsSection("position");
    hideOptionsSection("format");
    hideOptionsSection("colourtrim");
    hideOptionsSection("export");
    hideOptionsSection("save");
    hideOptionsSection("about");

    loadFont(initialisePost);

    countControl = document.getElementById("count");
    counterModeCheckbox = document.getElementById("countermode");
    clockInstructions = document.getElementById("clockinstructions");
    counterInstructions = document.getElementById("counterinstructions");
}

/* Save the settings currently in optionsValues to the cookie. */
function saveSettings() {
    saveOptionsToCookies();
    disableSaveButton("Settings saved");
}

/* Read the settings stored in the cookie, apply them to optionsValues,
 * update the form controls to reflect that, and redraw the clock with the
 * restored settings. If an option isn't stored in the cookie, don't update
 * optionsValues for that option. */
function restoreSettings() {
    restoreOptionsFromCookies();
    refreshConfiguration();
    disableSaveButton("Settings restored");
    refreshClock();
}

/* Reset all the settings in optionsValues to their defaults as recorded in
 * optionsDesc, and update the form controls to reflect that. */
function resetSettingsToDefaults() {
    initialiseOptions();
    refreshConfiguration();
    enableSaveButton();
    refreshClock();
}

/* Show the cookie blurb. This happens when the user clicks "more info" on
 * the cookie summary in the save/restore settings section. */
function showCookieDetails() {
    let cookieSummary = document.getElementById("cookiesummary");
    let cookieDetails = document.getElementById("cookiedetails");
    cookieSummary.style.display = "none";
    cookieDetails.style.display = null;
}

/* Hide the cookie blurb and show the summary which contains a link to open
 * the cookie blurb. */
function hideCookieDetails() {
    let cookieSummary = document.getElementById("cookiesummary");
    let cookieDetails = document.getElementById("cookiedetails");
    cookieSummary.style.display = null;
    cookieDetails.style.display = "none";
}

/* Show the div whose id is <name>section and put an up-arrow in the
 * corresponding dropdown box. */
function showOptionsSection(name) {
    let sec = document.getElementById(name + "section");
    let dropdown = document.getElementById(name + "dropdown");
    dropdown.innerHTML = "&#x25B2;";
    sec.style.display = null;
}

/* Hide the div whose id is <name>section and put a down-arrow in the
 * corresponding dropdown box. */
function hideOptionsSection(name) {
    let sec = document.getElementById(name + "section");
    let dropdown = document.getElementById(name + "dropdown");
    dropdown.innerHTML = "&#x25BC;";
    sec.style.display = "none";
}

/* If the div called <name>section is visible, call hideOptionsSection() on it,
 * otherwise call showOptionsSection(). Used by the dropdown toggles for each
 * section on the menu. */
function toggleOptionsSection(name) {
    let sec = document.getElementById(name + "section");
    if (sec != null) {
        if (sec.style.display == "none") {
            showOptionsSection(name);
        }
        else {
            hideOptionsSection(name);
        }
    }
}
