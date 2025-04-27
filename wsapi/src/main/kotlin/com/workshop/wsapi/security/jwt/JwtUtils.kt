package com.workshop.wsapi.security.jwt


import com.workshop.wsapi.security.services.UserDetailsImpl
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.UnsupportedJwtException
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import java.security.Key
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtUtils {
    @Value("\${workshop.app.jwtSecret}")
    private val jwtSecret: String? = null

    @Value("\${workshop.app.jwtExpirationMs}")
    private val jwtExpirationMs = 0

    private fun key(): Key {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret))
    }

    fun generateJwtToken(authentication: Authentication): String {
        val userPrincipal = authentication.principal as UserDetailsImpl

        return Jwts.builder()
            .claims()
            .subject((userPrincipal.username))
            .issuedAt(Date())
            .expiration(Date((Date()).time + jwtExpirationMs))
            .and()
            .signWith(key())
            .compact()
    }


    fun getUserNameFromJwtToken(token: String?): String {
        return Jwts.parser()
            .verifyWith(key() as SecretKey)
            .build()
            .parseSignedClaims(token)
            .payload.subject
    }

    fun validateJwtToken(authToken: String?): Boolean {
        try {
            Jwts.parser()
                .verifyWith(key() as SecretKey)
                .build().parseSignedClaims(authToken)
            return true
        } catch (e: MalformedJwtException) {
            logger.error("Invalid JWT token: {}", e.message)
        } catch (e: ExpiredJwtException) {
            logger.error("JWT token is expired: {}", e.message)
        } catch (e: UnsupportedJwtException) {
            logger.error("JWT token is unsupported: {}", e.message)
        } catch (e: IllegalArgumentException) {
            logger.error("JWT claims string is empty: {}", e.message)
        }

        return false
    }

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(JwtUtils::class.java)
    }
}