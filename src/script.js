import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

//a.texture
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const chekerboardTexture1024 = textureLoader.load('/textures/checkerboard-1024x1024.png')
const chekerboardTexture8 = textureLoader.load('/textures/checkerboard-8x8.png')
const matcapTexture01 = textureLoader.load('textures/matcaps/10.png')
const matcapTexture02 = textureLoader.load('textures/matcaps/9.png')

chekerboardTexture1024.minFilter = THREE.NearestFilter
chekerboardTexture8.magFilter = THREE.NearestFilter

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/4/px.png',
    '/textures/environmentMaps/4/nx.png',
    '/textures/environmentMaps/4/py.png',
    '/textures/environmentMaps/4/ny.png',
    '/textures/environmentMaps/4/pz.png',
    '/textures/environmentMaps/4/nz.png'
])

//b.font
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            "Three.js Playground",
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.04,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        textGeometry.center()
        const textMaterial = new THREE.MeshMatcapMaterial()
        textMaterial.matcap = matcapTexture01
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
        text.position.y = 1.2
    }
)



//0.gui
const gui = new dat.GUI()
// gui.close()
const parameters = {
    spinX: () => {
        gsap.to(mesh.rotation, { duration: 1, x:mesh.rotation.x + 10})
    },
    spinY: () => {
        gsap.to(mesh.rotation, { duration: 1, y:mesh.rotation.y + 10})
    },
    spinZ: () => {
        gsap.to(mesh.rotation, { duration: 1, z:mesh.rotation.z + 10})
    },
    reset: () => {
        gsap.to(mesh.rotation, { duration: 3, x: 0})
        gsap.to(mesh.rotation, { duration: 3, y: 0})
        gsap.to(mesh.rotation, { duration: 3, z: 0})
        gsap.to(mesh.position, { duration: 3, x: 0})
        gsap.to(mesh.position, { duration: 3, y: 0})
        gsap.to(mesh.position, { duration: 3, z: 0})
    }
}
window.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
        if (gui._hidden)
            gui.show()
        else
            gui.hide()
    }
})


//1.canvas, scene, size, resize
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


//2.object, axesHelper, light
const axesHelper = new THREE.AxesHelper(2)
axesHelper.visible = false;
scene.add(axesHelper)

const mesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.45, 0.15, 100, 32),
    new THREE.MeshStandardMaterial()
)
scene.add(mesh)

mesh.material.color = new THREE.Color(0xba1212)
mesh.material.metalness = 0.7
mesh.material.roughness = 0.2
mesh.material.envMap = environmentMapTexture

gui
    .add(mesh.position, 'x')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('pos - x')

gui
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('pos - y')

gui
    .add(mesh.position, 'z')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('pos - z')

gui
    .add(mesh, 'visible')

gui
    .add(mesh.material, 'wireframe')

gui
    .addColor(mesh.material, 'color')
    .name('color - material')

gui
    .addColor(mesh.material, 'emissive')
    .name('color - emissive')    

gui
    .add(mesh.material, 'emissiveIntensity')
    .min(0)
    .max(1)
    .step(0.1)

gui
    .add(mesh.material, 'metalness')
    .min(0)
    .max(1)
    .step(0.1)

gui
    .add(mesh.material, 'roughness')
    .min(0)
    .max(1)
    .step(0.1)


gui
    .add(parameters, 'spinX')

gui
    .add(parameters, 'spinY')

gui
    .add(parameters, 'spinZ')

gui
    .add(parameters, 'reset')

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap:matcapTexture02 })
for (let i = 0; i < 300; i++){
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)

    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

    scene.add(donut)
}


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2, 3, 4)
scene.add(ambientLight, pointLight)


//3.camera, contorls, renderer
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1.5, 1.5, 2.5)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//4.animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()


    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()