package com.airport.dashboard.model;

public enum GateStatus {
    ACTIVE("Active"),
    BOARDING("Boarding"),
    AVAILABLE("Available"),
    MAINTENANCE("Maintenance"),
    DELAYED("Delayed");

    private final String displayName;

    GateStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}