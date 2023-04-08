package com.luv2code.springbootlibrary.requestmodels;

import lombok.Data;

 /*
 * The AdminQuestionRequest is going to be the object that the client side; react, is going to send to us the back the object, and we will update the question from admin
 */

@Data
public class AdminQuestionRequest {

    private Long id;

    private String response;
}
