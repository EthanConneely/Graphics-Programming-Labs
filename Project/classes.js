import * as THREE from 'three';

export class Paddle
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
        this.paddleMesh.position.y = 0;
        this.paddleMesh.position.z = 1;

        scene.add(this.paddleMesh);
    }

    update()
    {
        let dist = 11;

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

export class Ball
{
    x = 0;
    y = 0;

    vx = .25;
    vy = .25;

    r = 1;

    light = new THREE.PointLight(0x0000ff, 5, 10);

    raycaster = new THREE.Raycaster();

    arrow = new THREE.ArrowHelper(this.raycaster.ray.direction, this.raycaster.ray.origin, 8, 0xff0000);

    constructor(scene)
    {
        let geometry = new THREE.SphereGeometry(this.r, 12, 12);
        let material = new THREE.MeshLambertMaterial({ color: 0x2266aa, wireframe: false });
        this.ballmesh = new THREE.Mesh(geometry, material);
        this.ballmesh.castShadow = true;
        this.ballmesh.position.y = 0
        this.ballmesh.position.z = this.r; // sit it on the background plane

        scene.add(this.ballmesh);
        scene.add(this.arrow);
        scene.add(this.light);
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
        }

        // Bounce on the left and right walls
        if (this.x > right || this.x < left)
        {
            this.vx *= -1;
        }

        let box = new THREE.Box3();
        box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(15, 1, 1))

        this.raycaster.set(new THREE.Vector3(this.x, this.y, 0), new THREE.Vector3(this.vx, this.vy, 0))

        this.arrow.position.x = this.x;
        this.arrow.position.y = this.y;
        this.arrow.setDirection(new THREE.Vector3(this.vx, this.vy, 0));

        let intersections = this.raycaster.intersectObjects(box);
        for (const intersection of intersections)
        {
            console.log(intersection.point);
        }

        this.light.position.x = this.x;
        this.light.position.y = this.y;
        this.light.position.z = 1;

        this.ballmesh.position.x = this.x;
        this.ballmesh.position.y = this.y;
    }
}

export class Box
{
    constructor(scene)
    {
        let mat = new THREE.MeshLambertMaterial({ color: 0xaa2233, wireframe: false });
        let geometry = new THREE.PlaneGeometry(100, 100);

        // Add Background Plane
        let mesh = new THREE.Mesh(geometry, mat);
        mesh.receiveShadow = true;
        scene.add(mesh);

        // Add Top Plane
        mesh = new THREE.Mesh(geometry, mat);
        mesh.receiveShadow = true;
        mesh.position.y = 20
        mesh.rotation.x = Math.PI / 2;
        scene.add(mesh);

        // Add Bottom Plane
        mesh = new THREE.Mesh(geometry, mat);
        mesh.receiveShadow = true;
        mesh.position.y = -20
        mesh.rotation.x = -Math.PI / 2;
        scene.add(mesh);

        // Add Right Plane
        mesh = new THREE.Mesh(geometry, mat);
        mesh.receiveShadow = true;
        mesh.position.x = 34 / 2.0
        mesh.rotation.y = -Math.PI / 2;
        scene.add(mesh);

        // Add Left Plane
        mesh = new THREE.Mesh(geometry, mat);
        mesh.receiveShadow = true;
        mesh.position.x = - 34 / 2.0
        mesh.rotation.y = Math.PI / 2;
        scene.add(mesh);
    }
}
