package com.airport.dashboard.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStats {
    private int totalFlightsToday;
    private double onTimePerformance;
    private int activeDelays;
    private int passengersToday;
    private int fuelAlerts;
    private double atcCommQuality;
    private int criticalAlerts;
    private int pendingAlerts;
    private int availableGates;
    private int activeGates;
}