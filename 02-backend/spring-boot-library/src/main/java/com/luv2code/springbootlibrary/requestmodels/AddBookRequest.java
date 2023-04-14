package com.luv2code.springbootlibrary.requestmodels;

import lombok.Data;

/*
 * The idea behind creating this AddBookRequest is to store and process the information(objects) that react-frontend is going to send spring-boot when making an api call.
 * will be sending to spring-boot. * This is the best way to pass information(object's holding value) to our controller and service.
 */
@Data
public class AddBookRequest {

    private String title;

    private String author;

    private String description;

    private int copies;

    private String category;

    private String img;
}
