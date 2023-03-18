package com.luv2code.springbootlibrary.requestmodels;

import lombok.Data;
import java.util.Optional;

 /*
  * The ReviewRequest is going to be the object that the client side; react, is going to send to us the back the object
  *
 */
@Data
public class ReviewRequest {

    private double rating;

    private Long bookId;

    private Optional<String> reviewDescription;
}
