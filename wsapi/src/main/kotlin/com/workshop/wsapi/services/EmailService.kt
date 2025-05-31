package com.workshop.wsapi.services

import jakarta.mail.internet.MimeMessage
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.springframework.util.ResourceUtils

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

        message.subject = subject
        message.text = text
        message.setTo(targetEmail)

        emailSender.send(message)
    }

    fun sendRaportNotification(targetEmail: String) {
        val message: MimeMessage = emailSender.createMimeMessage();
        val helper: MimeMessageHelper = MimeMessageHelper(message, true, "UTF-8")
        helper.setTo(targetEmail)
        helper.setSubject("Nowy zmiany w raporcie dla twojej wizyty")

        val htmlContent = """
        <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; padding: 30px 20px 20px;">
                    <img src='cid:logo' alt="Logo" style="max-width: 200px; height: auto;">
                </div>
                
                <div style="padding: 0 30px 30px;">
                    <h1 style="color: #333; margin-bottom: 20px;">Witaj!</h1>
                    
                    <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                        Informujemy, że raport dotyczący Twojej wizyty w naszym serwisie został zaktualizowany.
                    </p>
                    
                    <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
                        Aby sprawdzić szczegóły aktualizacji oraz pełny raport z wykonanych usług, 
                        zapraszamy do odwiedzenia naszej strony internetowej.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/profile" 
                           style="background-color: #2563eb; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold; 
                                  display: inline-block;">
                            Sprawdź raport online
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                    
                    <p style="color: #777; font-size: 14px; line-height: 1.5;">
                        Dziękujemy za zaufanie i korzystanie z naszych usług.<br>
                        W razie pytań, prosimy o kontakt.
                    </p>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                        Ta wiadomość została wysłana automatycznie. Prosimy nie odpowiadać na ten email.
                    </p>
                </div>
            </div>
        </body>
        </html>
    """.trimIndent()

        helper.setText(htmlContent, true)
        helper.addInline("logo", ResourceUtils.getFile("classpath:mail/attachments/email_logo_black.png"));

        emailSender.send(message);
    }
}