package com.workshop.wsapi.services

import com.workshop.wsapi.models.OpeningHour
import com.workshop.wsapi.repositories.OpeningHoursRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service


@Service
class OpeningHoursService {

    @Autowired
    lateinit var openingHoursRepository: OpeningHoursRepository


    fun editOpeningHours(openingHour: OpeningHour): ResponseEntity<Any> {
        return ResponseEntity.ok().body(openingHoursRepository.save(openingHour))
    }

    fun getHours(): ResponseEntity<List<OpeningHour>> {
        return ResponseEntity.ok().body(openingHoursRepository.getHours())
    }
}