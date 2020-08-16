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

    if (minus)
        n = -n;

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
        s = "-" + s;
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

    formatValue(formatCode, useLeadingZero=false, secondsOnly=false) {
        let valueSeconds;
        let initValueSeconds;
        let minDigits;

        if (this.direction < 0) {
            valueSeconds = Math.ceil(this.getValueMs() / 1000);
            initValueSeconds = Math.ceil(this.initialValueMs / 1000);
        }
        else {
            valueSeconds = Math.floor(this.getValueMs() / 1000);
            initValueSeconds = Math.floor(this.initialValueMs / 1000);
        }

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
            timeString = this.formatNumber(valueSeconds, minDigits, useLeadingZero);
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

        return timeString;
    }

    setDirection(dir) {
        let wallNow = new Date().getTime();
        this.valueMs = this.getValueMs(wallNow);
        this.valueWallTime = wallNow;
        this.direction = dir;
    }
}
