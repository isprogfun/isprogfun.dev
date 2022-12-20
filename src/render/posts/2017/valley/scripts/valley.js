(function () {
    /**
     * requestAnimationFrame
     * (IE 10+, Firefox 23+, Chrome 29+, Safari 6.0 (webkit), 7.0, Opera 17+, iOS 6.0+ (webkit), 7.0)
     * WebGL (IE 11+, Firefox 23+, Chrome 29+, Safari 5.1+, Opera 17+)
     */
    var scene;
    var camera;
    var renderer;
    var WIDTH;
    var HEIGHT;
    var loader;
    var mesh;
    var light;
    var ambientLight;

    var init = function () {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        scene = new THREE.Scene();

        // Renderer
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(WIDTH, HEIGHT);
        renderer.domElement.className = 'canvasModel';
        document.body.appendChild(renderer.domElement);

        // Camera
        camera = new THREE.OrthographicCamera(WIDTH / -90, WIDTH / 90, HEIGHT / 90, HEIGHT / -90, 0.1, 1000);
        camera.position.set(0, 0, 10);
        scene.add(camera);

        // Axis
        // var axisHelper = new THREE.AxisHelper(7);
        // scene.add(axisHelper);

        // Light
        renderer.setClearColor(0xfefefe, 1);
        light = new THREE.PointLight(0xeeeeee);
        light.position.set(-10, 2, 10);
        ambientLight = new THREE.AmbientLight(0x9FC8CA);
        scene.add(ambientLight);
        scene.add(light);

        // Load geometry
        loader = new THREE.JSONLoader();
        loader.load('/posts/valley/scripts/triangle.json', function (geometry) {
            var colors = [0x52cb0b, 0x204fcb, 0x841acb, 0xcb3525, 0x3ecbbf, 0xcb7b2b];

            mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                color: colors[Math.round(Math.random() * (colors.length - 1))],
                shading: THREE.FlatShading
            }));
            mesh.rotation.y = -2.355;
            mesh.rotation.x = -0.705;
            scene.add(mesh);
        });

        // Orbit control
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
    };

    var render = function () {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        controls.update();
    };

    var onResize = function () {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.left = WIDTH / -90;
        camera.right = WIDTH / 90;
        camera.top = HEIGHT / 90;
        camera.bottom = HEIGHT / -90;
        camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', onResize);

    init();
    render();
})();
