package com.garonfok.blockulator.utils;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

import javax.imageio.ImageIO;

public class ImageUtils {

  public static Color getAverageColor(BufferedImage image) {
    int width = image.getWidth();
    int height = image.getHeight();
    int totalPixels = width * height;
    int red = 0;
    int green = 0;
    int blue = 0;

    for (int x = 0; x < width; x++) {
      for (int y = 0; y < height; y++) {
        Color pixelColor = new Color(image.getRGB(x, y));
        red += pixelColor.getRed();
        green += pixelColor.getGreen();
        blue += pixelColor.getBlue();
      }
    }
    red /= totalPixels;
    green /= totalPixels;
    blue /= totalPixels;
    return new Color(red, green, blue);
  }

  public static Color[][] getPixelColors(BufferedImage image) {
    int width = image.getWidth();
    int height = image.getHeight();

    Color pixelColors[][] = new Color[width][height];

    for (int x = 0; x < width; x++) {
      for (int y = 0; y < height; y++) {
        pixelColors[x][y] = new Color(image.getRGB(x, y), true);
        // System.out.println("Alpha for col " + x + ", row " + y + ": " + pixelColors[x][y].getAlpha());
      }
    }

    return pixelColors;
  }

  public static BufferedImage downsample(BufferedImage image, int height, int width) {
    BufferedImage resizedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);

    Graphics2D g = resizedImage.createGraphics();
    g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_NEAREST_NEIGHBOR);
    g.drawImage(image, 0, 0, width, height, null);
    g.dispose();
    return resizedImage;
  }

  public static double getColorDistance(Color color1, Color color2) {
    int r1 = color1.getRed();
    int g1 = color1.getGreen();
    int b1 = color1.getBlue();
    int r2 = color2.getRed();
    int g2 = color2.getGreen();
    int b2 = color2.getBlue();

    double distance = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    return distance;
  }

  public static String toBase64(BufferedImage image) {
    try {
      if (image == null) {
        return null;
      }
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      ImageIO.write(image, "png", baos);
      return Base64.getEncoder().encodeToString(baos.toByteArray());
    } catch (IOException e) {
      e.printStackTrace();
      return null;
    }
  }
}
