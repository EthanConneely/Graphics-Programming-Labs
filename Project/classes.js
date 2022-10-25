class Paddle
{
    x = 0;
    y = -5;

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

    Update()
    {
        this.paddleMesh.position.x = this.x;
        this.paddleMesh.position.y = this.y;

        let dist = 10

        if (this.x < -dist)
        {
            this.x = -dist;
        }


        if (this.x > dist)
        {
            this.x = dist;
        }
    }
}

class Ball
{
    x = 0;
    y = 0;

    ballmesh;

    constructor(scene)
    {
        let geometry = new THREE.SphereGeometry(1.5, 12, 50);
        let material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, wireframe: false });
        this.ballmesh = new THREE.Mesh(geometry, material);
        this.ballmesh.castShadow = true;
        this.ballmesh.position.y = 0
        this.ballmesh.position.z = 1
        scene.add(this.ballmesh);
    }

    Update()
    {
        this.ballmesh.position.x = this.x;
        this.ballmesh.position.y = this.y;
    }
}
