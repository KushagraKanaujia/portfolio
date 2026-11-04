// WebGL water: depth color, sun bloom, god rays, caustics, the surface seen from below, haze, dithering.
// Rendered at reduced resolution and scaled up by CSS (the content is soft, so it looks the same and runs fast).

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uDepth;
uniform vec3 uTop;
uniform vec3 uBot;
uniform vec2 uMouse;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.0, 9.0); a *= 0.5; }
  return v;
}
// ridged noise, domain warped: thin bright webs like light focused by waves
float ridge(vec2 p) { float n = noise(p); return pow(1.0 - abs(n * 2.0 - 1.0), 6.0); }
float caustic(vec2 p, float t) {
  vec2 w = vec2(fbm(p * 0.5 + t * 0.05), fbm(p * 0.5 - t * 0.04 + 5.2));
  p += w * 1.8;
  return ridge(p + vec2(t * 0.17, t * 0.05)) * 0.6 + ridge(p * 1.6 - vec2(t * 0.11, -t * 0.07)) * 0.45;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.y = 1.0 - uv.y;                     // 0 at top
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float t = uTime;

  vec3 col = mix(uTop, uBot, smoothstep(0.0, 1.0, uv.y));
  float lit = 1.0 - smoothstep(0.0, 0.34, uDepth);   // how much sunlight still reaches us

  // where the surface is on screen (a little above the top when you arrive)
  float sy = 0.02 - uDepth * 2.6;
  float below = max(0.0, uv.y - sy);
  float fall = exp(-below * 1.5);

  if (lit > 0.001) {
    // sun bloom
    vec2 sun = vec2(0.64 * asp, sy - 0.05);
    float sd = length((p - sun) * vec2(1.0, 1.25));
    col += vec3(1.0, 0.84, 0.62) * exp(-sd * 2.4) * 0.55 * lit;
    col += vec3(1.0, 0.72, 0.5) * exp(-sd * 0.9) * 0.10 * lit;

    // god rays fanning down from the sun
    vec2 d = p - (sun - vec2(0.0, 0.5));
    float ang = atan(d.x, d.y);
    float r = noise(vec2(ang * 16.0, t * 0.12)) * 0.6 + noise(vec2(ang * 37.0 + 3.0, t * 0.21)) * 0.4;
    r = smoothstep(0.42, 1.0, r);
    float rayFade = exp(-below * 1.1) * smoothstep(0.0, 0.08, below);
    col += vec3(1.0, 0.94, 0.82) * r * rayFade * 0.32 * lit;

    // caustics, strongest right under the surface
    float cs = caustic(vec2(uv.x * asp, uv.y + uDepth * 3.0) * 3.2, t * 0.55);
    col += vec3(0.82, 0.95, 1.0) * cs * fall * 0.16 * lit;

    // the surface seen from below: a bright rippling ceiling
    float wave = sy + (fbm(vec2(uv.x * asp * 3.0, t * 0.25)) - 0.5) * 0.05;
    float above = smoothstep(wave + 0.006, wave - 0.006, uv.y);
    float rip = fbm(vec2(uv.x * asp * 7.0 + t * 0.3, uv.y * 20.0 - t * 0.5));
    vec3 ceiling = mix(vec3(0.55, 0.82, 0.92), vec3(1.0, 0.9, 0.75), rip) * (0.8 + 0.4 * rip);
    col = mix(col, ceiling, above * 0.85 * lit);
    col += vec3(1.0, 0.95, 0.85) * smoothstep(0.03, 0.0, abs(uv.y - wave)) * 0.35 * lit;
  }

  // drifting murk
  float haze = fbm(p * 1.4 + vec2(t * 0.015, -uDepth * 4.0));
  col += (haze - 0.5) * (0.06 * lit + 0.025);

  // a faint glow that follows your cursor in the dark
  float m = length((uv - uMouse) * vec2(asp, 1.0));
  col += vec3(1.0, 0.75, 0.45) * exp(-m * 6.0) * 0.05 * smoothstep(0.5, 0.9, uDepth);

  // vignette and dithering (no banding)
  float vig = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(asp * 0.75, 1.0)));
  col *= mix(0.5, 1.0, vig);
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) * (2.5 / 255.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

export type Water = {
  render: (o: { time: number; depth: number; top: number[]; bot: number[]; mouse: [number, number] }) => void;
  resize: (w: number, h: number) => void;
  destroy: () => void;
};

export function createWater(canvas: HTMLCanvasElement): Water | null {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
  if (!gl || gl.isContextLost()) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn("water shader failed", type === gl.VERTEX_SHADER ? "vert" : "frag", gl.isContextLost(), gl.getShaderInfoLog(s)); return null; }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = U("uRes"), uTime = U("uTime"), uDepth = U("uDepth"), uTop = U("uTop"), uBot = U("uBot"), uMouse = U("uMouse");

  return {
    resize(w, h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    },
    render({ time, depth, top, bot, mouse }) {
      gl.uniform1f(uTime, time);
      gl.uniform1f(uDepth, depth);
      gl.uniform3f(uTop, top[0] / 255, top[1] / 255, top[2] / 255);
      gl.uniform3f(uBot, bot[0] / 255, bot[1] / 255, bot[2] / 255);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    // don't force-lose the context: React may mount again on the same canvas (dev, hot reload)
    destroy() { gl.deleteBuffer(buf); gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs); },
  };
}
