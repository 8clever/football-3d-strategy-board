import * as THREE from 'three';
import { Player, Ball, TacticalMarker, TacticalArrow } from '../types';

export const PITCH_LENGTH = 105;
export const PITCH_WIDTH = 68;

// Create high-res procedural texture for the football pitch
export function createPitchTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1360; // ratio approx 105 : 68 = 1.544
  const ctx = canvas.getContext('2d')!;

  // Scale factors
  const w = canvas.width;
  const h = canvas.height;
  const scaleX = w / PITCH_LENGTH;
  const scaleZ = h / PITCH_WIDTH;

  // Background dark green
  ctx.fillStyle = '#1e5e2f';
  ctx.fillRect(0, 0, w, h);

  // Mowed grass alternating stripes (vertical stripes across length)
  const stripeCount = 18;
  const stripeWidth = w / stripeCount;
  for (let i = 0; i < stripeCount; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#26733a' : '#1f6331';
    ctx.fillRect(i * stripeWidth, 0, stripeWidth, h);
  }

  // Subtle turf noise / gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(0,0,0,0.08)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.03)');
  grad.addColorStop(1, 'rgba(0,0,0,0.08)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // White line markings setup
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = Math.max(3, scaleX * 0.14); // realistic line width ~12cm
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';

  // Helper to convert pitch meters (-52.5..+52.5, -34..+34) to canvas px
  const toPxX = (x: number) => (x + PITCH_LENGTH / 2) * scaleX;
  const toPxY = (z: number) => (z + PITCH_WIDTH / 2) * scaleZ;

  // Touchlines and Goal lines (outer boundary)
  ctx.strokeRect(toPxX(-52.5), toPxY(-34), PITCH_LENGTH * scaleX, PITCH_WIDTH * scaleZ);

  // Halfway line
  ctx.beginPath();
  ctx.moveTo(toPxX(0), toPxY(-34));
  ctx.lineTo(toPxX(0), toPxY(34));
  ctx.stroke();

  // Center circle (radius 9.15m)
  ctx.beginPath();
  ctx.arc(toPxX(0), toPxY(0), 9.15 * scaleX, 0, Math.PI * 2);
  ctx.stroke();

  // Center spot (radius ~0.25m)
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(toPxX(0), toPxY(0), 0.5 * scaleX, 0, Math.PI * 2);
  ctx.fill();

  // Goal Area (6-yard box): 5.5m deep, 18.32m wide (from -9.16 to +9.16)
  // Left side
  ctx.strokeRect(toPxX(-52.5), toPxY(-9.16), 5.5 * scaleX, 18.32 * scaleZ);
  // Right side
  ctx.strokeRect(toPxX(52.5 - 5.5), toPxY(-9.16), 5.5 * scaleX, 18.32 * scaleZ);

  // Penalty Box (18-yard box): 16.5m deep, 40.32m wide (from -20.16 to +20.16)
  // Left side
  ctx.strokeRect(toPxX(-52.5), toPxY(-20.16), 16.5 * scaleX, 40.32 * scaleZ);
  // Right side
  ctx.strokeRect(toPxX(52.5 - 16.5), toPxY(-20.16), 16.5 * scaleX, 40.32 * scaleZ);

  // Penalty spots (11m from goal line)
  ctx.beginPath();
  ctx.arc(toPxX(-41.5), toPxY(0), 0.45 * scaleX, 0, Math.PI * 2);
  ctx.arc(toPxX(41.5), toPxY(0), 0.45 * scaleX, 0, Math.PI * 2);
  ctx.fill();

  // Penalty arcs (radius 9.15m from penalty spot, outside penalty box)
  // Left arc
  ctx.beginPath();
  ctx.arc(toPxX(-41.5), toPxY(0), 9.15 * scaleX, -0.92, 0.92, false);
  ctx.stroke();

  // Right arc
  ctx.beginPath();
  ctx.arc(toPxX(41.5), toPxY(0), 9.15 * scaleX, Math.PI - 0.92, Math.PI + 0.92, false);
  ctx.stroke();

  // Corner arcs (1m radius)
  const cornerRad = 1.0 * scaleX;
  // Top-left
  ctx.beginPath();
  ctx.arc(toPxX(-52.5), toPxY(-34), cornerRad, 0, Math.PI / 2, false);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.arc(toPxX(-52.5), toPxY(34), cornerRad, -Math.PI / 2, 0, false);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.arc(toPxX(52.5), toPxY(-34), cornerRad, Math.PI / 2, Math.PI, false);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.arc(toPxX(52.5), toPxY(34), cornerRad, Math.PI, Math.PI * 1.5, false);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

// Build 3D goal posts with realistic frame & net
export function createGoal(isLeft: boolean): THREE.Group {
  const goal = new THREE.Group();
  const postRadius = 0.08;
  const goalWidth = 7.32;
  const goalHeight = 2.44;
  const goalDepth = 2.0;

  const postMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.2,
  });

  const netMaterial = new THREE.MeshBasicMaterial({
    color: 0xe2e8f0,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });

  // Vertical posts
  const postGeom = new THREE.CylinderGeometry(postRadius, postRadius, goalHeight, 16);
  const leftPost = new THREE.Mesh(postGeom, postMaterial);
  leftPost.position.set(0, goalHeight / 2, -goalWidth / 2);
  goal.add(leftPost);

  const rightPost = new THREE.Mesh(postGeom, postMaterial);
  rightPost.position.set(0, goalHeight / 2, goalWidth / 2);
  goal.add(rightPost);

  // Crossbar
  const crossbarGeom = new THREE.CylinderGeometry(postRadius, postRadius, goalWidth, 16);
  const crossbar = new THREE.Mesh(crossbarGeom, postMaterial);
  crossbar.rotation.x = Math.PI / 2;
  crossbar.position.set(0, goalHeight, 0);
  goal.add(crossbar);

  // Back net support box
  const dir = isLeft ? -1 : 1;
  const backBox = new THREE.BoxGeometry(goalDepth, goalHeight, goalWidth);
  const net = new THREE.Mesh(backBox, netMaterial);
  net.position.set((dir * goalDepth) / 2, goalHeight / 2, 0);
  goal.add(net);

  // Position at goal line
  const x = isLeft ? -52.5 : 52.5;
  goal.position.set(x, 0, 0);

  return goal;
}

// Create ball canvas texture with classic football pattern
export function createBallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw black pentagons/hexagons pattern
  ctx.fillStyle = '#111827';
  const pentagons = [
    { x: 128, y: 64, r: 24 },
    { x: 384, y: 64, r: 24 },
    { x: 256, y: 128, r: 28 },
    { x: 100, y: 192, r: 22 },
    { x: 412, y: 192, r: 22 },
  ];

  for (const p of pentagons) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const px = p.x + p.r * Math.cos(angle);
      const py = p.y + p.r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Seam lines
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 2;
  for (const p of pentagons) {
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.r * 1.6 * Math.cos(angle), p.y + p.r * 1.6 * Math.sin(angle));
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Generate circular texture for player jersey number top badge
export function createNumberBadgeTexture(number: number, teamColor: string, isGK: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Circular background
  ctx.fillStyle = isGK ? '#eab308' : teamColor;
  ctx.beginPath();
  ctx.arc(128, 128, 124, 0, Math.PI * 2);
  ctx.fill();

  // White border
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // Number text
  ctx.fillStyle = isGK ? '#1e293b' : '#ffffff';
  ctx.font = 'bold 110px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(number), 128, 132);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Create 3D player token object
export function createPlayerMesh(player: Player, teamAColor: string, teamBColor: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `player-${player.id}`;
  group.userData = { type: 'player', id: player.id };

  const color = player.team === 'teamA' ? teamAColor : teamBColor;
  const isGK = !!player.isGoalkeeper;
  const primaryColor = isGK ? '#eab308' : color;

  // Base disc on grass
  const baseGeom = new THREE.CylinderGeometry(1.25, 1.35, 0.25, 32);
  const baseMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    roughness: 0.4,
    metalness: 0.1,
  });
  const baseMesh = new THREE.Mesh(baseGeom, baseMat);
  baseMesh.position.y = 0.125;
  baseMesh.castShadow = true;
  group.add(baseMesh);

  // Player body / torso token
  const bodyGeom = new THREE.CylinderGeometry(0.95, 1.1, 1.6, 32);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    roughness: 0.35,
    metalness: 0.1,
  });
  const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
  bodyMesh.position.y = 0.25 + 0.8;
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Number badge disc on top
  const topBadgeGeom = new THREE.CylinderGeometry(0.95, 0.95, 0.05, 32);
  const badgeTexture = createNumberBadgeTexture(player.number, color, isGK);
  const topMat = new THREE.MeshBasicMaterial({ map: badgeTexture });
  const sideMat = new THREE.MeshStandardMaterial({ color: '#ffffff' });
  const topBadge = new THREE.Mesh(topBadgeGeom, [sideMat, topMat, sideMat]);
  topBadge.position.y = 0.25 + 1.6 + 0.025;
  group.add(topBadge);

  // Heading arrow / visor indicator pointing forward
  const arrowShape = new THREE.ConeGeometry(0.4, 0.8, 16);
  const arrowMat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.2,
  });
  const arrow = new THREE.Mesh(arrowShape, arrowMat);
  arrow.rotation.z = -Math.PI / 2;
  arrow.position.set(1.4, 0.25, 0); // Points towards +X locally
  group.add(arrow);

  // Selection highlight ring (invisible by default)
  const ringGeom = new THREE.RingGeometry(1.5, 1.75, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
  });
  const ringMesh = new THREE.Mesh(ringGeom, ringMat);
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.y = 0.03;
  ringMesh.name = 'selection-ring';
  group.add(ringMesh);

  // Position & rotation
  group.position.set(player.position.x, 0, player.position.z);
  group.rotation.y = player.rotation || 0;

  return group;
}

// Create 3D soccer ball object
export function createBallMesh(ball: Ball): THREE.Group {
  const group = new THREE.Group();
  group.name = 'soccer-ball';
  group.userData = { type: 'ball' };

  const ballRadius = 0.7; // scaled for tactical clarity
  const geom = new THREE.SphereGeometry(ballRadius, 32, 32);
  const texture = createBallTexture();
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.35,
    metalness: 0.1,
  });

  const sphere = new THREE.Mesh(geom, mat);
  sphere.position.y = ballRadius;
  sphere.castShadow = true;
  group.add(sphere);

  // Contact shadow disc under ball
  const shadowGeom = new THREE.CircleGeometry(ballRadius * 1.1, 24);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x0a1f0f,
    transparent: true,
    opacity: 0.5,
  });
  const shadow = new THREE.Mesh(shadowGeom, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  // Halo for ball selection
  const haloGeom = new THREE.RingGeometry(ballRadius * 1.3, ballRadius * 1.55, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
  });
  const halo = new THREE.Mesh(haloGeom, haloMat);
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.03;
  halo.name = 'ball-halo';
  group.add(halo);

  group.position.set(ball.position.x, 0, ball.position.z);
  return group;
}

// Create tactical cone
export function createConeMarker(marker: TacticalMarker): THREE.Group {
  const group = new THREE.Group();
  group.name = `marker-${marker.id}`;
  group.userData = { type: 'marker', id: marker.id };

  const coneGeom = new THREE.ConeGeometry(0.6, 1.2, 16);
  const coneMat = new THREE.MeshStandardMaterial({
    color: marker.color || 0xf97316,
    roughness: 0.4,
  });
  const cone = new THREE.Mesh(coneGeom, coneMat);
  cone.position.y = 0.6;
  cone.castShadow = true;
  cone.userData = { type: 'marker', id: marker.id };
  group.add(cone);

  // White reflective base
  const baseGeom = new THREE.BoxGeometry(1.2, 0.08, 1.2);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = 0.04;
  base.userData = { type: 'marker', id: marker.id };
  group.add(base);

  // Generous transparent click target so users can easily click/tap the cone
  const hitGeom = new THREE.CylinderGeometry(0.9, 0.9, 1.5, 12);
  const hitMat = new THREE.MeshBasicMaterial({
    visible: false,
    transparent: true,
    opacity: 0,
  });
  const hitMesh = new THREE.Mesh(hitGeom, hitMat);
  hitMesh.position.y = 0.75;
  hitMesh.userData = { type: 'marker', id: marker.id };
  group.add(hitMesh);

  group.position.set(marker.position.x, 0, marker.position.z);
  return group;
}
