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


        // let box = this.getBox(1,1,1)

        let boxGrid = this.getBoxGrid(10, 1.5)

        let plane = this.getPlane(20)
        let pointLight = this.getPointLight(1)
        let sphere = this.getSphere(0.05)

        plane.name = 'plane-1'

        boxGrid.name = 'box-grid'

        // box.position.y = box.geometry.parameters.height/2
        plane.rotation.x = Math.PI/2
        pointLight.position.y = 1.5
        pointLight.intensity = 2

        gui.add(pointLight, 'intensity', 0, 10)
        gui.add(pointLight.position, 'y', 0, 5)


        // scene.add(box)
        scene.add(plane)
        scene.add(pointLight)
        scene.add(boxGrid)

        pointLight.add(sphere)

        let camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth/window.innerHeight,
            1,
            1000
        )

        camera.position.x = 1

        camera.position.y = 2

        camera.position.z = 5

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
        this.update(renderer, scene, camera, controls)

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
    update(renderer, scene, camera, controls) {
        renderer.render(
            scene,
            camera
        )

        let box = scene.getObjectByName('box-grid')
        box.rotation.y += 0.031
        // box.rotation.z += 0.031

        // scene.traverse(function(child) {
        //     child.scale.x += 0.001
        // })

        controls.update()

        requestAnimationFrame(() => {
            this.update(renderer, scene, camera, controls)
        })
    },
    getPointLight(intensity) {
        let light = new THREE.PointLight(0xffffff, intensity)
        light.castShadow = true
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