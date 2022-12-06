import cv2
import numpy as np
from matplotlib import pyplot as plt

jpg = cv2.imread("ATU.jpg")
duck = cv2.imread("Duck.jpg")


gray_duck = cv2.cvtColor(duck, cv2.COLOR_BGR2GRAY)


img = cv2.cvtColor(jpg, cv2.COLOR_BGR2RGB)

plt.subplot(3, 4, 1)
plt.imshow(img, cmap="gray")
plt.title("Original")
plt.xticks([])
plt.yticks([])

gray_image = cv2.cvtColor(jpg, cv2.COLOR_BGR2GRAY)

plt.subplot(3, 4, 2)
plt.imshow(gray_image, cmap="gray")
plt.title("GrayScale")
plt.xticks([])
plt.yticks([])

imgBlur3 = cv2.GaussianBlur(gray_image, (3, 3), 0)

plt.subplot(3, 4, 3)
plt.imshow(imgBlur3, cmap="gray")
plt.title("Blur 3x3")
plt.xticks([])
plt.yticks([])

imgBlur13 = cv2.GaussianBlur(gray_image, (13, 13), 0)

plt.subplot(3, 4, 4)
plt.imshow(imgBlur13, cmap="gray")
plt.title("Blur 13x13")
plt.xticks([])
plt.yticks([])


sobelHorizontal = cv2.Sobel(gray_image, cv2.CV_32F, 1, 0, ksize=5)  # x dir
plt.subplot(3, 4, 5)
plt.imshow(sobelHorizontal, cmap="gray")
plt.title("Sobel X")
plt.xticks([])
plt.yticks([])


sobelVertical = cv2.Sobel(gray_image, cv2.CV_32F, 0, 1, ksize=5)  # y dir
plt.subplot(3, 4, 6)
plt.imshow(sobelVertical, cmap="gray")
plt.title("Sobel Y")
plt.xticks([])
plt.yticks([])


sobbleBoth = cv2.add(sobelHorizontal, sobelVertical)
plt.subplot(3, 4, 7)
plt.imshow(sobbleBoth, cmap="gray")
plt.title("Sobel Both")
plt.xticks([])
plt.yticks([])


canny = cv2.Canny(gray_image, 90, 300)
plt.subplot(3, 4, 8)
plt.imshow(canny, cmap="gray")
plt.title("Canny")
plt.xticks([])
plt.yticks([])


duck = cv2.Canny(gray_duck, 150, 100)
plt.subplot(3, 4, 9)
plt.imshow(duck, cmap="gray")
plt.title("Duck")
plt.xticks([])
plt.yticks([])

clippedImg = sobbleBoth

for i in range(0, clippedImg.shape[0]):
    for j in range(0, clippedImg.shape[1]):
        pixel = clippedImg[i, j]
        if pixel < 2000:
            clippedImg.itemset(i, j, 0)
        else:
            clippedImg.itemset(i, j, 1)

plt.subplot(3, 4, 10)
plt.imshow(clippedImg, cmap="gray")
plt.title("Clip Range")
plt.xticks([])
plt.yticks([])

edgeImg = np.zeros((gray_image.shape[0], gray_image.shape[1]), np.uint8)

for i in range(0, gray_image.shape[0]):
    for j in range(0, gray_image.shape[1]):
        pixelHorA = gray_image.item(i, j)
        if i < gray_image.shape[0] - 1:
            pixelHorB = gray_image.item(i + 1, j)
        else:
            pixelHorB = pixelHorA

        pixelVerA = gray_image.item(i, j)
        if j < gray_image.shape[1] - 1:
            pixelVerB = gray_image.item(i, j + 1)
        else:
            pixelVerB = pixelVerA

        edgeImg.itemset(i, j, np.abs((pixelHorA - pixelHorB) + (pixelVerA - pixelVerB)))

plt.subplot(3, 4, 11)
plt.imshow(edgeImg, cmap="gray")
plt.title("Custom Edge")
plt.xticks([])
plt.yticks([])

plt.show()
