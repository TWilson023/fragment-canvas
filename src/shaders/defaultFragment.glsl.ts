export const defaultFragment = `
    uniform float iTime;
    uniform vec2 iResolution;

    void main() 
    {
        vec2 uv = gl_FragCoord / iResolution.xy;
        gl_FragColor = vec4(iTime + .5 + .5 * cos(uv.xyx + vec3(0., 2., 4.)), 1.);
    }
`