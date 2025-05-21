package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.RepairDto
import com.workshop.wsapi.services.RepairService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/repairs")
class RepairsController {

    @Autowired
    lateinit var repairService: RepairService

    @GetMapping("/{id}")
    fun getRepairById(@PathVariable id: Int): String {
        return "Get repair from $id"
    }

    @PutMapping("/{id}")
    fun editRepair(
        @PathVariable id: Long,
        @RequestBody repair: RepairDto,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Any> {
        return ResponseEntity.ok().body(repairService.editRepair(id, repair))
    }

    @DeleteMapping("/{id}")
    fun deleteRepair(@PathVariable id: Int): String {
        return "Deleted repair for user $id"
    }

}