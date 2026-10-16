import { useEffect, useRef } from 'react'
import {
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
} from 'three'
import { prefersReducedMotion } from './scroll'
import type { ThemeId } from './useTheme'

// how many pointer blooms can be alive on the water at once, and how long each lasts
const BLOOMS = 12
const BLOOM_LIFE = 1.8

const NOISE = /* glsl */ `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(17.1, 9.2);
      a *= 0.5;
    }
    return v;
  }
`

// full screen quads ignore the camera and draw straight into clip space
const SCREEN_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const MIST_FRAGMENT = /* glsl */ `
  uniform vec3 uBg;
  uniform vec3 uMist;
  uniform float uTime;
  uniform float uScroll;
  uniform float uAspect;
  uniform float uFog;
  uniform float uHorizon;
  varying vec2 vUv;
  ${NOISE}
  void main() {
    vec2 p = vec2((vUv.x - 0.5) * uAspect, vUv.y);
    float drift = uTime * 0.012;
    float n = fbm(p * 1.4 + vec2(drift, uScroll * 0.08));
    float n2 = fbm(p * 3.1 + vec2(-drift * 1.6, uScroll * 0.05 + 3.0));
    float mist = smoothstep(0.38, 0.82, n * 0.7 + n2 * 0.3);
    // the mist gathers along the horizon and lies heavy on the river below it
    float horizon = exp(-pow((vUv.y - uHorizon) / 0.14, 2.0));
    float river = smoothstep(uHorizon, uHorizon - 0.3, vUv.y) * 0.45;
    float amount = clamp(mist * 0.6 + horizon * 0.55 + river, 0.0, 1.0) * uFog;
    vec3 col = mix(uBg, uMist, amount);
    // wash the edges out to the paper colour, like an over-exposed print
    float edge = smoothstep(0.35, 0.95, length((vUv - vec2(0.5, 0.55)) * vec2(1.1, 1.3)));
    col = mix(col, uBg, edge * 0.85);
    gl_FragColor = vec4(col, 1.0);
  }
`

const RIVER_VERTEX = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorld;
  varying float vDepth;
  void main() {
    vec3 p = position;
    // a slow swell, like water under fog
    p.y += sin(p.x * 0.21 + uTime * 0.32) * 0.14 + sin(p.z * 0.37 - uTime * 0.41) * 0.12 + sin((p.x + p.z) * 0.13 + uTime * 0.2) * 0.1;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vec4 view = viewMatrix * world;
    vWorld = world.xyz;
    vDepth = -view.z;
    gl_Position = projectionMatrix * view;
  }
`

const RIVER_FRAGMENT = /* glsl */ `
  #define BLOOMS ${BLOOMS}
  #define LIFE ${BLOOM_LIFE.toFixed(2)}
  uniform vec3 uGrid;
  uniform vec3 uStreak;
  uniform float uAlpha;
  uniform float uFade;
  uniform float uScroll;
  uniform float uTime;
  // xy: position on the water (flow space), z: age in seconds, w: strength (0 = unused)
  uniform vec4 uBlooms[BLOOMS];
  varying vec3 vWorld;
  varying float vDepth;
  ${NOISE}

  // screen space anti-aliased horizontal lines, faded out where they crowd together towards the horizon
  float scanline(float c) {
    float d = fwidth(c);
    float g = abs(fract(c - 0.5) - 0.5) / d;
    return (1.0 - min(g, 1.0)) * (1.0 - smoothstep(0.2, 0.7, d));
  }

  void main() {
    // flow space: the water drifts towards the viewer as the page scrolls
    vec2 flow = vec2(vWorld.x, vWorld.z - uScroll * 7.0);
    float row = flow.y / 0.22;
    float line = scanline(row);
    // light catching the water unevenly along each line
    float shimmer = 0.55 + 0.45 * noise(vec2(flow.x * 0.3 + uTime * 0.06, floor(row) * 1.7));
    float fog = 1.0 - smoothstep(8.0, 55.0, vDepth);
    float near = smoothstep(0.8, 3.5, vDepth);

    // surface blooms: a soft glow where the pointer passed, with a ring rippling out from it
    float bloom = 0.0;
    for (int i = 0; i < BLOOMS; i++) {
      vec4 b = uBlooms[i];
      if (b.w <= 0.0) continue;
      float d = distance(flow, b.xy);
      float life = 1.0 - clamp(b.z / LIFE, 0.0, 1.0);
      float glow = exp(-d * d / 1.1);
      float ring = exp(-pow((d - b.z * 2.4) / 0.32, 2.0)) * 0.7;
      bloom += (glow + ring) * life * life * b.w;
    }
    bloom = min(bloom, 1.3);

    float a = line * (uAlpha * shimmer * uFade + bloom * 0.75) + bloom * 0.045;
    vec3 col = mix(uGrid, uStreak, clamp(bloom * 1.3, 0.0, 1.0));
    gl_FragColor = vec4(col, a * fog * near);
  }
`

const STREAK_FRAGMENT = /* glsl */ `
  uniform vec3 uStreak;
  uniform float uTime;
  uniform float uScroll;
  uniform float uIntensity;
  uniform vec2 uResolution;
  varying vec2 vUv;
  ${NOISE}

  // one sleeve streak, measured in CSS pixels: a 2px core, a 14px blurred band and a wide faint glow.
  // returns (alpha, how white-hot this pixel is)
  vec2 streak(vec2 px, float y, float start, float len, float coreAmount, float seed) {
    float dy = px.y - y;
    float core = exp(-pow(dy / 1.1, 2.0)) * coreAmount;
    float band = exp(-pow(dy / 7.0, 2.0)) * 0.24;
    float glow = exp(-pow(dy / 18.0, 2.0)) * 0.08;
    float x = (px.x - start) / len;
    float body = smoothstep(0.0, 0.3, x) * (1.0 - smoothstep(0.72, 1.0, x));
    float grain = 0.72 + 0.28 * noise(vec2(px.x * 0.06 + seed * 13.0, seed));
    float hot = smoothstep(0.28, 0.52, x) * (1.0 - smoothstep(0.52, 0.76, x));
    return vec2((core + band + glow) * body * grain, core * body * hot);
  }

  void main() {
    vec2 px = vUv * uResolution;
    vec2 s = vec2(0.0);
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float seed = fi * 7.31 + 1.7;
      float speed = 0.07 + 0.05 * fract(seed * 0.37);
      float y = fract(0.14 + fi * 0.197 + uScroll * speed + 0.012 * sin(uTime * 0.2 + seed));
      float len = (0.38 + 0.36 * fract(seed * 0.53)) * uResolution.x;
      float start = (-0.15 + 0.7 * fract(seed * 0.29) + 0.1 * sin(uTime * 0.07 + seed)) * uResolution.x;
      // some streaks are only the blurred band, like light smeared across the fog
      float coreAmount = step(0.35, fract(seed * 0.61));
      float edgeFade = smoothstep(0.0, 0.08, y) * (1.0 - smoothstep(0.92, 1.0, y));
      s += streak(px, y * uResolution.y, start, len, coreAmount, seed) * edgeFade * (0.55 + 0.45 * fract(seed * 0.19));
    }

    // the one vertical amber hairline from the sleeve, belonging to the hero
    float vx = (0.635 + 0.015 * sin(uTime * 0.05)) * uResolution.x;
    float vertical = exp(-pow((px.x - vx) / 0.7, 2.0)) * smoothstep(0.04, 0.22, vUv.y) * (1.0 - smoothstep(0.78, 0.94, vUv.y));
    s.x += vertical * 0.55 * (1.0 - smoothstep(0.2, 0.9, uScroll));

    vec3 hotColour = mix(uStreak, vec3(1.0, 0.9, 0.75), 0.85);
    vec3 col = mix(uStreak, hotColour, clamp(s.y, 0.0, 1.0));
    gl_FragColor = vec4(col, clamp(s.x, 0.0, 1.0) * uIntensity);
  }
`

type Palette = {
  bg: Vector3
  mist: Vector3
  grid: Vector3
  streak: Vector3
  gridAlpha: number
  streakAlpha: number
  fog: number
}

// colours are written straight to the sRGB framebuffer, so keep them as raw sRGB rather than three's linear Color
const hexToVector = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

const readPalette = (): Palette => {
  const styles = getComputedStyle(document.documentElement)
  const get = (name: string) => styles.getPropertyValue(name).trim()
  return {
    bg: hexToVector(get('--bg')),
    mist: hexToVector(get('--mist')),
    grid: hexToVector(get('--grid')),
    streak: hexToVector(get('--streak')),
    gridAlpha: parseFloat(get('--grid-alpha')),
    streakAlpha: parseFloat(get('--streak-alpha')),
    fog: parseFloat(get('--fog')),
  }
}

const screenQuad = (material: ShaderMaterial, order: number) => {
  const mesh = new Mesh(new PlaneGeometry(2, 2), material)
  mesh.frustumCulled = false
  mesh.renderOrder = order
  return mesh
}

type Props = {
  theme: ThemeId
}

const Background = ({ theme }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // lets the theme effect hand a new palette to the running scene
  const paletteRef = useRef<{ target: Palette; render?: () => void } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' })
    } catch {
      // no WebGL: the plain page background shows instead
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))

    const reducedMotion = prefersReducedMotion()
    const target = readPalette()
    const current: Palette = {
      ...target,
      bg: target.bg.clone(),
      mist: target.mist.clone(),
      grid: target.grid.clone(),
      streak: target.streak.clone(),
    }

    const scene = new Scene()
    const camera = new PerspectiveCamera(50, 1, 0.1, 300)

    const mist = new ShaderMaterial({
      vertexShader: SCREEN_VERTEX,
      fragmentShader: MIST_FRAGMENT,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uBg: { value: current.bg },
        uMist: { value: current.mist },
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uAspect: { value: 1 },
        uFog: { value: current.fog },
        uHorizon: { value: 0.56 },
      },
    })

    const blooms = Array.from({ length: BLOOMS }, () => new Vector4(0, 0, 0, 0))
    const river = new ShaderMaterial({
      vertexShader: RIVER_VERTEX,
      fragmentShader: RIVER_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uGrid: { value: current.grid },
        uStreak: { value: current.streak },
        uAlpha: { value: current.gridAlpha },
        uFade: { value: 1 },
        uScroll: { value: 0 },
        uTime: { value: 0 },
        uBlooms: { value: blooms },
      },
    })

    const streaks = new ShaderMaterial({
      vertexShader: SCREEN_VERTEX,
      fragmentShader: STREAK_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uStreak: { value: current.streak },
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uIntensity: { value: current.streakAlpha },
        uResolution: { value: new Vector2(1, 1) },
      },
    })

    const waterGeometry = new PlaneGeometry(200, 200, 160, 160)
    waterGeometry.rotateX(-Math.PI / 2)
    const water = new Mesh(waterGeometry, river)
    water.position.z = -50
    water.renderOrder = 1
    scene.add(screenQuad(mist, 0), water, screenQuad(streaks, 2))

    const lookAt = new Vector3()
    const horizonPoint = new Vector3()
    const ray = new Vector3()
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let scroll = window.scrollY / window.innerHeight
    // with reduced motion the scene is a still image, with a fixed time picked for a pleasant layout
    let time = 12
    let last = performance.now()
    let frame = 0
    let nextBloom = 0
    let lastBloom: { x: number; y: number; at: number } | null = null

    const render = () => {
      const s = Math.min(scroll, 3)
      camera.position.set(pointer.x * 0.9, 2.4 + pointer.y * 0.25 + s * 0.35, 8)
      lookAt.set(pointer.x * 0.4, 0.2 - s * 0.9, -30)
      camera.lookAt(lookAt)
      camera.updateMatrixWorld()
      // where the (infinitely far) water meets the sky on screen, for the mist band
      horizonPoint.set(camera.position.x, 0, camera.position.z - 5000).project(camera)
      mist.uniforms.uHorizon.value = horizonPoint.y * 0.5 + 0.5

      // the river belongs to the hero; below it only the faintest water stays behind the text
      const fade = 1 - 0.78 * Math.min(Math.max((scroll - 0.6) / 0.8, 0), 1)

      mist.uniforms.uTime.value = time
      mist.uniforms.uScroll.value = scroll
      mist.uniforms.uFog.value = current.fog
      river.uniforms.uTime.value = time
      river.uniforms.uScroll.value = scroll
      river.uniforms.uAlpha.value = current.gridAlpha
      river.uniforms.uFade.value = fade
      streaks.uniforms.uTime.value = time
      streaks.uniforms.uScroll.value = scroll
      streaks.uniforms.uIntensity.value = current.streakAlpha * (0.35 + 0.65 * fade)
      renderer.render(scene, camera)
    }

    const approach = (k: number) => {
      const t = paletteRef.current?.target ?? target
      current.bg.lerp(t.bg, k)
      current.mist.lerp(t.mist, k)
      current.grid.lerp(t.grid, k)
      current.streak.lerp(t.streak, k)
      current.gridAlpha += (t.gridAlpha - current.gridAlpha) * k
      current.streakAlpha += (t.streakAlpha - current.streakAlpha) * k
      current.fog += (t.fog - current.fog) * k
    }

    // project the pointer onto the water and drop a bloom there, in flow space so it drifts with the river
    const bloomAt = (clientX: number, clientY: number) => {
      const { clientWidth: w, clientHeight: h } = canvas
      ray
        .set((clientX / w) * 2 - 1, -(clientY / h) * 2 + 1, 0.5)
        .unproject(camera)
        .sub(camera.position)
      if (ray.y >= -1e-4) return // above the horizon, nothing to touch
      const t = -camera.position.y / ray.y
      const x = camera.position.x + ray.x * t
      const z = camera.position.z + ray.z * t
      if (z < -60) return // too far into the fog to see
      const flowY = z - scroll * 7
      const now = performance.now()
      // space blooms out so a fast swipe leaves a trail rather than one blob
      if (lastBloom && now - lastBloom.at < 90 && Math.hypot(x - lastBloom.x, flowY - lastBloom.y) < 0.45) return
      blooms[nextBloom].set(x, flowY, 0, 1)
      nextBloom = (nextBloom + 1) % BLOOMS
      lastBloom = { x, y: flowY, at: now }
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      // frame rate independent easing, capped so a long pause does not jump
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      time += dt
      const ease = 1 - Math.exp(-dt * 4)
      scroll += (window.scrollY / window.innerHeight - scroll) * ease
      pointer.x += (pointer.tx - pointer.x) * ease * 0.6
      pointer.y += (pointer.ty - pointer.y) * ease * 0.6
      blooms.forEach((b) => {
        if (b.w <= 0) return
        b.z += dt
        if (b.z > BLOOM_LIFE) b.w = 0
      })
      approach(1 - Math.exp(-dt * 3))
      render()
    }

    const start = () => {
      if (!frame && !reducedMotion && !document.hidden) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      mist.uniforms.uAspect.value = w / h
      streaks.uniforms.uResolution.value.set(w, h)
      if (!frame) render()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    const finePointer = window.matchMedia('(pointer: fine)').matches
    const onPointer = (event: PointerEvent) => {
      if (finePointer) {
        pointer.tx = (event.clientX / window.innerWidth) * 2 - 1
        pointer.ty = -((event.clientY / window.innerHeight) * 2 - 1)
      }
      bloomAt(event.clientX, event.clientY)
    }
    const onVisibility = () => (document.hidden ? stop() : start())
    if (!reducedMotion) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('pointerdown', onPointer, { passive: true })
    }
    document.addEventListener('visibilitychange', onVisibility)

    paletteRef.current = {
      target,
      // the static (reduced motion) scene redraws on demand when the theme changes
      render: reducedMotion
        ? () => {
            approach(1)
            render()
          }
        : undefined,
    }

    render()
    canvas.classList.add('is-ready')
    start()

    return () => {
      stop()
      observer.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      scene.traverse((object) => {
        if (object instanceof Mesh) object.geometry.dispose()
      })
      mist.dispose()
      river.dispose()
      streaks.dispose()
      renderer.dispose()
      paletteRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!paletteRef.current) return
    paletteRef.current.target = readPalette()
    paletteRef.current.render?.()
  }, [theme])

  return <canvas ref={canvasRef} className="scene" aria-hidden="true" />
}

export default Background
