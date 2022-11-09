import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";

export default class Paddle
{
    x = 0;
    y = -15;

    paddleMesh = new Mesh();

    // Initialize Paddle
    constructor(scene)
    {
        let geometry = new BoxGeometry(10, 1, 2);
        let material = new MeshLambertMaterial({ color: 0xaaaaaa, wireframe: false });
        this.paddleMesh = new Mesh(geometry, material);
        this.paddleMesh.name = "Paddle";
        this.paddleMesh.castShadow = true;
        this.paddleMesh.position.y = 0;
        this.paddleMesh.position.z = 1;

        scene.add(this.paddleMesh);
    }

    update()
    {
        let dist = 12;

        // Restrict the movement of the paddle to stop it from
        // Escaping out of the bounds of the map
        if (this.x < -dist)
        {
            this.x = -dist;
        }
        else if (this.x > dist)
        {
            this.x = dist;
        }

        // Set the position of the mesh to the classes position
        this.paddleMesh.position.x = this.x;
        this.paddleMesh.position.y = this.y;
    }
}
