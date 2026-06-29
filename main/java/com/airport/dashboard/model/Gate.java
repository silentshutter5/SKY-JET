package com.airport.dashboard.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Gate {
    private String gateId;
    private String terminal;
    private GateStatus status;
    private String assignedFlightId;
    private String assignedAirline;
    private String destination;
    private String departureTime;
    private Integer passengerCount;
    private Integer turnaroundMinutes;
    private String gateAgent;
    private String aircraftType;

    public boolean hasActiveFlight() {
        return assignedFlightId != null && !assignedFlightId.isBlank();
    }
}