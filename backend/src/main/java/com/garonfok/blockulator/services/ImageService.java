package com.garonfok.blockulator.services;

import java.awt.Color;

import java.awt.image.BufferedImage;

import java.io.IOException;

import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;

import org.springframework.web.multipart.MultipartFile;

import com.garonfok.blockulator.entities.BlockEntity;
import com.garonfok.blockulator.utils.ImageUtils;
import com.garonfok.blockulator.utils.MinecraftUtils;

public class ImageService {
  public Object convertImage(MultipartFile file, int width, int height) {

    BufferedImage image = null;
    try {
      image = ImageIO.read(file.getInputStream());
    } catch (IOException e) {
      throw new IllegalArgumentException("Invalid image provided. Please provide a valid image file.");
    }

    BufferedImage downsampledImage = ImageUtils.downsample(image, height, width);
    Color[][] pixelColors = ImageUtils.getPixelColors(downsampledImage);


    Object[][] matchingBlocks = new Object[height][width];

    MinecraftUtils minecraftUtils = new MinecraftUtils();

    for (int x = 0; x < width; x++) {
      for (int y = 0; y < height; y++) {
        BlockEntity matchingBlock = minecraftUtils.getNearestBlock(pixelColors[x][y]);
        Map<String, Object> block = new HashMap<String, Object>();
        block.put("name", matchingBlock.name());
        block.put("image", matchingBlock.image());
        matchingBlocks[y][x] = block;
      }
    }

    return matchingBlocks;

  }

  public Object downsampleImage(MultipartFile file, int width, int height) {
    BufferedImage image = null;
    try {
      image = ImageIO.read(file.getInputStream());
    } catch (IOException e) {
      throw new IllegalArgumentException("Invalid image provided. Please provide a valid image file.");
    }

    BufferedImage downsampledImage = ImageUtils.downsample(image, height, width);

    String downsampledImageBytes = ImageUtils.toBase64(downsampledImage);

    return downsampledImageBytes;
  }
}
