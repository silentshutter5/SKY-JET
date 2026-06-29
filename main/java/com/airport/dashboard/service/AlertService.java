package com.airport.dashboard.service;

import com.airport.dashboard.model.Alert;
import com.airport.dashboard.model.AlertSeverity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class AlertService {

    private final List<Alert> alerts = new ArrayList<>();
    private final AtomicInteger idCounter = new AtomicInteger(41);

    public AlertService() {
        alerts.addAll(List.of(
            Alert.builder().alertId("ALT-0041").severity(AlertSeverity.CRITICAL).category("SECURITY")
                .title("Unattended bag — Concourse B")
                .description("Unattended baggage near Gate B7. TSA K-9 dispatched.")
                .location("Concourse B, Gate B7").timestamp(LocalDateTime.now().minusMinutes(5))
                .assignee("Officer Diaz").acknowledged(false).active(true).build(),

            Alert.builder().alertId("ALT-0040").severity(AlertSeverity.HIGH).category("FIRE")
                .title("Smoke detector triggered — Kitchen 3A")
                .description("Smoke alarm in Food Court kitchen 3A. Fire suppression engaged.")
                .location("Terminal A, Level 2").timestamp(LocalDateTime.now().minusMinutes(9))
                .assignee("Station 7 Fire").acknowledged(true).active(true).build(),

            Alert.builder().alertId("ALT-0039").severity(AlertSeverity.HIGH).category("ATC")
                .title("Communication loss — Flight UA-887")
                .description("Intermittent radio contact for 4 minutes. Re-established.")
                .location("ATC Tower").timestamp(LocalDateTime.now().minusMinutes(16))
                .assignee("Controller Brooks").acknowledged(true).active(true).build(),

            Alert.builder().alertId("ALT-0038").severity(AlertSeverity.MEDIUM).category("POWER")
                .title("UPS battery low — Server Room B2")
                .description("UPS below 20% threshold. Generator standby activated.")
                .location("IT Infrastructure B2").timestamp(LocalDateTime.now().minusMinutes(27))
                .assignee(null).acknowledged(false).active(true).build(),

            Alert.builder().alertId("ALT-0037").severity(AlertSeverity.MEDIUM).category("WEATHER")
                .title("Wind shear advisory in effect")
                .description("Pilot reports of wind shear on approach to Runway 28L.")
                .location("Runway 28L").timestamp(LocalDateTime.now().minusMinutes(32))
                .assignee("Meteorology").acknowledged(true).active(true).build()
        ));
    }

    public List<Alert> getAllActiveAlerts() {
        return alerts.stream().filter(Alert::isActive)
            .sorted(Comparator.comparingInt(a -> -a.getSeverity().getPriority()))
            .toList();
    }

    public List<Alert> getUnacknowledgedAlerts() {
        return alerts.stream().filter(Alert::isActive).filter(a -> !a.isAcknowledged()).toList();
    }

    public Optional<Alert> getAlertById(String id) {
        return alerts.stream().filter(a -> a.getAlertId().equals(id)).findFirst();
    }

    public boolean acknowledgeAlert(String alertId, String by) {
        return getAlertById(alertId).map(a -> { a.acknowledge(by); return true; }).orElse(false);
    }

    public boolean dismissAlert(String alertId) {
        return getAlertById(alertId).map(a -> { a.dismiss(); return true; }).orElse(false);
    }

    public Alert createAlert(AlertSeverity severity, String category, String title,
                              String description, String location) {
        String id = "ALT-" + String.format("%04d", idCounter.incrementAndGet());
        Alert alert = Alert.builder().alertId(id).severity(severity).category(category)
            .title(title).description(description).location(location)
            .timestamp(LocalDateTime.now()).acknowledged(false).active(true).build();
        alerts.add(alert);
        return alert;
    }

    public long countCriticalUnacked() {
        return alerts.stream().filter(Alert::isActive).filter(a -> !a.isAcknowledged())
            .filter(a -> a.getSeverity() == AlertSeverity.CRITICAL).count();
    }
}