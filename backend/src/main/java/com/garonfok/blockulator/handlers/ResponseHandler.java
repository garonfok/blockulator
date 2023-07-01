package com.garonfok.blockulator.handlers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseHandler {
  public static ResponseEntity<Object> generateResponse(String message, HttpStatus status, Object responseObj) {
    Map<String, Object> response = new HashMap<String, Object>();
    response.put("message", message);
    response.put("status", status.value());
    response.put("data", responseObj);

    return new ResponseEntity<Object>(response, status);
  }
}
