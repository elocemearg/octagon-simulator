function secondsToFormatCode(seconds) {
    if (seconds < 10) {
        return 1;
    }
    else if (seconds < 60) {
        return 2;
    }
    else if (seconds < 600) {
        return 3;
    }
    else {
        return 4;
    }
}

function formatNumber(n, minDigits, useLeadingZero) {
    let s = "";
    let minus = (n < 0);
    let digitsWritten = 0;

    if (minus) {
        n = -n;
    }

    while (n > 0 || s.length < minDigits) {
        let d = n % 10;
        let c;
        if (d == 0 && n == 0 && !useLeadingZero && digitsWritten > 0) {
            c = " ";
        }
        else {
            c = d.toString();
            digitsWritten++;
        }
        s = c + s;
        n = Math.floor(n / 10);
    }
    if (minus) {
        /* Find the last space, or if we're zero-padding, the first character
         * if that is a zero, and replace it with a minus. If there is no
         * such character, put a minus at the front of the string. */
        let minusPos;
        if (useLeadingZero) {
            if (s.length > 0 && s.charAt(0) === "0") {
                minusPos = 0;
            }
            else {
                minusPos = -1;
            }
        }
        else {
            minusPos = s.lastIndexOf(" ");
        }
        if (minusPos == -1) {
            s = "-" + s;
        }
        else {
            s = s.substring(0, minusPos) + "-" + s.substring(minusPos + 1);
        }
    }
    return s;
}

class Clock {
    constructor(startTimeSeconds) {
        this.direction = -1;
        this.running = false;
        this.reset = true;
        this.valueMs = Math.floor(startTimeSeconds * 1000);
        this.initialValueMs = this.valueMs;
        this.valueWallTime = new Date().getTime();
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.reset = false;
            this.valueWallTime = new Date().getTime();
        }
    }

    stop() {
        if (this.running) {
            let wallNow = new Date().getTime();
            this.valueMs = this.getValueMs(wallNow);
            this.valueWallTime = wallNow;
            this.running = false;
        }
    }

    resetClock() {
        this.valueMs = this.initialValueMs;
        this.valueWallTime = new Date().getTime();
        if (!this.running) {
            this.reset = true;
        }
    }

    setInitialValueSeconds(sec) {
        this.initialValueMs = Math.floor(sec * 1000);
        if (this.reset) {
            this.valueMs = this.initialValueMs;
            this.valueWallTime = new Date().getTime();
        }
    }

    getValueMs(wallNow=null) {
        let value = this.valueMs;
        if (this.running) {
            if (wallNow == null)
                wallNow = new Date().getTime();
            value += this.direction * (wallNow - this.valueWallTime);
        }
        if (value < 0)
            value = 0;
        return value;
    }

    isRunning() {
        return this.running;
    }

    getDirection() {
        return this.direction;
    }

    /* Get valueMs, in milliseconds, rounded appropriately for the clock
     * direction and how many decimal places we'd show if we formatted it in
     * seconds. So if decimalPlaces is 1 and valueMs is 2345, then if the
     * clock is counting upwards we return 2300.
     *
     * Note that if the clock is counting upwards we always round down (e.g.
     * 2.9s shows as 2 if decimalPlaces=0). If the clock is counting downwards
     * we always round up (e.g. 2.1s shows as 3) - this is so that we only
     * display zero when the time has actually run out. */
    getMsToFormat(valueMs, decimalPlaces) {
        if (decimalPlaces > 3)
            decimalPlaces = 3;
        if (decimalPlaces < 0)
            decimalPlaces = 0;

        let divisor = Math.pow(10, 3 - decimalPlaces);
        if (this.direction < 0) {
            return Math.ceil(valueMs / divisor) * divisor;
        }
        else {
            return Math.floor(valueMs / divisor) * divisor;
        }
    }

    /* formatValue: format the current value on the clock as a string.
     *
     * formatCode: if positive, it's the minimum number of digits to display
     * to the left of the decimal point (or at all, if there's no decimal
     * point). If -1, we use the minimum number of digits we'd take to show
     * the start time, and if -2, we use the minimum number of digits we'd take
     * to show the current time.
     *
     * useLeadingZero: if the most significant field we're displaying (whether
     * that's minutes or seconds) needs to be left-padded to meet the format,
     * it will be padded with a zero if useLeadingZero is true, or a space if
     * it's false.
     *
     * secondsOnly: don't use a minutes field, just display the number of
     * seconds, so that e.g. 3 minutes shows as "180".
     *
     * decimalPlaces: the number of digits to show after the decimal point.
     * This is capped within the range 0-3. If it's 0, no decimal point is
     * shown.
     * */
    formatValue(formatCode, useLeadingZero=false, secondsOnly=false, decimalPlaces=0) {
        let valueSeconds;
        let initValueSeconds;
        let minDigits;
        let msToShow;

        msToShow = this.getMsToFormat(this.getValueMs(), decimalPlaces);

        valueSeconds = Math.floor(msToShow / 1000);
        initValueSeconds = Math.floor(this.getMsToFormat(this.initialValueMs, decimalPlaces) / 1000);

        if (formatCode == -1) {
            minDigits = secondsToFormatCode(initValueSeconds);
        }
        else if (formatCode == -2) {
            minDigits = secondsToFormatCode(valueSeconds);
        }
        else {
            minDigits = formatCode;
        }

        let timeString = "";

        if (secondsOnly) {
            timeString = formatNumber(valueSeconds, minDigits, useLeadingZero);
        }
        else {
            let secondsPart = valueSeconds % 60;
            let minutesPart = Math.floor(valueSeconds / 60);
            timeString = formatNumber(secondsPart,
                    minutesPart > 0 ? 2 : Math.min(minDigits, 2),
                    useLeadingZero || minDigits > 2 || minutesPart > 0);
            if (minDigits > 2 || minutesPart > 0) {
                timeString = ":" + timeString;
                timeString = formatNumber(minutesPart, Math.max(1, minDigits - 2), useLeadingZero) + timeString;
            }
        }

        if (decimalPlaces > 0) {
            if (decimalPlaces > 3)
                decimalPlaces = 3;
            timeString += ".";
            timeString += formatNumber(
                    Math.floor((msToShow % 1000) / Math.pow(10, 3 - decimalPlaces)),
                    decimalPlaces, true);
        }

        return timeString;
    }

    setDirection(dir) {
        let wallNow = new Date().getTime();
        this.valueMs = this.getValueMs(wallNow);
        this.valueWallTime = wallNow;
        this.direction = dir;
    }
}
