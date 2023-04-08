package com.luv2code.springbootlibrary.dao;

import com.luv2code.springbootlibrary.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface MessageRepository extends JpaRepository<Message, Long> {

    /*
     * Below endpoint is for specifically for user to see all the tickets (messages) uploaded by users
     */
    Page<Message> findByUserEmail(@RequestParam("user_email") String userEmail, Pageable pageable);

    /*
     * Below endpoint is for specifically for ADMIN to see all the tickets (messages) uploaded by users
     */
    Page<Message> findByClosed(@RequestParam("closed") boolean closed, Pageable pageable);
}
