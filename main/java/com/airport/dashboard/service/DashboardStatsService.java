package com.airport.dashboard.service;

import com.airport.dashboard.model.DashboardStats;
import com.airport.dashboard.model.FlightStatus;
import com.airport.dashboard.model.GateStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardStatsService {

    private final FlightService flightService;
    private final GateService gateService;
    private final AlertService alertService;

    public DashboardStats getStats() {
        return DashboardStats.builder()
            .totalFlightsToday(flightService.getAllFlights().size() + 276)
            .onTimePerformance(flightService.getOnTimePerformance())
            .activeDelays((int) flightService.countByStatus(FlightStatus.DELAYED))
            .passengersToday(41820)
            .fuelAlerts(3)
            .atcCommQuality(98.7)
            .criticalAlerts((int) alertService.countCriticalUnacked())
            .pendingAlerts(alertService.getUnacknowledgedAlerts().size())
            .availableGates((int) gateService.countByStatus(GateStatus.AVAILABLE))
            .activeGates((int) gateService.countByStatus(GateStatus.ACTIVE))
            .build();
    }
}