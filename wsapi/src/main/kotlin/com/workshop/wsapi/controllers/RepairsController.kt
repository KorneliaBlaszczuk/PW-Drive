package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.Repair
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/repairs")
class RepairsController {

    @GetMapping("/{id}")
    fun getRepairById(@PathVariable id: Int): String {
        return "Get repair from $id"
    }
    

    @PutMapping("/{id}")
    fun editRepairById(@PathVariable id: Int, @RequestBody @Validated repair: Repair): String {
        return "Edited repair for user $id"
    }

    @DeleteMapping("/{id}")
    fun deleteRepair(@PathVariable id: Int): String {
        return "Deleted repair for user $id"
    }

}