package com.workshop.wsapi.services

import com.workshop.wsapi.repositories.RepairRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


@Service
class RepairService {


    @Autowired
    lateinit var repairRepository: RepairRepository


}