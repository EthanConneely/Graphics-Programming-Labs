import Paddle from "./Paddle.js";
import Brick from "./Brick.js";
import Ball from "./Ball.js";
import Walls from "./Walls.js";
import { AmbientLight, Color, PerspectiveCamera, Scene, SpotLight, Vector2, WebGLRenderer } from 'three';
import * as THREE from 'three';

const brickWidth = 7;
const brickHeight = 10;

// Create scene
const scene = new Scene();

// Create camera
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.z = 50;

// Add AmbientLight
var light = new AmbientLight(0xffffff);
light.intensity = 0.75;
scene.add(light);

// Add Light
var light = new SpotLight(0xffffff, .75);
light.position.set(25, 0, 50);
light.castShadow = true;
light.lookAt(0, 0, 0)
light.shadow.mapSize.width = 512 * 8;
light.shadow.mapSize.height = 512 * 8;
scene.add(light);

var score = 0;

// Add the walls to the scene
new Walls(scene);

let paddle = new Paddle(scene);
let ball = new Ball(scene);

// Handle the event when the ball bounces into a brick
window.addEventListener("pointEvent", (p) =>
{
    // Increase the score
    score++

    // Update the html text display of the score
    document.getElementById("Score").textContent = "Score: " + score

    // Spawn a new set of bricks everytime we clear all the bricks
    if (score % (brickWidth * brickHeight) == 0)
    {
        ball.isHeld = true;
        spawnBricks();
    }
})

// Handle when the ball dies
window.addEventListener("gameover", (p) =>
{
    // Set score to zero
    score = 0

    // Set html score to zero
    document.getElementById("Score").textContent = "Score: " + score

    if ((localStorage.getItem("Highscore") | 0) <= score)
    {
        localStorage.setItem("Highscore", score);
    }
    // Reset the games state
    ball.isHeld = true;
    paddle.x = 0;
    spawnBricks();

    // Show the gameover overlay
    document.getElementById("Gameover").style.display = "block"

    // After 1 second disable the title
    setTimeout(() =>
    {
        document.getElementById("Gameover").style.display = "none"
    }, 1000);
})

spawnBricks();

// Create renderer
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Add renderer to dom
document.body.appendChild(renderer.domElement);

let left = 0;
let right = 0;
let movement = 0;
let shootBall = false;

function spawnBricks()
{
    // Delete all remaining bricks on the screen
    for (let i = scene.children.length - 1; i >= 0; i--)
    {
        let object = scene.children[i]

        if (object.name == "Brick")
        {
            scene.remove(object)
        }
    }

    // Spawn all the bricks
    for (let x = 0; x < brickWidth; x++)
    {
        for (let y = 0; y < brickHeight; y++)
        {
            // Maths for diagnal rainbow colors
            let num = (x + (y * brickWidth));
            num -= (Math.floor(y / 2));

            let hue = num % brickWidth;
            let color = new Color().setHSL(hue / brickWidth, .9, .6);
            new Brick(scene, (x * 4.5 - 14.5) + ((y % 2) * 2), 16 - y * 2, color);
        }
    }
}

function Loop()
{
    renderer.render(scene, camera)

    paddle.x += movement * .25;
    paddle.update()

    if (shootBall)
    {
        shootBall = false;
        ball.isHeld = false;
        ball.velocity = new Vector2(Math.random() - .5, .25).normalize().setLength(.3)
    }

    if (ball.isHeld)
    {
        ball.position = new Vector2(paddle.x, paddle.y + 1.5)
    }

    ball.update()

    camera.lookAt(paddle.x, paddle.y + 15, 0)

    requestAnimationFrame(Loop)
}
// Start the loop
requestAnimationFrame(Loop)

// Input key dowwn events
document.addEventListener('keydown', function (event)
{
    let key = event.key.toLowerCase();

    if (key == "a" || key == "arrowleft")
    {
        left = -1;
    }
    if (key == "d" || key == "arrowright")
    {
        right = 1;
    }
    if (key == " " && ball.isHeld)
    {
        shootBall = true;
    }

    movement = left + right;
});

// Input key up events
document.addEventListener('keyup', function (event)
{
    let key = event.key.toLowerCase();

    if (key == "a" || key == "arrowleft")
    {
        left = 0;
    }
    if (key == "d" || key == "arrowright")
    {
        right = 0;
    }

    movement = left + right;
});
