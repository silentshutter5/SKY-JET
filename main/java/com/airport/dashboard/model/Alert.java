package com.airport.dashboard.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
    private String alertId;
    private AlertSeverity severity;
    private String category;
    private String title;
    private String description;
    private String location;
    private LocalDateTime timestamp;
    private String assignee;
    private boolean acknowledged;
    private boolean active;

    public void acknowledge(String acknowledgedBy) {
        this.acknowledged = true;
        this.assignee = acknowledgedBy;
    }

    public void dismiss() {
        this.active = false;
    }
}