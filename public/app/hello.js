Machine.cog({

    display: `<div id="webgl"></div>`,

    start() {
        console.log("HELLO!", THREE)

        let enableFog = false

        if (enableFog) {
            scene.fog = new THREE.FogExp2(0xffffff, 0.2)

        }

        let scene = new THREE.Scene()
        let gui = new dat.GUI()

        let clock = new THREE.Clock()


        // let box = this.getBox(1,1,1)

        let boxGrid = this.getBoxGrid(10, 1.5)

        let plane = this.getPlane(20)
        let directionalLight = this.getDirectionalLight(1)
        let sphere = this.getSphere(0.05)

        let helper = new THREE.CameraHelper(directionalLight.shadow.camera)

        let ambientLight = this.getAmbientLight(1)

        plane.name = 'plane-1'

        boxGrid.name = 'box-grid'

        // box.position.y = box.geometry.parameters.height/2
        plane.rotation.x = Math.PI/2
       directionalLight.position.x = 13
       directionalLight.position.y = 10
       directionalLight.position.z = 10
       directionalLight.intensity = 2

        gui.add(directionalLight, 'intensity', 0, 10)
        gui.add(directionalLight.position, 'x', 0, 20)
        gui.add(directionalLight.position, 'y', 0, 20)
        gui.add(directionalLight.position, 'z', 0, 20)
        gui.add(ambientLight, 'intensity', 1, 10)

        // gui.add(directionalLight, 'penumbra', 0,1)


        // scene.add(box)
        scene.add(plane)
        scene.add(directionalLight)
        scene.add(boxGrid)
        scene.add(helper)
        scene.add(ambientLight)

       directionalLight.add(sphere)

        // let camera = new THREE.PerspectiveCamera(
        //     45,
        //     window.innerWidth/window.innerHeight,
        //     1,
        //     1000
        // )

        let camera = new THREE.OrthographicCamera(
            -15,
            15,
            15,
            -15,
            1,
            1000
        )

        camera.position.x = 10

        camera.position.y = 18

        camera.position.z = -18

        camera.lookAt(new THREE.Vector3(0,0,0))

        let renderer = new THREE.WebGLRenderer()

        renderer.shadowMap.enabled = true

        renderer.setSize(window.innerWidth, window.innerHeight)

        renderer.setClearColor('rgb(120,120,120)')

        document.getElementById('webgl').appendChild(renderer.domElement)

        let controls = new THREE.OrbitControls(camera, renderer.domElement)

        // renderer.render(
        //     scene,
        //     camera
        // )
        this.update(renderer, scene, camera, controls, clock)

        window.scene = scene
    },
    getBox(w,d,h) {
        let geometry = new THREE.BoxGeometry(w,d,h)

        let material = new THREE.MeshPhongMaterial({
            color: 'rgb(120,120,120)'
        })

        let mesh = new THREE.Mesh(
            geometry,
            material
        )

        mesh.castShadow = true

        return mesh
    },

    getBoxGrid(amount, separationMultiplier) {
    let self = this
    var group = new THREE.Group();

    for (var i=0; i<amount; i++) {
        var obj = self.getBox(1, 1, 1);
        obj.position.x = i * separationMultiplier;
        obj.position.y = obj.geometry.parameters.height/2;
        group.add(obj);
        for (var j=1; j<amount; j++) {
            var obj = self.getBox(1, 1, 1);
            obj.position.x = i * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height/2;
            obj.position.z = j * separationMultiplier;
            group.add(obj);
        }
    }

    group.position.x = -(separationMultiplier * (amount-1))/2;
    group.position.z = -(separationMultiplier * (amount-1))/2;

    return group;
    },



getPlane(size) {
        let geometry = new THREE.PlaneGeometry(size, size)

        let material = new THREE.MeshPhongMaterial({
            color: 'rgb(120,120,120)',
            side: THREE.DoubleSide
        })

        let mesh = new THREE.Mesh(
            geometry,
            material
        )
        mesh.receiveShadow = true

        return mesh
    },
    update(renderer, scene, camera, controls, clock) {
        renderer.render(
            scene,
            camera
        )

        let box = scene.getObjectByName('box-grid')

        let timeElapsed = clock.getElapsedTime()


        box.children.forEach(function(child, index) {

            let x = timeElapsed * 5 + index

            child.scale.y = (noise.simplex2(x, x) + 1) / 2 + 0.001
            child.position.y = child.scale.y/2
        })


        // box.rotation.y += 0.005
        // box.rotation.z += 0.031

        // scene.traverse(function(child) {
        //     child.scale.x += 0.001
        // })

        controls.update()

        requestAnimationFrame(() => {
            this.update(renderer, scene, camera, controls, clock)
        })
    },
    getPointLight(intensity) {
        let light = new THREE.PointLight(0xffffff, intensity)
        light.castShadow = true
        return light
    },
    getAmbientLight(intensity) {
        let light = new THREE.AmbientLight('rgb(10,30,50)', intensity)
        return light
    },
    getSpotLight(intensity) {
        let light = new THREE.SpotLight(0xffffff, intensity)
        light.castShadow = true

        // remove shadow glitches
        light.shadow.bias = 0.001

        light.shadow.mapSize.width = 2048
        light.shadow.mapSize.height = 2048


        return light
    },
    getDirectionalLight(intensity) {
        let light = new THREE.DirectionalLight(0xffffff, intensity)
        light.castShadow = true

        light.shadow.camera.left = -10
        light.shadow.camera.bottom = -10
        light.shadow.camera.right = 10
        light.shadow.camera.top = 10


        return light
    },
    getSphere(size) {
        let geometry = new THREE.SphereGeometry(size, 24, 24)

        let material = new THREE.MeshBasicMaterial({
            color: 'white'
        })

        let mesh = new THREE.Mesh(
            geometry,
            material
        )

        return mesh
    },
});