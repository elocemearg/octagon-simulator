# octagon-simulator
HTML/Javascript mockup of the on-screen countdown clock used by various 90s BBC shows, prompted by [this video about the BBC Micro](https://www.youtube.com/watch?v=g80rnhK-cKo#t=16m32s).

## Technical mumbling and assumptions made

Each character is represented by a 41x25 pixel PNG image, the contents of which come from looking at screenshots of old shows along with equal parts measurement and guesswork. The script `gendata.py` takes the images and converts them to an array of data-URLs in `font.js`, and that's what's used by the rest of the code.

In making the characters and how they're laid out, I made the following assumptions, which were based on the same measurement/guesswork dream team:
* Each digit is 41 pixels high by 25 pixels wide, except the colon character which I've made 12 pixels wide. Most of the horizontal and vertical strokes are 5 pixels thick.
* Between each pair of characters, there's 18 pixels of space.
* There's some vertical space between the horizontal border and the digits. I've taken the distance between the top of the border and the top of the digit as 18 pixels.
* To the left of the leftmost digit, and to the right of the rightmost digit, the horizontal lines comprising the top and bottom border extend a short distance before the diagonals of the octagon. I've taken this as 3 pixels, and it's included in `leftborder.png` and `rightborder.png`.
* The height of the whole graphic (top of top border to bottom of bottom border) seems to have been about 76 lines out of a 576-line picture, so the result is scaled accordingly based on the window size.
