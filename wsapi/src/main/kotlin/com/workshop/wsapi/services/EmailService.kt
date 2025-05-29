package com.workshop.wsapi.services

import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(
    private val emailSender: JavaMailSender
) {
    fun sendEmail(
        subject: String,
        text: String,
        targetEmail: String
    ) {
        val message = SimpleMailMessage()

        message.setSubject(subject)
        message.setText(text)
        message.setTo(targetEmail)

        emailSender.send(message)
    }
}