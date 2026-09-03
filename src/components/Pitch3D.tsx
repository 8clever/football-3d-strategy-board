import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Player, 
  Ball, 
  TacticalMarker, 
  TacticalArrow, 
  CameraPreset 
} from '../types';
import { 
  createPitchTexture, 
  createGoal, 
  createPlayerMesh, 
  createBallMesh, 
  createConeMarker,
  PITCH_LENGTH,
  PITCH_WIDTH
} from '../utils/threeTactics';

interface Pitch3DProps {
  players: Player[];
  ball: Ball;
  markers: TacticalMarker[];
  arrows: TacticalArrow[];
  teamAName: string;
  teamBName: string;
  teamAColor: string;
  teamBColor: string;
  cameraPreset: CameraPreset;
  showNames: boolean;
  showPassingLines: boolean;
  selectedPlayerId: string | null;
  onPlayerPositionChange: (id: string, pos: { x: number; y: number; z: number }) => void;
  onBallPositionChange: (pos: { x: number; y: number; z: number }) => void;
  onMarkerPositionChange?: (id: string, pos: { x: number; y: number; z: number }) => void;
  onContextMenuOpen: (
    type: 'player' | 'ball' | 'field' | 'marker',
    id: string | undefined,
    screenX: number,
    screenY: number,
    pitchCoords?: { x: number; z: number }
  ) => void;
  onSelectPlayer: (id: string | null) => void;
}

export const Pitch3D: React.FC<Pitch3DProps> = ({
  players,
  ball,
  markers,
  arrows,
  teamAName,
  teamBName,
  teamAColor,
  teamBColor,
  cameraPreset,
  showNames,
  showPassingLines,
  selectedPlayerId,
  onPlayerPositionChange,
  onBallPositionChange,
  onMarkerPositionChange,
  onContextMenuOpen,
  onSelectPlayer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js instances stored in refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Groups in scene
  const playersGroupRef = useRef<THREE.Group | null>(null);
  const ballGroupRef = useRef<THREE.Group | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const linesGroupRef = useRef<THREE.Group | null>(null);
  const pitchMeshRef = useRef<THREE.Mesh | null>(null);

  // Camera animation state
  const cameraAnimRef = useRef<{
    isAnimating: boolean;
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
    startTime: number;
    duration: number;
  } | null>(null);

  // Dragging state
  const dragRef = useRef<{
    isDragging: boolean;
    draggedType: 'player' | 'ball' | 'marker' | null;
    draggedId: string | null;
    startPointerPos: { x: number; y: number };
    hasMoved: boolean;
    currentPitchPos: { x: number; z: number };
  }>({
    isDragging: false,
    draggedType: null,
    draggedId: null,
    startPointerPos: { x: 0, y: 0 },
    hasMoved: false,
    currentPitchPos: { x: 0, z: 0 },
  });

  // 2D screen positions for player names / HUD
  const [playerScreenPositions, setPlayerScreenPositions] = useState<
    { id: string; name: string; number: number; x: number; y: number; team: 'teamA' | 'teamB'; isGK: boolean }[]
  >([]);

  // Calculate preset camera target & position
  const getPresetCoords = useCallback(
    (preset: CameraPreset): { pos: THREE.Vector3; target: THREE.Vector3 } => {
      switch (preset) {
        case 'top':
          // Perpendicular top-down bird's eye view
          return {
            pos: new THREE.Vector3(0, 92, 0.001),
            target: new THREE.Vector3(0, 0, 0),
          };
        case 'center_angled':
          // TV broadcast elevated side view
          return {
            pos: new THREE.Vector3(0, 45, 60),
            target: new THREE.Vector3(0, 0, 0),
          };
        case 'ball_angled':
          // Focused on ball
          return {
            pos: new THREE.Vector3(ball.position.x, 24, ball.position.z + 32),
            target: new THREE.Vector3(ball.position.x, 0.5, ball.position.z),
          };
        case 'goal_a':
          return {
            pos: new THREE.Vector3(-65, 20, 0),
            target: new THREE.Vector3(0, 2, 0),
          };
        case 'goal_b':
          return {
            pos: new THREE.Vector3(65, 20, 0),
            target: new THREE.Vector3(0, 2, 0),
          };
        default:
          return {
            pos: new THREE.Vector3(0, 48, 62),
            target: new THREE.Vector3(0, 0, 0),
          };
      }
    },
    [ball.position.x, ball.position.z]
  );

  // Trigger camera animation to preset
  const transitionToPreset = useCallback(
    (preset: CameraPreset) => {
      if (!cameraRef.current || !controlsRef.current) return;
      const { pos, target } = getPresetCoords(preset);

      cameraAnimRef.current = {
        isAnimating: true,
        startPos: cameraRef.current.position.clone(),
        endPos: pos,
        startTarget: controlsRef.current.target.clone(),
        endTarget: target,
        startTime: performance.now(),
        duration: 750, // ms
      };
    },
    [getPresetCoords]
  );

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b131e');
    sceneRef.current = scene;

    // Subtle atmospheric fog
    scene.fog = new THREE.FogExp2('#0b131e', 0.0035);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
    const initialCoords = getPresetCoords('center_angled');
    camera.position.copy(initialCoords.pos);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't go below ground
    controls.minDistance = 8;
    controls.maxDistance = 160;
    controls.target.copy(initialCoords.target);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Main floodlight (Sun)
    const dirLight1 = new THREE.DirectionalLight(0xfffbeb, 1.4);
    dirLight1.position.set(30, 70, 40);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    dirLight1.shadow.camera.near = 10;
    dirLight1.shadow.camera.far = 200;
    const d = 60;
    dirLight1.shadow.camera.left = -d;
    dirLight1.shadow.camera.right = d;
    dirLight1.shadow.camera.top = d;
    dirLight1.shadow.camera.bottom = -d;
    dirLight1.shadow.bias = -0.0005;
    scene.add(dirLight1);

    // Opposite fill light
    const dirLight2 = new THREE.DirectionalLight(0xe0f2fe, 0.6);
    dirLight2.position.set(-30, 45, -40);
    scene.add(dirLight2);

    // Pitch Plane with Procedural Turf & Markings
    const pitchGeom = new THREE.PlaneGeometry(PITCH_LENGTH, PITCH_WIDTH);
    const pitchTexture = createPitchTexture();
    const pitchMat = new THREE.MeshStandardMaterial({
      map: pitchTexture,
      roughness: 0.8,
      metalness: 0.05,
    });
    const pitchMesh = new THREE.Mesh(pitchGeom, pitchMat);
    pitchMesh.rotation.x = -Math.PI / 2;
    pitchMesh.receiveShadow = true;
    pitchMesh.name = 'pitch-plane';
    pitchMesh.userData = { type: 'field' };
    scene.add(pitchMesh);
    pitchMeshRef.current = pitchMesh;

    // Darker perimeter safety turf apron
    const apronGeom = new THREE.PlaneGeometry(PITCH_LENGTH + 14, PITCH_WIDTH + 14);
    const apronMat = new THREE.MeshStandardMaterial({
      color: 0x164e24,
      roughness: 0.9,
    });
    const apronMesh = new THREE.Mesh(apronGeom, apronMat);
    apronMesh.rotation.x = -Math.PI / 2;
    apronMesh.position.y = -0.02;
    apronMesh.receiveShadow = true;
    scene.add(apronMesh);

    // Goal posts
    const leftGoal = createGoal(true);
    const rightGoal = createGoal(false);
    scene.add(leftGoal);
    scene.add(rightGoal);

    // Container groups for dynamic objects
    const playersGroup = new THREE.Group();
    playersGroup.name = 'players-group';
    scene.add(playersGroup);
    playersGroupRef.current = playersGroup;

    const ballGroup = new THREE.Group();
    ballGroup.name = 'ball-group';
    scene.add(ballGroup);
    ballGroupRef.current = ballGroup;

    const markersGroup = new THREE.Group();
    markersGroup.name = 'markers-group';
    scene.add(markersGroup);
    markersGroupRef.current = markersGroup;

    const linesGroup = new THREE.Group();
    linesGroup.name = 'lines-group';
    scene.add(linesGroup);
    linesGroupRef.current = linesGroup;

    // Handle Window Resize via ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    // Main animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Handle camera preset animation
      if (cameraAnimRef.current && cameraAnimRef.current.isAnimating) {
        const { startPos, endPos, startTarget, endTarget, startTime, duration } = cameraAnimRef.current;
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Smooth cubic ease out
        const ease = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(startPos, endPos, ease);
        controls.target.lerpVectors(startTarget, endTarget, ease);

        if (progress >= 1) {
          cameraAnimRef.current.isAnimating = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      // Update projected 2D coordinates of players for name labels
      if (playersGroupRef.current && cameraRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const halfW = containerRect.width / 2;
        const halfH = containerRect.height / 2;

        const positions: {
          id: string;
          name: string;
          number: number;
          x: number;
          y: number;
          team: 'teamA' | 'teamB';
          isGK: boolean;
        }[] = [];

        playersGroupRef.current.children.forEach((child) => {
          const playerId = child.userData?.id;
          if (!playerId) return;

          const pObj = players.find((p) => p.id === playerId);
          if (!pObj) return;

          // Project head position (y = 2.4) into screen space
          const tempVec = new THREE.Vector3(child.position.x, 2.4, child.position.z);
          tempVec.project(camera);

          // Check if in front of camera
          if (tempVec.z < 1) {
            const screenX = tempVec.x * halfW + halfW;
            const screenY = -(tempVec.y * halfH) + halfH;
            positions.push({
              id: playerId,
              name: pObj.name,
              number: pObj.number,
              x: screenX,
              y: screenY,
              team: pObj.team,
              isGK: !!pObj.isGoalkeeper,
            });
          }
        });

        setPlayerScreenPositions(positions);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Watch for Camera Preset Changes
  useEffect(() => {
    transitionToPreset(cameraPreset);
  }, [cameraPreset, transitionToPreset]);

  // Update Players 3D meshes when players or colors change
  useEffect(() => {
    const group = playersGroupRef.current;
    if (!group) return;

    // Clear previous players
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }

    // Build new player meshes
    players.forEach((player) => {
      const mesh = createPlayerMesh(player, teamAColor, teamBColor);
      const isSelected = player.id === selectedPlayerId;
      const ring = mesh.getObjectByName('selection-ring') as THREE.Mesh;
      if (ring && ring.material) {
        (ring.material as THREE.MeshBasicMaterial).opacity = isSelected ? 0.9 : 0;
      }
      group.add(mesh);
    });
  }, [players, teamAColor, teamBColor, selectedPlayerId]);

  // Update Ball 3D mesh
  useEffect(() => {
    const group = ballGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }

    const mesh = createBallMesh(ball);
    group.add(mesh);
  }, [ball]);

  // Update Markers 3D meshes
  useEffect(() => {
    const group = markersGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }

    markers.forEach((m) => {
      const cone = createConeMarker(m);
      group.add(cone);
    });
  }, [markers]);

  // Update Passing Lines / Tactical Arrows
  useEffect(() => {
    const group = linesGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }

    if (!showPassingLines) return;

    // Find nearest player of each team to ball and draw tactical passing lines
    let nearestA: Player | null = null;
    let distA = Infinity;
    let nearestB: Player | null = null;
    let distB = Infinity;

    players.forEach((p) => {
      const d = Math.hypot(p.position.x - ball.position.x, p.position.z - ball.position.z);
      if (p.team === 'teamA' && d < distA) {
        distA = d;
        nearestA = p;
      } else if (p.team === 'teamB' && d < distB) {
        distB = d;
        nearestB = p;
      }
    });

    // Helper to draw a sleek dotted/glowing tactical line
    const addPassLine = (from: { x: number; z: number }, to: { x: number; z: number }, colorHex: number) => {
      const points = [];
      const steps = 24;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = THREE.MathUtils.lerp(from.x, to.x, t);
        const z = THREE.MathUtils.lerp(from.z, to.z, t);
        // Subtle arch in 3D
        const y = 0.08 + Math.sin(t * Math.PI) * 1.5;
        points.push(new THREE.Vector3(x, y, z));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineDashedMaterial({
        color: colorHex,
        dashSize: 1.2,
        gapSize: 0.6,
        linewidth: 2,
      });
      const line = new THREE.Line(geom, mat);
      line.computeLineDistances();
      group.add(line);
    };

    if (nearestA) {
      addPassLine(ball.position, (nearestA as Player).position, 0xef4444);
    }
    if (nearestB) {
      addPassLine(ball.position, (nearestB as Player).position, 0x3b82f6);
    }
  }, [players, ball, showPassingLines]);

  // Pointer Events: Raycasting for Hover, Drag & Drop, and Clicks
  const getRaycastHit = (clientX: number, clientY: number) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    // Objects to test
    const interactables: THREE.Object3D[] = [];
    if (playersGroupRef.current) interactables.push(...playersGroupRef.current.children);
    if (ballGroupRef.current) interactables.push(...ballGroupRef.current.children);
    if (markersGroupRef.current) interactables.push(...markersGroupRef.current.children);
    if (pitchMeshRef.current) interactables.push(pitchMeshRef.current);

    const intersects = raycaster.intersectObjects(interactables, true);
    if (intersects.length === 0) return null;

    // Find the relevant parent with userData
    const hit = intersects[0];
    let curr: THREE.Object3D | null = hit.object;
    let targetData: { type: 'player' | 'ball' | 'field' | 'marker'; id?: string } | null = null;

    while (curr && curr !== sceneRef.current) {
      if (curr.userData && curr.userData.type) {
        targetData = {
          type: curr.userData.type,
          id: curr.userData.id,
        };
        break;
      }
      curr = curr.parent;
    }

    return {
      hit,
      point: hit.point,
      targetData: targetData || { type: 'field' as const },
    };
  };

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only handle primary button
    if (e.button !== 0) return;

    const hitResult = getRaycastHit(e.clientX, e.clientY);
    if (!hitResult) return;

    dragRef.current.startPointerPos = { x: e.clientX, y: e.clientY };
    dragRef.current.hasMoved = false;

    if (hitResult.targetData.type === 'player' && hitResult.targetData.id) {
      dragRef.current.isDragging = true;
      dragRef.current.draggedType = 'player';
      dragRef.current.draggedId = hitResult.targetData.id;
      if (controlsRef.current) controlsRef.current.enabled = false;
      if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    } else if (hitResult.targetData.type === 'ball') {
      dragRef.current.isDragging = true;
      dragRef.current.draggedType = 'ball';
      dragRef.current.draggedId = 'ball';
      if (controlsRef.current) controlsRef.current.enabled = false;
      if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    } else if (hitResult.targetData.type === 'marker' && hitResult.targetData.id) {
      dragRef.current.isDragging = true;
      dragRef.current.draggedType = 'marker';
      dragRef.current.draggedId = hitResult.targetData.id;
      if (controlsRef.current) controlsRef.current.enabled = false;
      if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    }
  };

  // Pointer Move (Dragging & Cursor update)
  const handlePointerMove = (e: React.PointerEvent) => {
    const dX = e.clientX - dragRef.current.startPointerPos.x;
    const dY = e.clientY - dragRef.current.startPointerPos.y;
    const dist = Math.hypot(dX, dY);

    if (dist > 4) {
      dragRef.current.hasMoved = true;
    }

    if (dragRef.current.isDragging && cameraRef.current && canvasRef.current) {
      // Raycast against horizontal plane at y = 0
      const rect = canvasRef.current.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), cameraRef.current);

      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, intersection);

      if (intersection) {
        // Clamp to pitch borders
        const clampedX = Math.max(-52.5, Math.min(52.5, intersection.x));
        const clampedZ = Math.max(-34, Math.min(34, intersection.z));

        dragRef.current.currentPitchPos = { x: clampedX, z: clampedZ };

        // Realtime 3D feedback
        if (dragRef.current.draggedType === 'player' && playersGroupRef.current) {
          const mesh = playersGroupRef.current.children.find(
            (c) => c.userData?.id === dragRef.current.draggedId
          );
          if (mesh) {
            mesh.position.x = clampedX;
            mesh.position.z = clampedZ;
          }
        } else if (dragRef.current.draggedType === 'ball' && ballGroupRef.current) {
          const ballMesh = ballGroupRef.current.children[0];
          if (ballMesh) {
            ballMesh.position.x = clampedX;
            ballMesh.position.z = clampedZ;
          }
        } else if (dragRef.current.draggedType === 'marker' && markersGroupRef.current) {
          const markerMesh = markersGroupRef.current.children.find(
            (c) => c.userData?.id === dragRef.current.draggedId
          );
          if (markerMesh) {
            markerMesh.position.x = clampedX;
            markerMesh.position.z = clampedZ;
          }
        }
      }
    } else {
      // Hover cursor
      const hitResult = getRaycastHit(e.clientX, e.clientY);
      if (canvasRef.current) {
        if (
          hitResult &&
          (hitResult.targetData.type === 'player' ||
            hitResult.targetData.type === 'ball' ||
            hitResult.targetData.type === 'marker')
        ) {
          canvasRef.current.style.cursor = 'grab';
        } else {
          canvasRef.current.style.cursor = 'default';
        }
      }
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent) => {
    if (canvasRef.current) canvasRef.current.style.cursor = 'default';

    if (dragRef.current.isDragging) {
      if (controlsRef.current) controlsRef.current.enabled = true;

      if (dragRef.current.hasMoved) {
        const { x, z } = dragRef.current.currentPitchPos;
        if (dragRef.current.draggedType === 'player' && dragRef.current.draggedId) {
          onPlayerPositionChange(dragRef.current.draggedId, { x, y: 0, z });
        } else if (dragRef.current.draggedType === 'ball') {
          onBallPositionChange({ x, y: 0.5, z });
        } else if (dragRef.current.draggedType === 'marker' && dragRef.current.draggedId) {
          onMarkerPositionChange?.(dragRef.current.draggedId, { x, y: 0, z });
        }
      }

      dragRef.current.isDragging = false;
      dragRef.current.draggedType = null;
      dragRef.current.draggedId = null;
    }

    // If it was a click without significant drag: open Context Menu!
    if (!dragRef.current.hasMoved) {
      const hitResult = getRaycastHit(e.clientX, e.clientY);
      if (hitResult) {
        const { targetData, point } = hitResult;
        if (targetData.type === 'player' && targetData.id) {
          onSelectPlayer(targetData.id);
          onContextMenuOpen('player', targetData.id, e.clientX, e.clientY);
        } else if (targetData.type === 'ball') {
          onContextMenuOpen('ball', undefined, e.clientX, e.clientY);
        } else if (targetData.type === 'marker' && targetData.id) {
          onSelectPlayer(null);
          onContextMenuOpen('marker', targetData.id, e.clientX, e.clientY);
        } else {
          // Field clicked
          onSelectPlayer(null);
          onContextMenuOpen('field', undefined, e.clientX, e.clientY, {
            x: Math.max(-52.5, Math.min(52.5, point.x)),
            z: Math.max(-34, Math.min(34, point.z)),
          });
        }
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex-1 overflow-hidden select-none bg-slate-950">
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full block touch-none"
      />

      {/* 2D Player Labels Overlay */}
      {showNames && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {playerScreenPositions.map((pos) => (
            <div
              key={pos.id}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -100%)`,
              }}
              className="absolute pointer-events-none transition-transform duration-75 ease-out will-change-transform"
            >
              <div
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg border backdrop-blur-sm whitespace-nowrap flex items-center gap-1 ${
                  pos.isGK
                    ? 'bg-amber-900/90 text-amber-200 border-amber-400'
                    : pos.team === 'teamA'
                    ? 'bg-slate-900/90 text-rose-300 border-rose-500/80'
                    : 'bg-slate-900/90 text-sky-300 border-sky-500/80'
                }`}
              >
                <span>#{pos.number}</span>
                <span className="font-semibold">{pos.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team Indicators on Pitch Sides */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-none text-xs">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamAColor }} />
        <span className="font-bold text-white">{teamAName}</span>
        <span className="text-[10px] text-slate-400">← Defending</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-none text-xs">
        <span className="text-[10px] text-slate-400">Defending →</span>
        <span className="font-bold text-white">{teamBName}</span>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamBColor }} />
      </div>
    </div>
  );
};
