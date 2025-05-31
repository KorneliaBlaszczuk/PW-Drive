package com.workshop.wsapi.models

class Raport(
    val visit: Visit,
    val repairs: List<Repair>,
    val mileage: HistoryOfChange?,
    val inspectionDate: HistoryOfChange?,
)