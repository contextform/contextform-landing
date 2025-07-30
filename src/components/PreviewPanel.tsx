import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface PreviewPanelProps {
  currentGeometry?: string; // STL data or geometry URL
  proposedGeometry?: string; // AI-generated geometry changes
  pendingModification?: {
    featureId: string;
    parameterId: string;
    oldValue: string;
    newValue: string;
    intent: string;
  } | null;
  onApplyChanges?: () => void;
  onRejectChanges?: () => void;
  onRequestGeometry?: () => void;
}

const PreviewPanel = ({ 
  currentGeometry, 
  proposedGeometry,
  pendingModification,
  onApplyChanges, 
  onRejectChanges,
  onRequestGeometry
}: PreviewPanelProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const currentMeshRef = useRef<THREE.Mesh>();
  const proposedMeshRef = useRef<THREE.Mesh>();
  const [viewMode, setViewMode] = useState<'current' | 'proposed' | 'comparison'>('current');
  const [isLoading, setIsLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (mountRef.current && rendererRef.current && cameraRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        setDimensions({ width, height });
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    // Create ResizeObserver to watch for panel size changes
    const resizeObserver = new ResizeObserver(handleResize);
    if (mountRef.current) {
      resizeObserver.observe(mountRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Request real geometry when component loads
  useEffect(() => {
    if (onRequestGeometry) {
      onRequestGeometry();
    }
  }, [onRequestGeometry]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    setDimensions({ width, height });

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    // Camera - positioned for Z-up coordinate system like Onshape
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(5, -5, 5); // X right, Y back, Z up
    camera.up.set(0, 0, 1); // Set Z as up direction
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);
    
    // Add grid helper - rotate to XY plane (Z-up)
    const gridHelper = new THREE.GridHelper(5, 10, 0xcccccc, 0xeeeeee);
    gridHelper.rotateX(Math.PI / 2); // Rotate to XY plane
    scene.add(gridHelper);
    
    // Add axes helper with labels for Onshape coordinate system
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);
    
    // Add coordinate labels (X=red, Y=green, Z=blue)
    // Note: In Onshape, Z is up (blue axis points up)

    // Controls (basic orbit)
    const controls = {
      mouseX: 0,
      mouseY: 0,
      isMouseDown: false
    };

    const handleMouseDown = (event: MouseEvent) => {
      controls.isMouseDown = true;
      controls.mouseX = event.clientX;
      controls.mouseY = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!controls.isMouseDown) return;
      
      const deltaX = event.clientX - controls.mouseX;
      const deltaY = event.clientY - controls.mouseY;
      
      // Simple orbit rotation
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      camera.position.setFromSpherical(spherical);
      camera.up.set(0, 0, 1); // Maintain Z-up during rotation
      camera.lookAt(0, 0, 0);
      
      controls.mouseX = event.clientX;
      controls.mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      controls.isMouseDown = false;
    };

    const handleWheel = (event: WheelEvent) => {
      const scale = event.deltaY > 0 ? 1.1 : 0.9;
      camera.position.multiplyScalar(scale);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    mountRef.current.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Load current geometry
  useEffect(() => {
    if (!sceneRef.current) return;
    
    setIsLoading(true);
    
    let geometry: THREE.BufferGeometry;
    let material: THREE.MeshLambertMaterial;
    
    if (currentGeometry && currentGeometry.faces && currentGeometry.faces.length > 0) {
      console.log('🔄 Converting Onshape tessellation to Three.js geometry');
      
      // Convert Onshape tessellated faces to Three.js geometry
      const vertices: number[] = [];
      const normals: number[] = [];
      
      currentGeometry.faces.forEach((face: any) => {
        if (face.facets) {
          face.facets.forEach((facet: any) => {
            // Each facet should have vertices and normals
            if (facet.vertices && facet.normals) {
              // Add vertices (convert from Onshape coordinate system)
              for (let i = 0; i < facet.vertices.length; i += 3) {
                vertices.push(
                  facet.vertices[i],     // X
                  facet.vertices[i + 1], // Y  
                  facet.vertices[i + 2]  // Z
                );
              }
              
              // Add normals
              for (let i = 0; i < facet.normals.length; i += 3) {
                normals.push(
                  facet.normals[i],     // X
                  facet.normals[i + 1], // Y
                  facet.normals[i + 2]  // Z
                );
              }
            }
          });
        }
      });
      
      if (vertices.length > 0) {
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.computeBoundingBox();
        
        material = new THREE.MeshLambertMaterial({ 
          color: 0x4f46e5,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide
        });
        
        console.log('✅ Converted', vertices.length / 3, 'vertices from Onshape');
      } else {
        // Fallback to placeholder
        geometry = new THREE.BoxGeometry(1.5, 0.8, 0.4);
        material = new THREE.MeshLambertMaterial({ 
          color: 0xff6b6b,
          transparent: true,
          opacity: 0.9 
        });
        console.log('⚠️ No vertices found, using placeholder');
      }
    } else {
      // Placeholder geometry when no data
      geometry = new THREE.BoxGeometry(1.5, 0.8, 0.4);
      material = new THREE.MeshLambertMaterial({ 
        color: 0x6c757d,
        transparent: true,
        opacity: 0.9 
      });
      console.log('📦 Using placeholder geometry - no Onshape data');
    }
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Remove old mesh
    if (currentMeshRef.current) {
      sceneRef.current.remove(currentMeshRef.current);
    }
    
    currentMeshRef.current = mesh;
    sceneRef.current.add(mesh);
    setIsLoading(false);
  }, [currentGeometry]);

  // Load proposed geometry
  useEffect(() => {
    if (!proposedGeometry || !sceneRef.current) return;
    
    // Create modified geometry (example: slightly larger)
    // Showing change in Z dimension (height in Onshape)
    const geometry = new THREE.BoxGeometry(1.5, 0.8, 0.6); // Z increased from 0.4 to 0.6
    const material = new THREE.MeshLambertMaterial({ 
      color: 0x10b981,
      transparent: true,
      opacity: 0.9,
      wireframe: viewMode === 'comparison'
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Remove old proposed mesh
    if (proposedMeshRef.current) {
      sceneRef.current.remove(proposedMeshRef.current);
    }
    
    proposedMeshRef.current = mesh;
    
    if (viewMode === 'proposed' || viewMode === 'comparison') {
      sceneRef.current.add(mesh);
    }
  }, [proposedGeometry, viewMode]);

  // Update visibility based on view mode
  useEffect(() => {
    if (!currentMeshRef.current || !proposedMeshRef.current || !sceneRef.current) return;

    // Remove both meshes first
    sceneRef.current.remove(currentMeshRef.current);
    sceneRef.current.remove(proposedMeshRef.current);

    switch (viewMode) {
      case 'current':
        sceneRef.current.add(currentMeshRef.current);
        break;
      case 'proposed':
        sceneRef.current.add(proposedMeshRef.current);
        break;
      case 'comparison':
        // Show both - current as wireframe, proposed as solid
        const currentMaterial = currentMeshRef.current.material as THREE.MeshLambertMaterial;
        currentMaterial.wireframe = true;
        currentMaterial.opacity = 0.3;
        
        const proposedMaterial = proposedMeshRef.current.material as THREE.MeshLambertMaterial;
        proposedMaterial.wireframe = false;
        proposedMaterial.opacity = 0.8;
        
        sceneRef.current.add(currentMeshRef.current);
        sceneRef.current.add(proposedMeshRef.current);
        break;
    }
  }, [viewMode]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-lg">🔮</span>
          3D Preview
        </h3>
      </div>

      {/* View Mode Selector */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setViewMode('current')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              viewMode === 'current' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setViewMode('proposed')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              viewMode === 'proposed' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            disabled={!proposedGeometry}
          >
            Proposed
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              viewMode === 'comparison' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            disabled={!proposedGeometry}
          >
            Compare
          </button>
          
          {/* Debug: Manual refresh button */}
          <button
            onClick={() => {
              console.log('🔄 Manual geometry refresh requested');
              if (onRequestGeometry) {
                onRequestGeometry();
              }
            }}
            className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors ml-auto"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          ref={mountRef} 
          className="absolute inset-0"
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Loading geometry...</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {(proposedGeometry || pendingModification) && (
        <div className="p-4 border-t border-gray-200 bg-white">
          {pendingModification && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-xs font-medium text-blue-900 mb-1">Pending Change:</div>
              <div className="text-sm text-blue-800">
                {pendingModification.parameterId}: {pendingModification.oldValue} → {pendingModification.newValue}
              </div>
              {pendingModification.intent && (
                <div className="text-xs text-blue-600 mt-1">Reason: {pendingModification.intent}</div>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={onApplyChanges}
              className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              {pendingModification?.applied ? '✓ Keep Changes' : '✓ Apply Changes'}
            </button>
            <button
              onClick={onRejectChanges}
              className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              {pendingModification?.applied ? '↶ Revert Changes' : '✗ Cancel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;