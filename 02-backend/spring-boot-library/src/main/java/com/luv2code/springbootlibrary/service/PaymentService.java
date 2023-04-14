package com.luv2code.springbootlibrary.service;

import com.luv2code.springbootlibrary.dao.PaymentRepository;
import com.luv2code.springbootlibrary.entity.Payment;
import com.luv2code.springbootlibrary.requestmodels.PaymentInfoRequest;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    /*
     * Here we are Auto-wiring PaymentRepository with reference paymentRepository
     * passing the stripe.kep.secret to stripe.apiKey(via String secretKey) from application.properties
     */
    @Autowired
    public PaymentService(PaymentRepository paymentRepository, @Value("${stripe.key.secret}") String secretKey){
        this.paymentRepository = paymentRepository;
        Stripe.apiKey = secretKey;
    }

    /*
     * Below createPaymentIntent method is prebuilt by stripe inside PaymentIntent class.
     * In the below method, we are defining strings and values attached to it (here values are coming from react-frontend via PaymentInfoRequest class)
     * values holds information about "amount", "currency" , "payment_method_types"
     * later we pass all the information to stripe(using java object) using PaymentIntent class, provided by stripe
     */
    public PaymentIntent createPaymentIntent(PaymentInfoRequest paymentInfoRequest) throws StripeException {

        // Below is List which hold all the Strings - different types of payment method(card, apple pay, etc)
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String ,Object> params = new HashMap<>();
        params.put("amount", paymentInfoRequest.getAmount());
        params.put("currency", paymentInfoRequest.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);

        return PaymentIntent.create(params);
    }

    /*
     * Below stripePayment method is designed to validate the payment from user.
     * After a successful payment we are returning 200k status code and setting the amount to 00.00
     */
    public ResponseEntity<String> stripePayment(String userEmail) throws Exception{
        Payment payment = paymentRepository.findByUserEmail(userEmail);
        if(payment == null){
            throw new Exception("Payment information is missing!");
        }
        payment.setAmount(00.00);
        paymentRepository.save(payment);
        return new ResponseEntity<>(HttpStatus.OK); //returning 200k status code on successfully response
    }
}
