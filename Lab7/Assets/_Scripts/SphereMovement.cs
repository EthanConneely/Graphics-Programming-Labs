using UnityEngine;

public class SphereMovement : MonoBehaviour
{
    public float speed = 10;
    private new Rigidbody rigidbody;

    private void Awake()
    {
        rigidbody = GetComponent<Rigidbody>();
    }

    private void Update()
    {
        Vector3 movemnt = new(Input.GetAxisRaw("Horizontal"), 0, Input.GetAxisRaw("Vertical"));

        rigidbody.AddForce(movemnt * speed);
    }
}
