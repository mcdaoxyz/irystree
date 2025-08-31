import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import './ThreeBackground.css';

interface ThreeBackgroundProps {
  className?: string;
}

const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  // Memoized shader materials for better performance
  const shaderMaterial = useMemo(() => {
    try {
      console.log('Creating main shader material...');
      return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
        mouse: { value: new THREE.Vector2() }
      },
      vertexShader: `
        precision mediump float;
        
        uniform float time;
        uniform vec2 mouse;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          pos.x += sin(time * 0.5 + position.y * 0.1) * 0.1;
          pos.y += cos(time * 0.3 + position.x * 0.1) * 0.1;
          pos.z += sin(time * 0.7 + position.x * 0.1 + position.y * 0.1) * 0.05;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 st = vUv;
          vec3 color = vec3(0.0);
          
          // Create dynamic gradient based on position and time
          color.r = sin(vPosition.x * 0.5 + time * 0.5) * 0.5 + 0.5;
          color.g = sin(vPosition.y * 0.5 + time * 0.3) * 0.5 + 0.5;
          color.b = sin(vPosition.z * 0.5 + time * 0.7) * 0.5 + 0.5;
          
          // Add mouse interaction
          float dist = distance(st, mouse);
          color *= 1.0 - smoothstep(0.0, 0.5, dist);
          
          gl_FragColor = vec4(color, 0.3);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    } catch (error) {
      console.error('Error creating shader material:', error);
      // Fallback to a basic material
      return new THREE.MeshBasicMaterial({ 
        color: 0x4444ff, 
        transparent: true, 
        opacity: 0.3 
      });
    }
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS gradient');
      return;
    }
    
    // Check WebGL version and capabilities
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      console.log('WebGL Renderer:', gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      console.log('WebGL Vendor:', gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
    }
    console.log('WebGL Version:', gl.getParameter(gl.VERSION));
    console.log('GLSL Version:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

    // Helper function to validate shaders
    const validateShader = (gl: WebGLRenderingContext, shader: WebGLShader, type: string) => {
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        console.error(`${type} shader compilation error:`, error);
        return false;
      }
      return true;
    };

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 100);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup with enhanced settings
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: window.innerWidth > 768, // Disable antialiasing on mobile for performance
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = false; // Disable shadows for better performance
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Mouse interaction setup
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update shader uniform
      if ('uniforms' in shaderMaterial && shaderMaterial.uniforms.mouse) {
        shaderMaterial.uniforms.mouse.value.set(
          event.clientX / window.innerWidth,
          1 - event.clientY / window.innerHeight
        );
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Create particle system
    const createParticleSystem = () => {
      const particleCount = window.innerWidth < 768 ? 1000 : window.innerWidth < 1024 ? 2000 : 3000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Positions
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
        
        // Colors
        const hue = Math.random();
        const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // Sizes
        sizes[i] = Math.random() * 2 + 1;
      }
      
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      let particleMaterial;
      try {
        console.log('Creating particle shader material...');
        particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
        },
        vertexShader: `
          precision mediump float;
          
          uniform float time;
          uniform float pixelRatio;
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            
            vec3 pos = position;
            pos.x += sin(time * 0.5 + position.y * 0.01) * 2.0;
            pos.y += cos(time * 0.3 + position.z * 0.01) * 2.0;
            pos.z += sin(time * 0.7 + position.x * 0.01) * 1.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          precision mediump float;
          
          varying vec3 vColor;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            
            gl_FragColor = vec4(vColor, alpha * 0.6);
          }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      } catch (error) {
        console.error('Error creating particle material:', error);
        // Fallback to a basic points material
        particleMaterial = new THREE.PointsMaterial({
          size: 2,
          vertexColors: true,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
      }
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      particleSystemRef.current = particles;
      
      return { particleGeometry, particleMaterial };
    };
    
    const { particleGeometry, particleMaterial } = createParticleSystem();

    // Create enhanced geometric shapes with better complexity management
    const createGeometries = () => {
      const isMobile = window.innerWidth < 768;
      const segments = isMobile ? 16 : 32;
      
      return [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.7, segments, segments),
        new THREE.ConeGeometry(0.7, 1.5, segments),
        new THREE.TorusGeometry(0.7, 0.3, 8, segments),
        new THREE.OctahedronGeometry(0.8),
        new THREE.IcosahedronGeometry(0.8, 0),
        new THREE.TetrahedronGeometry(0.9),
      ];
    };
    
    const geometries = createGeometries();

    // Enhanced materials with shader-based effects
    const createEnhancedMaterials = () => {
      const colors = [
        { r: 0.39, g: 0.40, b: 0.95 }, // Indigo
        { r: 0.55, g: 0.36, b: 0.96 }, // Purple
        { r: 0.02, g: 0.71, b: 0.83 }, // Cyan
        { r: 0.06, g: 0.73, b: 0.51 }, // Emerald
        { r: 0.96, g: 0.62, b: 0.04 }, // Amber
        { r: 0.99, g: 0.32, b: 0.32 }, // Red
        { r: 0.34, g: 0.70, b: 0.98 }, // Blue
      ];
      
      return colors.map((color, index) => {
        try {
          console.log(`Creating enhanced material ${index}...`);
          return new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Vector3(color.r, color.g, color.b) },
            opacity: { value: 0.3 + index * 0.1 },
            mouse: { value: new THREE.Vector2() }
          },
          vertexShader: `
            precision mediump float;
            
            uniform float time;
            uniform vec2 mouse;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
              vUv = uv;
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              
              vec3 pos = position;
              
              // Add wave distortion
              float wave = sin(time * 2.0 + position.x * 5.0) * 0.02;
              pos += normal * wave;
              
              // Mouse interaction effect
              float mouseInfluence = 1.0 - distance(mouse, vec2(0.5)) * 2.0;
              pos += normal * mouseInfluence * 0.1;
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            precision mediump float;
            
            uniform float time;
            uniform vec3 color;
            uniform float opacity;
            uniform vec2 mouse;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
              // Create dynamic color based on normal and time
              vec3 finalColor = color;
              
              // Add fresnel effect
              float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              finalColor += fresnel * 0.3;
              
              // Add time-based color variation
              finalColor.r += sin(time * 0.5 + vPosition.x) * 0.1;
              finalColor.g += sin(time * 0.7 + vPosition.y) * 0.1;
              finalColor.b += sin(time * 0.3 + vPosition.z) * 0.1;
              
              // Mouse interaction glow
              float mouseDistance = distance(vUv, mouse);
              float glow = 1.0 - smoothstep(0.0, 0.5, mouseDistance);
              finalColor += glow * 0.2;
              
              gl_FragColor = vec4(finalColor, opacity);
            }
          `,
          transparent: true,
          wireframe: true,
          side: THREE.DoubleSide
        });
        } catch (error) {
          console.error('Error creating enhanced material:', error);
          // Fallback to a basic material
          return new THREE.MeshBasicMaterial({
            color: new THREE.Color(color.r, color.g, color.b),
            transparent: true,
            opacity: 0.3 + index * 0.1,
            wireframe: true,
            side: THREE.DoubleSide
          });
        }
      });
    };
    
    const materials = createEnhancedMaterials();

    // Create meshes and add to scene
    const meshes: THREE.Mesh[] = [];
    // Reduce mesh count on mobile devices for better performance
    const meshCount = window.innerWidth < 768 ? 8 : window.innerWidth < 1024 ? 12 : 15;
    for (let i = 0; i < meshCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geometry, material);
      
      // Random positioning
      mesh.position.x = (Math.random() - 0.5) * 20;
      mesh.position.y = (Math.random() - 0.5) * 20;
      mesh.position.z = (Math.random() - 0.5) * 20;
      
      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;
      
      // Random scale
      const scale = Math.random() * 0.5 + 0.5;
      mesh.scale.setScalar(scale);
      
      scene.add(mesh);
      meshes.push(mesh);
    }

    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Enhanced animation loop with performance monitoring
    let lastTime = 0;
    const targetFPS = window.innerWidth < 768 ? 30 : 60;
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime: number) => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Frame rate limiting for mobile devices
      if (currentTime - lastTime < frameInterval) {
        return;
      }
      lastTime = currentTime;
      
      const time = currentTime * 0.001;
      
      // Update shader uniforms
      materials.forEach((material) => {
        if ('uniforms' in material && material.uniforms) {
          material.uniforms.time.value = time;
          material.uniforms.mouse.value.set(
            (mouseRef.current.x + 1) * 0.5,
            (mouseRef.current.y + 1) * 0.5
          );
        }
      });
      
      // Update particle system
      if ('uniforms' in particleMaterial && particleMaterial.uniforms) {
        particleMaterial.uniforms.time.value = time;
      }
      
      // Update main shader material
      if ('uniforms' in shaderMaterial && shaderMaterial.uniforms) {
        shaderMaterial.uniforms.time.value = time;
        shaderMaterial.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
      }
      
      // Animate meshes with more sophisticated movement
      meshes.forEach((mesh, index) => {
        const speed = 0.5 + index * 0.1;
        const offset = index * 0.5;
        
        // Complex rotation patterns
        mesh.rotation.x += (0.003 + index * 0.0005) * speed;
        mesh.rotation.y += (0.004 + index * 0.0007) * speed;
        mesh.rotation.z += (0.002 + index * 0.0003) * speed;
        
        // Advanced floating animation with multiple sine waves
        const floatY = Math.sin(time * 0.5 + offset) * 0.5 + 
                      Math.sin(time * 1.2 + offset * 2) * 0.2;
        const floatX = Math.cos(time * 0.3 + offset) * 0.3;
        const floatZ = Math.sin(time * 0.7 + offset * 1.5) * 0.4;
        
        mesh.position.x += floatX * 0.01;
        mesh.position.y += floatY * 0.01;
        mesh.position.z += floatZ * 0.01;
        
        // Scale pulsing effect
        const scale = 1 + Math.sin(time * 2 + offset) * 0.1;
        mesh.scale.setScalar(scale * (0.5 + index * 0.1));
      });
      
      // Enhanced camera movement with mouse influence
      const mouseInfluence = 0.5;
      camera.position.x = Math.sin(time * 0.2) * 3 + mouseRef.current.x * mouseInfluence;
      camera.position.y = Math.cos(time * 0.15) * 2 + mouseRef.current.y * mouseInfluence;
      camera.position.z = 5 + Math.sin(time * 0.1) * 1;
      
      // Dynamic camera target
      const targetX = Math.sin(time * 0.1) * 2;
      const targetY = Math.cos(time * 0.08) * 1;
      camera.lookAt(targetX, targetY, 0);
      
      // Animate particle system rotation
      if (particleSystemRef.current) {
        particleSystemRef.current.rotation.y += 0.001;
        particleSystemRef.current.rotation.x += 0.0005;
      }
      
      renderer.render(scene, camera);
    };

    animate(0);

    // Enhanced resize handler with performance optimization
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      // Update shader uniforms for resolution
      if ('uniforms' in shaderMaterial && shaderMaterial.uniforms.resolution) {
        shaderMaterial.uniforms.resolution.value.set(width, height);
      }
      
      // Update particle system pixel ratio
      if ('uniforms' in particleMaterial && particleMaterial.uniforms.pixelRatio) {
        particleMaterial.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);
      }
      
      // Adjust antialiasing based on screen size
      if (width <= 768 && renderer.getContext().getParameter(renderer.getContext().SAMPLES) > 0) {
        // Disable antialiasing on mobile after resize if it was enabled
        console.log('Mobile device detected, consider disabling antialiasing for better performance');
      }
    };

    window.addEventListener('resize', handleResize);

    // Enhanced cleanup function
    return () => {
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      // Cancel animation frame
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      // Remove DOM element
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of particle system
      if (particleSystemRef.current) {
        scene.remove(particleSystemRef.current);
        if (particleGeometry) particleGeometry.dispose();
        if (particleMaterial) particleMaterial.dispose();
      }
      
      // Dispose of geometries and materials
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => {
        if (material.dispose) material.dispose();
      });
      
      // Dispose of meshes
      meshes.forEach(mesh => {
        scene.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      
      // Dispose of shader material
      if (shaderMaterial) {
        shaderMaterial.dispose();
      }
      
      // Dispose of lights
      scene.children.forEach(child => {
        if (child instanceof THREE.Light) {
          scene.remove(child);
        }
      });
      
      // Final renderer disposal
      renderer?.dispose();
      
      // Clear references
      sceneRef.current = null;
      rendererRef.current = null;
      particleSystemRef.current = null;
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`three-background ${className}`}
    />
  );
};

export default ThreeBackground;