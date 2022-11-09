import * as THREE from 'three';


export default class Brick
{
    // Initialize Brick
    constructor(scene, x, y, color)
    {
        let geometry = new THREE.BoxGeometry(3.5, 1.5, 2);
        let material = new THREE.MeshLambertMaterial({ color: color, wireframe: false });
        this.brickMesh = new THREE.Mesh(geometry, material);
        this.brickMesh.name = "Brick";
        this.brickMesh.castShadow = true;
        this.brickMesh.position.x = x;
        this.brickMesh.position.y = y;
        scene.add(this.brickMesh);
    }
}
