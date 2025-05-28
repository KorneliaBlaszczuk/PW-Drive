package com.workshop.wsapi.email

import org.springframework.context.annotation.Bean
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl


@Bean
fun javaMailSender(): JavaMailSender {
    val mail: JavaMailSenderImpl = JavaMailSenderImpl()
    mail.setHost("\${workshop.app.mail.host}")
    mail.setPort("\${workshop.app.mail.port}".toInt())
    mail.setUsername("\${workshop.app.mail.username}")
    mail.setPassword("\${workshop.app.mail.password}")
    val props = mail.getJavaMailProperties();
    props.put("mail.transport.protocol", "\${workshop.app.mail.protocol}");
    props.put("mail.smtp.auth", "\${workshop.app.mail.auth}");
    props.put("mail.smtp.sta'rttls.enable", "\${workshop.app.mail.starttls}");
    props.put("mail.debug", "\${workshop.app.mail.debug}");
    return mail

}