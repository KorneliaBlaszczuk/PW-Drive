package com.workshop.wsapi.email

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl

@Configuration
class MailConfig {

    @Value("\${workshop.app.mail.host}")
    private lateinit var host: String

    @Value("\${workshop.app.mail.port}")
    private var port: Int = 0

    @Value("\${workshop.app.mail.username}")
    private lateinit var username: String

    @Value("\${workshop.app.mail.password}")
    private lateinit var password: String

    @Value("\${workshop.app.mail.protocol}")
    private lateinit var protocol: String

    @Value("\${workshop.app.mail.auth}")
    private lateinit var auth: String

    @Value("\${workshop.app.mail.starttls}")
    private lateinit var starttls: String

    @Value("\${workshop.app.mail.debug}")
    private lateinit var debug: String

    @Bean
    fun javaMailSender(): JavaMailSender {
        val mailSender = JavaMailSenderImpl()
        mailSender.host = host
        mailSender.port = port
        mailSender.username = username
        mailSender.password = password

        val props = mailSender.javaMailProperties
        props["mail.transport.protocol"] = protocol
        props["mail.smtp.auth"] = auth
        props["mail.smtp.starttls.enable"] = starttls
        props["mail.debug"] = debug

        return mailSender
    }

}