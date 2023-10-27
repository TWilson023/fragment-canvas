export const defaultFragment = `
    precision mediump float;

    uniform float iTime;
    uniform vec2 iResolution;

    void main() 
    {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        gl_FragColor = vec4(.5 + .5 * cos(iTime + uv.xyx + vec3(0., 2., 4.)), 1.);
    }
`;
