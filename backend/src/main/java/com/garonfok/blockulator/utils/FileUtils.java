package com.garonfok.blockulator.utils;

import java.io.File;

public class FileUtils {

  public static boolean isImageFile(File file) {
    String name = file.getName().toLowerCase();
    return name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg");
  }

}
