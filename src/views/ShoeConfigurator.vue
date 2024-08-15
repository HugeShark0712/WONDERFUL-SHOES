<script setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';

import LeftMenu from '../components/LeftMenu.vue';
import MenuPopUp from '../components/MenuPopUp.vue';

// Define the circles for the menu items
const circles = ref([
  { id: 'laces', name: 'Laces' },
  { id: 'inside', name: 'Inside' },
  { id: 'outside_1', name: 'Outside 1' },
  { id: 'sole_1', name: 'Sole 1' },
  { id: 'sole_2', name: 'Sole 2' },
  { id: 'jewelry', name: 'Jewelry' },
  { id: 'options', name: 'Options' }
]);

const activeMenu = ref(null);
const shoeModel = ref(null);
const shoeSize = ref(42);

// Define color options
const colorOptions = ref([
  '#FF0000', // Red
  '#000000', // Black
  '#3498DB', // Blue
  '#FFFFFF', // White
  '#2ECC71', // Green
  '#8E44AD', // Purple
  '#F1C40F', // Yellow
  '#E67E22', // Orange
  '#7F8C8D', // Dark Gray
  '#00008B', // Dark Blue
]);

// Define material options
const materialOptions = ref([
  {
    name: 'Stylized Scales',
    textures: {
      ao: '/textures/scales/Stylized_Scales_003_ambientOcclusion.png',
      base: '/textures/scales/Stylized_Scales_003_basecolor.png',
      normal: '/textures/scales/Stylized_Scales_003_normal.png',
      roughness: '/textures/scales/Stylized_Scales_003_roughness.png'
    }
  },
  {
    name: 'Fabric Lace',
    textures: {
      ao: '/textures/leopard/Fabric_Lace_038_ambientOcclusion.png',
      base: '/textures/leopard/Fabric_Lace_038_basecolor.png',
      normal: '/textures/leopard/Fabric_Lace_038_normal.png',
      roughness: '/textures/leopard/Fabric_Lace_038_roughness.png',
      opacity: '/textures/leopard/Fabric_Lace_038_opacity.png'
    }
  },
  {
    name: 'Tropic Lace',
    textures: {
      ao: '/textures/tropic/Fabric_Lace_036_ambientOcclusion.png',
      base: '/textures/tropic/Fabric_Lace_036_basecolor.png',
      normal: '/textures/tropic/Fabric_Lace_036_normal.png',
      roughness: '/textures/tropic/Fabric_Lace_036_roughness.png',
      opacity: '/textures/tropic/Fabric_Lace_036_opacity.png'
    }
  },
  {
    name: 'Military',
    textures: {
      ao: '/textures/military/Fabric_Mesh_Military_001_ambientOcclusion.jpg',
      base: '/textures/military/Fabric_Mesh_Military_001_basecolor.jpg',
      normal: '/textures/military/Fabric_Mesh_Military_001_normal.jpg',
      opacity: '/textures/military/Fabric_Mesh_Military_001_opacity.jpg',
      roughness: '/textures/military/Fabric_Mesh_Military_001_roughness.jpg'
    }
  },
  {
    name: 'Hexagon Fabric',
    textures: {
      ao: '/textures/hexagon/Fabric_026_ambientOcclusion.jpg',
      base: '/textures/hexagon/Fabric_026_basecolor.jpg',
      normal: '/textures/hexagon/Fabric_026_normal.jpg',
      roughness: '/textures/hexagon/Fabric_026_roughness.jpg'
    }
  }
]);

const toggleMenu = (circleId) => {
  activeMenu.value = activeMenu.value === circleId ? null : circleId;
};

const closeMenu = () => {
  activeMenu.value = null;
};

// Function to select color for a part
const selectColor = (part, color) => {
  console.log(`Selected color for ${part}:`, color);
  if (shoeModel.value) {
    shoeModel.value.traverse((child) => {
      if (child.isMesh && child.name === part) {
        child.material.color.set(color);
      }
    });
  }
  closeMenu();
};

// Function to select material for a part
const selectMaterial = (part, materialTextures) => {
  if (!materialTextures) {
    console.error(`Material textures for ${part} are undefined`);
    return;
  }

  console.log(`Selected material for ${part}:`, materialTextures);
  if (shoeModel.value) {
    const textureLoader = new THREE.TextureLoader();

    // Load textures conditionally based on the material options
    const textures = {};
    if (materialTextures.ao) textures.aoMap = textureLoader.load(materialTextures.ao);
    if (materialTextures.base) textures.map = textureLoader.load(materialTextures.base);
    if (materialTextures.normal) textures.normalMap = textureLoader.load(materialTextures.normal);
    if (materialTextures.roughness) textures.roughnessMap = textureLoader.load(materialTextures.roughness);
    if (materialTextures.opacity) textures.opacityMap = textureLoader.load(materialTextures.opacity);
    if (materialTextures.height) textures.displacementMap = textureLoader.load(materialTextures.height);

    shoeModel.value.traverse((child) => {
      if (child.isMesh && child.name === part) {
        Object.assign(child.material, textures);
        child.material.needsUpdate = true;
      }
    });
  }
  closeMenu();
};

// Function to select jewelry
const selectJewelry = (jewelryOption) => {
  console.log(`Selected jewelry:`, jewelryOption);
  // Implement the logic to apply jewelry option to the model
  closeMenu();
};

// Function to save configuration
const saveConfiguration = async () => {
  try {
    // Extract current configuration from the model
    const configuration = { colorOptions: {}, materialOptions: {}, shoeSize: shoeSize.value };

    // Extract colors and materials from the shoe model
    shoeModel.value.traverse((child) => {
      if (child.isMesh) {
        const color = child.material.color.getHexString();
        configuration.colorOptions[child.name] = `#${color}`;
        // Assuming material is a simple material with basic properties
        configuration.materialOptions[child.name] = {
          ao: child.material.aoMap ? child.material.aoMap.image.src : '',
          base: child.material.map ? child.material.map.image.src : '',
          normal: child.material.normalMap ? child.material.normalMap.image.src : '',
          roughness: child.material.roughnessMap ? child.material.roughnessMap.image.src : '',
          opacity: child.material.opacityMap ? child.material.opacityMap.image.src : ''
        };
      }
    });

    const response = await axios.post('/api/saveConfiguration', configuration);
    console.log('Configuration saved successfully:', response.data);
    alert('Configuration saved successfully!');
  } catch (error) {
    console.error('Error saving configuration:', error);
    alert('Failed to save configuration.');
  }
};

// Initialize Three.js scene
const initializeThreeJs = () => {
  const scene = new THREE.Scene();

  // Load skybox textures
  const loader = new THREE.CubeTextureLoader();
  const skyboxTexture = loader.load([
    '/cubemap/px.png', // Positive X
    '/cubemap/nx.png', // Negative X
    '/cubemap/py.png', // Positive Y
    '/cubemap/ny.png', // Negative Y
    '/cubemap/pz.png', // Positive Z
    '/cubemap/nz.png'  // Negative Z
  ]);
  scene.background = skyboxTexture;

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('threejs-container').appendChild(renderer.domElement);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight1.position.set(1, 1, 1).normalize();
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight2.position.set(-1, -1, -1).normalize();
  scene.add(directionalLight2);

  // Load GLB model
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/models/shoe-optimized-arne.glb', (gltf) => {
    const model = gltf.scene;
    console.log('Model loaded:', model);
    model.position.set(0, 1, 0);
    model.scale.set(1, 1, 1);

    scene.add(model);

    shoeModel.value = model;

    // Traverse model to log child names
    model.traverse((child) => {
      if (child.isMesh) {
        console.log('Child name:', child.name);
      }
    });
  }, undefined, (error) => {
    console.error('An error occurred while loading the model:', error);
  });

  // Create a rounded square platform with reflective material
  const platformGeometry = new THREE.ExtrudeGeometry(createRoundedSquare(1.5, 0.2), { depth: 0.2, bevelEnabled: false });
  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888, // Adjust color if needed
    metalness: 1.0,  // High metalness for reflectivity
    roughness: 0.1,  // Low roughness for a smooth, mirror-like finish
    envMap: skyboxTexture, // Use skybox texture as environment map
    envMapIntensity: 1.0  // Adjust intensity if needed
  });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.rotation.x = -Math.PI / 2;
  platform.position.y = -1;
  scene.add(platform);

  // Function to create a rounded square shape
  function createRoundedSquare(size, radius) {
    const shape = new THREE.Shape();
    shape.moveTo(-size + radius, -size);
    shape.lineTo(size - radius, -size);
    shape.quadraticCurveTo(size, -size, size, -size + radius);
    shape.lineTo(size, size - radius);
    shape.quadraticCurveTo(size, size, size - radius, size);
    shape.lineTo(-size + radius, size);
    shape.quadraticCurveTo(-size, size, -size, size - radius);
    shape.lineTo(-size, -size + radius);
    shape.quadraticCurveTo(-size, -size, -size + radius, -size);
    return shape;
  }

  // Add OrbitControls for camera
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.screenSpacePanning = false;

  // Disable zooming by setting minDistance and maxDistance to the same value
  const fixedDistance = 5; // Set this to the desired zoom distance
  controls.minDistance = fixedDistance;
  controls.maxDistance = fixedDistance;

  // Restrict vertical camera movement
  controls.maxPolarAngle = Math.PI / 2; // Limit camera's vertical movement to 90 degrees (looking only up and down)
  controls.minPolarAngle = 0; // Ensure camera cannot go below the horizontal plane

  camera.position.z = fixedDistance;

  const animate = function () {
    requestAnimationFrame(animate);

    // Slowly rotate the shoe model
    if (shoeModel.value) {
      shoeModel.value.rotation.y += 0.001; // Adjust this value for rotation speed
    }

    controls.update();

    renderer.render(scene, camera);
  };

  animate();
};

onMounted(() => {
  initializeThreeJs();
});
</script>

<template>
  <div id="app-container">
    <div id="threejs-container"></div>
    <LeftMenu :circles="circles" :activeMenu="activeMenu" @toggleMenu="toggleMenu" />
    <MenuPopUp v-if="activeMenu !== null" :activeMenu="activeMenu" @closeMenu="closeMenu" @selectColor="selectColor"
      @selectMaterial="selectMaterial" @selectJewelry="selectJewelry" :colorOptions="colorOptions"
      :materialOptions="materialOptions" />
    <button @click="saveConfiguration" style="position: fixed; bottom: 20px; right: 20px;">Save Configuration</button>
  </div>
</template>

<style scoped>
#app-container {
  display: flex;
  flex-direction: column;
}

#threejs-container {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
</style>
