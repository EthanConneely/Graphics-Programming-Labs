using UnityEngine;

public class BulletController : MonoBehaviour
{
    private new Rigidbody rigidbody;

    private void Awake()
    {
        rigidbody = GetComponent<Rigidbody>();
    }

    private void FixedUpdate()
    {
        rigidbody.velocity = transform.forward * 20;
    }
}
