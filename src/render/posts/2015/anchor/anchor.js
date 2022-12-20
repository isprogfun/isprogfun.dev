(function() {
    /**
     * requestAnimationFrame (IE 10+, Firefox 23+, Chrome 29+, Safari 6.0 (webkit), 7.0, Opera 17+, iOS 6.0+ (webkit), 7.0)
     * WebGL (IE 11+, Firefox 23+, Chrome 29+, Safari 5.1+, Opera 17+)
     */
    var scene,
        camera,
        renderer,
        group,
        canvas = document.getElementById('anchor'),
        autoRotate = false,

        // Stats
        // stats = new Stats(),

        // Loading part
        groupParts = [
            { fileName: 'tsep', name: 'Цепь' },
            { fileName: 'shtok', name: 'Шток' },
            { fileName: 'skoba', name: 'Скоба' },
            { fileName: 'vereteno', name: 'Веретено' },
            { fileName: 'piatka', name: 'Пятка' },
            { fileName: 'roga', name: 'Рога' },
            { fileName: 'lapi', name: 'Лапы' }
        ],
        deferreds = [],

        // Sizes
        WIDTH = 300,
        HEIGHT = window.innerHeight,
        MAX_ANCHOR_DELTA = 6,
        maxScroll = $(document).outerHeight(true) - HEIGHT,

        // TODO: Hint
        $hint = $('.hint'),
        $hintText = $hint.find('.hint__text'),
        hintText = '',

        // Picking
        raycaster = new THREE.Raycaster(),
        mouse = new THREE.Vector2();

    mouse.x = -1;
    mouse.y = -1;

    // Set stats
    // stats.setMode(0);
    // document.body.appendChild(stats.domElement);

    // Shader
    var shader = {
        'outline' : {
            vertex_shader: [
                "uniform float offset;",
                "void main() {",
                    "vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );",
                    "gl_Position = projectionMatrix * pos;",
                "}"
            ].join("\n"),

            fragment_shader: [
                "void main() {",
                    "gl_FragColor = vec4( 0.9, 0.2, 0.2, 1.0 );",
                "}"
            ].join("\n")
        }
    };

    matShader = new THREE.ShaderMaterial({
        uniforms: { offset: { type: 'f', value: 0 } },
        vertexShader: shader.outline.vertex_shader,
        fragmentShader: shader.outline.fragment_shader,
    });

    /**
     * Создание сцены, добавление главных объектов
     */
    function init() {
        var light;

        scene = new THREE.Scene();

        // Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        console.log(WIDTH, HEIGHT);
        renderer.setSize(WIDTH, HEIGHT);

        // Camera
        camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10000);
        camera.position.set(0, 3, 15);
        camera.lookAt(0, 0, 0);
        scene.add(camera);

        // Light
        renderer.setClearColor(0xfefefe); // Same as the page background
        light = new THREE.HemisphereLight(0xffffff, 0x000000, 4);
        light.position.set(0, 50, 0);
        ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight, light);

        // Axes helper
        // scene.add(new THREE.AxisHelper(20));

        // Anchor group
        group = new THREE.Object3D();

        // Load geometry
        groupParts.forEach(function(part) {
            var deferred = $.Deferred();

            deferreds.push(deferred);

            new THREE.JSONLoader().load('model/' + part.fileName + '.json', function(geometry, materials) {
                var mesh;

                materials = materials.map(function(material) {
                    material.shading = THREE.FlatShading;

                    return material;
                });
                mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
                mesh.name = part.name;
                group.add(mesh);
                constructOutline(mesh);
                deferred.resolve();
            });
        });

        // Orbit control
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.noPan = true;
        // controls.noZoom = true;
        controls.minDistance = 12; // TODO: magic numbers
        controls.maxDistance = 15; // TODO: magic numbers
        controls.minPolarAngle = 1.1; // radians
        controls.maxPolarAngle = 1.1; // radians
    }

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        if (autoRotate) {
            group.rotation.y -= 0.01;
        }
        // stats.update();
        controls.update();
    }

    function constructOutline(mesh) {
        var outlineMesh = new THREE.Mesh(mesh.geometry, matShader);

        outlineMesh.material.depthWrite = false;
        outlineMesh.quaternion = mesh.quaternion;
        outlineMesh.name = mesh.name + '_outline';
        group.add(outlineMesh);
    }

    function onResize() {
        HEIGHT = window.innerHeight;
        maxScroll = $(document).outerHeight(true) - HEIGHT;
        calculateAnchorPosition();

        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    }

    function onMouseMove(event) {
        // Calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(group.children);

        event.preventDefault();

        autoRotate = false;

        mouse.x = ( ( event.clientX - ( $(canvas).position().left - 450 ) ) / WIDTH ) * 2 - 1;
        mouse.y = - ( event.clientY / HEIGHT ) * 2 + 1;

        // Picking
        raycaster.setFromCamera(mouse, camera);
        highlight(intersects.length > 0 && intersects[0].object.name);
    }

    function calculateAnchorPosition() {
        if (maxScroll === 0) {
            maxScroll = 1;
        }
        group.position.y = -(window.scrollY * MAX_ANCHOR_DELTA / maxScroll);
    }

    function highlight(name) {
        if (name && hintText !== name) {
            group.children.forEach(function(mesh) {
                if (mesh.name.search(/_outline/) !== -1 && mesh.visible) {
                    mesh.visible = false;
                }
            });
            group.children.some(function(mesh) {
                if (mesh.name === name + '_outline') {
                    if (mesh.material.uniforms.offset.value === 0) {
                        mesh.material.uniforms.offset.value = 0.1;
                    }
                    mesh.visible = true;

                    return true;
                }
            });
            $hintText.text(name);
            $hint.show();

            hintText = name;
        } else if (!name || name.search(/_outline/) !== -1) {
            group.children.forEach(function(mesh) {
                if (mesh.name.search(/_outline/) !== -1) {
                    mesh.visible = false;
                }
            });
            $hint.hide();
            hintText = '';
        }
    }

    init();
    render();

    $.when.apply($, deferreds).done(function() {
        group.rotateY(-0.5);
        scene.add(group);
        calculateAnchorPosition();

        // Events
        window.addEventListener('resize', onResize);
        canvas.addEventListener('mousemove', onMouseMove);
        window.setTimeout(function() {
            autoRotate = true;
        }, 1000);

        // TODO: jQuery events
        $(window).on('scroll', calculateAnchorPosition);
        $('.highlight').hover(function() {
            highlight(this.dataset.part);
        }, function() {
            highlight();
        });
    });
})();
