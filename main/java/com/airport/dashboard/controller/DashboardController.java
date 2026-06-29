package com.airport.dashboard.controller;

import com.airport.dashboard.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class DashboardController {

    private final FlightService flightService;
    private final GateService gateService;
    private final AlertService alertService;
    private final DashboardStatsService statsService;

    @GetMapping("/")
    public String dashboard(Model model) {
        model.addAttribute("stats", statsService.getStats());
        model.addAttribute("flights", flightService.getAllFlights());
        model.addAttribute("gates", gateService.getAllGates());
        model.addAttribute("alerts", alertService.getAllActiveAlerts());
        model.addAttribute("airportCode", "KORD");
        model.addAttribute("airportName", "O'Hare International Airport");
        return "dashboard";
    }
}