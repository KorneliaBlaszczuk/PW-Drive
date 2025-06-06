package com.workshop.wsapi.controllers

import com.workshop.wsapi.services.EmailService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*


/* TEST CONTROLLER - example on have to use authorization */

@CrossOrigin(origins = ["*"], maxAge = 3600)
@RestController
@RequestMapping("/api/test")
class TestController {


    @Autowired
    lateinit var emailService: EmailService

    @GetMapping("/all")
    fun allAccess(): String {
        return "Public Content."
    }

    @PostMapping("/email")
    fun sendEmail() {
        return emailService.sendEmail("test", "test2", "pwdrive12@gmail.com")
    }


    @GetMapping("/user")
    @PreAuthorize("hasAuthority('USER')")
    fun userAccess(): String {
        return "User Content."
    }


    @GetMapping("/workshop")
    @PreAuthorize("hasAuthority('WORKSHOP')")
    fun adminAccess(): String {
        return "Workshop Board."
    }
}