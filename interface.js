let clock = null;
let optionsValues = {};
let countValue = 0;
let countControl = null;
let counterModeCheckbox = null;
let rtcModeCheckbox = null;
let clockInstructions = null;
let counterInstructions = null;
let screenDiv = null;
let mobileControlsClock = null;
let mobileControlsCounter = null;
let mobileControlsRTC = null;
let fullScreenControls = null;
let fullScreenButton = null;

let mobileControlDisplay = "block";
let isFullScreen = false;

let activeClockDesign = null;

/* mapping of clock design short names ("e.g. "octagon", "nixie" - the values
 * of the selections in the drop-down list) to ClockDesign objects. */
let clockDesigns = {};

/* To add a new option:
 *  - Add a control for it in index.html
 *  - Add a new entry in optionsDesc describing the type of option, its id,
 *    category and default - this ensures the option is initialised, saved and
 *    restored appropriately
 *  - Add any other code required to act on that option
 */
let optionsDesc = {
    "countermode" : {
        "type" : "radio",
        "id" : "countermode",
        "category" : "options",
        "default" : "0"
    },
    "displayclock" : {
        "type" : "checkbox",
        "id" : "displayclock",
        "category" : "options",
        "default" : true
    },
    "clockdesign" : {
        "type" : "select",
        "id" : "clockdesign",
        "category" : "options",
        "default" : "octagon"
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
    "allowhours" : {
        "type" : "checkbox",
        "id" : "allowhours",
        "category" : "options",
        "default" : true
    },
    "showrtcseconds" : {
        "type" : "checkbox",
        "id" : "showrtcseconds",
        "category" : "options",
        "default" : true
    },
    "showtenths" : {
        "type" : "checkbox",
        "id" : "showtenths",
        "category" : "options",
        "default" : false
    },
    "showframes" : {
        "type" : "checkbox",
        "id" : "showframes",
        "category" : "options",
        "default" : false
    },
    "showborder" : {
        "type" : "checkbox",
        "id" : "showborder",
        "category" : "appearance",
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
    "clockbgcolor" : {
        "type" : "color",
        "id" : "clockbgcolor",
        "category" : "appearance",
        "default" : [ 0, 0, 0 ],
    },
    "clockbgalpha" : {
        "type" : "number",
        "id" : "clockbgalpha",
        "category" : "appearance",
        "default" : 70
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
    },
    "showpresets" : {
        "type" : "menuvisibility",
        "linkid" : "togglepresetslink",
        "objectid" : "presetspanelcontainer",
        "showtext" : "Show presets",
        "hidetext" : "Hide presets",
        "category" : "showmenus",
        "default" : true
    },
    "typeface" : {
        "type" : "select",
        "id" : "typeface",
        "category" : "appearance",
        "default" : "Bebas Neue"
    },
    "doubleheight" : {
        "type" : "checkbox",
        "id" : "doubleheight",
        "category" : "appearance",
        "default" : false
    },
    "keepdesignoptions" : {
        "type" : "radio",
        "id" : "keepdesignoptions",
        "category" : "options",
        "default" : "0"
    },
    "positionmode" : {
        "type" : "select",
        "id" : "positionmode",
        "category" : "position",
        "default" : "manual"
    }
};
let refreshTimer = null;
const FRAMES_PER_SECOND = 25;

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

function setValueFromRadioButton(map, elementName, defaultValue, mapName=null) {
    let elements = document.getElementsByName(elementName);
    let value = null;
    if (mapName == null) {
        mapName = elementName;
    }
    for (let i = 0; i < elements.length; ++i) {
        if (elements[i].checked) {
            value = elements[i].value;
            break;
        }
    }
    if (value === null) {
        value = defaultValue;
    }
    map[mapName] = value;
}

function setRadioInput(elementName, value) {
    let elements = document.getElementsByName(elementName);
    for (let i = 0; i < elements.length; ++i) {
        elements[i].checked = (elements[i].value.toString() == value.toString());
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

function setMenuVisibility(linkId, objectId, showText, hideText, show) {
    let link = document.getElementById(linkId);
    let obj = document.getElementById(objectId);
    if (show) {
        link.innerText = hideText;
        obj.style.display = null;
    }
    else {
        link.innerText = showText;
        obj.style.display = "none";
    }
}

function setMainMenuVisibility(visible) {
    let menu = document.getElementById("menu");
    let checkbox = document.getElementById("exportmenuon");
    if (checkbox) {
        checkbox.checked = visible;
    }
    if (menu) {
        menu.style.display = (visible ? null : "none");
    }
}

function toggleMainMenu() {
    let menu = document.getElementById("menu");
    setMainMenuVisibility(menu.style.display == "none");
}

function toggleTouchscreenControls() {
    if (mobileControlDisplay == "none") {
        mobileControlDisplay = "block";
        optionsDesc["positionmode"]["default"] = "autocentremax";
    }
    else {
        mobileControlDisplay = "none";
        optionsDesc["positionmode"]["default"] = "manual";
    }
    changeInterface();
}

function openFullScreen() {
    let e = document.documentElement;
    if (e.requestFullscreen) {
        e.requestFullscreen();
    }
    else if (e.webkitRequestFullscreen) {
        e.webkitRequestFullscreen();
    }
    else if (e.msRequestFullscreen) {
        e.msRequestFullscreen();
    }
    fullScreenButton.innerHTML = "&#x2199;"
    isFullScreen = true;
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    fullScreenButton.innerHTML = "&#x2922;"
    isFullScreen = false;
}

function toggleFullScreen() {
    if (isFullScreen) {
        exitFullScreen();
    }
    else {
        openFullScreen();
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
    else if (elementType === "radio") {
        setValueFromRadioButton(valueMap, elementId, defaultValue, mapKey);
    }
}

/* Update one form control with an option value looked up from valueMap.
 * descMap[mapKey] must be an object containing "type" (e.g. "number",
 * "checkbox" etc), and "id" (the id of the <input> tag). The input element's
 * value will change to reflect the value in valueMap[mapKey].
 *
 * If the type is "menuvisibility", it must have "linkid", "objectid",
 * "showtext" and "hidetext". */
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
    else if (t === "radio") {
        setRadioInput(elementId, value);
    }
    else if (t === "menuvisibility") {
        setMenuVisibility(desc["linkid"], desc["objectid"], desc["showtext"], desc["hidetext"], value)
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
        else if (t === "checkbox" || t === "menuvisibility") {
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
                if (name == "countup") {
                    /* Have to set this now, not wait until the caller applies
                     * all the new options, because it affects the behaviour
                     * of autostart below. */
                    clock.setDirection(optionsValues[name] ? 1 : -1);
                }
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
        setMainMenuVisibility(menuOn);
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

function isClockMode() {
    return parseInt(optionsValues["countermode"]) === 0;
}

function isCounterMode() {
    return parseInt(optionsValues["countermode"]) === 1;
}

function isRTCMode() {
    return parseInt(optionsValues["countermode"]) === 2;
}

/* Set all the values in optionsValues to their defaults, and update the
 * form controls accordingly. */
function initialiseOptions() {
    for (let name in optionsDesc) {
        let desc = optionsDesc[name];

        /* First, set this option to the default value... */
        optionsValues[name] = desc["default"];

        /* Then if the control on the form says something different, set the
         * control on the form to the default. */
        setControlFromOptionValue(optionsValues, optionsDesc, name);
    }
}

function refreshOptions() {
    setOptionValuesInCategory("options");

    let newDirection = optionsValues["countup"] ? 1 : -1;

    if (clock.getDirection() != newDirection) {
        clock.setDirection(optionsValues["countup"] ? 1 : -1);
        if ((isClockMode() && clock.isRunning()) || isRTCMode()) {
            setNextSecondTimeout();
        }
    }

    if ((optionsValues["showtenths"] || optionsValues["showframes"]) && ((clock.isRunning() && isClockMode()) || isRTCMode())) {
        setNextSecondTimeout();
    }
}

function arrayLikeConcat(a1, a2) {
    let result = [];
    for (let i = 0; i < a1.length; ++i) {
        result.push(a1[i]);
    }
    for (let i = 0; i < a2.length; ++i) {
        result.push(a2[i]);
    }
    return result;
}

function changeInterface() {
    let counterMode = counterModeCheckbox.checked;
    let rtcMode = rtcModeCheckbox.checked;
    let clockMode = !(counterMode || rtcMode);

    mobileControlsClock.style.display = (clockMode ? mobileControlDisplay : "none");
    mobileControlsCounter.style.display = (counterMode ? mobileControlDisplay : "none");
    mobileControlsRTC.style.display = (rtcMode ? mobileControlDisplay : "none");
    fullScreenControls.style.display = mobileControlDisplay;
}

function changeMode() {
    let counterMode = counterModeCheckbox.checked;
    let rtcMode = rtcModeCheckbox.checked;
    let counterModeControls = document.getElementsByClassName("countermodecontrols");
    let clockModeControls = document.getElementsByClassName("clockmodecontrols");
    let rtcModeControls = document.getElementsByClassName("rtcmodecontrols");
    let allControls = arrayLikeConcat(arrayLikeConcat(counterModeControls, clockModeControls), rtcModeControls);
    let visibleControls;

    if (counterMode) {
        visibleControls = counterModeControls;
    }
    else if (rtcMode) {
        visibleControls = rtcModeControls;
    }
    else {
        visibleControls = clockModeControls;
    }

    for (let i = 0; i < allControls.length; ++i) {
        allControls[i].style.display = "none";
    }
    for (let i = 0; i < visibleControls.length; ++i) {
        visibleControls[i].style.display = "block";
    }

    clockInstructions.style.display = "none";
    counterInstructions.style.display = "none";
    rtcInstructions.style.display = "none";
    if (counterMode) {
        if (refreshTimer != null) {
            clearTimeout(refreshTimer);
            refreshTimer = null;
        }
        counterInstructions.style.display = "block";
    }
    else if (rtcMode) {
        rtcInstructions.style.display = "block";
        setNextSecondTimeout();
    }
    else {
        clockInstructions.style.display = "block";
        setNextSecondTimeout();
    }

    if (activeClockDesign) {
        activeClockDesign.clearClock(true);
    }

    changeInterface();
    optionsChanged();
}

function setClassVisible(className, visible) {
    let elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; ++i) {
        elements[i].style.display = (visible ? null : "none");
    }
}

function applyPositionOptions(clockDesign) {
    if (optionsValues["positionmode"] === "manual") {
        clockDesign.setPosition(optionsValues["xpospc"],
            optionsValues["ypospc"],
            optionsValues["xposanchor"] === "right",
            optionsValues["yposanchor"] === "bottom");
    }
    else {
        clockDesign.setPositionAutoCentre();
    }

    if (optionsValues["positionmode"] === "autocentremax") {
        clockDesign.setAutoMaximise();
    }
    else {
        clockDesign.setScaleFactor(optionsValues["scalefactor"] / 100);
    }
}

function applyMenuVisibilityOptions() {
    setControlFromOptionValue(optionsValues, optionsDesc, "showpresets");
}

function applyOptionValues(optVals) {
    for (let name in optVals) {
        let value = optVals[name];
        optionsValues[name] = value;
        setControlFromOptionValue(optionsValues, optionsDesc, name);
    }
}


function clockDesignChanged(canApplyDefaults=false) {
    enableSaveButton();
    refreshOptions();

    activeClockDesign.clearClock(true);
    activeClockDesign = clockDesigns[optionsValues["clockdesign"]];
    if (activeClockDesign == null) {
        activeClockDesign = clockDesigns["boring"];
    }

    if (canApplyDefaults && parseInt(optionsValues["keepdesignoptions"]) == 0) {
        applyOptionValues(activeClockDesign.getDefaultOptionValues());
    }

    applyAppearanceOptions(activeClockDesign);
    applyPositionOptions(activeClockDesign);

    setClassVisible("bordercolourcontrol", activeClockDesign.supportsClockBackground());
    setClassVisible("textcolourcontrol", activeClockDesign.supportsTextColour());
    setClassVisible("textoutlinecontrol", activeClockDesign.supportsTextOutline());
    setClassVisible("textshadowcontrol", activeClockDesign.supportsTextShadow());
    setClassVisible("doubleheightcontrol", activeClockDesign.supportsDoubleHeight());
    setClassVisible("fontcontrol", activeClockDesign.supportsFonts());

    refreshClock();
}

function countChanged() {
    let newValue = parseInt(countControl.value);
    if (!isNaN(newValue)) {
        setCounter(newValue);
    }
}

function applyAppearanceOptions(clockDesign) {
    if (clockDesign.supportsTextColour()) {
        clockDesign.setTextColour(optionsValues["fgcolor"]);
    }
    if (clockDesign.supportsTextOutline()) {
        clockDesign.setOutline(optionsValues["outlinecolor"], optionsValues["outlinesize"]);
    }
    if (clockDesign.supportsTextShadow()) {
        clockDesign.setShadow(optionsValues["shadowlength"], parseInt(optionsValues["shadowdir"]));
    }
    if (clockDesign.supportsFonts()) {
        clockDesign.setFontFamily(optionsValues["typeface"]);
    }
    if (clockDesign.supportsDoubleHeight()) {
        clockDesign.setDoubleHeight(optionsValues["doubleheight"]);
    }
    clockDesign.setBorder(optionsValues["showborder"]);
    if (clockDesign.supportsClockBackground()) {
        clockDesign.setClockBackgroundColour(optionsValues["clockbgcolor"], optionsValues["clockbgalpha"] / 100);
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
    applyAppearanceOptions(activeClockDesign);
}

function refreshPosition() {
    setOptionValuesInCategory("position");
    applyPositionOptions(activeClockDesign);
}

function refreshClock() {
    if (clock == null)
        return;

    if (optionsValues["displayclock"]) {
        let timeString = "";
        if (isCounterMode()) {
            timeString = formatNumber(countValue, optionsValues["counterwidth"],
                optionsValues["leadingzero"]);
        }
        else if (isClockMode()) {
            timeString = clock.formatValue(parseInt(optionsValues["format"]),
                optionsValues["leadingzero"], false,
                optionsValues["showframes"] ? -FRAMES_PER_SECOND : (optionsValues["showtenths"] ? 1 : 0),
                optionsValues["allowhours"]);
        }
        else if (isRTCMode()) {
            let d = new Date();
            let ms = d.getHours() * 3600000 + d.getMinutes() * 60000 + d.getSeconds() * 1000 + d.getMilliseconds();
            timeString = Clock.formatMilliseconds(ms, 6,
                optionsValues["leadingzero"], false,
                optionsValues["showframes"] ? -FRAMES_PER_SECOND : (optionsValues["showtenths"] ? 1 : 0), true);
            if (!optionsValues["showtenths"] && !optionsValues["showrtcseconds"] && !optionsValues["showframes"]) {
                /* If the user doesn't want seconds, take the seconds off */
                timeString = timeString.substring(0, timeString.length - 3);
            }
        }

        activeClockDesign.drawClock(timeString);
    }
    else {
        activeClockDesign.clearClock(true);
    }

    /* If a backwards-counting clock has reached zero, stop */
    if (clock.isRunning() && clock.getDirection() < 0 && clock.getValueMs() <= 0) {
        stopClock();
    }
}

function setNextSecondTimeout() {
    let ms;
    let timeoutInterval;
    if (optionsValues["showframes"])
        timeoutInteval = 1000 / FRAMES_PER_SECOND;
    else if (optionsValues["showtenths"])
        timeoutInterval = 100;
    else
        timeoutInterval = 1000;

    if (isRTCMode()) {
        let d = new Date();
        ms = d.getHours() * 3600000 + d.getMinutes() * 60000 + d.getSeconds() * 1000 + d.getMilliseconds();
        ms %= timeoutInterval;
    }
    else {
        ms = clock.getValueMs() % timeoutInterval;
    }
    if (isRTCMode() || clock.getDirection() > 0) {
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
    if (isRTCMode() || (clock.isRunning() && isClockMode())) {
        setNextSecondTimeout();
    }
}

/* Reread all the settings on the options form, apply them to optionsValues,
 * and redraw anything that needs redrawing because of this. */
function refreshConfiguration() {
    startTimeChanged();
    changeMode();
    clockDesignChanged();
    refreshOptions();
    refreshAppearance();
    refreshPosition();
    refreshPositionModeControls();
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

function refreshPositionModeControls() {
    /* If auto-centre is enabled, disable the xpos and ypos controls. */
    let manualPosControls = document.getElementsByClassName("manualposcontrol");
    for (let i = 0; i < manualPosControls.length; i++) {
        manualPosControls[i].disabled = (optionsValues["positionmode"] != "manual");
    }

    /* If auto-centre and maximise is enabled, disable the scale control. */
    let manualSizeControls = document.getElementsByClassName("manualsizecontrol");
    for (let i = 0; i < manualSizeControls.length; i++) {
        manualSizeControls[i].disabled = (optionsValues["positionmode"] === "autocentremax");
    }
}

function positionModeChanged() {
    /* Refresh the clock's position... */
    positionChanged();
    refreshPositionModeControls();
}

function switchToPreset(presetName) {
    let presetOptionsValues = getPresetOptionValues(presetName);
    if (presetOptionsValues) {
        for (let name in presetOptionsValues) {
            if (name in optionsDesc) {
                optionsValues[name] = presetOptionsValues[name];
                setControlFromOptionValue(optionsValues, optionsDesc, name);
            }
        }
    }
    enableSaveButton();
    refreshConfiguration();
    refreshClock();
}

function enableReset() {
    let resetButton = document.getElementById("reset");
    let mobileResetButton = document.getElementById("mobilereset");
    resetButton.disabled = false;
    mobileResetButton.disabled = false;
}

function disableReset() {
    let resetButton = document.getElementById("reset");
    let mobileResetButton = document.getElementById("mobilereset");
    resetButton.disabled = true;
    mobileResetButton.disabled = true;
}

function setPresetButtonsEnabled(enabled) {
    let buttons = document.getElementsByClassName("presetbutton");
    for (let i = 0; i < buttons.length; ++i) {
        buttons[i].disabled = !enabled;
    }
}

function stopClock() {
    clock.stop();
    if (isClockMode()) {
        if (refreshTimer != null) {
            clearTimeout(refreshTimer);
            refreshTimer = null;
        }
    }
    let startButton = document.getElementById("start");
    let mobileStartButton = document.getElementById("mobilestartstop");
    startButton.innerHTML = "&#x25B6; Start";
    startButton.style.backgroundColor = "#ddffdd";
    mobileStartButton.innerHTML = "&#x25B6;";
    mobileStartButton.style.backgroundColor = "#ddffdd";
    refreshClock();
    console.log("stopped on " + clock.getValueMs().toString() + "ms");
    setPresetButtonsEnabled(true);
    enableReset();
}

function startStop() {
    if (clock.isRunning()) {
        stopClock();
    }
    else {
        if (clock.getDirection() > 0 || clock.getValueMs() != 0) {
            let startButton = document.getElementById("start");
            let mobileStartButton = document.getElementById("mobilestartstop");
            startButton.innerHTML = "&#x25FC; Stop";
            startButton.style.backgroundColor = "#ffdddd";
            mobileStartButton.innerHTML = "&#x25FC;";
            mobileStartButton.style.backgroundColor = "#ffdddd";
            clock.start();
            setNextSecondTimeout();
            setPresetButtonsEnabled(false);
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
    if (e.keyCode != 27 && active.tagName.toUpperCase() == "INPUT" &&
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
            if (isCounterMode()) {
                resetCounter();
            }
            else if (isClockMode()) {
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
    if (activeClockDesign)
        activeClockDesign.styleChanged = true;
    refreshClock();
}

function initialisePost() {
    let errDiv = document.getElementById("errors");
    try {
        let mins, secs;

        if ("ontouchstart" in document.documentElement) {
            /* This is a touch screen. Default to showing the touchscreen
             * controls, not showing the main menu, and auto-centring and
             * maximising the clock. */
            mobileControlDisplay = "block";
            setMainMenuVisibility(false);
            optionsDesc["positionmode"]["default"] = "autocentremax";
        }
        else {
            mobileControlDisplay = "none";
        }

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

function loadPresetButtons() {
    let presetsPanel = document.getElementById("presetspanel");
    let sections = clockPresetBanner["sections"];

    buildPresetNameMap();
    while (presetsPanel.firstChild) {
        presetsPanel.removeChild(presetsPanel.firstChild);
    }
    for (let secIndex = 0; secIndex < sections.length; ++secIndex) {
        let section = sections[secIndex];
        let sectionName = section["name"];
        let presets = section["presets"];
        let sectionDiv = document.createElement("div");
        let sectionHeaderDiv = document.createElement("div");

        sectionDiv.classList.add("presetdesignsection");
        sectionHeaderDiv.classList.add("presetdesignheader");
        sectionHeaderDiv.innerText = sectionName;
        sectionDiv.appendChild(sectionHeaderDiv);

        for (let presetIndex = 0; presetIndex < presets.length; ++presetIndex) {
            let presetInfo = presets[presetIndex];
            let presetBoxDiv = document.createElement("div");
            let presetImageDiv = document.createElement("div");
            let presetDescDiv = document.createElement("div");
            let presetButton = document.createElement("button");
            let presetImage = document.createElement("img");
            presetBoxDiv.classList.add("presetbox");
            presetImageDiv.classList.add("presetimage");
            presetDescDiv.classList.add("presetdesc");

            sectionDiv.appendChild(presetBoxDiv);
            presetBoxDiv.appendChild(presetImageDiv);
            presetBoxDiv.appendChild(presetDescDiv);

            presetImageDiv.appendChild(presetButton);
            presetButton.classList.add("presetbutton");
            presetButton.appendChild(presetImage);
            if (presetInfo["mouseover"]) {
                presetButton.title = presetInfo["mouseover"];
            }
            presetImage.src = presetInfo["imageurl"];
            presetImage.alt = presetInfo["desc"];
            presetDescDiv.innerText = presetInfo["desc"];

            let presetName = presetInfo["name"];
            presetButton.addEventListener("click", function() {
                switchToPreset(presetName);
            });
        }
        presetsPanel.appendChild(sectionDiv);
    }
}

let numCanvasClocks = 0;
function canvasClockLoaded() {
    numCanvasClocks--;
    if (numCanvasClocks == 0) {
        initialisePost();
    }
}

function screenClick(e) {
    let screenWidth = screenDiv.clientWidth;
    let screenHeight = screenDiv.clientHeight;
    let relX = e.clientX / screenWidth;
    let relY = e.clientY / screenHeight;

    /* If the click or tap is in the left 25% of the top half of the
     * screen, display the menu. */
    if (relX < 0.25 && relY < 0.5) {
        setMainMenuVisibility(true);
    }
}

function initialise() {
    let errDiv = document.getElementById("errors");
    let canvasDiv = document.getElementById("screen");
    let canvas = document.getElementById("canvas");

    errDiv.innerText = "Loading, please wait...";

    /* Start with all menu sections collapsed */
    hideOptionsSection("general");
    hideOptionsSection("format");
    hideOptionsSection("design");
    hideOptionsSection("export");
    hideOptionsSection("save");
    hideOptionsSection("about");

    numCanvasClocks = 4;
    clockDesigns["octagon"] = new OctagonCanvasClockDesign(canvas, canvasDiv, canvasClockLoaded);
    clockDesigns["nixie"] = new NixieCanvasClockDesign(canvas, canvasDiv, canvasClockLoaded);
    clockDesigns["teletext"] = new TeletextCanvasClockDesign(canvas, canvasDiv, canvasClockLoaded);
    clockDesigns["mode7"] = new Mode7CanvasClockDesign(canvas, canvasDiv, canvasClockLoaded);
    clockDesigns["boring"] = new HTMLBoxClockDesign(canvasDiv, "htmlclock");

    activeClockDesign = clockDesigns["octagon"];

    countControl = document.getElementById("count");
    counterModeCheckbox = document.getElementById("countermode");
    rtcModeCheckbox = document.getElementById("rtcmode");
    clockInstructions = document.getElementById("clockinstructions");
    counterInstructions = document.getElementById("counterinstructions");
    rtcInstructions = document.getElementById("rtcinstructions");
    presetsPanelContainer = document.getElementById("presetspanelcontainer");
    togglePresetsLink = document.getElementById("togglepresetslink");

    screenDiv = document.getElementById("screen");
    screenDiv.addEventListener("click", screenClick);

    mobileControlsClock = document.getElementById("mobilecontrolsclock");
    mobileControlsCounter = document.getElementById("mobilecontrolscounter");
    mobileControlsRTC = document.getElementById("mobilecontrolsrtc");
    fullScreenControls = document.getElementById("fullscreencontrols");
    fullScreenButton = document.getElementById("fullscreenbutton");

    loadPresetButtons();
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

function togglePresetsHeader() {
    optionsValues["showpresets"] = !optionsValues["showpresets"];
    applyMenuVisibilityOptions();
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
