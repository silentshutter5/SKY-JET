package com.airport.dashboard.controller;

import com.airport.dashboard.model.Flight;
import com.airport.dashboard.model.FlightStatus;
import com.airport.dashboard.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightApiController {

    private final FlightService flightService;

    @GetMapping
    public List<Flight> getAllFlights() { return flightService.getAllFlights(); }

    @GetMapping("/{flightId}")
    public ResponseEntity<Flight> getFlight(@PathVariable String flightId) {
        return flightService.getFlightById(flightId)
            .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public List<Flight> getByStatus(@PathVariable FlightStatus status) {
        return flightService.getFlightsByStatus(status);
    }

    @PatchMapping("/{flightId}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable String flightId, @RequestBody Map<String, String> body) {
        try {
            FlightStatus status = FlightStatus.valueOf(body.get("status"));
            boolean updated = flightService.updateFlightStatus(flightId, status);
            return updated
                ? ResponseEntity.ok(Map.of("success", true, "flightId", flightId))
                : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
        }
    }

    @GetMapping("/stats/performance")
    public Map<String, Object> getPerformanceStats() {
        return Map.of(
            "onTimePerformance", flightService.getOnTimePerformance(),
            "totalFlights", flightService.getAllFlights().size(),
            "delayed", flightService.countByStatus(FlightStatus.DELAYED),
            "cancelled", flightService.countByStatus(FlightStatus.CANCELLED),
            "inFlight", flightService.countByStatus(FlightStatus.IN_FLIGHT)
        );
    }
}