import { useEffect, useRef } from 'react'
import { Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Vector3, WebGLRenderer } from 'three'
import { prefersReducedMotion } from './scroll'
import type { ThemeId } from './useTheme'

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
    // the mist gathers along the horizon, like fog sitting on the river
    float horizon = exp(-pow((vUv.y - uHorizon) / 0.14, 2.0));
    float amount = clamp(mist * 0.7 + horizon * 0.55, 0.0, 1.0) * uFog;
    vec3 col = mix(uBg, uMist, amount);
    // wash the edges out to the paper colour, like an over-exposed print
    float edge = smoothstep(0.35, 0.95, length((vUv - vec2(0.5, 0.55)) * vec2(1.1, 1.3)));
    col = mix(col, uBg, edge * 0.85);
    gl_FragColor = vec4(col, 1.0);
  }
`

const GRID_VERTEX = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorld;
  varying float vDepth;
  void main() {
    vec3 p = position;
    p.y += sin(p.x * 0.18 + uTime * 0.35) * 0.22 + sin(p.z * 0.23 - uTime * 0.27) * 0.18 + sin((p.x + p.z) * 0.11 + uTime * 0.2) * 0.15;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vec4 view = viewMatrix * world;
    vWorld = world.xyz;
    vDepth = -view.z;
    gl_Position = projectionMatrix * view;
  }
`

const GRID_FRAGMENT = /* glsl */ `
  uniform vec3 uGrid;
  uniform vec3 uStreak;
  uniform float uAlpha;
  uniform float uScroll;
  uniform float uTime;
  varying vec3 vWorld;
  varying float vDepth;

  // screen space anti-aliased lines, faded out where cells get smaller than a few pixels to avoid moire
  float lines(vec2 c, float width) {
    vec2 d = fwidth(c);
    vec2 g = abs(fract(c - 0.5) - 0.5) / (d * width);
    float l = 1.0 - min(min(g.x, g.y), 1.0);
    return l * (1.0 - smoothstep(0.15, 0.6, max(d.x, d.y)));
  }

  void main() {
    // offset half a cell so no line sits dead centre, where it would draw straight down the page
    vec2 c = vec2(vWorld.x + 0.5, vWorld.z - uScroll * 7.0);
    float minor = lines(c, 1.0);
    float major = lines(c / 4.0, 1.4);
    float fog = 1.0 - smoothstep(10.0, 70.0, vDepth);
    float near = smoothstep(0.8, 4.0, vDepth);
    // a slow amber pulse running along the major lines, like a platform sign lighting up
    float pulse = pow(0.5 + 0.5 * sin(c.y * 0.25 + uTime * 0.6), 18.0);
    vec3 col = mix(uGrid, uStreak, clamp(major * pulse, 0.0, 1.0));
    float a = (minor * 0.5 + major * 0.9) * uAlpha + major * pulse * 0.35;
    gl_FragColor = vec4(col, a * fog * near);
  }
`

const STREAK_FRAGMENT = /* glsl */ `
  uniform vec3 uStreak;
  uniform float uTime;
  uniform float uScroll;
  uniform float uIntensity;
  varying vec2 vUv;
  ${NOISE}

  float streak(vec2 uv, float y, float thick, float start, float len, float seed) {
    float dy = (uv.y - y) / thick;
    float core = exp(-dy * dy);
    float glow = exp(-dy * dy * 0.04) * 0.25;
    float h = smoothstep(start, start + len * 0.35, uv.x) * (1.0 - smoothstep(start + len * 0.8, start + len, uv.x));
    float grain = 0.55 + 0.45 * noise(vec2(uv.x * 90.0 + seed * 13.0, seed));
    return (core + glow) * h * grain;
  }

  void main() {
    float s = 0.0;
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float seed = fi * 7.31 + 1.7;
      float speed = 0.06 + 0.05 * fract(seed * 0.37);
      float y = fract(0.12 + fi * 0.161 + uScroll * speed + 0.015 * sin(uTime * 0.2 + seed));
      float thick = 0.0016 + 0.0022 * fract(seed * 0.71);
      float len = 0.35 + 0.4 * fract(seed * 0.53);
      float start = -0.2 + 0.7 * fract(seed * 0.29) + 0.12 * sin(uTime * 0.07 + seed);
      float edgeFade = smoothstep(0.0, 0.08, y) * (1.0 - smoothstep(0.92, 1.0, y));
      s += streak(vUv, y, thick, start, len, seed) * edgeFade * (0.45 + 0.55 * fract(seed * 0.19));
    }
    gl_FragColor = vec4(uStreak, clamp(s, 0.0, 1.0) * uIntensity);
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

    const grid = new ShaderMaterial({
      vertexShader: GRID_VERTEX,
      fragmentShader: GRID_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uGrid: { value: current.grid },
        uStreak: { value: current.streak },
        uAlpha: { value: current.gridAlpha },
        uScroll: { value: 0 },
        uTime: { value: 0 },
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
      },
    })

    const floorGeometry = new PlaneGeometry(200, 200, 160, 160)
    floorGeometry.rotateX(-Math.PI / 2)
    const floor = new Mesh(floorGeometry, grid)
    floor.position.z = -50
    floor.renderOrder = 1
    scene.add(screenQuad(mist, 0), floor, screenQuad(streaks, 2))

    const lookAt = new Vector3()
    const horizonPoint = new Vector3()
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let scroll = window.scrollY / window.innerHeight
    // with reduced motion the scene is a still image, with a fixed time picked for a pleasant layout
    let time = 12
    let last = performance.now()
    let frame = 0

    const render = () => {
      const s = Math.min(scroll, 3)
      camera.position.set(pointer.x * 0.9, 2.4 + pointer.y * 0.25 + s * 0.35, 8)
      lookAt.set(pointer.x * 0.4, 0.2 - s * 0.9, -30)
      camera.lookAt(lookAt)
      camera.updateMatrixWorld()
      // where the (infinitely far) floor meets the sky on screen, for the mist band
      horizonPoint.set(camera.position.x, 0, camera.position.z - 5000).project(camera)
      mist.uniforms.uHorizon.value = horizonPoint.y * 0.5 + 0.5

      mist.uniforms.uTime.value = time
      mist.uniforms.uScroll.value = scroll
      mist.uniforms.uFog.value = current.fog
      grid.uniforms.uTime.value = time
      grid.uniforms.uScroll.value = scroll
      grid.uniforms.uAlpha.value = current.gridAlpha
      streaks.uniforms.uTime.value = time
      streaks.uniforms.uScroll.value = scroll
      streaks.uniforms.uIntensity.value = current.streakAlpha
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
      if (!frame) render()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1
      pointer.ty = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    const onVisibility = () => (document.hidden ? stop() : start())
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (finePointer && !reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true })
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
      document.removeEventListener('visibilitychange', onVisibility)
      scene.traverse((object) => {
        if (object instanceof Mesh) object.geometry.dispose()
      })
      mist.dispose()
      grid.dispose()
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
