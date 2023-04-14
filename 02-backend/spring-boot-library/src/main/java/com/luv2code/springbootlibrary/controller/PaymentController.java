package com.luv2code.springbootlibrary.controller;

import com.luv2code.springbootlibrary.requestmodels.PaymentInfoRequest;
import com.luv2code.springbootlibrary.service.PaymentService;
import com.luv2code.springbootlibrary.utils.ExtractJWT;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000") //React application will be able to call this controller without getting any error
@RestController
@RequestMapping("api/payment/secure")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /*
     * Below createPaymentIntent is designed to accept paymentInfoRequest coming from react (amount, currency and payment_type_method).
     * Later we are storing all the information into a reference of PaymentIntent class(built in class by stripe)
     * Finally converting the formatting the information into JSON
     */
    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfoRequest  paymentInfoRequest) throws StripeException{
     PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfoRequest);
     String paymentString = paymentIntent.toJson();

     return new ResponseEntity<>(paymentString, HttpStatus.OK);
    }

    /*
     * Below stripePaymentComplete method is designed for validating the userEmail by calling out stripePayment method to modify the amount value after successful response.
     */
    @PutMapping("/payment-complete")
    public ResponseEntity<String> stripePaymentComplete(@RequestHeader(value="Authorization") String token) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        if(userEmail == null){
            throw new Exception("user email is missing!");
        }
        return paymentService.stripePayment(userEmail);
    }
}
