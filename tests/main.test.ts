require("webgl-mock");

import FragmentCanvas from "../src";

test("initializes a fragment canvas with default shaders and uniforms", () => {
    const canvas = new HTMLCanvasElement();
    canvas.width = 800;
    canvas.height = 600;

    new FragmentCanvas(canvas);
});
