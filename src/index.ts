import { defaultFragment, defaultVertex } from "./shaders";

export type FragmentCanvasOptions = {
    /**
     * Fragment shader to use.
     */
    fragmentShader: string;

    /**
     * Vertex shader to use (you probably don't need this).
     */
    vertexShader: string;

    /**
     * Custom uniforms to pass to the shader.
     * Use `gl.uniform[1234][fi][v](location, [value])` to set their values.
     */
    uniforms: Record<
        string,
        (
            gl: WebGLRenderingContext,
            location: WebGLUniformLocation,
            time?: DOMHighResTimeStamp
        ) => void
    >;

    /**
     * Whether to automatically render the shader with requestAnimationFrame.
     * @default true
     */
    autoRender: boolean;

    /**
     * Blend function to use
     *
     * @default [WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE]
     */
    blendFunc: [number, number];
};

const defaultOptions: FragmentCanvasOptions = {
    fragmentShader: defaultFragment,
    vertexShader: defaultVertex,
    uniforms: {},
    autoRender: true,
    blendFunc: [770, 1],
};

const defaultUniforms = ["iTime", "iResolution"];

export default class FragmentCanvas {
    options: FragmentCanvasOptions;

    gl: WebGLRenderingContext;
    shaderProgram: WebGLProgram;
    uniformLocations: Record<string, WebGLUniformLocation | null> = {};

    constructor(
        public canvas: HTMLCanvasElement,
        options?: Partial<FragmentCanvasOptions>
    ) {
        this.options = { ...defaultOptions, ...options };

        const gl = canvas.getContext("webgl");
        if (gl === null) throw new Error("Failed to initialize WebGL");
        this.gl = gl;

        const shaderProgram = this.gl.createProgram();
        if (shaderProgram === null)
            throw new Error("Failed to create shader program");
        this.shaderProgram = shaderProgram;

        this.addShaderToProgram("vertex", this.options.vertexShader);
        this.addShaderToProgram("fragment", this.options.fragmentShader);

        this.gl.linkProgram(this.shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            throw new Error(
                "Failed to link shader program:\n" +
                    gl.getProgramInfoLog(shaderProgram)
            );
        }

        // Populate uniformLocations
        [...defaultUniforms, ...Object.keys(this.options.uniforms)].forEach(
            (uniform) => {
                this.uniformLocations[uniform] = this.gl.getUniformLocation(
                    this.shaderProgram,
                    uniform
                );
            }
        );

        gl.useProgram(shaderProgram);

        const positionAttribLocation = gl.getAttribLocation(
            shaderProgram,
            "position"
        );

        const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(positions),
            gl.STATIC_DRAW
        );

        gl.enableVertexAttribArray(positionAttribLocation);
        gl.vertexAttribPointer(
            positionAttribLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        gl.blendFunc(...this.options.blendFunc);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);

        if (this.options.autoRender) {
            this.render();
        }
    }

    render(time?: DOMHighResTimeStamp) {
        // Default uniforms
        this.gl.uniform1f(this.uniformLocations["iTime"], (time ?? 0) / 1000);
        this.gl.uniform2fv(this.uniformLocations["iResolution"], [
            this.canvas.width,
            this.canvas.height,
        ]);

        // Custom uniform callbacks
        Object.entries(this.options.uniforms).forEach(([uniform, callback]) => {
            const location = this.uniformLocations[uniform];
            if (location) callback(this.gl, location, time);
        });

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    private addShaderToProgram(type: "vertex" | "fragment", source: string) {
        const shaderType =
            type === "vertex"
                ? WebGLRenderingContext["VERTEX_SHADER"]
                : WebGLRenderingContext["FRAGMENT_SHADER"];
        const shaderObj = this.gl.createShader(shaderType);

        if (!shaderObj) {
            throw new Error(`Failed to create ${type} shader object`);
        }
        this.gl.shaderSource(shaderObj, source);
        this.gl.compileShader(shaderObj);
        if (!this.gl.getShaderParameter(shaderObj, this.gl.COMPILE_STATUS)) {
            throw new Error(
                `Failed to compile ${type} shader:\n` +
                    this.gl.getShaderInfoLog(shaderObj)
            );
        }

        this.gl.attachShader(this.shaderProgram, shaderObj);
    }
}
