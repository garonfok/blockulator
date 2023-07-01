package com.garonfok.blockulator.entities;

import java.awt.Color;
import java.awt.image.BufferedImage;

import java.io.Serializable;

import com.garonfok.blockulator.utils.ImageUtils;

public class BlockEntity implements Serializable {
  private String name;
  private Color color;
  private String image;

  public BlockEntity(String name, Color color, BufferedImage image) {
    this.name = formatName(name);
    this.color = color;
    this.image = ImageUtils.toBase64(image);
  }

  public String name() {
    return name;
  }

  public Color color() {
    return color;
  }

  public String image() {
    return image;
  }

  // Strip the file extension and convert to Title case with spaces
  // Also remove any words that say top or front
  // e.g. "fletching_table_front.png" -> "Fletching"
  private String formatName(String name) {
    String formattedName = name.substring(0, name.lastIndexOf('.'));
    formattedName = formattedName.replaceAll("_+$", "");

    return formattedName;
  }
}
