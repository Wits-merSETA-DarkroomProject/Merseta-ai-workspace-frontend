import React, { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";
import "./Strands.css";

export interface StrandsProps {
  colors?: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  taper?: number;
  spread?: number;
  intensity?: number;
  saturation?: number;
  opacity?: number;
  scale?: number;
  glass?: boolean;
  className?: string;
  mask?: "radial" | "horizontal" | "none";
}

const vertexShader = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor0;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uCount;
  uniform float uSpeed;
  uniform float uAmplitude;
  uniform float uWaviness;
  uniform float uThickness;
  uniform float uGlow;
  uniform float uTaper;
  uniform float uSpread;
  uniform float uIntensity;
  uniform float uSaturation;
  uniform float uOpacity;
  uniform float uScale;
  uniform float uGlass;

  varying vec2 vUv;

  // Simple hash noise
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  // Taper factor: zero at ends (x=0, x=1), peak in center
  float getTaper(float x, float power) {
    float t = 4.0 * x * (1.0 - x);
    return pow(clamp(t, 0.001, 1.0), power);
  }

  void main() {
    vec2 st = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
    st *= (1.0 / max(uScale, 0.1));

    // Glass distortion if enabled
    if (uGlass > 0.5) {
      st += vec2(
        sin(st.y * 3.0 + uTime * 0.5) * 0.03,
        cos(st.x * 3.0 + uTime * 0.5) * 0.03
      );
    }

    vec3 finalColor = vec3(0.0);
    float totalAlpha = 0.0;

    int maxCount = int(clamp(uCount, 1.0, 8.0));
    float time = uTime * uSpeed;

    for (int i = 0; i < 8; i++) {
      if (i >= maxCount) break;

      float fi = float(i);
      float offset = fi * (uSpread * 0.28);
      float phase = fi * 1.618;

      // Calculate vertical position of strand centerline
      float wave = sin(st.x * (uWaviness * 1.5) + time + phase) * (uAmplitude * 0.35);
      wave += cos(st.x * (uWaviness * 2.7) - time * 0.7 + phase * 1.3) * (uAmplitude * 0.15);

      float yCenter = offset - (float(maxCount - 1) * uSpread * 0.14) + wave;

      // Distance from point to strand curve
      float dist = abs(st.y - yCenter);

      // Taper along the horizontal axis
      float normX = clamp(vUv.x, 0.0, 1.0);
      float taperFactor = getTaper(normX, uTaper);
      float effectiveThickness = max(uThickness * 0.045 * taperFactor, 0.001);

      // Exponential glow and core
      float core = smoothstep(effectiveThickness, 0.0, dist);
      float glow = exp(-dist * (14.0 / max(uGlow, 0.1))) * (uGlow * 0.35);
      float strandStrength = (core + glow) * taperFactor * uIntensity;

      // Palette selection
      vec3 col = uColor0;
      int colorIdx = int(mod(fi, 4.0));
      if (colorIdx == 1) col = uColor1;
      else if (colorIdx == 2) col = uColor2;
      else if (colorIdx == 3) col = uColor3;

      // Apply saturation adjustment
      float gray = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(gray), col, uSaturation);

      finalColor += col * strandStrength;
      totalAlpha += strandStrength * 0.9;
    }

    totalAlpha = clamp(totalAlpha * uOpacity, 0.0, 1.0);
    gl_FragColor = vec4(finalColor, totalAlpha);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  if (clean.length === 3) {
    const r = ((num >> 8) & 0xf) * 17;
    const g = ((num >> 4) & 0xf) * 17;
    const b = (num & 0xf) * 17;
    return [r / 255, g / 255, b / 255];
  }
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return [r / 255, g / 255, b / 255];
}

export const Strands: React.FC<StrandsProps> = ({
  colors = ["#1F3664", "#12326E", "#C39546", "#E5C991"],
  count = 3,
  speed = 0.35,
  amplitude = 0.8,
  waviness = 1.0,
  thickness = 0.55,
  glow = 2.0,
  taper = 3.0,
  spread = 1.1,
  intensity = 0.45,
  saturation = 1.1,
  opacity = 0.65,
  scale = 1.4,
  glass = false,
  className = "",
  mask = "radial",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGl, setHasWebGl] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;
    let renderer: Renderer;
    let program: Program;

    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: true,
        dpr: Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2),
      });

      const gl = renderer.gl;
      if (!gl) {
        setHasWebGl(false);
        return;
      }

      const geometry = new Triangle(gl);

      const rgbColors = colors.map((c) => hexToRgb(c));
      const c0 = rgbColors[0] || [0.12, 0.21, 0.39];
      const c1 = rgbColors[1] || [0.07, 0.2, 0.43];
      const c2 = rgbColors[2] || [0.76, 0.58, 0.27];
      const c3 = rgbColors[3] || [0.9, 0.79, 0.57];

      program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        transparent: true,
        cullFace: null,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [container.clientWidth || 300, container.clientHeight || 300] },
          uColor0: { value: c0 },
          uColor1: { value: c1 },
          uColor2: { value: c2 },
          uColor3: { value: c3 },
          uCount: { value: count },
          uSpeed: { value: speed },
          uAmplitude: { value: amplitude },
          uWaviness: { value: waviness },
          uThickness: { value: thickness },
          uGlow: { value: glow },
          uTaper: { value: taper },
          uSpread: { value: spread },
          uIntensity: { value: intensity },
          uSaturation: { value: saturation },
          uOpacity: { value: opacity },
          uScale: { value: scale },
          uGlass: { value: glass ? 1.0 : 0.0 },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        if (!container) return;
        const width = container.clientWidth || 300;
        const height = container.clientHeight || 300;
        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [width, height];
      };

      const resizeObserver = new ResizeObserver(() => {
        resize();
      });
      resizeObserver.observe(container);
      resize();

      const startTime = performance.now();

      const update = (now: number) => {
        animationFrameId = requestAnimationFrame(update);
        const elapsed = (now - startTime) * 0.001;
        program.uniforms.uTime.value = elapsed;
        renderer.render({ scene: mesh });
      };

      animationFrameId = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();
        const loseContext = gl.getExtension("WEBGL_lose_context");
        if (loseContext) loseContext.loseContext();
      };
    } catch (err) {
      console.warn("Strands WebGL initialization failed, using CSS fallback.", err);
      setHasWebGl(false);
    }
  }, [
    colors,
    count,
    speed,
    amplitude,
    waviness,
    thickness,
    glow,
    taper,
    spread,
    intensity,
    saturation,
    opacity,
    scale,
    glass,
  ]);

  const maskClass =
    mask === "radial"
      ? "strands-mask-radial"
      : mask === "horizontal"
        ? "strands-mask-horizontal"
        : "";

  return (
    <div
      ref={containerRef}
      className={`strands-container ${maskClass} ${className}`}
      aria-hidden="true"
    >
      {hasWebGl ? (
        <canvas ref={canvasRef} className="strands-canvas" />
      ) : (
        <div className="strands-fallback" />
      )}
    </div>
  );
};

export default Strands;
