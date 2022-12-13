import cv2
import numpy as np
from matplotlib import pyplot as plt

img = cv2.imread("Face.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
face = cv2.imread("Face.jpg")
grayFace = cv2.cvtColor(face, cv2.COLOR_RGB2GRAY)


face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
eye_cascade = cv2.CascadeClassifier("haarcascade_eye.xml")
smile_cascade = cv2.CascadeClassifier("haarcascade_smile.xml")

faces = face_cascade.detectMultiScale(gray, 1.3, 5)
for (x, y, w, h) in faces:
    cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
    roi_gray = gray[y : y + h, x : x + w]
    roi_color = img[y : y + h, x : x + w]
    smile = eye_cascade.detectMultiScale(roi_gray)
    for (ex, ey, ew, eh) in smile:
        cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)

plt.subplot(2, 3, 1)
plt.imshow(img)
plt.title("face detection")
plt.xticks([])
plt.yticks([])


faces = face_cascade.detectMultiScale(grayFace, 1.3, 5)
for (x, y, w, h) in faces:
    cv2.rectangle(face, (x, y), (x + w, y + h), (255, 0, 0), 2)
    roi_gray = grayFace[y : y + h, x : x + w]
    roi_color = face[y : y + h, x : x + w]
    smile = smile_cascade.detectMultiScale(roi_gray)
    for (ex, ey, ew, eh) in smile:
        cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)


plt.subplot(2, 3, 2)
plt.imshow(face)
plt.title("face detection")
plt.xticks([])
plt.yticks([])

r = face.copy()
# set blue and green channels to 0
r[:, :, 0] = 0
r[:, :, 1] = 0

plt.subplot(2, 3, 4)
plt.imshow(r)
plt.title("R")
plt.xticks([])
plt.yticks([])

g = face.copy()
# set blue and red channels to 0
g[:, :, 0] = 0
g[:, :, 2] = 0

plt.subplot(2, 3, 5)
plt.imshow(g)
plt.title("G")
plt.xticks([])
plt.yticks([])

b = face.copy()
# set green and red channels to 0
b[:, :, 1] = 0
b[:, :, 2] = 0

plt.subplot(2, 3, 6)
plt.imshow(b)
plt.title("B")
plt.xticks([])
plt.yticks([])

hsvFace = cv2.cvtColor(face, cv2.COLOR_RGB2HSV)

plt.subplot(2, 3, 3)
plt.imshow(hsvFace)
plt.title("Hsv")
plt.xticks([])
plt.yticks([])


plt.show()
