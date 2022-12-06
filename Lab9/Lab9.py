import cv2
import numpy as np
from matplotlib import pyplot as plt

import random as rng


width = 3
height = 3

atu1 = cv2.cvtColor(cv2.imread("ATU1.jpg"), cv2.COLOR_BGR2RGB)
atu2 = cv2.cvtColor(cv2.imread("ATU2.jpg"), cv2.COLOR_BGR2RGB)

img1 = cv2.cvtColor(cv2.imread("Duck.jpg"), cv2.COLOR_BGR2RGB)

gray = cv2.cvtColor(img1, cv2.COLOR_RGB2GRAY)

plt.subplot(width, height, 1)
plt.imshow(gray, cmap="gray")
plt.title("img1_gray")
plt.xticks([])
plt.yticks([])

dst = cv2.cornerHarris(gray, 2, 3, 0.04)


plt.subplot(width, height, 2)
plt.imshow(dst, cmap="gray")
plt.title("dst")
plt.xticks([])
plt.yticks([])

imgHarris = img1.copy()

threshold = 0.1
# number between 0 and 1
for i in range(len(dst)):
    for j in range(len(dst[i])):
        if dst[i][j] > (threshold * dst.max()):
            cv2.circle(imgHarris, (j, i), 10, (255, 0, 0), 2)

plt.subplot(width, height, 3)
plt.imshow(imgHarris)
plt.title("imgHarris")
plt.xticks([])
plt.yticks([])

imgShiTomasi = img1.copy()

corners = cv2.goodFeaturesToTrack(gray, 100, 0.01, 10)

for i in corners:
    x, y = i.ravel()
    cv2.circle(imgShiTomasi, (int(x), int(y)), 10, (0, 0, 255), 2)

plt.subplot(width, height, 4)
plt.imshow(imgShiTomasi)
plt.title("imgShiTomasi")
plt.xticks([])
plt.yticks([])

orbImg = img1.copy()


# Initiate ORB detector
orb = cv2.ORB_create()
# find the keypoints with ORB
kp = orb.detect(gray, None)
# compute the descriptors with ORB
kp, des = orb.compute(gray, kp)
# draw only keypoints location,not size and orientation
img2 = cv2.drawKeypoints(orbImg, kp, None, color=(0, 255, 0), flags=0)

plt.subplot(width, height, 5)
plt.imshow(img2)
plt.title("img2")
plt.xticks([])
plt.yticks([])


# find the keypoints and descriptors with ORB
kp1, des1 = orb.detectAndCompute(atu1, None)
kp2, des2 = orb.detectAndCompute(atu2, None)

# create BFMatcher object
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
# Match descriptors.
matches = bf.match(des1, des2)
# Sort them in the order of their distance.
matches = sorted(matches, key=lambda x: x.distance)
# Draw first 10 matches.
img3 = cv2.drawMatches(
    atu1,
    kp1,
    atu2,
    kp2,
    matches[:10],
    None,
    flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS,
)


plt.subplot(width, height, 6)
plt.imshow(img3)
plt.title("diff")
plt.xticks([])
plt.yticks([])

threshold = 100

blur = cv2.blur(gray, (3, 3))

# Detect edges using Canny
canny_output = cv2.Canny(blur, threshold, threshold * 2)
# Find contours
contours, hierarchy = cv2.findContours(
    canny_output, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
)
# Draw contours
drawing = np.zeros((canny_output.shape[0], canny_output.shape[1], 3), dtype=np.uint8)
for i in range(len(contours)):
    color = (rng.randint(0, 256), rng.randint(0, 256), rng.randint(0, 256))
    cv2.drawContours(drawing, contours, i, color, 2, cv2.LINE_8, hierarchy, 0)

plt.subplot(width, height, 7)
plt.imshow(drawing)
plt.title("drawing")
plt.xticks([])
plt.yticks([])

plt.show()
