function testFormatNumber() {
    const tests = [
        [ 0, 1, false, "0" ],
        [ -1, 2, false, "-1" ],
        [ 1, 2, false, " 1" ],
        [ 1, 2, true, "01" ],
        [ -1, 3, false, " -1" ],
        [ -1, 3, true, "-01" ],
        [ 100, 3, false, "100" ],
        [ 0, 5, false, "    0" ],
        [ 0, 5, true, "00000" ],
        [ -100, 5, true, "-0100" ],
        [ 12345, 1, true, "12345" ],
        [ 12345, 1, false, "12345" ],
        [ 1, 0, false, "1" ],
        [ 0, 0, false, "" ],
        [ -123, 3, false, "-123" ]
    ];

    let numFailures = 0;

    for (let testNum = 0; testNum < tests.length; ++testNum) {
        let test = tests[testNum];
        let observed = formatNumber(test[0], test[1], test[2]);
        let expected = test[3];

        let testTitle = "Test " + (testNum + 1).toString() + ": formatNumber(n=" + test[0].toString() + ", minDigits=" + test[1].toString() + ", useLeadingZero=" + test[2].toString() + ")";
        if (observed === expected) {
            console.log(testTitle + ": success (\"" + observed + "\")");
        }
        else {
            console.log(testTitle + ": FAILURE (expected \"" + expected.toString() + "\", observed \"" + observed.toString() + "\")");
            numFailures++;
        }
    }

    if (numFailures > 0) {
        console.log(numFailures.toString() + " tests failed.");
    }
    else {
        console.log("All tests passed.");
    }
}
