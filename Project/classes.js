class Paddle
{
    x = 0;
    y = -15;

    paddleMesh = new THREE.Mesh();

    constructor(scene)
    {
        let geometry = new THREE.BoxGeometry(10, 1, 2);
        let material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, wireframe: false });
        this.paddleMesh = new THREE.Mesh(geometry, material);
        this.paddleMesh.castShadow = true;
        this.paddleMesh.position.y = 0
        this.paddleMesh.position.z = 5
        scene.add(this.paddleMesh);
    }

    update()
    {
        let dist = 11

        if (this.x < -dist)
        {
            this.x = -dist;
        }

        if (this.x > dist)
        {
            this.x = dist;
        }

        this.paddleMesh.position.x = this.x;
        this.paddleMesh.position.y = this.y;
    }
}

class Ball
{
    x = 0;
    y = 0;

    vx = .25;
    vy = .25;

    r = 1;

    constructor(scene)
    {
        let geometry = new THREE.SphereGeometry(this.r, 12, 50);
        let material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, wireframe: false });
        this.ballmesh = new THREE.Mesh(geometry, material);
        this.ballmesh.castShadow = true;
        this.ballmesh.position.y = 0
        this.ballmesh.position.z = this.r; // sit it on the background plane
        scene.add(this.ballmesh);
    }

    update(scene)
    {
        let width = 17;
        let height = 20;

        let top = height - this.r;
        let bottom = - height + this.r;
        let left = -width + this.r;
        let right = width - this.r;

        // Apply the velocity to the ball
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on the top and bottom walls
        if (this.y > top || this.y < bottom)
        {
            this.vy *= -1;
            this.vx *= 1;
            this.rotationalVelocity *= -1;
        }

        // Bounce on the left and right walls
        if (this.x > right || this.x < left)
        {
            this.vx *= -1;
            this.vy *= 1;
            this.rotationalVelocity *= -1;
        }

        // Stop clipping into the wall
        if (this.y > top)
        {
            this.y = top;
        }

        if (this.y < bottom)
        {
            this.y = bottom;
        }

        if (this.x > right)
        {
            this.x = right;
        }

        if (this.x < bottom)
        {
            this.x = bottom;
        }

        let boxPos = new THREE.Box3();
        boxPos.setFromCenterAndSize(new THREE.Vector3(this.x, this.y, 0), new THREE.Vector3(this.r, this.r, this.r))

        let box = new THREE.Box3();
        box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(15, 1, 1))

        if (boxPos.intersectsBox(box))
        {
            console.log("HIT");

        }


        this.ballmesh.position.x = this.x;
        this.ballmesh.position.y = this.y;
    }

    checkCollision(otherBall)
    {
        // Get the distance between this ball and the colliding ball
        let dist = Math.sqrt(Math.pow(otherBall.x - this.x, 2) + Math.pow(otherBall.y - this.y, 2))
        if (dist < this.r + otherBall.r)
        {
            collisionOccured = true;// for the text
            setTimeout(() =>
            {
                collisionOccured = false;
            }, 750);
            score += 1;
            return true
        }

        return false
    }
}
