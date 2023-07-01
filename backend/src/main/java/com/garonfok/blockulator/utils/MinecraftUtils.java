package com.garonfok.blockulator.utils;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;

import javax.imageio.ImageIO;

import org.springframework.core.io.ClassPathResource;

import com.garonfok.blockulator.entities.BlockEntity;

public class MinecraftUtils {
  private HashSet<BlockEntity> blocks;
  private HashMap<Color, BlockEntity> colorMatches;

  public MinecraftUtils() {
    this.colorMatches = new HashMap<>();

    try {
      this.blocks = loadBlocks();
    } catch (IOException e) {
      e.printStackTrace();
      this.blocks = new HashSet<>();
    }
  }

  private HashSet<BlockEntity> loadBlocks() throws IOException {

    HashSet<BlockEntity> blocks = new HashSet<>();

    File[] files = new ClassPathResource("assets/blocks").getFile().listFiles();

    for (File file : files) {
      if (FileUtils.isImageFile(file)) {
        String blockName = file.getName();
        try {
          BufferedImage image = ImageIO.read(file);
          Color averageColor = ImageUtils.getAverageColor(image);
          blocks.add(new BlockEntity(blockName, averageColor, image));
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
    return blocks;
  }

  public BlockEntity getNearestBlock(Color color) {
    if (colorMatches.containsKey(color)) {
      return colorMatches.get(color);
    }
    // If transparent, return air block
    if (color.getAlpha() == 0) {
      return new BlockEntity("air.png", new Color(0, 0, 0, 0), null);
    }

    BlockEntity nearestBlock = blocks.iterator().next();
    double nearestDistance = Double.MAX_VALUE;

    for (BlockEntity block : blocks) {
      double distance = ImageUtils.getColorDistance(color, block.color());
      if (distance < nearestDistance) {
        nearestBlock = block;
        nearestDistance = distance;
      }
    }
    colorMatches.put(color, nearestBlock);
    return nearestBlock;
  }
}
