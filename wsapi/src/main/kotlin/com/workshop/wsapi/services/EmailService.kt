package com.workshop.wsapi.services

import jakarta.mail.internet.MimeMessage
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.io.ClassPathResource
import org.springframework.mail.MailException
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.retry.annotation.Backoff
import org.springframework.retry.annotation.Recover
import org.springframework.retry.annotation.Retryable
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine
import java.time.LocalDate


@Service
class EmailService(
    private val emailSender: JavaMailSender,
    private val templateEngine: SpringTemplateEngine
) {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(EmailService::class.java)
    }

    fun sendEmail(
        subject: String,
        text: String,
        targetEmail: String
    ) {
        val message = SimpleMailMessage()

        message.subject = subject
        message.text = text
        message.setTo(targetEmail)

        emailSender.send(message)
    }

    @Retryable(
        retryFor = [MailException::class],
        maxAttempts = 3,
        backoff = Backoff(delay = 3000)
    )
    @Async
    fun sendRaportNotification(
        username: String,
        visitDate: LocalDate,
        carName: String,
        serviceName: String,
        targetEmail: String
    ) {

        logger.info("Sending report notification email to: $targetEmail")

        val message: MimeMessage = emailSender.createMimeMessage()
        val helper = MimeMessageHelper(message, true, "UTF-8")
        helper.setTo(targetEmail)
        helper.setSubject("PW Drive - Nowe zmiany w raporcie dla twojej wizyty")

        val context = Context()
        context.setVariable("username", username)
        context.setVariable("visitDate", visitDate)
        context.setVariable("carName", carName)
        context.setVariable("serviceName", serviceName)
        context.setVariable("websiteUrl", "http://localhost:3000/profile")

        val htmlContent = templateEngine.process("mail/report_notification.html", context)

        helper.setText(htmlContent, true)

        val resource = ClassPathResource("mail/attachments/email_logo_black.png")
        helper.addInline("logo", resource)

        emailSender.send(message)
    }

    @Recover
    fun handleMailException(e: MailException): String {
        logger.error("Max attempts reached. Failed to send email after 3 attempts.")
        logger.error("Error message: {}", e.message)

        return "Max attempts reached. Failed to send email"
    }
}