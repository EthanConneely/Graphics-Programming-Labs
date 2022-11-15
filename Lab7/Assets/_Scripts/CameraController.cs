using UnityEngine;

public class CameraController : MonoBehaviour
{
    public Transform target;
    public Vector3 offset = new(0, 10, -12);

    private void Start()
    {

    }

    private void Update()
    {
        transform.position = target.position + offset;
    }
}
