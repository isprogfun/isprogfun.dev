(function() {
    /**
     * FileAPI (File, FileReader) (IE 10+, Firefox 23+, Chrome 29+, Safari 6.0, Opera 17+, iOS 6.0+)
     * requestAnimationFrame (IE 10+, Firefox 23+, Chrome 29+, Safari 6.0 (webkit), 7.0, Opera 17+, iOS 6.0+ (webkit), 7.0)
     * WebGL (IE 11+, Firefox 23+, Chrome 29+, Safari 5.1+, Opera 17+)
     */
    var dropzone = document.getElementsByClassName('j-dropzone')[0],
        uploader = document.getElementsByClassName('j-upload')[0],
        scene, camera, renderer, WIDTH, HEIGHT, loader, mesh, light, ambientLight, parsedModel,
        preloader = document.getElementsByClassName('viewer-preloader')[0];

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
        camera.position.set(1, 0, 30);
        scene.add(camera);

        // Light
        renderer.setClearColor(0xfefefe, 1);
        light = new THREE.PointLight(0xffffff);
        light.position.set(0, 0, 30);
        ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);
        scene.add(light);

        // Orbit control
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    };

    /**
     * Render scene
     */
    var render = function() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        controls.update();
    };

    /**
     * On resize handler
     */
    var onResize = function() {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    };

    /**
     * File handler
     * @param {Object} file File from the user
     */
    var fileSelectHandler = function(file) {
        var reader = new FileReader();

        preloader.style.display = 'inline-block';

        if (mesh !== undefined) {
            scene.remove(mesh);
            // render();
        }

        reader.onload = function(event) {
            if (scene === undefined) {
                init();
                render();
                window.addEventListener('resize', onResize);
            }

            if (loader === undefined) {
                loader = new THREE.JSONLoader();
            }

            var parsedModel = loader.parse(JSON.parse(event.target.result));

            mesh = new THREE.Mesh(parsedModel.geometry, parsedModel.materials && new THREE.MultiMaterial(parsedModel.materials));
            mesh.position.set(-1, -5, 0);
            preloader.style.display = 'none';
            scene.add(mesh);
            render();
        };

        reader.readAsText(file);
    };

    // Adding listeners
    dropzone.addEventListener('dragover', function(event) {
        event.dataTransfer.dropEffect = 'copy';
        eventPreventer(event);
    }, false);

    dropzone.addEventListener('drop', function(event) {
        fileSelectHandler(event.dataTransfer.files[0]);
        eventPreventer(event);
    }, false);

    uploader.addEventListener('change', function(event) {
        fileSelectHandler(event.target.files[0]);
        eventPreventer(event);
    }, false);
})();
