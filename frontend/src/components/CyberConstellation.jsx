import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function CyberConstellation({
  activeStep = 1,
  selectedAgent = null,
  onSelectAgent,
  className = 'w-full h-full',
}) {
  const containerRef = useRef(null);
  const activeStepRef = useRef(activeStep);
  const selectedAgentRef = useRef(selectedAgent);
  const onSelectAgentRef = useRef(onSelectAgent);

  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    selectedAgentRef.current = selectedAgent;
  }, [selectedAgent]);

  useEffect(() => {
    onSelectAgentRef.current = onSelectAgent;
  }, [onSelectAgent]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 460;

    // -------------------------------------------------------------
    // SCENE & CAMERA SETUP
    // -------------------------------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 16.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------
    // LIGHTING SETUP (Rich Multi-chromatic Theme Lighting)
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0x0a0f1d, 3.0);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    mainLight.position.set(10, 15, 12);
    scene.add(mainLight);

    const purpleBackLight = new THREE.DirectionalLight(0x818cf8, 2.8);
    purpleBackLight.position.set(-12, 10, -8);
    scene.add(purpleBackLight);

    const emeraldPoint = new THREE.PointLight(0x10b981, 3.5, 30);
    emeraldPoint.position.set(0, 2.5, 0);
    scene.add(emeraldPoint);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // -------------------------------------------------------------
    // 1. BASE GRID & RADAR FLOOR
    // -------------------------------------------------------------
    const floorGroup = new THREE.Group();
    floorGroup.position.y = -3.2;
    rootGroup.add(floorGroup);

    // Concentric Radar Rings
    const ringRadii = [2.2, 4.4, 6.6, 8.8];
    ringRadii.forEach((r, idx) => {
      const ringGeo = new THREE.RingGeometry(r, r + 0.03, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x0ea5e9 : 0x6366f1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22 - idx * 0.03,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      floorGroup.add(ringMesh);
    });

    // Crosshairs on floor
    const crosshairMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });
    const crossPoints = [];
    crossPoints.push(new THREE.Vector3(-9, 0, 0), new THREE.Vector3(9, 0, 0));
    crossPoints.push(new THREE.Vector3(0, 0, -9), new THREE.Vector3(0, 0, 9));
    const crossGeo = new THREE.BufferGeometry().setFromPoints(crossPoints);
    const crossLines = new THREE.LineSegments(crossGeo, crosshairMat);
    floorGroup.add(crossLines);

    // -------------------------------------------------------------
    // 2. LAYER 1: INGESTION PLATFORM (Step 1 Focus)
    // -------------------------------------------------------------
    const intakeGroup = new THREE.Group();
    intakeGroup.position.y = -2.2;
    rootGroup.add(intakeGroup);

    const baseCylGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.4, 32);
    const baseCylMat = new THREE.MeshPhongMaterial({
      color: 0x0f172a,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      shininess: 90,
      flatShading: true,
      transparent: true,
      opacity: 0.92,
    });
    const baseCyl = new THREE.Mesh(baseCylGeo, baseCylMat);
    intakeGroup.add(baseCyl);

    const intakeWireGeo = new THREE.CylinderGeometry(1.65, 1.85, 0.42, 16);
    const intakeWireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    intakeGroup.add(new THREE.Mesh(intakeWireGeo, intakeWireMat));

    // Floating Data Shards inside Intake
    const shardCount = 8;
    const shardMeshes = [];
    const shardGeo = new THREE.BoxGeometry(0.18, 0.28, 0.04);
    const shardMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
    });

    for (let i = 0; i < shardCount; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      const angle = (i / shardCount) * Math.PI * 2;
      shard.position.set(Math.cos(angle) * 1.1, 0.4 + (i % 3) * 0.15, Math.sin(angle) * 1.1);
      shard.rotation.y = angle;
      intakeGroup.add(shard);
      shardMeshes.push(shard);
    }

    // -------------------------------------------------------------
    // 3. LAYER 2 & 3: 4-AGENT ORBITAL NODES & RESEARCH MATRIX
    // -------------------------------------------------------------
    const agentsData = [
      {
        id: 'market',
        name: 'Market Analyst',
        code: '01. MARKET',
        color: 0x06b6d4,
        emissive: 0x0891b2,
        radius: 5.5,
        speed: 0.004,
        initialAngle: 0,
        shape: 'octahedron',
      },
      {
        id: 'competitor',
        name: 'Competitor Scout',
        code: '02. COMPETITOR',
        color: 0x8b5cf6,
        emissive: 0x7c3aed,
        radius: 5.5,
        speed: 0.004,
        initialAngle: Math.PI / 2,
        shape: 'icosahedron',
      },
      {
        id: 'financial',
        name: 'Financial Modeler',
        code: '03. FINANCIAL',
        color: 0xf59e0b,
        emissive: 0xd97706,
        radius: 5.5,
        speed: 0.004,
        initialAngle: Math.PI,
        shape: 'cylinder',
      },
      {
        id: 'risk',
        name: 'Risk Assessor',
        code: '04. RISK',
        color: 0x10b981,
        emissive: 0x059669,
        radius: 5.5,
        speed: 0.004,
        initialAngle: (3 * Math.PI) / 2,
        shape: 'dodecahedron',
      },
    ];

    const agentNodes = [];

    // Orbital Guideline Ring
    const orbitTrackGeo = new THREE.TorusGeometry(5.5, 0.02, 16, 128);
    const orbitTrackMat = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.35,
    });
    const orbitTrack = new THREE.Mesh(orbitTrackGeo, orbitTrackMat);
    orbitTrack.rotation.x = Math.PI / 2;
    orbitTrack.position.y = 0.4;
    rootGroup.add(orbitTrack);

    agentsData.forEach((ag) => {
      const nodeGroup = new THREE.Group();

      let geom;
      if (ag.shape === 'octahedron') {
        geom = new THREE.OctahedronGeometry(0.55, 0);
      } else if (ag.shape === 'icosahedron') {
        geom = new THREE.IcosahedronGeometry(0.52, 0);
      } else if (ag.shape === 'cylinder') {
        geom = new THREE.CylinderGeometry(0.42, 0.42, 0.75, 6);
      } else {
        geom = new THREE.DodecahedronGeometry(0.52, 0);
      }

      const mat = new THREE.MeshPhongMaterial({
        color: ag.color,
        emissive: ag.emissive,
        emissiveIntensity: 0.65,
        shininess: 90,
        flatShading: true,
      });

      const mesh = new THREE.Mesh(geom, mat);
      nodeGroup.add(mesh);

      // Wireframe overlay on agent mesh
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const wireMesh = new THREE.Mesh(geom, wireMat);
      wireMesh.scale.set(1.05, 1.05, 1.05);
      nodeGroup.add(wireMesh);

      // Sonar / Radar Ring
      const sonarGeo = new THREE.RingGeometry(0.85, 0.98, 32);
      const sonarMat = new THREE.MeshBasicMaterial({
        color: ag.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
      });
      const sonarRing = new THREE.Mesh(sonarGeo, sonarMat);
      sonarRing.rotation.x = Math.PI / 2;
      nodeGroup.add(sonarRing);

      // Vertical energy beacon pillar
      const beaconGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: ag.color,
        transparent: true,
        opacity: 0.45,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = -0.7;
      nodeGroup.add(beacon);

      rootGroup.add(nodeGroup);

      agentNodes.push({
        id: ag.id,
        group: nodeGroup,
        mesh,
        wireMesh,
        sonarRing,
        angle: ag.initialAngle,
        radius: ag.radius,
        speed: ag.speed,
        color: ag.color,
        data: ag,
      });
    });

    // -------------------------------------------------------------
    // 4. LAYER 3: CROSS-CONTRADICTION LASER GRID
    // -------------------------------------------------------------
    // Dynamic Lines connecting agents to each other and to the center
    const laserCount = 6 + 4; // 6 inter-agent pairs + 4 to center
    const laserGeo = new THREE.BufferGeometry();
    const laserPositions = new Float32Array(laserCount * 6);
    laserGeo.setAttribute('position', new THREE.BufferAttribute(laserPositions, 3));

    const laserMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      linewidth: 2,
    });
    const laserMesh = new THREE.LineSegments(laserGeo, laserMat);
    rootGroup.add(laserMesh);

    // -------------------------------------------------------------
    // 5. LAYER 4: SYNTHESIS CORE & CONVICTION CRYSTAL (Step 4 Focus)
    // -------------------------------------------------------------
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 0.5;
    rootGroup.add(coreGroup);

    // Tiered Processing Discs
    const coreDiscCount = 3;
    for (let i = 0; i < coreDiscCount; i++) {
      const y = (i - 1) * 0.45;
      const r = 1.3 - i * 0.15;
      const discG = new THREE.CylinderGeometry(r, r, 0.2, 32);
      const discM = new THREE.MeshPhongMaterial({
        color: 0x0f172a,
        emissive: 0x059669,
        emissiveIntensity: 0.4,
        shininess: 90,
        flatShading: true,
        transparent: true,
        opacity: 0.9,
      });
      const disc = new THREE.Mesh(discG, discM);
      disc.position.y = y;
      coreGroup.add(disc);

      const dWireG = new THREE.CylinderGeometry(r * 1.03, r * 1.03, 0.22, 16);
      const dWireM = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });
      const dWire = new THREE.Mesh(dWireG, dWireM);
      dWire.position.y = y;
      coreGroup.add(dWire);
    }

    // Hovering Conviction Gemstone (Emerald & Gold)
    const gemGeo = new THREE.OctahedronGeometry(0.85, 0);
    const gemMat = new THREE.MeshPhongMaterial({
      color: 0x10b981,
      emissive: 0x047857,
      emissiveIntensity: 0.85,
      shininess: 100,
      flatShading: true,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gemMesh.position.y = 1.6;
    coreGroup.add(gemMesh);

    const gemWireGeo = new THREE.OctahedronGeometry(0.92, 0);
    const gemWireMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const gemWire = new THREE.Mesh(gemWireGeo, gemWireMat);
    gemWire.position.y = 1.6;
    coreGroup.add(gemWire);

    // Glowing Orbital Ring around Gem
    const gemHaloGeo = new THREE.TorusGeometry(1.2, 0.03, 16, 64);
    const gemHaloMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.7,
    });
    const gemHalo = new THREE.Mesh(gemHaloGeo, gemHaloMat);
    gemHalo.rotation.x = Math.PI / 2.5;
    gemHalo.position.y = 1.6;
    coreGroup.add(gemHalo);

    // -------------------------------------------------------------
    // 6. AMBIENT KNOWLEDGE / VECTOR PARTICLES
    // -------------------------------------------------------------
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleCol = new Float32Array(particleCount * 3);

    const colors = [
      new THREE.Color(0x38bdf8),
      new THREE.Color(0x818cf8),
      new THREE.Color(0x34d399),
      new THREE.Color(0xfbbf24),
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
      particlePos[i * 3 + 2] = radius * Math.cos(phi);

      const col = colors[Math.floor(Math.random() * colors.length)];
      particleCol[i * 3] = col.r;
      particleCol[i * 3 + 1] = col.g;
      particleCol[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleCol, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // -------------------------------------------------------------
    // INTERACTION & MOUSE EVENTS
    // -------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x * 0.3;
      targetMouseY = y * 0.2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 500;
      height = container.clientHeight || 460;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    resizeObserver.observe(container);

    // -------------------------------------------------------------
    // ANIMATION & CAMERA INTERPOLATION LOOP
    // -------------------------------------------------------------
    const clock = new THREE.Clock();
    let animationId;

    // Target Camera Coordinates for each step
    const stepCameras = {
      1: { y: 1.5, z: 15.5, pitch: 0.15 }, // Intake: Focus lower
      2: { y: 3.2, z: 16.5, pitch: 0.08 }, // Agents: Elevated orbital view
      3: { y: 4.2, z: 15.8, pitch: -0.05 }, // Contradiction: Isometric top-down
      4: { y: 2.2, z: 14.5, pitch: 0.05 }, // Verdict Core: Close-up on consensus gem
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const curStep = activeStepRef.current;
      const curSelected = selectedAgentRef.current;

      // Smooth mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Camera Lerp based on active workflow step
      const targetCam = stepCameras[curStep] || stepCameras[1];
      camera.position.y += (targetCam.y + mouseY * 2 - camera.position.y) * 0.04;
      camera.position.z += (targetCam.z - camera.position.z) * 0.04;
      camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.04;
      camera.lookAt(0, curStep === 1 ? -0.8 : curStep === 4 ? 1.0 : 0.2, 0);

      // Root rotation
      rootGroup.rotation.y = elapsedTime * 0.04;

      // Base Floor rotation
      floorGroup.rotation.y = -elapsedTime * 0.02;

      // Intake Shards float
      shardMeshes.forEach((shard, idx) => {
        shard.position.y = 0.3 + Math.sin(elapsedTime * 3 + idx) * 0.18;
        shard.rotation.y += 0.02;
        shard.rotation.z = Math.sin(elapsedTime * 2 + idx) * 0.1;
      });

      // Update 4 Agent Nodes & Laser Mesh
      const coords = [];
      agentNodes.forEach((node, i) => {
        node.angle += node.speed;
        const x = Math.cos(node.angle) * node.radius;
        const z = Math.sin(node.angle) * node.radius;
        const y = Math.sin(node.angle * 2 + i) * 0.35 + 0.4;

        node.group.position.set(x, y, z);
        node.mesh.rotation.y += 0.015;
        node.mesh.rotation.x += 0.01;
        node.wireMesh.rotation.y -= 0.02;
        node.sonarRing.rotation.z += 0.025;

        // Pulse selected or step-active agent
        const isSelected = curSelected === node.id;
        const isStepActive =
          (curStep === 2 && true) ||
          (curStep === 3 && true) ||
          (curStep === 1 && i === 0);

        const targetScale = isSelected ? 1.35 : isStepActive ? 1.15 : 0.95;
        node.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        coords.push({ x, y, z });
      });

      // Update Laser Positions (Lines between nodes and into center)
      const positions = laserMesh.geometry.attributes.position.array;
      let posIdx = 0;

      // 4 Beams from agents to center core
      coords.forEach((coord, i) => {
        positions[posIdx++] = coord.x;
        positions[posIdx++] = coord.y;
        positions[posIdx++] = coord.z;

        positions[posIdx++] = 0;
        positions[posIdx++] = 1.6;
        positions[posIdx++] = 0;
      });

      // 6 Inter-agent contradiction check lasers
      for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
          positions[posIdx++] = coords[i].x;
          positions[posIdx++] = coords[i].y;
          positions[posIdx++] = coords[i].z;

          positions[posIdx++] = coords[j].x;
          positions[posIdx++] = coords[j].y;
          positions[posIdx++] = coords[j].z;
        }
      }

      laserMesh.geometry.attributes.position.needsUpdate = true;

      // Laser intensity modulation based on Step 3 (Cross-Contradiction)
      const laserBaseOpacity = curStep === 3 ? 0.9 : curStep === 2 ? 0.55 : 0.25;
      laserMat.opacity = laserBaseOpacity + Math.sin(elapsedTime * 4) * 0.15;
      laserMat.color.setHex(curStep === 3 ? 0xf59e0b : curStep === 4 ? 0x10b981 : 0x38bdf8);

      // Core Gemstone & Synthesis Animation
      coreGroup.rotation.y = -elapsedTime * 0.08;
      gemMesh.rotation.y += 0.025;
      gemMesh.rotation.x = Math.sin(elapsedTime * 1.5) * 0.12;
      gemWire.rotation.y -= 0.03;
      gemHalo.rotation.z += 0.02;

      const gemScale = curStep === 4 ? 1.25 + Math.sin(elapsedTime * 5) * 0.1 : 1.0;
      gemMesh.scale.set(gemScale, gemScale, gemScale);
      gemWire.scale.set(gemScale * 1.08, gemScale * 1.08, gemScale * 1.08);

      // Particles drift
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}

