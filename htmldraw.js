
function tripleToRGBString(colour) {
    s = "rgb(";
    for (let i = 0; i < 3; ++i) {
        s += colour[i].toString();
        if (i < 2)
            s += ",";
    }
    s += ")";
    return s;
}

function tripleToRGBAString(colour, alpha) {
    s = "rgba(";
    for (let i = 0; i < 3; ++i) {
        s += colour[i].toString() + ", ";
    }
    s += alpha.toString() + ")";
    return s;
}

/* Scan "src" and replace every run of consecutive occurrences of the character
 * "seek" with a <span style="visibility: hidden"></span> tag, whose contents
 * is that same number of occurrences of the character "repl" and return the
 * result. */
function replaceWithInvisible(src, seek, repl) {
    let dest = "";
    let srcPos = 0;
    while (srcPos < src.length) {
        if (src.charAt(srcPos) == seek) {
            dest += "<span style=\"visibility: hidden\">"
            while (srcPos < src.length && src.charAt(srcPos) == seek) {
                dest += repl;
                srcPos++;
            }
            dest += "</span>";
        }
        else {
            dest += src.charAt(srcPos++);
        }
    }
    return dest;
}

class HTMLBoxClockDesign extends ClockDesign {
    constructor(container, uniqueClassName) {
        super();
        this.container = container;
        this.div = document.createElement("DIV");
        this.div.classList.add(uniqueClassName);
        this.div.style.position = "absolute";
        this.div.style.fontFamily = [ this.fontFamily, "sans-serif" ];
        this.div.style.fontVariantNumeric = "tabular-nums";
        this.div.style.display = "none"; // don't display anything yet
        this.container.appendChild(this.div);

        this.showBorder = true;
        this.clockBackgroundColour = [ 0, 0, 0 ];
        this.clockBackgroundAlpha = 0.7;
        this.styleChanged = true;
        this.applyStyle();
    }

    setOutline(outlineColour, outlineSize) {
        if (outlineSize > 0)
            outlineSize = 0.5;
        else
            outlineSize = 0;
        super.setOutline(outlineColour, outlineSize);
    }

    setClockBackgroundColour(clockBackgroundColour, clockBackgroundAlpha) {
        this.clockBackgroundColour = clockBackgroundColour;
        this.clockBackgroundAlpha = clockBackgroundAlpha;
        this.styleChanged = true;
    }

    supportsClockBackground() {
        return true;
    }

    supportsFonts() {
        return true;
    }

    applyStyle() {
        let charHeightPx = this.scaleFactor * this.container.clientHeight / 15;
        let lengthUnitPx = charHeightPx / 40;
        this.div.style.fontSize = charHeightPx.toString() + "px";
        this.div.style.color = tripleToRGBString(this.textColour);
        this.div.style.display = "block";
        this.div.style.paddingLeft = "0.25em";
        this.div.style.paddingRight = "0.25em";
        this.div.style.fontFamily = [ this.fontFamily, "sans-serif" ];

        if (this.fontFamily == "'Press Start 2P'") {
            /* Press Start 2P has zero padding on top; fix that */
            this.div.style.paddingTop = (charHeightPx / 8).toString() + "px";
        }
        else {
            this.div.style.paddingTop = null;
        }

        if (this.showBorder) {
            this.div.style.backgroundColor = tripleToRGBAString(this.clockBackgroundColour, this.clockBackgroundAlpha);
        }
        else {
            this.div.style.backgroundColor = null;
        }

        let shadows = [];

        if (this.outlineSize > 0) {
            /* We abuse shadows to make an outline, so we don't allow an
             * outline size of greater than 0.5 or it looks awful. */
            for (let d = 0; d < 8; ++d) {
                let shadowPx = this.outlineSize * lengthUnitPx;
                shadows.push((directionToXY[d][0] * shadowPx).toString() + "px " +
                    (directionToXY[d][1] * shadowPx).toString() + "px " +
                    shadowPx.toString() + "px " +
                    tripleToRGBString(this.outlineColour));
            }
        }

        if (this.shadowLength > 0) {
            let horizShadow = directionToXY[this.shadowDirection][0] * this.shadowLength * lengthUnitPx;
            let vertShadow = directionToXY[this.shadowDirection][1] * this.shadowLength * lengthUnitPx;
            let blurRadius = (Math.abs(horizShadow) > Math.abs(vertShadow) ? Math.abs(horizShadow) : Math.abs(vertShadow));
            shadows.push(horizShadow.toString() + "px " +
                vertShadow.toString() + "px " +
                blurRadius.toString() + "px black");
        }

        let shadowString = "";
        if (shadows.length == 0) {
            shadowString = "none";
        }
        else {
            for (let i = 0; i < shadows.length; ++i) {
                if (i > 0)
                    shadowString += ", ";
                shadowString += shadows[i];
            }
        }
        this.div.style.textShadow = shadowString;

        if (this.xPosRightEdge) {
            this.div.style.right = (100 - this.xPosPercent).toString() + "%";
            this.div.style.left = null;
        }
        else {
            this.div.style.left = this.xPosPercent.toString() + "%";
            this.div.style.right = null;
        }

        if (this.yPosBottomEdge) {
            this.div.style.top = null;
            this.div.style.bottom = (100 - this.yPosPercent).toString() + "%";
        }
        else {
            this.div.style.top = this.yPosPercent.toString() + "%";
            this.div.style.bottom = null;
        }
        this.styleChanged = false;
    }

    drawClock(string) {
        if (this.styleChanged) {
            this.applyStyle();
        }

        if (this.fontFamily != "'Press Start 2P'") {
            /* Replace - with &minus so it looks a bit more minusy, except
             * don't do that with Press Start 2P because it doesn't have a
             * specific &minus; character. */
            string = string.replace(/-/g, "&minus;");
        }

        /* Replace every run of spaces with the same number of invisible digits.
         * We can't use &numsp; because that turns out not always to be exactly
         * the same width as a digit. When " 9" becomes "10" we don't want the
         * size of the div to change. */
        string = replaceWithInvisible(string, " ", "0");

        this.div.innerHTML = string;
    }

    clearClock() {
        this.div.style.display = "none";
        this.styleChanged = true;
    }
}
