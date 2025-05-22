package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.*
import com.workshop.wsapi.services.CarService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/cars")
class CarController {

    @Autowired
    lateinit var carService: CarService


    @GetMapping("/{id}")
    fun getCarById(@PathVariable id: Long, @AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<Car> {
        return ResponseEntity.ok().body(carService.getCar(id))
    }

    @PutMapping("/{id}")
    fun editCar(
        @PathVariable id: Long,
        @RequestBody @Validated car: CarDto,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Any> {
        val carAfterEdit = carService.editCar(id, car, userDetails)
        return if (carAfterEdit != null) {
            ResponseEntity.ok(carAfterEdit)
        } else {
            ResponseEntity.badRequest().body("The date is busy")
        }
    }

    @DeleteMapping("/{id}")
    fun deleteCar(@PathVariable id: Long, @AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<Any> {
        return ResponseEntity.ok().body(carService.deleteCar(id, userDetails))
    }

    @GetMapping("{id}/visits")
    fun getCarVisits(@PathVariable id: Long): Optional<List<Visit>> {
        return carService.getCarVisits(id)
    }

    @PostMapping("{id}/visit-service")
    fun addVisitWithService(
        @PathVariable id: Long,
        @RequestBody @Validated visit: ServiceVisitDTO,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Any> {
        val createdVisit = carService.addCarVisitWithService(id, visit, userDetails)
        return if (createdVisit != null) {
            ResponseEntity.ok(createdVisit)
        } else {
            ResponseEntity.badRequest().body("The date is busy")
        }
    }

    @PostMapping("{id}/visit-no-service")
    fun addVisitNoService(
        @PathVariable id: Long,
        @RequestBody @Validated visit: NoServiceVisitDTO,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Any> {
        val createdVisit = carService.addCarVisitNoService(id, visit, userDetails)
        return if (createdVisit != null) {
            ResponseEntity.ok(createdVisit)
        } else {
            ResponseEntity.badRequest().body("The date is busy")
        }
    }


    @PostMapping("{id}/history")
    fun addHistory(
        @PathVariable id: Long,
        @RequestBody @Validated history: History,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<HistoryOfChange> {
        return ResponseEntity.ok(history.accept(id, carService, userDetails))
    }

    @GetMapping("{id}/history")
    fun getHistory(
        @PathVariable id: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Optional<List<HistoryOfChange>>> {
        return ResponseEntity.ok(carService.getHistory(id, userDetails))
    }


}