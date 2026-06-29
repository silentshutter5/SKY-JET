package com.airport.dashboard.model;

public enum AlertSeverity {
    CRITICAL(4),
    HIGH(3),
    MEDIUM(2),
    LOW(1);

    private final int priority;

    AlertSeverity(int priority) {
        this.priority = priority;
    }

    public int getPriority() {
        return priority;
    }
}