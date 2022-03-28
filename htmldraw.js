
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

class HTMLBoxClockDesign extends ClockDesign {
    constructor(container, uniqueClassName) {
        super();
        this.container = container;
        this.div = document.createElement("DIV");
        this.div.classList.add(uniqueClassName);
        this.div.style.position = "absolute";
        this.div.style.fontFamily = [ "Inter", "sans-serif" ];
        this.div.style.fontVariantNumeric = "tabular-nums";
        this.div.style.fontWeight = "bold";
        this.div.style.display = "none"; // don't display anything yet
        this.container.appendChild(this.div);
    }

    /* scaleX is ignored, and the value of outlineSize is ignored except
     * to see if it's zero or not. */
    drawClock(string, xPosPercent, yPosPercent, mainColour,
            xPosRightEdge=false, yPosBottomEdge=false,
            scaleX=1, scaleY=1, outlineColour=null, outlineSize=0,
            shadowLength=0, shadowDirection=SOUTHEAST, showBorder=true) {
        let charHeightPx = scaleY * this.container.clientHeight / 15;
        let lengthUnitPx = charHeightPx / 40;
        this.div.style.fontSize = charHeightPx.toString() + "px";
        this.div.style.color = tripleToRGBString(mainColour);
        this.div.style.display = "block";
        this.div.style.paddingLeft = (lengthUnitPx * 10).toString() + "px";
        this.div.style.paddingRight = (lengthUnitPx * 10).toString() + "px";

        if (showBorder) {
            this.div.style.backgroundColor = "rgba(0, 0, 0, 70%)";
        }
        else {
            this.div.style.backgroundColor = null;
        }

        let shadows = [];

        if (outlineSize > 0) {
            /* We abuse shadows to make an outline, so we don't allow an
             * outline size of greater than 0.5 or it looks awful. */
            outlineSize = 0.5;
            if (outlineColour == null) {
                outlineColour = [0, 0, 0];
            }
            for (let d = 0; d < 8; ++d) {
                let shadowPx = outlineSize * lengthUnitPx;
                shadows.push((directionToXY[d][0] * shadowPx).toString() + "px " +
                    (directionToXY[d][1] * shadowPx).toString() + "px " +
                    (shadowPx).toString() + "px " +
                    tripleToRGBString(outlineColour));
            }
        }

        if (shadowLength > 0) {
            let horizShadow = directionToXY[shadowDirection][0] * shadowLength * lengthUnitPx;
            let vertShadow = directionToXY[shadowDirection][1] * shadowLength * lengthUnitPx;
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

        if (xPosRightEdge) {
            this.div.style.right = (100 - xPosPercent).toString() + "%";
            this.div.style.left = null;
        }
        else {
            this.div.style.left = xPosPercent.toString() + "%";
            this.div.style.right = null;
        }

        if (yPosBottomEdge) {
            this.div.style.top = null;
            this.div.style.bottom = (100 - yPosPercent).toString() + "%";
        }
        else {
            this.div.style.top = yPosPercent.toString() + "%";
            this.div.style.bottom = null;
        }

        /* Replace spaces with &numsp and - with &minus so that space padding
         * works and the minus sign looks a bit more minusy. */
        string = string.replace(" ", "&numsp;");
        string = string.replace("-", "&minus;");
        this.div.innerHTML = string;
    }

    clearClock() {
        this.div.style.display = "none";
    }
}
