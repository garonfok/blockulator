package com.garonfok.blockulator.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.garonfok.blockulator.handlers.ResponseHandler;
import com.garonfok.blockulator.services.ImageService;

@RestController
@CrossOrigin(origins = "http://192.168.1.11:5173")
@RequestMapping("/api/image")
public class ImageController {

  private ImageService imageService;

  public ImageController() {
    this.imageService = new ImageService();
  }

  @PostMapping("/upload")
  public ResponseEntity<Object> convertImage(@RequestParam("file") MultipartFile file,
      @RequestParam("width") int width, @RequestParam("height") int height) {

    try {
      Object matchingBlocks = imageService.convertImage(file, width, height);
      return ResponseHandler.generateResponse("Successfully converted image", HttpStatus.OK, matchingBlocks);
    } catch (Exception e) {
      return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
    }
  }

  @PostMapping("/downsample")
  public ResponseEntity<Object> downsample(@RequestParam("file") MultipartFile file,
      @RequestParam("width") int width, @RequestParam("height") int height) {
    try {
      Object downsampledImage = imageService.downsampleImage(file, width, height);
      return ResponseHandler.generateResponse("Successfully downsampled image", HttpStatus.OK, downsampledImage);
    } catch (Exception e) {
      return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
    }
  }
}
