import * as THREE from 'three';
import { EventDispatcher, Vector2, Vector3 } from 'three';

export default class Ball
{
    position = new Vector2(0, 0);
    velocity = new Vector2(0);
    r = 1;
    light = new THREE.PointLight(0x0000ff, 3, 10);
    raycaster = new THREE.Raycaster();
    ballmesh = new THREE.Mesh();
    scene = new THREE.Scene()
    pointEvent = new CustomEvent("pointEvent", {});
    gameoverEvent = new CustomEvent("gameover", {});
    isHeld = true;

    // Initialize Ball
    constructor(threeJsScene)
    {
        this.scene = threeJsScene;
        let geometry = new THREE.SphereGeometry(this.r, 12, 12);
        let material = new THREE.MeshLambertMaterial({ color: 0x2266aa });
        this.ballmesh = new THREE.Mesh(geometry, material);
        this.ballmesh.name = "ballmesh";
        this.ballmesh.castShadow = true;
        this.ballmesh.position.y = 0;
        this.ballmesh.position.z = this.r; // sit it on the background plane

        this.light.position.z = 1;

        // Parent the light to the ballmesh
        this.ballmesh.add(this.light);
        // Add the ball to the scene
        this.scene.add(this.ballmesh);
    }

    update()
    {
        // if the ball is being help dont check collisions or move it
        if (!this.isHeld)
        {
            this.handleBounces();

            this.velocity = this.velocity.normalize();
            if (Math.abs(this.velocity.y) < .5)
            {
                // sign not to be mixed up with sin returns only 1 or -1
                // depending on if the value is positive or negative
                this.velocity.y = .5 * Math.sign(this.velocity.y);
            }
            this.velocity = this.velocity.normalize();
            this.velocity = this.velocity.multiplyScalar(.25);

            // Apply the velocity to the ball
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }

        this.ballmesh.position.x = this.position.x;
        this.ballmesh.position.y = this.position.y;
    }

    handleBounces()
    {
        let rays = [
            new Vector3(0, this.r, 0),
            new Vector3(0, -this.r, 0),
            new Vector3(this.r, 0, 0),
            new Vector3(-this.r, 0, 0),

            new Vector3(this.r, this.r, 0),
            new Vector3(-this.r, -this.r, 0),
            new Vector3(this.r, -this.r, 0),
            new Vector3(-this.r, this.r, 0)
        ]

        for (const ray of rays)
        {
            this.raycaster.set(new Vector3(this.position.x + ray.x, this.position.y + ray.y, 0), new Vector3(this.velocity.x, this.velocity.y, 0));
            let collisions = this.raycaster.intersectObjects(this.scene.children);
            for (const collision of collisions)
            {
                if (collision.distance <= this.velocity.length())
                {
                    if (!collision.face)
                    {
                        continue;
                    }

                    if (collision.face.normal.y == 1 || collision.face.normal.y == -1)
                    {
                        this.velocity.y *= -1;
                    }
                    else if (collision.face.normal.x == 1 || collision.face.normal.x == -1)
                    {
                        this.velocity.x *= -1;
                    }

                    if (collision.object.name == "Brick")
                    {
                        // Delete the brick
                        this.scene.remove(collision.object);
                        window.dispatchEvent(this.pointEvent);// Emit the point event
                        this.Pop();
                        break;
                    }
                    else if (collision.object.name == "Paddle")
                    {
                        this.HandlePaddleCollision(collision);
                        this.Tick();
                    }
                    else if (collision.object.name == "Dead")
                    {
                        window.dispatchEvent(this.gameoverEvent);
                    }
                    else
                    {
                        this.Tick();
                    }
                }
            }
        }
    }

    // Play pop sound for the brick
    Pop()
    {
        var audio = new Audio('pop.mp3');
        audio.volume = (Math.random() * .25) + .75
        audio.play().catch(e => { })
    }

    // Play tick sound effect
    Tick()
    {
        var audio = new Audio('tick.mp3');
        audio.volume = (Math.random() * .25) + .75
        audio.play().catch(e => { })
    }

    HandlePaddleCollision(collision)
    {
        // Get the value based on the x position relative to the paddle
        let percent = (this.position.x - collision.object.position.x) / 6;
        // Add the velocity
        this.velocity.x += percent;
    }
}
