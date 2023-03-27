package com.luv2code.springbootlibrary.service;

import com.luv2code.springbootlibrary.dao.BookRepository;
import com.luv2code.springbootlibrary.dao.CheckoutRepository;
import com.luv2code.springbootlibrary.entity.Book;
import com.luv2code.springbootlibrary.entity.checkout;
import com.luv2code.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CheckoutRepository checkoutRepository;

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);
        checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        // Here we are making a validation to check out only one book at a time
        if (book.isEmpty() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book doesn't exit or already checked out by user");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        checkout checkout = new checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId());

        checkoutRepository.save(checkout);

        return book.get();
    }

    /*
     * The idea behind creating the below method is to verify if the book is already checked out by user
     *
     */
    public boolean checkoutBookByUser(String userEmail, Long bookId){
        checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(validateCheckout!=null){
            return true;
        }else{
            return false;
        }
    }

    public int currentLoansCount(String userEmail){
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {

        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();
        List<checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
        List<Long> bookIdList = new ArrayList<>();

        // getting all the bookId's from booklist, which we received from checkoutlist
        for (checkout i : checkoutList) {
            bookIdList.add(i.getBookId());
        }

        // Need to select all the books based on the book ID's
        List<Book> books = bookRepository.findBookByBookIds(bookIdList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for(Book book: books){
            Optional<checkout> checkout = checkoutList.stream()
                    .filter(x -> x.getBookId() == book.getId()).findFirst();

            if(checkout.isPresent()){
                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long difference_In_Time = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);
                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int)difference_In_Time));
            }
        }
        return  shelfCurrentLoansResponses;
    }

    public void returnBook (String userEmail, Long bookId) throws Exception{

        Optional<Book> book = bookRepository.findById(bookId);
        checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(!book.isPresent() || validateCheckout == null){
            throw new Exception("Book does not exist or not checked out by user");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);

        bookRepository.save(book.get());
        checkoutRepository.deleteById(validateCheckout.getId());

    }
}
