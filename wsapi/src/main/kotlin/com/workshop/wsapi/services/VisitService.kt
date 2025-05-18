package com.workshop.wsapi.services

import com.workshop.wsapi.models.AvailableSlotDTO
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.models.VisitDto
import com.workshop.wsapi.repositories.CarRepository
import com.workshop.wsapi.repositories.ServiceRepository
import com.workshop.wsapi.repositories.UserRepository
import com.workshop.wsapi.repositories.VisitRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.sql.Time
import java.time.LocalDateTime
import com.workshop.wsapi.models.Service as ServiceModel

@Service
class VisitService {

    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var userService: UserService

    @Autowired
    lateinit var carRepository: CarRepository

    @Autowired
    lateinit var visitRepository: VisitRepository

    @Autowired
    lateinit var serviceRepository: ServiceRepository

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(VisitService::class.java)
    }

    fun removeAbandonedReservations() {
        val fifteenMinutesAgo = LocalDateTime.now().minusMinutes(15)
        logger.info("Removing abandoned reservations past $fifteenMinutesAgo")
//        visitRepository.deleteAbandonedReservations(fifteenMinutesAgo)
    }

    fun findAvailableSlotsForService(
        startDate: LocalDateTime,
        endDate: LocalDateTime,
        serviceId: Long
    ): List<AvailableSlotDTO> {
        logger.info("findAvailableSlotsForService startDate: $startDate, endDate: $endDate, serviceId: $serviceId")
//        removeAbandonedReservations()

        val reservedVisits = visitRepository.findReservedVisitsBetweenDates(startDate, endDate)
        val service = serviceRepository.findById(serviceId).orElseThrow {
            NoSuchElementException("Service is not found")
        }

        return generateAvailableSlotsForService(startDate, endDate, service, reservedVisits)
    }

    fun generateAvailableSlotsForService(
        startDate: LocalDateTime,
        endDate: LocalDateTime,
        service: ServiceModel,
        reservedVisits: List<Visit>
    ): List<AvailableSlotDTO> {
        logger.info("Called generateAvailableSlotsForService")
        return listOf<AvailableSlotDTO>()
    }

    fun editVisit(id: Long, visit: VisitDto, userDetails: UserDetails): ResponseEntity<Any> {
        val oldVisit = visitRepository.findById(id).orElseThrow {
            IllegalArgumentException("Visit not found")
        }

        val car = oldVisit.car?.let {
            it.id?.let { it1 ->
                carRepository.findById(it1).orElseThrow {
                    IllegalArgumentException("Car not found")
                }
            }
        }
        val usr = car?.user?.id?.let {
            userRepository.findById(it).orElseThrow {
                IllegalArgumentException("User not found with id ${car.user.id}")
            }
        }
        val serv = visit.serviceId?.let {
            serviceRepository.findById(it).orElseThrow {
                IllegalArgumentException("Service not found")
            }
        }
        if (usr == null || usr.id != userService.getUserByUsername(userDetails.username).id) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only access visits from your own account")
        }

        val newVisit = Visit(
            id = id,
            service = serv,
            car = car,
            isReserved = visit.isReserved,
            time = visit.time ?: Time.valueOf("00:00:00"),
            date = visit.date,
            status = visit.status ?: "PENDING",
            comment = visit.comment
        )
        visitRepository.save(newVisit)
        return ResponseEntity.ok().body(newVisit)
    }

    fun deleteVisit(id: Long): ResponseEntity<Any> {
        return ResponseEntity.ok().body(visitRepository.deleteById(id))
    }

}
