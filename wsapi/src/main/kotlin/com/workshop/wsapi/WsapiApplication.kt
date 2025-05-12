package com.workshop.wsapi

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class WsapiApplication

fun main(args: Array<String>) {
	runApplication<WsapiApplication>(*args)
}
