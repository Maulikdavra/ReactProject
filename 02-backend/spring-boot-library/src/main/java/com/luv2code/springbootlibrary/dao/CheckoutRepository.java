package com.luv2code.springbootlibrary.dao;

import com.luv2code.springbootlibrary.entity.checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<checkout, Long> {

    checkout findByUserEmailAndBookId(String userEmail, Long bookId);

    List<checkout> findBooksByUserEmail(String userEmail);

    /*
     * The idea behind creating below query method is to delete a checked out book by user when it's deleted by admin
     * @Query is responsible to running the query based on the parameter.
     * @Modifying is responsible to updating the database record after the modification is done by a successful query.
     */
    @Modifying
    @Query("delete from checkout where book_id in :book_id")
    public void deleteAllByBookId(@Param("book_id") Long bookId);


}
