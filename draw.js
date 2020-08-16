const INTER_CHAR_SPACE = 18;
const BORDER_TO_CHAR_SPACE = 18;

let characterCanvases = [];
let characterImages = [];
let numImagesLoaded = 0;

/* Called when the page loads. When all images are loaded, finishedCallback
 * is called. */
function loadFont(finishedCallback) {
    for (let i = 0; i < characterUrls.length; ++i) {
        characterImages[i] = new Image();
        characterImages[i].onload = function() {
            characterCanvases[i] = document.createElement("canvas");
            characterCanvases[i].width = characterImages[i].width;
            characterCanvases[i].height = characterImages[i].height;
            let ctx = characterCanvases[i].getContext("2d");
            ctx.drawImage(characterImages[i], 0, 0, characterImages[i].width, characterImages[i].height);
            numImagesLoaded++;
            if (numImagesLoaded == characterUrls.length) {
                finishedCallback();
            }
        };
        characterImages[i].src = characterUrls[i];
    }
}


function getCharacterWidth(code) {
    return characterCanvases[code].width;
}

function getCharacterHeight(code) {
    return characterCanvases[code].height;
}

function drawCharacter(destImage, code, destX, destY, xLimit=null) {
    let imageData;

    if (xLimit == null) {
        xLimit = characterCanvases[code].width;
    }

    srcImage = characterCanvases[code].getContext("2d").getImageData(0, 0,
            Math.min(characterCanvases[code].width, xLimit),
            characterCanvases[code].height);

    for (let y = 0; y < srcImage.height; ++y) {
        for (let x = 0; x < srcImage.width; ++x) {
            let dataDest = 4 * ((destY + y) * destImage.width + destX + x);
            let dataSrc = 4 * (y * srcImage.width + x);
            for (let i = 0; i < 4; ++i) {
                destImage.data[dataDest + i] = srcImage.data[dataSrc + i];
            }
        }
    }
}

function charToIndex(ch) {
    let code = null;
    if (ch >= '0' && ch <= '9') {
        code = DIGIT0 + (ch - '0');
    }
    else if (ch == ':') {
        code = COLON;
    }
    else if (ch == ' ') {
        code = SPACE;
    }
    else if (ch == '.') {
        code = DOT;
    }
    else if (ch == '-') {
        code = MINUS;
    }

    return code;
}

function makeClockImage(string) {
    let xstart = 0;
    let ystart = 0;
    let xpos = xstart;

    /* Work out the width and height of the finished clock. Height is easy,
     * it's just the top to bottom height of the NUMBER_BORDER character.
     * Width is the sum of the widths of the left border, the characters, the
     * inter-character spacing, and the right border. */
    let height;
    let width;
    let charsPrinted = 0;

    height = getCharacterHeight(NUMBER_BORDER);
    width = getCharacterWidth(LEFT_BORDER);
    for (let i = 0; i < string.length; ++i) {
        let charWidth = getCharacterWidth(charToIndex(string[i]));
        if (charsPrinted > 0) {
            width += INTER_CHAR_SPACE;
        }
        width += charWidth;
        charsPrinted++;
    }
    width += getCharacterWidth(RIGHT_BORDER);

    let imageData = new ImageData(width, height);

    /* Draw left border */
    drawCharacter(imageData, LEFT_BORDER, xpos, ystart);

    xpos += getCharacterWidth(LEFT_BORDER);

    charsPrinted = 0;
    for (let i = 0; i < string.length; ++i) {
        let ch = string[i];
        let charIndex = charToIndex(ch);

        if (charIndex != null) {
            charWidth = getCharacterWidth(charIndex);

            if (charsPrinted > 0) {
                /* Leave some space after the last character, and draw the
                 * top and bottom border above and below this space */
                drawCharacter(imageData, NUMBER_BORDER, xpos, ystart, INTER_CHAR_SPACE);
                xpos += INTER_CHAR_SPACE;
            }

            /* Draw the top and bottom border over this character */
            drawCharacter(imageData, NUMBER_BORDER, xpos, ystart, charWidth);

            /* Draw the character, a set distance below the top border */
            drawCharacter(imageData, charIndex, xpos, ystart + BORDER_TO_CHAR_SPACE);

            /* Advance xpos by the width of this character */
            xpos += charWidth;

            charsPrinted++;
        }
    }

    /* Draw right border */
    drawCharacter(imageData, RIGHT_BORDER, xpos, ystart);

    return imageData;
}

function copyNonTransparentPixels(destContext, srcData, xstart, ystart, overrideColour=null) {
    let destData = destContext.getImageData(xstart, ystart, srcData.width, srcData.height);
    let destDataPos = 0;
    let srcDataPos = 0;
    for (let y = 0; y < srcData.height; ++y) {
        for (let x = 0; x < srcData.width; ++x) {
            if (srcData.data[srcDataPos + 3] != 0) {
                for (let i = 0; i < 4; ++i) {
                    if (overrideColour == null || i == 3) {
                        destData.data[destDataPos + i] = srcData.data[srcDataPos + i];
                    }
                    else {
                        destData.data[destDataPos + i] = overrideColour[i];
                    }
                }
            }
            srcDataPos += 4;
            destDataPos += 4;
        }
    }
    destContext.putImageData(destData, xstart, ystart);
}

function changeNonTransparentPixelColour(imageData, newColour) {
    for (let y = 0; y < imageData.height; ++y) {
        let dataPos = y * imageData.width * 4;
        for (let x = 0; x < imageData.width; ++x) {
            if (imageData.data[dataPos + 3] != 0) {
                for (let i = 0; i < 3; ++i) {
                    imageData.data[dataPos + i] = newColour[i];
                }
            }
            dataPos += 4;
        }
    }
}

const directionToXY = [
    [ 0, -1 ], // north
    [ 1, -1 ], // northeast
    [ 1, 0 ], // east
    [ 1, 1 ], // southeast
    [ 0, 1 ], // south
    [ -1, 1 ], // southwest
    [ -1, 0 ], // west
    [ -1, -1 ], // northwest
];

const NORTH = 0;
const NORTHEAST = 1;
const EAST = 2;
const SOUTHEAST = 3;
const SOUTH = 4;
const SOUTHWEST = 5;
const WEST = 6;
const NORTHWEST = 7;

/* Draw the clock graphic onto destCanvas, with the left edge at xstart and the
 * top edge at ystart. (These are the right edge and bottom edge if
 * xstartRightEdge and ystartBottomEdge, respectively, are true.).
 *
 * The string should consist of one or more characters from the following set:
 *    digits 0-9, space, colon (:), dot (.), minus (-)
 * Any other characters in the string are ignored.
 *
 * mainColour and outlineColour should be a three element array of
 * [ red, green, blue ], where each value is in the range 0-255.
 *
 * outlineSize and shadowLength are in pixels. shadowDirection, if given,
 * must be one of the compass point constants above. The shadow is the same
 * colour as outlineColour. Set outlineSize or shadowLength to 0 to disable
 * the outline or shadow.
 *
 * scaleX and scaleY can be varied to enlarge or shrink the resulting clock
 * image by a scale factor before putting it onto destCanvas. By default
 * (scaleX=1, scaleY=1), each character is 41 pixels high.
 *
 * loadFont() must be called and finished before calling this function.
 */ 
function drawClock(destCanvas, string, xstart, ystart, mainColour,
        xstartRightEdge=false, ystartBottomEdge=false,
        scaleX=1, scaleY=1, outlineColour=null, outlineSize=0,
        shadowLength=0, shadowDirection=SOUTHEAST) {
    let destContext = destCanvas.getContext("2d");

    /* Get our basic clock image based on this string */
    let clockImage = makeClockImage(string);

    let outlineCanvas = document.createElement("canvas");
    let finishedCanvas = document.createElement("canvas");

    /* Padding: make our intermediate canvases the size of the clock image,
     * plus the expected outline and shadow */
    let padding = shadowLength + outlineSize;

    outlineCanvas.width = (clockImage.width + 2 * padding);
    outlineCanvas.height = (clockImage.height + 2 * padding);
    finishedCanvas.width = outlineCanvas.width;
    finishedCanvas.height = outlineCanvas.height;

    let outlineContext = outlineCanvas.getContext("2d");
    let finishedContext = finishedCanvas.getContext("2d");

    if (outlineColour != null) {
        /* Draw the outline, in outlineColour */
        changeNonTransparentPixelColour(clockImage, outlineColour);
        for (let dy = -outlineSize; dy <= outlineSize; ++dy) {
            for (let dx = -outlineSize; dx <= outlineSize; ++dx) {
                copyNonTransparentPixels(outlineContext, clockImage,
                        padding + dx, padding + dy, outlineColour);
            }
        }

        let outlineImage = outlineContext.getImageData(0, 0, outlineCanvas.width, outlineCanvas.height);
        copyNonTransparentPixels(finishedContext, outlineImage, 0, 0, outlineColour);

        /* Draw the shadow by smearing the outline in a particular direction */
        for (let dist = 1; dist <= shadowLength; ++dist) {
            copyNonTransparentPixels(finishedContext, outlineImage,
                    directionToXY[shadowDirection][0] * dist,
                    directionToXY[shadowDirection][1] * dist,
                    outlineColour);
        }
    }

    /* Draw the actual numbers, using the main colour */
    changeNonTransparentPixelColour(clockImage, mainColour);
    copyNonTransparentPixels(finishedContext, clockImage, padding, padding);

    if (ystartBottomEdge) {
        ystart -= finishedCanvas.height * scaleY;
    }
    if (xstartRightEdge) {
        xstart -= finishedCanvas.width * scaleX;
    }

    destContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    destContext.drawImage(finishedCanvas, Math.floor(xstart / scaleX),
            Math.floor(ystart / scaleY));
    destContext.setTransform(1, 0, 0, 1, 0, 0);
}
