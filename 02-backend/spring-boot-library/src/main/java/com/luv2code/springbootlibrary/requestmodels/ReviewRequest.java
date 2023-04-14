package com.luv2code.springbootlibrary.requestmodels;

import lombok.Data;
import java.util.Optional;

 /*
  * The idea behind creating this ReviewRequest is to store and process the information(objects) that react-frontend is going to send spring-boot when making an api call.
  * This is the best way to pass information(object's holding value) to our controller and service.
  */
@Data
public class ReviewRequest {

    private double rating;

    private Long bookId;

    private Optional<String> reviewDescription;
}
