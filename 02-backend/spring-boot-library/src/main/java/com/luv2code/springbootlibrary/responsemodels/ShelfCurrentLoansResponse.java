package com.luv2code.springbootlibrary.responsemodels;

/*
 * The idea behind creating this special class, is that we will be sending a response from our spring-boot application to react frontend,
 * We have another special class: "ReviewRequest" class, which was getting response object from react frontend.
 */

import com.luv2code.springbootlibrary.entity.Book;
import lombok.Data;

@Data
public class ShelfCurrentLoansResponse {

    private Book book;
    private int daysLeft;

    public ShelfCurrentLoansResponse(Book book, int daysLeft){
        this.book = book;
        this.daysLeft = daysLeft;
    }
}
