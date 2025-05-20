package com.workshop.wsapi.services

import com.workshop.wsapi.models.Repair
import com.workshop.wsapi.models.RepairDto
import com.workshop.wsapi.repositories.RepairRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


@Service
class RepairService {


    @Autowired
    lateinit var repairRepository: RepairRepository

    fun editRepair(id: Long, repairDto: RepairDto): Repair {
        val oldRepair = repairRepository.findById(id).orElseThrow {
            IllegalArgumentException("visit not found with id $id")

        }
        val newRepair = Repair(
            id = oldRepair.id, description = repairDto.description, price = repairDto.price, visit = oldRepair.visit
        )
        return repairRepository.save(newRepair)
    }
}