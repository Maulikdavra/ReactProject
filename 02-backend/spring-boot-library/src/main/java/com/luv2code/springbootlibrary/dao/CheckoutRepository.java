package com.luv2code.springbootlibrary.dao;

import com.luv2code.springbootlibrary.entity.checkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<checkout, Long> {

    checkout findByUserEmailAndBookId(String userEmail, Long bookId);

    List<checkout> findBooksByUserEmail(String userEmail);

}
