(function() {
    var scene,
        earth,
        moon,
        camera,
        renderer,
        controls,
        WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
        
    var a = 0, // in radian
        r = 40, // radius, in pixels for example
        da = Math.PI / 360; // in radian. Compute this (once!) using r if you like to use an absolute speed and not a radial one

    var init = function() {
        scene = new THREE.Scene();

        // Renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.getElementById('earth__canvas')
        });
        renderer.shadowMapEnabled = true;
        renderer.setSize(WIDTH, HEIGHT);

        // Light
        var light = new THREE.DirectionalLight({
            hex: '0xffffff',
            castShadow: true
        });

        light.position.set(5, 5, 5);
        scene.add(light);

        // Camera
        camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
        camera.position.set(0, 0, 60);
        scene.add(camera);

        // Earth mesh
        var earthGeometry = new THREE.SphereGeometry(1, 32, 32);
            earthMaterial = new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('/images/EarthMap_2500x1250.jpg'),
                bumpMap: THREE.ImageUtils.loadTexture('/images/EarthElevation_2500x1250.jpg'),
                bumpScale: 0.05,
                specularMap: THREE.ImageUtils.loadTexture('/images/EarthMask_2500x1250.jpg'),
                specular: new THREE.Color(0x333333)
            });
        
        earth = new THREE.Mesh(earthGeometry, earthMaterial);
        earth.rotation.y = - Math.PI / 180 * 140; // 140 градусов

        // Moon mesh
        var moonGeometry = new THREE.SphereGeometry(0.273, 32, 32),
            moonMaterial = new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('/images/MoonMap2_2500x1250.jpg')
            });

        moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.x = -40;

        // Stars
        var starsGeometry = new THREE.SphereGeometry(100, 32, 32),
            starsMaterial = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture('/images/galaxy_starfield.png'),
                side: THREE.BackSide
            });

        var stars = new THREE.Mesh(starsGeometry, starsMaterial);

        // Orbit control
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        scene.add(earth);
        scene.add(moon);
        scene.add(stars);
    };

    function render() {
        requestAnimationFrame(render);
        earth.rotation.y += Math.PI / 1500;
        a += da; // WTF???
        moon.position.x = r * Math.sin(a);
        moon.position.z = r * Math.cos(a);
        controls.update();
        renderer.render(scene, camera);
    }

    function onResize() {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', onResize);

    init();
    render();
})();