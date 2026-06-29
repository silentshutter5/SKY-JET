package com.airport.dashboard.controller;

import com.airport.dashboard.model.Gate;
import com.airport.dashboard.service.GateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gates")
@RequiredArgsConstructor
public class GateApiController {

    private final GateService gateService;

    @GetMapping
    public List<Gate> getAllGates() { return gateService.getAllGates(); }

    @GetMapping("/terminal/{terminal}")
    public List<Gate> getByTerminal(@PathVariable String terminal) {
        return gateService.getGatesByTerminal(terminal);
    }

    @GetMapping("/{gateId}")
    public ResponseEntity<Gate> getGate(@PathVariable String gateId) {
        return gateService.getGateById(gateId)
            .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{gateId}/assign")
    public ResponseEntity<Map<String, Object>> assignFlight(
            @PathVariable String gateId, @RequestBody Map<String, String> body) {
        String flightId = body.get("flightId");
        boolean assigned = gateService.assignFlight(gateId, flightId);
        return assigned
            ? ResponseEntity.ok(Map.of("success", true, "gateId", gateId, "flightId", flightId))
            : ResponseEntity.badRequest().body(Map.of("error", "Gate not available or not found"));
    }
}