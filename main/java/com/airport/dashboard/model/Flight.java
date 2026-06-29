package com.airport.dashboard.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Flight {
    private String flightId;
    private String airline;
    private String origin;
    private String destination;
    private FlightStatus status;
    private String gate;
    private LocalTime scheduledDeparture;
    private LocalTime scheduledArrival;
    private String aircraftType;
    private int passengerCount;
    private int passengerCapacity;
    private String pilotName;
    private int delayMinutes;

    public double getLoadFactor() {
        if (passengerCapacity == 0) return 0;
        return (double) passengerCount / passengerCapacity * 100;
    }
}