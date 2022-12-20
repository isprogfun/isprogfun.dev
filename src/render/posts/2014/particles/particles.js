(function() {
    var stats = new Stats(),
        scene,
        camera,
        renderer,
        render,
        WIDTH,
        HEIGHT,
        particles,
        particleSystem,
        particleCount = 1800;

    // Set stats
    // stats.setMode(0);
    // document.body.appendChild(stats.domElement);

    /**
     * Init Three.js scene
     */
    var init = function() {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        scene = new THREE.Scene();

        // Renderer
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(WIDTH, HEIGHT);
        renderer.domElement.className = 'canvasModel';
        document.body.appendChild(renderer.domElement);

        // Camera
        camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
        camera.position.set(1, 0, 250);
        scene.add(camera);

        // Light
        renderer.setClearColor(0x000000, 1);

        // Create the particles variables
        particles = new THREE.Geometry();

        var pMaterial = new THREE.ParticleBasicMaterial({
            color: 0xFFFFFF,
            size: 20,
            map: THREE.ImageUtils.loadTexture('particle.png'),
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        // Create particleSystem
        for (var p = 0; p < particleCount; p++) {
            // Create a particle with random position values from -250 to 250
            var pX = Math.random() * 500 -250,
                pY = Math.random() * 500 -250,
                pZ = Math.random() * 500 -250,
                particle = new THREE.Vector3(pX, pY, pZ);

            particle.velocity = new THREE.Vector3(0, -Math.random(), 0);

            // Add it to the geometry
            particles.vertices.push(particle);
        }

        // Create the particle system
        particleSystem = new THREE.ParticleSystem(particles, pMaterial);
        particleSystem.sortParticles = true;
        scene.add(particleSystem);
    };

    /**
     * Render scene
     */
    render = function() {
        var pCount = particleCount;

        particleSystem.rotation.y += 0.01;

        while (pCount--) {
            // get the particle
            var particle = particles.vertices[pCount];

            // check if we need to reset
            if (particle.y < -200) {
                particle.y = 200;
                particle.velocity.y = 0;
            }

            // update the velocity with a splat of randomniz
            particle.velocity.y -= Math.random() * .1;

            // and the position
            particle.add(particle.velocity);
        }
        // flag to the particle system that we've changed its vertices
        particleSystem.geometry.__dirtyVertices = true;

        renderer.render(scene, camera);

        requestAnimationFrame(render);
        stats.update();
    };

    window.addEventListener('resize', function() {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    init();
    render();
})();
