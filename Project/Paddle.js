import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";

export default class Paddle
{
    x = 0;
    y = -15;

    paddleMesh = new Mesh();

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
