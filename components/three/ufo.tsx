"use client"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { Euler, Vector3, Group } from "three"

type UFOProps = {
  // relative offsets in world units
  start?: [number, number, number]
  end?: [number, number, number]
  duration?: number
  helixRadius?: number
}

export function UFO({ start = [-6, -1.2, -4], end = [6, 1.2, -4], duration = 3.5, helixRadius = 1.2 }: UFOProps) {
  const group = useRef<Group | null>(null)
  const { scene } = useGLTF("/models/ufo.glb")


  // keep a simple animation state
  const startVec = new Vector3(...start)
  const endVec = new Vector3(...end)
  const travelVec = new Vector3().subVectors(endVec, startVec)
  // viewport-NDC path (attached to hero viewport) converted to world
  const { camera } = useThree()
  useFrame(({ clock }) => {
    if (!group.current) return

    const tNow = clock.getElapsedTime()
    if (!(group as any)._startTime) (group as any)._startTime = tNow
    const startTime = (group as any)._startTime as number
    const elapsed = Math.max(0, tNow - startTime)
    const total = duration
    const progress = Math.min(1, elapsed / total)

    // Deterministic NDC waypoints (x,y in -1..1)
    // path: left-bottom -> left-top -> right-top (circular motion)
    const ndcPts: Array<[number, number]> = [
      [-0.95, -0.95], // left-bottom corner
      [-0.95, 0.85], // left-top
      [0.47, 0.55], // right-top near marquee
    ]

    const distance = 6
    const ndcToWorld = (x: number, y: number) => {
      const v = new Vector3(x, y, 0.5)
      v.unproject(camera)
      const dir = v.sub(camera.position).normalize()
      return camera.position.clone().add(dir.multiplyScalar(distance))
    }

    const waypoints = ndcPts.map((p) => ndcToWorld(p[0], p[1]))
    // piecewise segment
    const segments = waypoints.length - 1
    const tSegment = Math.min(segments - 1e-6, progress * segments)
    const segIndex = Math.floor(tSegment)
    const localT = tSegment - segIndex
    const eased = localT * localT * (3 - 2 * localT)
    const from = waypoints[segIndex]
    const to = waypoints[Math.min(segIndex + 1, waypoints.length - 1)]
    const basePos = new Vector3().copy(from).lerp(to, eased)

    // circular lateral offset (helical) that decays toward end
  const revolutions = 2
  const angle = progress * Math.PI * 2 * revolutions + tNow * 1.2
  const helixAmp = helixRadius * (1 - progress) * 0.35
    const dir = new Vector3().subVectors(to, from).normalize()
    const up = new Vector3(0, 1, 0)
    const right = new Vector3().crossVectors(dir, up).normalize()
    const lateral = right.multiplyScalar(Math.cos(angle) * helixAmp)
    const lateralY = Math.sin(angle) * helixAmp * 0.4

    const targetPos = basePos.clone().add(lateral).add(new Vector3(0, lateralY, 0))

    // move toward targetPos smoothly
    group.current.position.lerp(targetPos, 0.22)

    // scale: shrink during travel then return to normal final size
    const startScale = 0.2
    const minScale = 0.08
    const finalScale = 0.2
    let desiredScale = finalScale
    if (progress < 0.5) {
      const t = progress / 0.5
      const easedT = t * t * (3 - 2 * t)
      desiredScale = startScale * (1 - easedT) + minScale * easedT
    } else {
      const t = (progress - 0.5) / 0.5
      const easedT = t * t * (3 - 2 * t)
      desiredScale = minScale * (1 - easedT) + finalScale * easedT
    }
    group.current.scale.lerp(new Vector3(desiredScale, desiredScale, desiredScale), 0.12)

  // tilt: bottom side should point left and top to right on final.
  // During travel, slightly roll toward the arc direction; final roll will be set on arrival.
  const lookDir = new Vector3().subVectors(to, from).normalize()
  const rightOnly = Math.max(0, lookDir.x)
  group.current.rotation.z = rightOnly * 0
  group.current.rotation.x = 0

    // final balanced spin when reached
    if (progress >= 1) {
  // final balanced size and spin
  group.current.rotation.y += 0.1
  group.current.scale.lerp(new Vector3(finalScale, finalScale, finalScale), 0.45)
 
  // tighten final position
  group.current.position.lerp(targetPos, 0.85)
    } else {
      // gentle spin while moving
      group.current.rotation.y += 0.06 + progress * 0.12
    }

    // compute screen position and expose as CSS vars for hero overlay
    try {
      const worldPos = group.current.getWorldPosition(new Vector3())
      const ndc = worldPos.clone().project(camera)
      const vx = (ndc.x * 0.5 + 0.5) * 100
      const vy = (-ndc.y * 0.5 + 0.5) * 100
      const intensity = Math.max(0.05, 1 - progress * 1.0)
      const radius = 12 + 60 * (1 - progress) // px
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--ufo-x", `${vx}%`)
        document.documentElement.style.setProperty("--ufo-y", `${vy}%`)
        document.documentElement.style.setProperty("--ufo-intensity", String(Number(intensity.toFixed(2))))
        document.documentElement.style.setProperty("--ufo-radius", `${radius}px`)
      }
    } catch (e) {
      // ignore
    }
  })

  // ensure GLTF scene is cloned safe for r3f
  useEffect(() => {
    ;(scene as any).traverse((obj: any) => {
      if (obj.isMesh) {
        obj.castShadow = false
        try {
          const mat = obj.material
          if (mat) {
            // increase environment reflection influence
            if (typeof mat.envMapIntensity !== "undefined") mat.envMapIntensity = Math.max(1, mat.envMapIntensity)
            // fallback to metallic look if the model doesn't specify maps
            if (typeof mat.metalness === "undefined") mat.metalness = 1
            if (typeof mat.roughness === "undefined") mat.roughness = 0.25
            // correct encoding for color textures if present
            if (mat.map) mat.map.encoding = (mat.map.encoding ?? 3000)
            mat.needsUpdate = true
          }
        } catch (e) {
          // defensive: some models may have shared or array materials
        }
      }
    })
  }, [scene])

  return (
    <group ref={group} position={start} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload && useGLTF.preload("/models/ufo.glb")
