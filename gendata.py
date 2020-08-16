#!/usr/bin/python3

# Take the png files in ./png and create a font.js file containing an array
# of data-URLs containing the PNG for each character. These data-URLs are used
# by draw.js to make a canvas for each character.
# font.js will also contain symbolic constants for each character, such as
# DIGIT0 = 0, DIGIT1 = 1, etc.

import os
import base64

image_dir = "./png"
image_extension = ".png"
output_file = "font.js"

filenames = [
        "0", "1", "2", "3", "4",
        "5", "6", "7", "8", "9", "colon",
        "numbertopbottomborder", "leftborder", "rightborder",
        "space", "dot", "minus"
]

symbolic_names = [ "DIGIT" + str(x) for x in range(0, 10) ] + [
        "COLON", "NUMBER_BORDER", "LEFT_BORDER", "RIGHT_BORDER",
        "SPACE", "DOT", "MINUS"
]

# if font.js exists, back it up
if os.path.exists(output_file):
    os.rename(output_file, output_file + ".old")

try:
    with open(output_file, "w") as fout:
        fout.write("const characterUrls = [\n")
        char_id = 0
        for name in filenames:
            filename = os.path.join(image_dir, name + image_extension)
            with open(filename, "rb") as f:
                data = f.read()
                base64_string = base64.b64encode(data).decode("utf-8")
                fout.write("\n\t/* %s: from %s */\n" % (symbolic_names[char_id], filename));
                fout.write("\t\"data:image/png;base64," + base64_string + "\"");
            fout.write("%s\n" % ("," if char_id < len(filenames) - 1 else ""))
            char_id += 1
        fout.write("];\n\n")
        for i in range(len(filenames)):
            if i < len(symbolic_names):
                fout.write("const %s = %d;\n" % (symbolic_names[i], i))
except FileNotFoundError as e:
    os.remove(output_file)
    raise e
