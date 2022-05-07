
const presetOctagonStopwatch = {
    "name" : "octagonstopwatch",
    "imageurl" : "presetimages/octagonstopwatch.jpg",
    "desc" : "Up from zero",
    "options" : {
        "countermode":"0",
        "displayclock":true,
        "clockdesign":"octagon",
        "startminutes":0,
        "startseconds":0,
        "countup":true,
        "leadingzero":false,
        "allowhours":true,
        "showtenths":false,
        "showborder":true,
        "format":"3",
        "bgcolor":[0,177,64],
        "fgcolor":[255,255,255],
        "outlinecolor":[0,0,0],
        "outlinesize":1,
        "scalefactor":100,
        "shadowdir":"3",
        "shadowlength":3,
        "xposanchor":"right",
        "yposanchor":"bottom",
        "xpospc":85,
        "ypospc":85,
        "bgdisable":false,
        "showpresets":true
    }
};

const presetOctagonCountdown30 = {
    "name" : "octagoncountdown30",
    "imageurl" : "presetimages/octagoncountdown30.jpg",
    "desc" : "30 → 0",
    "options" : {
        "countermode": "0",
        "displayclock": true,
        "clockdesign": "octagon",
        "startminutes": 0,
        "startseconds": 30,
        "countup": false,
        "leadingzero": false,
        "allowhours":true,
        "showtenths": false,
        "showborder": true,
        "format": "-1",
        "bgcolor": [ 0, 177, 64 ],
        "fgcolor": [ 255, 255, 255 ],
        "outlinecolor": [ 0, 0, 0 ],
        "outlinesize": 1,
        "scalefactor": 100,
        "shadowdir": "3",
        "shadowlength": 3,
        "xposanchor": "right",
        "yposanchor": "bottom",
        "xpospc": 85,
        "ypospc": 85,
        "bgdisable": false,
        "showpresets": true
    }
};

const presetOctagonCountdown3m = {
    "name" : "octagoncountdown3m",
    "imageurl" : "presetimages/octagoncountdown3m.jpg",
    "desc" : "3:00 → 0:00",
    "options" : {
        "countermode": "0",
        "displayclock": true,
        "clockdesign": "octagon",
        "startminutes": 3,
        "startseconds": 0,
        "countup": false,
        "leadingzero": false,
        "allowhours":true,
        "showtenths": false,
        "showborder": true,
        "format": "-1",
        "bgcolor": [ 0, 177, 64 ],
        "fgcolor": [ 255, 255, 255 ],
        "outlinecolor": [ 0, 0, 0 ],
        "outlinesize": 1,
        "scalefactor": 100,
        "shadowdir": "3",
        "shadowlength": 3,
        "xposanchor": "right",
        "yposanchor": "bottom",
        "xpospc": 85,
        "ypospc": 85,
        "bgdisable": false,
        "showpresets": true
    }
};

const presetTeletextStopwatch = {
    "name" : "teletextstopwatch",
    "imageurl" : "presetimages/teletextstopwatch.jpg",
    "desc" : "Up from zero",
    "options" : {
        "countermode" : 0,
        "displayclock": true,
        "clockdesign": "teletext",
        "startminutes": 0,
        "startseconds": 0,
        "countup": true,
        "leadingzero": false,
        "allowhours":true,
        "showtenths": true,
        "showborder": true,
        "format": "3",
        "bgcolor": [ 0, 177, 64 ],
        "fgcolor": [ 255, 255, 255 ],
        "clockbgcolor": [ 0, 0, 0 ],
        "clockbgalpha": 100,
        "outlinecolor": [ 0, 0, 0 ],
        "outlinesize": 0,
        "scalefactor": 100,
        "shadowdir": "3",
        "shadowlength": 0,
        "scalefactor": 100,
        "xposanchor": "right",
        "yposanchor": "bottom",
        "xpospc": 85,
        "ypospc": 85,
        "bgdisable": false,
        "doubleheight" : false,
        "showpresets": true
    }
};

const presetTeletextCountdown = {
    "name" : "teletextcountdown",
    "imageurl" : "presetimages/teletextcountdown.jpg",
    "desc" : "3:00 → 0:00",
    "options" : {
        "countermode" : 0,
        "displayclock": true,
        "clockdesign": "teletext",
        "startminutes": 3,
        "startseconds": 0,
        "countup": false,
        "leadingzero": false,
        "allowhours":true,
        "showtenths": false,
        "showborder": true,
        "format": "3",
        "bgcolor": [ 0, 177, 64 ],
        "fgcolor": [ 255, 255, 255 ],
        "clockbgcolor": [ 0, 0, 0 ],
        "clockbgalpha": 100,
        "outlinecolor": [ 0, 0, 0 ],
        "outlinesize": 0,
        "scalefactor": 100,
        "shadowdir": "3",
        "shadowlength": 0,
        "scalefactor": 100,
        "xposanchor": "right",
        "yposanchor": "bottom",
        "xpospc": 85,
        "ypospc": 85,
        "bgdisable": false,
        "doubleheight" : false,
        "showpresets": true
    }
};

const presetTeletextRTC = {
    "name" : "teletextrtc",
    "imageurl" : "presetimages/teletextrtc.jpg",
    "desc" : "Real-time clock",
    "options" : {
        "countermode":"2",
        "displayclock":true,
        "clockdesign":"teletext",
        "leadingzero":true,
        "allowhours":true,
        "showrtcseconds":true,
        "showtenths":false,
        "showborder":true,
        "format":"6",
        "fgcolor":[255, 255, 0],
        "clockbgcolor":[0, 0, 0],
        "clockbgalpha":100,
        "outlinecolor":[0, 0, 0],
        "outlinesize":0,
        "scalefactor":100,
        "shadowdir":"3",
        "shadowlength":0,
        "xposanchor":"right",
        "yposanchor":"bottom",
        "xpospc":85,
        "ypospc":85,
        "doubleheight":false
    }
};

/*const presetTeletextStopwatch2 = {
    "name" : "teletextstopwatch2",
    "imageurl" : "presetimages/teletextstopwatch2.jpg",
    "desc" : "Up from zero",
    "options" : {
        "countermode" : 0,
        "displayclock": true,
        "clockdesign": "teletext",
        "startminutes": 0,
        "startseconds": 0,
        "countup": true,
        "leadingzero": false,
        "allowhours":true,
        "showtenths": true,
        "showborder": true,
        "format": "3",
        "bgcolor": [ 0, 177, 64 ],
        "clockbgcolor": [ 0, 0, 0 ],
        "clockbgalpha": 100,
        "outlinecolor": [ 0, 0, 0 ],
        "outlinesize": 0,
        "scalefactor": 100,
        "shadowdir": "3",
        "shadowlength": 0,
        "scalefactor": 100,
        "xposanchor": "right",
        "yposanchor": "bottom",
        "xpospc": 85,
        "ypospc": 85,
        "bgdisable": false,
        "doubleheight" : true,
        "showpresets": true
    }
};

const presetTeletextCountdown2 = {
    "name" : "teletextcountdown2",
    "imageurl" : "presetimages/teletextcountdown2.jpg",
    "desc" : "3:00 → 0:00",
    "options" : {
        "countermode" : 0,
        "displayclock": true,
        "clockdesign": "teletext",
        "startminutes": 3,
        "startseconds": 0,
        "countup": false,
        "leadingzero": false,
        "allowhours":true,
        "showtenths": false,
        "showborder": true,
        "format": "3",
        "bgcolor": [ 0, 177, 64 ],
        "clockbgcolor": [ 0, 0, 0 ],
        "clockbgalpha": 100,
        "outlinecolor": [ 0, 0, 0 ],
        "outlinesize": 0,
        "scalefactor": 100,
        "shadowdir": "3",
        "shadowlength": 0,
        "scalefactor": 100,
        "xposanchor": "right",
        "yposanchor": "bottom",
        "xpospc": 85,
        "ypospc": 85,
        "bgdisable": false,
        "doubleheight" : true,
        "showpresets": true
    }
};*/

const presetNixieStopwatch = {
    "name" : "nixiestopwatch",
    "imageurl" : "presetimages/nixiestopwatch.jpg",
    "desc" : "Up from zero",
    "options" : {
        "countermode": "0",
        "displayclock": true,
        "clockdesign": "nixie",
        "startminutes": 0,
        "startseconds": 0,
        "countup": true,
        "leadingzero": false,
        "allowhours":true,
        "showtenths": true,
        "showborder": true,
        "format": "3",
        "bgcolor": [ 0, 177, 64 ],
        "scalefactor": 100,
        "xposanchor": "right",
        "yposanchor": "bottom",
        "xpospc": 85,
        "ypospc": 85,
        "bgdisable": false,
        "showpresets": true
    }
};

const presetNixieCountdown = {
    "name" : "nixiecountdown",
    "imageurl" : "presetimages/nixiecountdown.jpg",
    "desc" : "3:00 → 0:00",
    "options" : {
        "countermode": "0",
        "displayclock": true,
        "clockdesign": "nixie",
        "startminutes": 3,
        "startseconds": 0,
        "countup": false,
        "leadingzero": false,
        "allowhours":true,
        "showtenths": false,
        "showborder": true,
        "format": "3",
        "bgcolor": [ 0, 177, 64 ],
        "scalefactor": 100,
        "xposanchor": "right",
        "yposanchor": "bottom",
        "xpospc": 85,
        "ypospc": 85,
        "bgdisable": false,
        "showpresets": true
    }
};

const presetBoringStopwatch = {
    "name" : "boringstopwatch",
    "imageurl" : "presetimages/boringstopwatch.jpg",
    "desc" : "Up from zero",
    "mouseover" : "Sometimes you just want vanilla ice cream.",
    "options" : {
        "countermode": "0",
        "displayclock": true,
        "clockdesign": "boring",
        "startminutes": 0,
        "startseconds": 0,
        "countup": true,
        "leadingzero": false,
        "allowhours":true,
        "showtenths": true,
        "showborder": true,
        "format": "3",
        "bgcolor": [ 0, 177, 64 ],
        "fgcolor": [ 255, 255, 255 ],
        "clockbgcolor": [ 0, 0, 0 ],
        "clockbgalpha": 70,
        "outlinecolor": [ 0, 0, 0 ],
        "outlinesize": 0,
        "scalefactor": 100,
        "shadowdir": "3",
        "shadowlength": 2,
        "xposanchor": "right",
        "yposanchor": "bottom",
        "xpospc": 85,
        "ypospc": 85,
        "bgdisable": false,
        "showpresets": true
    }
};

const presetBoringCountdown = {
    "name" : "boringcountdown",
    "imageurl" : "presetimages/boringcountdown.jpg",
    "desc" : "3:00 → 0:00",
    "options" : {
        "countermode": "0",
        "displayclock": true,
        "clockdesign": "boring",
        "startminutes": 3,
        "startseconds": 0,
        "countup": false,
        "leadingzero": false,
        "allowhours":true,
        "showtenths": false,
        "showborder": true,
        "format": "3",
        "bgcolor": [ 0, 177, 64 ],
        "fgcolor": [ 255, 255, 255 ],
        "clockbgcolor": [ 0, 0, 0 ],
        "clockbgalpha": 70,
        "outlinecolor": [ 0, 0, 0 ],
        "outlinesize": 0,
        "scalefactor": 100,
        "shadowdir": "3",
        "shadowlength": 2,
        "xposanchor": "right",
        "yposanchor": "bottom",
        "xpospc": 85,
        "ypospc": 85,
        "bgdisable": false,
        "showpresets": true
    }
};

const clockPresetBanner = {
    "sections": [
        {
            "name" : "Octagonal",
            "presets" : [
				presetOctagonStopwatch,
				presetOctagonCountdown30,
				presetOctagonCountdown3m,
            ]
        },
        {
            "name" : "Teletext",
            "presets" : [
                presetTeletextStopwatch,
                presetTeletextCountdown,
                presetTeletextRTC
            ]
        },
/*        {
            "name" : "Teletext Double Height",
            "presets" : [
                presetTeletextStopwatch2,
                presetTeletextCountdown2
            ]
        },*/
        {
            "name" : "Nixie",
            "presets" : [
                presetNixieStopwatch,
                presetNixieCountdown
            ]
        },
        {
            "name" : "Boring",
            "presets" : [
                presetBoringStopwatch,
                presetBoringCountdown
            ]
        }
    ]
};

let clockPresetNames = {};
function buildPresetNameMap() {
    clockPresetNames = {};
    for (let i = 0; i < clockPresetBanner["sections"].length; ++i) {
        let sec = clockPresetBanner["sections"][i];
        for (let j = 0; j < sec["presets"].length; ++j) {
            clockPresetNames[sec["presets"][j]["name"]] = sec["presets"][j];
        }
    }
}

function getPresetOptionValues(name) {
    if (name in clockPresetNames) {
        return clockPresetNames[name]["options"];
    }
    else {
        return {};
    }
}
