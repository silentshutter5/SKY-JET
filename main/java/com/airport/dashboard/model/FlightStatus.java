package com.airport.dashboard.model;

public enum FlightStatus {
    ON_TIME("On Time"),
    DELAYED("Delayed"),
    BOARDING("Boarding"),
    IN_FLIGHT("In Flight"),
    LANDED("Landed"),
    CANCELLED("Cancelled");

    private final String displayName;

    FlightStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}