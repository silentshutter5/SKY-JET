package com.airport.dashboard.controller;

import com.airport.dashboard.model.Alert;
import com.airport.dashboard.model.AlertSeverity;
import com.airport.dashboard.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertApiController {

    private final AlertService alertService;

    @GetMapping
    public List<Alert> getAllAlerts() { return alertService.getAllActiveAlerts(); }

    @GetMapping("/unacknowledged")
    public List<Alert> getUnacknowledged() { return alertService.getUnacknowledgedAlerts(); }

    @PostMapping("/{alertId}/acknowledge")
    public ResponseEntity<Map<String, Object>> acknowledge(
            @PathVariable String alertId, @RequestBody Map<String, String> body) {
        boolean ok = alertService.acknowledgeAlert(alertId, body.getOrDefault("acknowledgedBy", "System"));
        return ok
            ? ResponseEntity.ok(Map.of("success", true, "alertId", alertId))
            : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{alertId}")
    public ResponseEntity<Map<String, Object>> dismiss(@PathVariable String alertId) {
        boolean ok = alertService.dismissAlert(alertId);
        return ok
            ? ResponseEntity.ok(Map.of("success", true, "alertId", alertId))
            : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Alert createAlert(@RequestBody Map<String, String> body) {
        return alertService.createAlert(
            AlertSeverity.valueOf(body.get("severity")),
            body.get("category"), body.get("title"),
            body.get("description"), body.get("location")
        );
    }
}