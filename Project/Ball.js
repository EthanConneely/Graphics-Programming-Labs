import * as THREE from 'three';
import { EventDispatcher, Vector2, Vector3 } from 'three';

export default class Ball
{
    position = new Vector2(0, 0);

    velocity = new Vector2(0.1, .5);

    r = 1;

    light = new THREE.PointLight(0x0000ff, 3, 10);

    raycaster = new THREE.Raycaster();

    arrow = new THREE.ArrowHelper(this.raycaster.ray.direction, this.raycaster.ray.origin, 8, 0x00ff00);

    ballmesh = new THREE.Mesh();

    scene = new THREE.Scene()

    pointEvent = new CustomEvent("pointEvent", {});

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

        this.arrow.position.z = 2
        this.light.position.z = 1;

        this.scene.add(this.ballmesh);
        this.scene.add(this.arrow);
        this.scene.add(this.light);
    }

    update()
    {
        this.handleBounces();

        // Apply the velocity to the ball
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.light.position.x = this.position.x;
        this.light.position.y = this.position.y;

        this.ballmesh.position.x = this.position.x;
        this.ballmesh.position.y = this.position.y;
    }

    handleBounces()
    {
        this.raycaster.set(new Vector3(this.position.x, this.position.y + this.r, 0), new Vector3(this.velocity.x, this.velocity.y, 0));
        if (this.handleCollisions(this.raycaster.intersectObjects(this.scene.children)))
        {
            return
        }

        this.raycaster.set(new Vector3(this.position.x + this.r, this.position.y, 0), new Vector3(this.velocity.x, this.velocity.y, 0));
        if (this.handleCollisions(this.raycaster.intersectObjects(this.scene.children)))
        {
            return
        }

        this.raycaster.set(new Vector3(this.position.x - this.r, this.position.y, 0), new Vector3(this.velocity.x, this.velocity.y, 0));
        if (this.handleCollisions(this.raycaster.intersectObjects(this.scene.children)))
        {
            return
        }

        this.raycaster.set(new Vector3(this.position.x, this.position.y - this.r, 0), new Vector3(this.velocity.x, this.velocity.y, 0));
        if (this.handleCollisions(this.raycaster.intersectObjects(this.scene.children)))
        {
            return
        }
    }

    handleCollisions(intersections)
    {
        for (const intersection of intersections)
        {
            if (intersection.distance > this.velocity.length())
            {
                continue;
            }

            if (intersection.face == null)
            {
                continue;
            }

            if (intersection.face.normal.y == 1 || intersection.face.normal.y == -1)
            {
                this.velocity.y *= -1;
            }
            else if (intersection.face.normal.x == 1 || intersection.face.normal.x == -1)
            {
                this.velocity.x *= -1;
            }

            if (intersection.object.name == "Brick")
            {
                this.scene.remove(intersection.object);

                var audio = new Audio('pop.mp3');
                audio.volume = (Math.random() * .25) + .75
                audio.play().catch(e => { })

                window.dispatchEvent(this.pointEvent)
            }
            else
            {
                var audio = new Audio('tick.mp3');
                audio.volume = (Math.random() * .25) + .75
                audio.play().catch(e => { })
            }

            if (intersection.object.name == "Paddle")
            {
                let percent = (this.position.x - intersection.object.position.x) / 6;

                this.velocity.x += percent

                this.velocity = this.velocity.normalize();

                // make it so that velocity going up and down is never less than 1/4
                // will make bugs where the ball is stuck going left and right forever stop
                if (Math.abs(this.velocity.y) < .5)
                {
                    // sign not to be mixed up with sin returns only 1 or -1
                    // dependinga on if the value is positive or negative
                    this.velocity.y = .5 * Math.sign(this.velocity.y)
                }

                this.velocity = this.velocity.multiplyScalar(.5);
            }

        }
    }
}
