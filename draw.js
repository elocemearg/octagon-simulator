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

/* A bounding box on a canvas which we define as "dirty". Helps us to remember
 * which part of the canvas we need to clear, to avoid having to clear all of
 * it. */
class CanvasDirtyRegion {
    constructor() {
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.clean = true;
    }

    getLeft() {
        return this.x1;
    }

    getTop() {
        return this.y1;
    }

    getWidth() {
        return 1 + this.x2 - this.x1;
    }

    getHeight() {
        return 1 + this.y2 - this.y1;
    }

    isClean() {
        return this.clean;
    }

    /* Mark the rectangle bounded by the top-left corner (x1, y1) and the
     * bottom-right corner (x2, y2) as dirty, and expand the dirty region
     * accordingly. */
    setDirtyRegion(x1, y1, x2, y2) {
        if (this.isClean()) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.clean = false;
        }
        else {
            this.x1 = Math.min(this.x1, x1);
            this.y1 = Math.min(this.y1, y1);
            this.x2 = Math.max(this.x2, x2);
            this.y2 = Math.max(this.y2, y2);
        }
    }

    setClean() {
        this.clean = true;
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
        this.canvasDirtyRegion = new CanvasDirtyRegion();
        this.clockBrushCanvas = document.createElement("canvas");

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

    drawCharacter(destCanvasContext, code, destX, destY, xLimit=null) {
        if (xLimit == null) {
            xLimit = this.characterCanvases[code].width;
        }
        destCanvasContext.drawImage(this.characterCanvases[code], destX, destY,
            Math.min(this.characterCanvases[code].width, xLimit),
            this.characterCanvases[code].height);
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

    /*
     * Return a canvas showing the clock text described by "string" without any
     * outline or shadow applied to it. If the character images have
     * transparency (this.transparentImages true), this canvas may be used as
     * a "brush" to draw the outline and shadow in different colours before
     * drawing the clock text.
     *
     * If existingCanvas is null, we create a new canvas and return it.
     * Otherwise we clear and reuse the existing canvas.
     */
    makeClockCanvas(string, existingCanvas, border=true) {
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

        let clockCanvas;
        let clockCanvasContext;
        if (existingCanvas) {
            clockCanvas = existingCanvas;
            clockCanvas.width = width;
            clockCanvas.height = height;
            clockCanvasContext = clockCanvas.getContext("2d");
            clockCanvasContext.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
        }
        else {
            clockCanvas = document.createElement("canvas");
            clockCanvas.width = width;
            clockCanvas.height = height;
            clockCanvasContext = clockCanvas.getContext("2d");
        }
        
        if (border) {
            /* Draw left border */
            this.drawCharacter(clockCanvasContext, LEFT_BORDER, xpos, ystart);
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
                        this.drawCharacter(clockCanvasContext, NUMBER_BORDER, xpos, ystart, this.interCharSpace);
                    }
                    xpos += this.interCharSpace;
                }

                if (border) {
                    /* Draw the top and bottom border over this character */
                    this.drawCharacter(clockCanvasContext, NUMBER_BORDER, xpos, ystart, charWidth);
                }

                /* Draw the character, a set distance below the top border */
                this.drawCharacter(clockCanvasContext, charIndex, xpos, ystart + this.borderToCharVerticalSpace);

                /* Advance xpos by the width of this character */
                xpos += charWidth;

                charsPrinted++;
            }
        }

        if (border) {
            /* Draw right border */
            this.drawCharacter(clockCanvasContext, RIGHT_BORDER, xpos, ystart);
        }

        return clockCanvas;
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

    /* Scale factor by which we scale the canvas we paint, which takes into
     * account the user setting and the font's assumed screen height relative
     * to the actual canvas height. */
    calculateModifiedScaleFactor() {
        return this.scaleFactor * this.canvas.height / this.fontScreenHeight;
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
        let scaleY = this.calculateModifiedScaleFactor();
        let scaleX = scaleY;

        let destContext = destCanvas.getContext("2d");

        /* Get our basic clock canvas based on this string. We'll use this as
         * our "brush", and we'll paint the outline, shadow and text using
         * this brush in the required colours. */
        let clockBrushCanvas = this.makeClockCanvas(string, this.clockBrushCanvas, this.showBorder);
        let clockBrushContext = clockBrushCanvas.getContext("2d");
        this.clockBrushCanvas = clockBrushCanvas;

        /* Finished canvas: the finished clock image with outline and shadow. */
        let finishedCanvas = document.createElement("canvas");
        let finishedContext = finishedCanvas.getContext("2d");

        /* Amount of padding on the left and top between the edge of
         * finishedCanvas and the top-left corner of the final clock text.
         * We set this to something positive if ther's any outline or shadow. */
        let padding = 0;

        /* finishedCanvas's dimensions are the same as the clock image for now.
         * If we add outline or shadow below, we'll make it larger then. */
        finishedCanvas.width = clockBrushCanvas.width;
        finishedCanvas.height = clockBrushCanvas.height;

        if (this.transparentImages) {
            /* Outline canvas: we'll use the clock image and stamp it onto the
             * outline canvas several times to make an outline of the clock
             * digits. */
            let outlineCanvas = document.createElement("canvas");
            let outlineContext = outlineCanvas.getContext("2d");
            let clockBrushImage = clockBrushContext.getImageData(0, 0, clockBrushCanvas.width, clockBrushCanvas.height);

            /* Padding: make our intermediate canvases the size of the clock
             * image, plus the expected outline and shadow */
            padding = this.shadowLength + this.outlineSize;
            outlineCanvas.width = (clockBrushImage.width + 2 * padding);
            outlineCanvas.height = (clockBrushImage.height + 2 * padding);
            finishedCanvas.width = outlineCanvas.width;
            finishedCanvas.height = outlineCanvas.height;

            if (this.outlineColour != null) {
                /* Draw the outline, in outlineColour */
                CanvasClockDesign.changeNonTransparentPixelColour(clockBrushImage, this.outlineColour);
                clockBrushContext.putImageData(clockBrushImage, 0, 0);
                for (let dy = -this.outlineSize; dy <= this.outlineSize; ++dy) {
                    for (let dx = -this.outlineSize; dx <= this.outlineSize; ++dx) {
                        outlineContext.drawImage(clockBrushCanvas, padding + dx, padding + dy);
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
            CanvasClockDesign.changeNonTransparentPixelColour(clockBrushImage, this.textColour);
            clockBrushContext.putImageData(clockBrushImage, 0, 0);
            finishedContext.drawImage(clockBrushCanvas, padding, padding);
        }
        else {
            finishedContext.drawImage(clockBrushCanvas, padding, padding);
        }

        if (this.yPosBottomEdge) {
            ystart -= finishedCanvas.height * scaleY;
        }
        if (this.xPosRightEdge) {
            xstart -= finishedCanvas.width * scaleX;
        }

        /* Now take our finished image and draw it onto the destination canvas
         * at the desired position. */
        let x = Math.floor(xstart / scaleX);
        let y = Math.floor(ystart / scaleY);
        destContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
        destContext.drawImage(finishedCanvas, x, y);
        destContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasDirtyRegion.setDirtyRegion(x, y, x + finishedCanvas.width, y + finishedCanvas.height);

        this.styleChanged = false;
    }

    /* Resize the canvas to the width and height of its container, and clear
     * the canvas. */
    clearClock(forceFullClean=false) {
        if (!this.styleChanged && !forceFullClean &&
                this.canvas.width == this.canvasContainer.clientWidth &&
                this.canvas.height == this.canvasContainer.clientHeight) {
            /* Optimised clear - clear only the bounding rectangle around
             * what's already been painted on. */
            if (!this.canvasDirtyRegion.isClean()) {
                let context = this.canvas.getContext("2d");
                let scale = this.calculateModifiedScaleFactor();
                context.setTransform(scale, 0, 0, scale, 0, 0);
                context.clearRect(
                    this.canvasDirtyRegion.getLeft(),
                    this.canvasDirtyRegion.getTop(),
                    this.canvasDirtyRegion.getWidth(),
                    this.canvasDirtyRegion.getHeight()
                );
                context.setTransform(1, 0, 0, 1, 0, 0);
            }
        }
        else {
            /* If any style options have changed, or the canvas size has
             * changed since we last set it to the dimensions of its
             * container, clear the whole canvas. */
            this.canvas.width = this.canvasContainer.clientWidth;
            this.canvas.height = this.canvasContainer.clientHeight;
            this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        this.canvasDirtyRegion.setClean();
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
