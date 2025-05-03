package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.Service
import com.workshop.wsapi.models.Visit
import org.springframework.data.jpa.repository.JpaRepository

import org.springframework.stereotype.Repository


@Repository
interface ServiceRepository : JpaRepository<Service, Long> {


}