/* Class: OctagonCanvasClockDesign */
const OCTAGON_DESIGN_NAME = "octagon";
const OCTAGON_INTER_CHAR_SPACE = 18;
const OCTAGON_BORDER_TO_CHAR_SPACE = 18;
const OCTAGON_ASSUMED_SCREEN_HEIGHT = 576;

/* Nixie: NixieCanvasClockDesign */
const NIXIE_DESIGN_NAME = "nixie";
const NIXIE_INTER_CHAR_SPACE = 0;
const NIXIE_BORDER_TO_CHAR_SPACE = 12;
const NIXIE_ASSUMED_SCREEN_HEIGHT = 1800;

const directionToXY = [
    [  0, -1 ], // north
    [  1, -1 ], // northeast
    [  1,  0 ], // east
    [  1,  1 ], // southeast
    [  0,  1 ], // south
    [ -1,  1 ], // southwest
    [ -1,  0 ], // west
    [ -1, -1 ], // northwest
];

/* Valid values for drawClock's shadowDirection argument. */
const NORTH = 0;
const NORTHEAST = 1;
const EAST = 2;
const SOUTHEAST = 3;
const SOUTH = 4;
const SOUTHWEST = 5;
const WEST = 6;
const NORTHWEST = 7;

class ClockDesign {
    constructor() {
        this.xPosPercent = 85;
        this.yPosPercent = 85;
        this.xPosRightEdge = true;
        this.yPosBottomEdge = true;
        this.scaleFactor = 1;
        this.outlineColour = [ 0, 0, 0 ];
        this.outlineSize = 1;
        this.shadowLength = 3;
        this.shadowDirection = SOUTHEAST;
        this.showBorder = true;
        this.textColour = [ 255, 255, 255 ];
        this.styleChanged = true;
    }

    drawClock(string) {
        /* To be overridden by subclass */
    }

    setPosition(xPosPercent, yPosPercent, xPosRightEdge, yPosBottomEdge) {
        this.xPosPercent = xPosPercent;
        this.yPosPercent = yPosPercent;
        this.xPosRightEdge = xPosRightEdge;
        this.yPosBottomEdge = yPosBottomEdge;
        this.styleChanged = true;
    }

    setScaleFactor(scaleFactor) {
        this.scaleFactor = scaleFactor;
        this.styleChanged = true;
    }

    /* outlineColour: three-element array [red, green, blue], with each
     * component in the range 0-255.
     * outlineSize: size of the text outline, in units about 1/41 of the
     * character height. */
    setOutline(outlineColour, outlineSize) {
        if (outlineColour == null)
            outlineColour = [ 0, 0, 0 ];
        this.outlineColour = outlineColour;
        this.outlineSize = outlineSize;
        this.styleChanged = true;
    }

    /* textColour: three element array [red, green, blue], with each component
     * in the range 0-255. */
    setTextColour(textColour) {
        this.textColour = textColour;
        this.styleChanged = true;
    }

    /* shadowLength: length of each character's shadow, in units about 1/41 of
     * the character height.
     * shadowDirection: NORTH, NORTHEAST, etc.
     */
    setShadow(shadowLength, shadowDirection) {
        this.shadowLength = shadowLength;
        this.shadowDirection = shadowDirection;
        this.styleChanged = true;
    }

    /* showBorder: true to show a border or background around the clock, false
     * not to. */
    setBorder(showBorder) {
        this.showBorder = showBorder;
        this.styleChanged = true;
    }

    /* borderColour: [ red, green, blue ], each component 0-255.
     * borderAlpha: 0.0-1.0, transparency of the border, especially where it
     * appears as a box background for the clock. */
    setClockBackgroundColour(colour, clockBackgroundAlpha) {
        this.clockBackgroundColour = clockBackgroundColour;
        this.clockBackgroundAlpha = clockBackgroundAlpha;
        this.styleChanged = true;
    }

    supportsClockBackground() {
        return false;
    }

    supportsTextOutline() {
        return true;
    }

    supportsTextColour() {
        return true;
    }

    supportsTextShadow() {
        return true;
    }
}

class CanvasClockDesign extends ClockDesign {
    /* Construct a ClockDesign which paints the clock image onto a canvas
     * which is contained within canvasContainer. Although the constructor
     * returns immediately, the CanvasClockDesign object's drawClock() method
     * is not available for use until finishedCallback is called. Behaviour is
     * undefined if drawClock() is called before then.
     *
     * canvas: the canvas which drawClock() will draw on.
     *
     * canvasContainer: the element containing the canvas. This is used to
     *     check the actual size of the canvas element.
     *
     * characterUrls: an array of data URLs from font.js, in the order
     *     specified there. Each URL refers to an image of a specific character.
     *
     * interCharSpace: the number of units of space to leave between adjacent
     *     character images. Each unit is equal to a pixel in the source
     *     character images.
     *
     * borderToCharVerticalSpace: the number of units of space to leave between
     *     the top border image and the top of the character images, and
     *     between the bottom of the character images and the bottom border.
     *
     * fontScreenHeight: the height of the screen, in pixels, assumed by the
     *     character images. If drawClock is called with scaleX and scaleY
     *     both equal to 1, a character image will take up
     *     (<IMAGE HEIGHT IN PIXELS> / fontScreenHeight) of the vertical space
     *     in the canvas. For the "octagon" design, the character height is 41
     *     and fontScreenHeight is 576.
     *
     * transparentImages: true if the background of the images is transparent
     *     and so we can use the same images to form the outline and shadow.
     *     If this is false, text outline and shadow options will have no
     *     effect.
     *
     * finishedCallback: function which will be called when all character URLs
     *     are successfully loaded, to notify the caller that the object is now
     *     available to be used.
     */
    constructor(canvas, canvasContainer, characterUrls, interCharSpace,
            borderToCharVerticalSpace, fontScreenHeight, transparentImages,
            finishedCallback) {
        super();
        this.characterImages = [];
        this.characterCanvases = [];
        this.numImagesLoaded = 0;
        this.interCharSpace = interCharSpace;
        this.borderToCharVerticalSpace = borderToCharVerticalSpace;
        this.canvas = canvas;
        this.canvasContainer = canvasContainer;
        this.fontScreenHeight = fontScreenHeight;
        this.transparentImages = transparentImages;

        for (let i = 0; i < characterUrls.length; ++i) {
            this.characterImages.push(null);
            this.characterCanvases.push(null);
        }
        let obj = this;
        for (let i = 0; i < characterUrls.length; ++i) {
            this.characterImages[i] = new Image();
            this.characterImages[i].onload = function() {
                obj.characterCanvases[i] = document.createElement("canvas");
                obj.characterCanvases[i].width = obj.characterImages[i].width;
                obj.characterCanvases[i].height = obj.characterImages[i].height;
                let ctx = obj.characterCanvases[i].getContext("2d");
                ctx.drawImage(obj.characterImages[i], 0, 0, obj.characterImages[i].width, obj.characterImages[i].height);
                obj.numImagesLoaded++;
                if (obj.numImagesLoaded == characterUrls.length) {
                    finishedCallback();
                }
            };
            this.characterImages[i].src = characterUrls[i];
        }
    }

    getCharacterWidth(code) {
        return this.characterCanvases[code].width;
    }

    getCharacterHeight(code) {
        return this.characterCanvases[code].height;
    }

    drawCharacter(destImage, code, destX, destY, xLimit=null) {
        let imageData;

        if (xLimit == null) {
            xLimit = this.characterCanvases[code].width;
        }

        let srcImage = this.characterCanvases[code].getContext("2d").getImageData(
                0, 0, Math.min(this.characterCanvases[code].width, xLimit),
                this.characterCanvases[code].height);

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

    static charToIndex(ch) {
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

    makeClockImage(string, border=true) {
        let xstart = 0;
        let ystart = 0;
        let xpos = xstart;

        /* Work out the width and height of the finished clock. Height is easy,
         * it's just the top to bottom height of the NUMBER_BORDER character.
         * Width is the sum of the widths of the left border, the characters,
         * the inter-character spacing, and the right border.
         * Note that we allow space for the border even if we're not actually
         * showing it, so that the clock doesn't jump around the screen when we
         * toggle the border. */
        let height;
        let width;
        let charsPrinted = 0;

        height = this.getCharacterHeight(NUMBER_BORDER);
        width = this.getCharacterWidth(LEFT_BORDER);
        for (let i = 0; i < string.length; ++i) {
            let charWidth = this.getCharacterWidth(CanvasClockDesign.charToIndex(string[i]));
            if (charsPrinted > 0) {
                width += this.interCharSpace;
            }
            width += charWidth;
            charsPrinted++;
        }
        width += this.getCharacterWidth(RIGHT_BORDER);

        let imageData = new ImageData(width, height);

        if (border) {
            /* Draw left border */
            this.drawCharacter(imageData, LEFT_BORDER, xpos, ystart);
        }

        xpos += this.getCharacterWidth(LEFT_BORDER);

        charsPrinted = 0;
        for (let i = 0; i < string.length; ++i) {
            let ch = string[i];
            let charIndex = CanvasClockDesign.charToIndex(ch);

            if (charIndex != null) {
                let charWidth = this.getCharacterWidth(charIndex);

                if (charsPrinted > 0) {
                    /* Leave some space after the last character, and draw the
                     * top and bottom border above and below this space */
                    if (border && this.interCharSpace > 0) {
                        this.drawCharacter(imageData, NUMBER_BORDER, xpos, ystart, this.interCharSpace);
                    }
                    xpos += this.interCharSpace;
                }

                if (border) {
                    /* Draw the top and bottom border over this character */
                    this.drawCharacter(imageData, NUMBER_BORDER, xpos, ystart, charWidth);
                }

                /* Draw the character, a set distance below the top border */
                this.drawCharacter(imageData, charIndex, xpos, ystart + this.borderToCharVerticalSpace);

                /* Advance xpos by the width of this character */
                xpos += charWidth;

                charsPrinted++;
            }
        }

        if (border) {
            /* Draw right border */
            this.drawCharacter(imageData, RIGHT_BORDER, xpos, ystart);
        }

        return imageData;
    }

    static changeNonTransparentPixelColour(imageData, newColour) {
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

    /* Resize the canvas to the width and height of its container, clear the
     * canvas, and draw the clock graphic onto the canvas, with the left edge
     * at xPosPercent and the top edge at yPosPercent. These percentages are
     * relative to the width and height of the canvas respectively. However,
     * the measurements are instead reckoned from the right edge and bottom
     * edge if xPosRightEdge and yPosBottomEdge, respectively, are true.)
     *
     * The string should consist of one or more characters from the following
     * set:
     *    digits 0-9, space, colon (:), dot (.), minus (-)
     * Any other characters in the string are ignored.
     *
     * The constructor must have finished loading the image files and called
     * finishedCallback() before anything calls this method.
     */
    drawClock(string) {
		let destCanvas = this.canvas;
        let canvasContainer = this.canvasContainer;

        this.clearClock();

        let xstart = Math.floor(destCanvas.width * this.xPosPercent / 100.0);
        let ystart = Math.floor(destCanvas.height * this.yPosPercent / 100.0);

        /* Scale the characters by the ratio of the actual canvas height and
         * the screen height assumed by the PNG files */
        let scaleY = this.scaleFactor * destCanvas.height / this.fontScreenHeight;
        let scaleX = this.scaleFactor * destCanvas.height / this.fontScreenHeight;

        let destContext = destCanvas.getContext("2d");

        /* Get our basic clock image based on this string */
        let clockImage = this.makeClockImage(string, this.showBorder);

        /* Clock canvas: just the image of the numbers with no outline, padding
         * or shadow. */
        let clockCanvas = document.createElement("canvas");

        /* Outline canvas: we'll use the clock image and stamp it onto the
         * outline canvas several times to make an outline of the clock
         * digits. */
        let outlineCanvas = document.createElement("canvas");

        /* Finished canvas: the finished clock image with outline and shadow. */
        let finishedCanvas = document.createElement("canvas");

        /* Padding: make our intermediate canvases the size of the clock image,
         * plus the expected outline and shadow */
        let padding = this.shadowLength + this.outlineSize;

        clockCanvas.width = clockImage.width;
        clockCanvas.height = clockImage.height;
        outlineCanvas.width = (clockImage.width + 2 * padding);
        outlineCanvas.height = (clockImage.height + 2 * padding);
        finishedCanvas.width = outlineCanvas.width;
        finishedCanvas.height = outlineCanvas.height;

        let clockContext = clockCanvas.getContext("2d");
        let outlineContext = outlineCanvas.getContext("2d");
        let finishedContext = finishedCanvas.getContext("2d");

        if (this.transparentImages && this.outlineColour != null) {
            /* Draw the outline, in outlineColour */
            CanvasClockDesign.changeNonTransparentPixelColour(clockImage, this.outlineColour);
            clockContext.putImageData(clockImage, 0, 0);
            for (let dy = -this.outlineSize; dy <= this.outlineSize; ++dy) {
                for (let dx = -this.outlineSize; dx <= this.outlineSize; ++dx) {
                    outlineContext.drawImage(clockCanvas, padding + dx, padding + dy);
                }
            }

            /* Put the outline on the finished context */
            finishedContext.drawImage(outlineCanvas, 0, 0);

            /* Draw the shadow by smearing the outline in a particular
             * direction */
            for (let dist = 1; dist <= this.shadowLength; ++dist) {
                finishedContext.drawImage(outlineCanvas,
                        directionToXY[this.shadowDirection][0] * dist,
                        directionToXY[this.shadowDirection][1] * dist);
            }
        }

        /* Finally, draw the actual numbers on top of the outline, using the
         * main colour. */
        if (this.transparentImages) {
            CanvasClockDesign.changeNonTransparentPixelColour(clockImage, this.textColour);
        }
        clockContext.putImageData(clockImage, 0, 0);
        finishedContext.drawImage(clockCanvas, padding, padding);

        if (this.yPosBottomEdge) {
            ystart -= finishedCanvas.height * scaleY;
        }
        if (this.xPosRightEdge) {
            xstart -= finishedCanvas.width * scaleX;
        }

        /* Now take our finished image and draw it onto the destination canvas
         * at the desired position. */
        destContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
        destContext.drawImage(finishedCanvas, Math.floor(xstart / scaleX),
                Math.floor(ystart / scaleY));
        destContext.setTransform(1, 0, 0, 1, 0, 0);
    }

    /* Resize the canvas to the width and height of its container, and clear
     * the canvas. */
    clearClock() {
        this.canvas.width = this.canvasContainer.clientWidth;
        this.canvas.height = this.canvasContainer.clientHeight;
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    supportsTextColour() {
        return this.transparentImages;
    }

    supportsTextOutline() {
        return this.transparentImages;
    }

    supportsTextShadow() {
        return this.transparentImages;
    }
}

class OctagonCanvasClockDesign extends CanvasClockDesign {
    constructor(canvas, canvasContainer, finishedCallback) {
        super(canvas, canvasContainer, characterDesignUrls[OCTAGON_DESIGN_NAME],
            OCTAGON_INTER_CHAR_SPACE, OCTAGON_BORDER_TO_CHAR_SPACE,
            OCTAGON_ASSUMED_SCREEN_HEIGHT, true, finishedCallback);
    }
}

class NixieCanvasClockDesign extends CanvasClockDesign {
    constructor(canvas, canvasContainer, finishedCallback) {
        super(canvas, canvasContainer, characterDesignUrls[NIXIE_DESIGN_NAME],
            NIXIE_INTER_CHAR_SPACE, NIXIE_BORDER_TO_CHAR_SPACE,
            NIXIE_ASSUMED_SCREEN_HEIGHT, false, finishedCallback);
    }
}
