package com.luv2code.springbootlibrary.requestmodels;

import lombok.Data;

/*
 * The idea behind creating this PaymentInfoRequest is to store and process the information(objects) that react-frontend
 * will be sending to spring-boot.
 * This is the best way to pass information(object's holding value) to our controller and service.
 */
@Data
public class PaymentInfoRequest {

    private int amount;

    private String currency;

    private String receiptEmail;
}
