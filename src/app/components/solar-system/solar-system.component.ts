import { Component, HostListener, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three-orbitcontrols-ts';


@Component({
  selector: 'app-solar-system',
  templateUrl: './solar-system.component.html',
  styleUrls: ['./solar-system.component.css']
})
export class SolarSystemComponent implements OnInit{



  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  raycaster!: THREE.Raycaster;
  mouse!: THREE.Vector2;
  controls!: OrbitControls;
  earthOrbitGroup!: THREE.Group;
  marsOrbitGroup!: THREE.Group;  // Group for Mars orbit
  jupiterOrbit: THREE.Mesh | undefined;
  mercuryOrbit: THREE.Mesh | undefined;
  objectsToIntersect: THREE.Mesh[] = [];  // List of objects to detect clicks (planets)
  mercuryOrbitAngle: number = 0;
  sunMesh!: THREE.Mesh;
  mercuryMesh!: THREE.Mesh;
  jupiterMesh!: THREE.Mesh;
  earthMesh!: THREE.Mesh;
  marsMesh!: THREE.Mesh;  // Mesh for Mars
  marsTrajectory!: THREE.Line;   // For Mars' trajectory (orbit path)
  earthTrajectory!: THREE.Line;  // For Earth's trajectory (orbit path)
  isMarsTrajectoryVisible: boolean = true;  // Track visibility state for Mars
  isEarthTrajectoryVisible: boolean = true; // Track visibility state
  jupiterOrbitVisible: boolean = true;
  jupiterOrbitAngle: number = 0;
  neptuneOrbitGroup!: THREE.Group;  // Groupe pour l'orbite de Neptune
  neptuneMesh!: THREE.Mesh;  // Maillage pour Neptune
  neptuneOrbit!: THREE.Mesh | undefined;
  neptuneOrbitAngle: number = 0; // Angle d'orbite de Neptune
  isNeptuneTrajectoryVisible: boolean = true; // État de visibilité de l'orbite de Neptune
  neptuneTrajectory!: THREE.Line; // Trajectoire de Neptune
  uranusOrbitGroup!: THREE.Group;  // Groupe pour l'orbite d'Uranus
  uranusMesh!: THREE.Mesh;  // Maillage pour Uranus
  uranusOrbit!: THREE.Mesh | undefined;
  uranusOrbitAngle: number = 0; // Angle d'orbite d'Uranus
  isUranusTrajectoryVisible: boolean = true; // État de visibilité de l'orbite d'Uranus
  uranusTrajectory!: THREE.Line; // Trajectoire d'Uranus

  light!: THREE.DirectionalLight;
  venusOrbitGroup!: THREE.Group; // Group for Venus orbit
  venusMesh!: THREE.Mesh; // Mesh for Venus
  venusTrajectory!: THREE.Line; // For Venus' trajectory
  venusOrbit!: THREE.Mesh | undefined; // Mesh for Venus orbit
  venusOrbitAngle: number = 0; // Angle de l'orbite de Vénus
  isVenusTrajectoryVisible: boolean = true; // Track visibility state for Venus
  saturnOrbitGroup!: THREE.Group;  // Groupe pour l'orbite de Saturne
saturnMesh!: THREE.Mesh;  // Maillage pour Saturne
saturnOrbit!: THREE.Mesh | undefined;
saturnOrbitAngle: number = 0; // Angle d'orbite de Saturne
isSaturnTrajectoryVisible: boolean = true; // État de visibilité de l'orbite de Saturne
saturnTrajectory!: THREE.Line; // Trajectoire de Saturne

  constructor() {}

  ngOnInit(): void {
    this.initThreeJS();
    this.addSun();
    this.addJupiter();  // Ajoute Jupiter
    this.addJupiterOrbit();
    this.addEarth();
    this.addEarthTrajectory();  // Add Earth's trajectory
    this.addMars();  // Add Mars
    this.addMarsTrajectory();   // Add Mars' trajectory
    this.addVenus(); // Ajout de Vénus
    this.addVenusTrajectory(); // Ajout de la trajectoire de Vénus
    this.addNeptune(); // Ajoutez l'appel à la méthode pour Neptune
    this.addNeptuneOrbit(); // Ajoutez l'appel à la méthode pour l'orbite de Neptune
    this.addStars();
    this.addLighting();
    this.addLighting1();
    this.animate();
    this.addMercury();
    this.addMercuryOrbit();
    this.addSaturn(); // Ajoutez l'appel à la méthode pour Saturne
    this.addSaturnOrbit(); // Ajoutez l'appel à la méthode pour l'orbite de Saturne
    
  }

  // Initialize Three.js scene
  initThreeJS() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.set(0, 75, 300);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvasContainer')?.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.target.set(0, 0, 0);

    this.raycaster = new THREE.Raycaster();  // Initialize raycaster
    this.mouse = new THREE.Vector2();        // Initialize mouse position

    // Add event listener for mouse clicks
    window.addEventListener('click', this.onMouseClick.bind(this), false);
  }

  // Add the Sun (center of the solar system)
  addSun() {
    const geometry = new THREE.SphereGeometry(50, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('../../../assets/Images/sun.jpg');
    const material = new THREE.MeshBasicMaterial({ map: sunTexture });

    this.sunMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.sunMesh);
  }

  

  // Méthode pour ajouter Neptune
addNeptune() {
  this.neptuneOrbitGroup = new THREE.Group();
  this.scene.add(this.neptuneOrbitGroup);

  const neptuneGeometry = new THREE.SphereGeometry(7, 32, 32); // Taille de Neptune
  const textureLoader = new THREE.TextureLoader();
  const neptuneTexture = textureLoader.load('../../../assets/Images/Neptune.jpg'); // Utilisez une texture pour Neptune
  const material = new THREE.MeshPhongMaterial({ map: neptuneTexture });

  this.neptuneMesh = new THREE.Mesh(neptuneGeometry, material);
  this.neptuneMesh.position.set(1400, 0, 0); // Positionnez Neptune à 1400 unités du Soleil
  this.neptuneOrbitGroup.add(this.neptuneMesh);
  this.objectsToIntersect.push(this.neptuneMesh); // Ajoutez Neptune à la liste des objets cliquables
}

// Méthode pour ajouter l'orbite de Neptune
addNeptuneOrbit() {
  const neptuneOrbitGeometry = new THREE.RingGeometry(1400 - 0.5, 1400 + 0.5, 64); // Orbite de Neptune
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x0099ff, side: THREE.DoubleSide });
  this.neptuneOrbit = new THREE.Mesh(neptuneOrbitGeometry, orbitMaterial);

  // Inclinaison de l'orbite pour la rendre visible
  this.neptuneOrbit.rotation.x = Math.PI / 2;

  this.scene.add(this.neptuneOrbit);
}
  // Méthode pour ajouter Saturne
addSaturn() {
  this.saturnOrbitGroup = new THREE.Group();
  this.scene.add(this.saturnOrbitGroup);

  const saturnGeometry = new THREE.SphereGeometry(9, 32, 32); // Taille de Saturne
  const textureLoader = new THREE.TextureLoader();
  const saturnTexture = textureLoader.load('../../../assets/Images/Saturne.jpg'); // Utilisez une texture pour Saturne
  const material = new THREE.MeshPhongMaterial({ map: saturnTexture });

  this.saturnMesh = new THREE.Mesh(saturnGeometry, material);
  this.saturnMesh.position.set(1000, 0, 0); // Positionnez Saturne à 1000 unités du Soleil
  this.saturnOrbitGroup.add(this.saturnMesh);
  this.objectsToIntersect.push(this.saturnMesh); // Ajoutez Saturne à la liste des objets cliquables
}

// Méthode pour ajouter l'orbite de Saturne
addSaturnOrbit() {
  const saturnOrbitGeometry = new THREE.RingGeometry(1000 - 0.5, 1000 + 0.5, 64); // Orbite de Saturne
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  this.saturnOrbit = new THREE.Mesh(saturnOrbitGeometry, orbitMaterial);

  // Inclinaison de l'orbite pour la rendre visible
  this.saturnOrbit.rotation.x = Math.PI / 2;

  this.scene.add(this.saturnOrbit);
}

  addVenus() {
    this.venusOrbitGroup = new THREE.Group();
    this.scene.add(this.venusOrbitGroup);

    const venusGeometry = new THREE.SphereGeometry(6, 32, 32); // Taille de Vénus
    const textureLoader = new THREE.TextureLoader();
    const venusTexture = textureLoader.load('../../../assets/Images/venus.jpg'); // Texture de Vénus
    const material = new THREE.MeshPhongMaterial({ map: venusTexture });

    this.venusMesh = new THREE.Mesh(venusGeometry, material);
    this.venusMesh.position.set(108, 0, 0); // Distance de Vénus : 108 unités du Soleil
    this.venusOrbitGroup.add(this.venusMesh);
    this.objectsToIntersect.push(this.venusMesh); // Ajouter Vénus aux objets cliquables
  }

  // Ajouter la trajectoire de Vénus
  addVenusTrajectory() {
    const orbitRadius = 108; // Rayon de l'orbite de Vénus
    const points = [];

    // Créer des points pour une orbite circulaire
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffa500 }); // Couleur orange pour la trajectoire de Vénus
    this.venusTrajectory = new THREE.Line(geometry, material);

    this.scene.add(this.venusTrajectory);
  }
  

  // Add the Earth with its orbit around the Sun
  addEarth() {
    this.earthOrbitGroup = new THREE.Group();
    this.scene.add(this.earthOrbitGroup);

    const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('../../../assets/Images/earth1.jpg');
    const material = new THREE.MeshPhongMaterial({ map: earthTexture });

    this.earthMesh = new THREE.Mesh(earthGeometry, material);
    this.earthMesh.position.set(150, 0, 0); // Place Earth 150 units away from Sun
    this.earthOrbitGroup.add(this.earthMesh);
    this.objectsToIntersect.push(this.earthMesh);
  }
  addMercury() {
    const mercuryGeometry = new THREE.SphereGeometry(2.5, 32, 32);  // Mercure est environ 0.38 fois la taille de la Terre
    const textureLoader = new THREE.TextureLoader();
    const mercuryTexture = textureLoader.load('../../../assets/Images/Mercury.jpeg');  // Texture réaliste de Mercure
    const material = new THREE.MeshPhongMaterial({ map: mercuryTexture });
  
    this.mercuryMesh = new THREE.Mesh(mercuryGeometry, material);
    this.mercuryMesh.position.set(58, 0, 0);  // Distance de Mercure : 58 unités astronomiques du Soleil
    this.scene.add(this.mercuryMesh);
  
    this.objectsToIntersect.push(this.mercuryMesh);  // Ajouter Mercure aux objets cliquables
  }
  addMars() {
    this.marsOrbitGroup = new THREE.Group();
    this.scene.add(this.marsOrbitGroup);

    const marsGeometry = new THREE.SphereGeometry(3, 32, 32);  // Mars is smaller than Earth
    const textureLoader = new THREE.TextureLoader();
    const marsTexture = textureLoader.load('../../../assets/Images/Mars.jpg');  // Use a Mars texture
    const material = new THREE.MeshPhongMaterial({ map: marsTexture });

    this.marsMesh = new THREE.Mesh(marsGeometry, material);
    this.marsMesh.position.set(228, 0, 0);  // Place Mars 228 units away from Sun (realistic distance)
    this.marsOrbitGroup.add(this.marsMesh);
    this.objectsToIntersect.push(this.marsMesh);
  }
  // Add Jupiter
addJupiter() {
  const jupiterGeometry = new THREE.SphereGeometry(11, 32, 32);  // Jupiter est environ 11 fois plus grande que la Terre
  const textureLoader = new THREE.TextureLoader();
  const jupiterTexture = textureLoader.load('../../../assets/Images/jupyter.jpg');  // Utiliser une texture réaliste de Jupiter
  const material = new THREE.MeshPhongMaterial({ map: jupiterTexture });

  this.jupiterMesh = new THREE.Mesh(jupiterGeometry, material);
  this.jupiterMesh.position.set(778, 0, 0);  // Placer Jupiter à 778 unités du Soleil
  this.scene.add(this.jupiterMesh);

  this.objectsToIntersect.push(this.jupiterMesh);  // Ajouter Jupiter à la liste des objets cliquables
}


  onMouseClick(event: MouseEvent) {
    event.preventDefault();

    // Update mouse position in normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster based on mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for intersections with planets
    const intersects = this.raycaster.intersectObjects(this.objectsToIntersect);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      this.focusOnPlanet(selectedObject);  // Center the camera on the clicked planet
    }
  }

  // Function to center the camera on the clicked planet
  focusOnPlanet(planet: THREE.Object3D) {
    // Récupère la position du centre de la planète cliquée
    const targetPosition = new THREE.Vector3();
    planet.getWorldPosition(targetPosition);
  
    // Effectue une transition douce de la caméra vers la planète
    const tween = new TWEEN.Tween(this.camera.position)
      .to(
        {
          x: targetPosition.x + 30,  // Déplace la caméra à proximité de la planète (30 unités de distance)
          y: targetPosition.y + 20,  // Légèrement au-dessus de la planète
          z: targetPosition.z + 30   // Zoomer sur la planète (réduire la distance)
        },
        1000  // Durée de l'animation (1 seconde)
      )
      .easing(TWEEN.Easing.Quadratic.InOut)  // Applique un easing pour une transition douce
      .onUpdate(() => {
        this.controls.update();  // Met à jour les contrôles pendant le mouvement
      })
      .start();
  
    // Actualise la cible des contrôles d'orbite pour viser la planète
    this.controls.target.copy(targetPosition);
  }
  addMercuryOrbit() {
    const mercuryOrbitGeometry = new THREE.RingGeometry(58 - 0.5, 58 + 0.5, 64); // Orbite de Mercure à 58 unités du Soleil
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    this.mercuryOrbit = new THREE.Mesh(mercuryOrbitGeometry, orbitMaterial);
  
    // Inclinaison de l'orbite pour la rendre visible
    this.mercuryOrbit.rotation.x = Math.PI / 2;
  
    this.scene.add(this.mercuryOrbit);
  }
  
  

  // Add the trajectory (orbital path) of the Earth
  addEarthTrajectory() {
    const orbitRadius = 150;
    const points = [];

    // Create points for a circular orbit
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    this.earthTrajectory = new THREE.Line(geometry, material);

    this.scene.add(this.earthTrajectory);
  }
  // Add Jupiter's orbit
  addJupiterOrbit() {
    const jupiterOrbitGeometry = new THREE.RingGeometry(778 - 0.5, 778 + 0.5, 64); // Rayon de 778 unités (distance de Jupiter au Soleil)
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    this.jupiterOrbit = new THREE.Mesh(jupiterOrbitGeometry, orbitMaterial);
  
    // Inclinaison de l'orbite pour l'aligner avec le plan orbital
    this.jupiterOrbit.rotation.x = Math.PI / 2;
  
    // Ajoute l'orbite à la scène
    this.scene.add(this.jupiterOrbit);
  }
  
  // Méthode pour afficher ou cacher l'orbite de Jupiter
  toggleJupiterOrbit() {
    if (this.jupiterOrbit) {
      this.jupiterOrbitVisible = !this.jupiterOrbitVisible;  // Change l'état de visibilité
      this.jupiterOrbit.visible = this.jupiterOrbitVisible;  // Applique l'état à l'orbite
    }
  }

  addMarsTrajectory() {
    const orbitRadius = 228;  // Mars' orbit radius (realistic)
    const points = [];

    // Create points for a circular orbit
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });  // Red color for Mars' trajectory
    this.marsTrajectory = new THREE.Line(geometry, material);

    this.scene.add(this.marsTrajectory);
  }

  // Toggle the visibility of the Earth's trajectory
  toggleEarthTrajectory() {
    this.isEarthTrajectoryVisible = !this.isEarthTrajectoryVisible;
    this.earthTrajectory.visible = this.isEarthTrajectoryVisible;
  }
  toggleMarsTrajectory() {
    this.isMarsTrajectoryVisible = !this.isMarsTrajectoryVisible;
    this.marsTrajectory.visible = this.isMarsTrajectoryVisible;
  }

  // Add stars in the background
  addStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  
    const starVertices = [];
    for (let i = 0; i < 10000; i++) { // Generate 10,000 stars
      const x = THREE.MathUtils.randFloatSpread(2000); // Random position
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      starVertices.push(x, y, z);
    }
  
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  
    const stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(stars);
  }

  // Add lighting (simulating sunlight)
  addLighting() {
    const sunLight = new THREE.PointLight(0xffffff, 1.5, 1000);
    this.scene.add(sunLight);
  }
  addLighting1() {
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(10, 10, 10);
    this.scene.add(this.light);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
  }

  // Animate the scene
  animate() {
    requestAnimationFrame(() => this.animate());
  
    // Rotation de la Terre et de Mars sur leurs axes
    this.earthMesh.rotation.y += 0.01;
    this.marsMesh.rotation.y += 0.008;
  
    // Rotation de Jupiter sur son axe
    this.jupiterMesh.rotation.y += 0.02;

    this.venusMesh.rotation.y += 0.015; // Rotation de Vénus sur son axe

    // Ajoutez ceci à la méthode animate pour faire orbiter Neptune
this.neptuneOrbitGroup.rotation.y += 0.0002; // Rotation de l'orbite de Neptune (plus lente que Saturne)
this.neptuneOrbitAngle += 0.0002; // Incrémenter l'angle d'orbite de Neptune
const neptuneX = 1400 * Math.cos(this.neptuneOrbitAngle); // Positionnement de Neptune sur son orbite
const neptuneZ = 1400 * Math.sin(this.neptuneOrbitAngle);
this.neptuneMesh.position.set(neptuneX, 0, neptuneZ); // Mettre à jour la position de Neptune

    // Faire orbiter Vénus autour du Soleil
    this.venusOrbitAngle += 0.001; // Lentement car Vénus a une orbite lente
    const venusX = 108 * Math.cos(this.venusOrbitAngle);
    const venusZ = 108 * Math.sin(this.venusOrbitAngle);
    this.venusMesh.position.set(venusX, 0, venusZ); // Mettre à jour la position de Vénus
    



     // Simulate the Earth's orbit around the Sun
     this.earthOrbitGroup.rotation.y += 0.001;
         // Simulate Mars' orbit around the Sun
    this.marsOrbitGroup.rotation.y += 0.0008;
    

  
    // Faire orbiter Jupiter autour du Soleil
    this.jupiterOrbitAngle += 0.001;  // Lentement car Jupiter a une orbite lente
    const jupiterX = 778 * Math.cos(this.jupiterOrbitAngle);
    const jupiterZ = 778 * Math.sin(this.jupiterOrbitAngle);
    this.jupiterMesh.position.set(jupiterX, 0, jupiterZ);
  
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  
    // Met à jour les animations de TWEEN
    TWEEN.update();
  }
  

  // Handle window resize
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Zoom In Function
  zoomIn() {
    if (this.camera.position.z > 50) {
      this.camera.position.z -= 10;
    }
  }

  // Zoom Out Function
  zoomOut() {
    if (this.camera.position.z < 500) {
      this.camera.position.z += 10;
    }
  }

}
