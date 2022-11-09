import * as THREE from 'three';
import { Mesh } from 'three';

export default class Walls
{
    // Initialize Walls
    constructor(scene)
    {
        let mat = new THREE.MeshLambertMaterial({ color: 0x444444, wireframe: false });
        let geometry = new THREE.BoxGeometry(100, 100, 100);
        let planeGeo = new THREE.PlaneGeometry(100, 100, 100);

        // Add Background Plane
        let mesh = new Mesh(planeGeo, mat);
        mesh.name = "Wall"
        mesh.receiveShadow = true;
        scene.add(mesh);

        // Add Top Plane
        mesh = new Mesh(geometry, mat);
        mesh.name = "Wall"
        mesh.receiveShadow = true;
        mesh.position.y = 70;
        scene.add(mesh);

        // Add Bottom Plane
        mesh = new Mesh(geometry, mat);
        mesh.name = "Dead"
        mesh.receiveShadow = true;
        mesh.position.y = -70;
        scene.add(mesh);

        // Add Right Plane
        mesh = new Mesh(geometry, mat);
        mesh.name = "Wall"
        mesh.receiveShadow = true;
        mesh.position.x = 67;
        scene.add(mesh);

        // Add Left Plane
        mesh = new Mesh(geometry, mat);
        mesh.name = "Wall"
        mesh.receiveShadow = true;
        mesh.position.x = -67;
        scene.add(mesh);
    }
}
