// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.z = 70;
// camera.position.y = 70;

// Add AmbientLight
var light = new THREE.AmbientLight(0xffffff);
light.intensity = 0.5;
scene.add(light);

// Add Light
var light = new THREE.SpotLight(0xffffff, 1);
light.position.set(25, 0, 50);
light.castShadow = true;
light.lookAt(0, 0, 0)
light.shadow.mapSize.width = 512 * 4; // default
light.shadow.mapSize.height = 512 * 4; // default

scene.add(light);

console.log(light.shadow.camera);

// Add Background Plane
geometry = new THREE.PlaneGeometry(35, 50);
let planematerial = new THREE.MeshLambertMaterial({ color: 0xaa2233, wireframe: false });
let mesh = new THREE.Mesh(geometry, planematerial);
mesh.receiveShadow = true;
mesh.position.y = 0
mesh.position.z = 0.5
scene.add(mesh);

let paddle = new Paddle(scene);
let ball = new Ball(scene);

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Add renderer to dom
document.body.appendChild(renderer.domElement);

let left = 0;
let right = 0;
let movement = 0;

function Loop(ts)
{
    renderer.render(scene, camera)

    paddle.x += movement * .25;

    paddle.update()
    ball.update(scene)

    camera.lookAt(0, 0, 0)

    // Keep looping
    requestAnimationFrame(Loop);
}

// Start the loop
requestAnimationFrame(Loop)

document.addEventListener('keydown', function (event)
{
    let key = event.key.toLowerCase();

    if (key == "a" || key == "leftarrow")
    {
        left = -1;
    }
    else if (key == "d" || key == "rightarrow")
    {
        right = 1;
    }

    movement = left + right;
});

document.addEventListener('keyup', function (event)
{
    let key = event.key.toLowerCase();

    if (key == "a" || key == "arrowleft")
    {
        left = 0;
    }
    else if (key == "d" || key == "arrowright")
    {
        right = 0;
    }
    movement = left + right;
});
