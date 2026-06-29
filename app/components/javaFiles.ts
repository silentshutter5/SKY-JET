export interface JavaFile {
  path: string;
  content: string;
  language: "java" | "xml" | "properties" | "html";
}

const POM = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.5</version>
  </parent>
  <groupId>com.airport</groupId>
  <artifactId>airport-dashboard</artifactId>
  <version>1.0.0</version>
  <name>Airport Operations Dashboard</name>
  <properties>
    <java.version>21</java.version>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <configuration>
          <excludes>
            <exclude>
              <groupId>org.projectlombok</groupId>
              <artifactId>lombok</artifactId>
            </exclude>
          </excludes>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>`;

const APP_PROPERTIES = `server.port=8080
spring.application.name=airport-dashboard
spring.thymeleaf.cache=false
management.endpoints.web.exposure.include=health,info
airport.code=KORD
airport.name=O'Hare International Airport`;

const MAIN_CLASS = `package com.airport.dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AirportDashboardApplication {
    public static void main(String[] args) {
        SpringApplication.run(AirportDashboardApplication.class, args);
    }
}`;

const FLIGHT_STATUS_ENUM = `package com.airport.dashboard.model;

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
}`;

const FLIGHT_MODEL = `package com.airport.dashboard.model;

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
}`;

const GATE_STATUS_ENUM = `package com.airport.dashboard.model;

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
}`;

const GATE_MODEL = `package com.airport.dashboard.model;

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
}`;

const ALERT_SEVERITY_ENUM = `package com.airport.dashboard.model;

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
}`;

const ALERT_MODEL = `package com.airport.dashboard.model;

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
}`;

const DASHBOARD_STATS_MODEL = `package com.airport.dashboard.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStats {
    private int totalFlightsToday;
    private double onTimePerformance;
    private int activeDelays;
    private int passengersToday;
    private int fuelAlerts;
    private double atcCommQuality;
    private int criticalAlerts;
    private int pendingAlerts;
    private int availableGates;
    private int activeGates;
}`;

const FLIGHT_SERVICE = `package com.airport.dashboard.service;

import com.airport.dashboard.model.Flight;
import com.airport.dashboard.model.FlightStatus;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FlightService {

    private final List<Flight> flights = new ArrayList<>();

    public FlightService() {
        flights.addAll(List.of(
            Flight.builder().flightId("AA-2341").airline("American Airlines")
                .origin("JFK").destination("LAX").status(FlightStatus.ON_TIME).gate("A12")
                .scheduledDeparture(LocalTime.of(14, 30)).scheduledArrival(LocalTime.of(18, 45))
                .aircraftType("B737-800").passengerCount(162).passengerCapacity(189)
                .pilotName("Capt. Harrison").delayMinutes(0).build(),

            Flight.builder().flightId("UA-887").airline("United Airlines")
                .origin("ORD").destination("MIA").status(FlightStatus.DELAYED).gate("B7")
                .scheduledDeparture(LocalTime.of(14, 15)).scheduledArrival(LocalTime.of(18, 20))
                .aircraftType("A320").passengerCount(148).passengerCapacity(150)
                .pilotName("Capt. Rodriguez").delayMinutes(45).build(),

            Flight.builder().flightId("DL-1204").airline("Delta Air Lines")
                .origin("ATL").destination("SEA").status(FlightStatus.BOARDING).gate("C3")
                .scheduledDeparture(LocalTime.of(14, 45)).scheduledArrival(LocalTime.of(17, 55))
                .aircraftType("B757-200").passengerCount(183).passengerCapacity(200)
                .pilotName("Capt. Williams").delayMinutes(0).build(),

            Flight.builder().flightId("SW-5532").airline("Southwest Airlines")
                .origin("DEN").destination("PHX").status(FlightStatus.ON_TIME).gate("D18")
                .scheduledDeparture(LocalTime.of(15, 0)).scheduledArrival(LocalTime.of(16, 30))
                .aircraftType("B737-700").passengerCount(137).passengerCapacity(143)
                .pilotName("Capt. Johnson").delayMinutes(0).build(),

            Flight.builder().flightId("BA-294").airline("British Airways")
                .origin("LHR").destination("BOS").status(FlightStatus.LANDED).gate("E2")
                .scheduledDeparture(LocalTime.of(6, 15)).scheduledArrival(LocalTime.of(14, 10))
                .aircraftType("A380").passengerCount(412).passengerCapacity(469)
                .pilotName("Capt. Thompson").delayMinutes(0).build(),

            Flight.builder().flightId("AA-901").airline("American Airlines")
                .origin("DFW").destination("JFK").status(FlightStatus.CANCELLED).gate("A5")
                .scheduledDeparture(LocalTime.of(13, 50)).scheduledArrival(LocalTime.of(18, 15))
                .aircraftType("B777").passengerCount(0).passengerCapacity(312)
                .pilotName("—").delayMinutes(0).build(),

            Flight.builder().flightId("UA-442").airline("United Airlines")
                .origin("SFO").destination("ORD").status(FlightStatus.IN_FLIGHT).gate("B14")
                .scheduledDeparture(LocalTime.of(11, 0)).scheduledArrival(LocalTime.of(17, 30))
                .aircraftType("B787-9").passengerCount(248).passengerCapacity(296)
                .pilotName("Capt. Chen").delayMinutes(0).build(),

            Flight.builder().flightId("LH-456").airline("Lufthansa")
                .origin("FRA").destination("JFK").status(FlightStatus.ON_TIME).gate("F1")
                .scheduledDeparture(LocalTime.of(8, 20)).scheduledArrival(LocalTime.of(11, 45))
                .aircraftType("A350-900").passengerCount(290).passengerCapacity(324)
                .pilotName("Capt. Müller").delayMinutes(0).build()
        ));
    }

    public List<Flight> getAllFlights() { return List.copyOf(flights); }

    public List<Flight> getFlightsByStatus(FlightStatus status) {
        return flights.stream().filter(f -> f.getStatus() == status).toList();
    }

    public Optional<Flight> getFlightById(String id) {
        return flights.stream().filter(f -> f.getFlightId().equals(id)).findFirst();
    }

    public long countByStatus(FlightStatus status) {
        return flights.stream().filter(f -> f.getStatus() == status).count();
    }

    public double getOnTimePerformance() {
        long onTime = flights.stream()
            .filter(f -> f.getStatus() != FlightStatus.CANCELLED && f.getDelayMinutes() == 0).count();
        long total = flights.stream()
            .filter(f -> f.getStatus() != FlightStatus.CANCELLED).count();
        return total == 0 ? 100.0 : (double) onTime / total * 100;
    }

    public boolean updateFlightStatus(String flightId, FlightStatus newStatus) {
        return getFlightById(flightId).map(f -> { f.setStatus(newStatus); return true; }).orElse(false);
    }
}`;

const GATE_SERVICE = `package com.airport.dashboard.service;

import com.airport.dashboard.model.Gate;
import com.airport.dashboard.model.GateStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GateService {

    private final List<Gate> gates = new ArrayList<>();

    public GateService() {
        gates.addAll(List.of(
            Gate.builder().gateId("A1").terminal("A").status(GateStatus.BOARDING)
                .assignedFlightId("AA-2341").assignedAirline("American Airlines")
                .destination("LAX").departureTime("14:30").passengerCount(162)
                .turnaroundMinutes(45).gateAgent("Rivera, M.").aircraftType("B737-800").build(),
            Gate.builder().gateId("A2").terminal("A").status(GateStatus.AVAILABLE).gateAgent("—").build(),
            Gate.builder().gateId("A3").terminal("A").status(GateStatus.DELAYED)
                .assignedFlightId("UA-887").assignedAirline("United Airlines")
                .destination("MIA").departureTime("14:15").passengerCount(148)
                .turnaroundMinutes(60).gateAgent("Chen, L.").aircraftType("A320").build(),
            Gate.builder().gateId("A4").terminal("A").status(GateStatus.ACTIVE)
                .assignedFlightId("DL-903").assignedAirline("Delta Air Lines")
                .destination("ATL").departureTime("15:20").passengerCount(183)
                .turnaroundMinutes(38).gateAgent("Park, S.").aircraftType("B757").build(),
            Gate.builder().gateId("B1").terminal("B").status(GateStatus.MAINTENANCE)
                .gateAgent("Tech: Johnson").build(),
            Gate.builder().gateId("B2").terminal("B").status(GateStatus.ACTIVE)
                .assignedFlightId("SW-5532").assignedAirline("Southwest Airlines")
                .destination("PHX").departureTime("15:00").passengerCount(137)
                .turnaroundMinutes(32).gateAgent("Martinez, K.").aircraftType("B737-700").build(),
            Gate.builder().gateId("C1").terminal("C").status(GateStatus.ACTIVE)
                .assignedFlightId("BA-294").assignedAirline("British Airways")
                .destination("LHR").departureTime("16:00").passengerCount(412)
                .turnaroundMinutes(90).gateAgent("Thompson, R.").aircraftType("A380").build()
        ));
    }

    public List<Gate> getAllGates() { return List.copyOf(gates); }

    public List<Gate> getGatesByTerminal(String terminal) {
        return gates.stream().filter(g -> g.getTerminal().equalsIgnoreCase(terminal)).toList();
    }

    public Optional<Gate> getGateById(String id) {
        return gates.stream().filter(g -> g.getGateId().equals(id)).findFirst();
    }

    public long countByStatus(GateStatus status) {
        return gates.stream().filter(g -> g.getStatus() == status).count();
    }

    public boolean assignFlight(String gateId, String flightId) {
        return getGateById(gateId)
            .filter(g -> g.getStatus() == GateStatus.AVAILABLE)
            .map(g -> { g.setAssignedFlightId(flightId); g.setStatus(GateStatus.ACTIVE); return true; })
            .orElse(false);
    }
}`;

const ALERT_SERVICE = `package com.airport.dashboard.service;

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
}`;

const STATS_SERVICE = `package com.airport.dashboard.service;

import com.airport.dashboard.model.DashboardStats;
import com.airport.dashboard.model.FlightStatus;
import com.airport.dashboard.model.GateStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardStatsService {

    private final FlightService flightService;
    private final GateService gateService;
    private final AlertService alertService;

    public DashboardStats getStats() {
        return DashboardStats.builder()
            .totalFlightsToday(flightService.getAllFlights().size() + 276)
            .onTimePerformance(flightService.getOnTimePerformance())
            .activeDelays((int) flightService.countByStatus(FlightStatus.DELAYED))
            .passengersToday(41820)
            .fuelAlerts(3)
            .atcCommQuality(98.7)
            .criticalAlerts((int) alertService.countCriticalUnacked())
            .pendingAlerts(alertService.getUnacknowledgedAlerts().size())
            .availableGates((int) gateService.countByStatus(GateStatus.AVAILABLE))
            .activeGates((int) gateService.countByStatus(GateStatus.ACTIVE))
            .build();
    }
}`;

const DASHBOARD_CONTROLLER = `package com.airport.dashboard.controller;

import com.airport.dashboard.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class DashboardController {

    private final FlightService flightService;
    private final GateService gateService;
    private final AlertService alertService;
    private final DashboardStatsService statsService;

    @GetMapping("/")
    public String dashboard(Model model) {
        model.addAttribute("stats", statsService.getStats());
        model.addAttribute("flights", flightService.getAllFlights());
        model.addAttribute("gates", gateService.getAllGates());
        model.addAttribute("alerts", alertService.getAllActiveAlerts());
        model.addAttribute("airportCode", "KORD");
        model.addAttribute("airportName", "O'Hare International Airport");
        return "dashboard";
    }
}`;

const FLIGHT_API_CONTROLLER = `package com.airport.dashboard.controller;

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
}`;

const GATE_API_CONTROLLER = `package com.airport.dashboard.controller;

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
}`;

const ALERT_API_CONTROLLER = `package com.airport.dashboard.controller;

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
}`;

const DASHBOARD_HTML = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title th:text="\${airportCode} + ' — Airport Operations Dashboard'">KORD Dashboard</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0f1e; color: #e2e8f0; font-family: 'Inter', system-ui, sans-serif; font-size: 14px; }
    .mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
    header { background: rgba(15,22,41,0.95); border-bottom: 1px solid rgba(56,189,248,0.15);
             padding: 0.75rem 1.5rem; display: flex; justify-content: space-between; align-items: center;
             position: sticky; top: 0; z-index: 100; }
    .logo { display: flex; align-items: center; gap: 0.75rem; }
    .logo-icon { width: 36px; height: 36px; background: rgba(56,189,248,0.12);
                 border: 1px solid rgba(56,189,248,0.3); border-radius: 6px;
                 display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .airport-name { color: #e2e8f0; }
    .airport-sub { font-size: 0.75rem; color: #64748b; }
    #clock { color: #38bdf8; font-size: 1.1rem; text-align: right; }
    #date-display { color: #64748b; font-size: 0.75rem; text-align: right; }
    main { padding: 1.5rem; max-width: 1600px; margin: 0 auto; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
    .kpi-card { background: #0f1629; border: 1px solid rgba(56,189,248,0.12); border-radius: 6px; padding: 1rem; }
    .kpi-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 0.5rem; }
    .kpi-value { font-size: 1.6rem; color: #e2e8f0; }
    .kpi-delta { font-size: 0.7rem; color: #34d399; margin-top: 0.25rem; }
    .kpi-delta.down { color: #f87171; }
    .panel { background: #0f1629; border: 1px solid rgba(56,189,248,0.12); border-radius: 6px; margin-bottom: 1rem; overflow: hidden; }
    .panel-header { padding: 0.75rem 1.25rem; border-bottom: 1px solid rgba(56,189,248,0.08); color: #e2e8f0; }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b;
         padding: 0.5rem 1rem; text-align: left; border-bottom: 1px solid rgba(56,189,248,0.08); }
    td { padding: 0.625rem 1rem; border-bottom: 1px solid rgba(56,189,248,0.05); }
    tr:hover td { background: rgba(255,255,255,0.02); }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.65rem; border: 1px solid; }
    .badge-on-time   { color: #34d399; background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3); }
    .badge-delayed   { color: #fbbf24; background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.3); }
    .badge-boarding  { color: #38bdf8; background: rgba(56,189,248,0.1); border-color: rgba(56,189,248,0.3); }
    .badge-cancelled { color: #f87171; background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.3); }
    .badge-landed    { color: #94a3b8; background: rgba(148,163,184,0.1); border-color: rgba(148,163,184,0.3); }
    .badge-in-flight { color: #a78bfa; background: rgba(167,139,250,0.1); border-color: rgba(167,139,250,0.3); }
    .badge-critical  { color: #f87171; background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.3); }
    .badge-high      { color: #fb923c; background: rgba(251,146,60,0.1);  border-color: rgba(251,146,60,0.3); }
    .badge-medium    { color: #fbbf24; background: rgba(251,191,36,0.1);  border-color: rgba(251,191,36,0.3); }
    .text-sky   { color: #38bdf8; }
    .text-muted { color: #64748b; }
    .alert-row.critical td:first-child { border-left: 3px solid #f87171; }
    .alert-row.high     td:first-child { border-left: 3px solid #fb923c; }
    .alert-row.medium   td:first-child { border-left: 3px solid #fbbf24; }
    footer { background: rgba(8,13,26,0.95); border-top: 1px solid rgba(56,189,248,0.1);
             padding: 0.375rem 1.5rem; display: flex; justify-content: space-between;
             font-size: 0.7rem; color: #64748b; position: fixed; bottom: 0; left: 0; right: 0; }
  </style>
</head>
<body>
<header>
  <div class="logo">
    <div class="logo-icon">✈</div>
    <div>
      <div class="airport-name mono" th:text="\${airportCode} + ' — ' + \${airportName}">KORD — O'Hare</div>
      <div class="airport-sub">Airport Operations Control Center</div>
    </div>
  </div>
  <div>
    <div class="mono" id="clock">--:--:--</div>
    <div class="mono" id="date-display">Loading...</div>
  </div>
</header>
<main>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label mono">Total Flights Today</div>
      <div class="kpi-value mono" th:text="\${stats.totalFlightsToday}">284</div>
      <div class="kpi-delta mono">+12 vs yesterday</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label mono">On-Time Performance</div>
      <div class="kpi-value mono" th:text="\${#numbers.formatDecimal(stats.onTimePerformance, 1, 1)} + '%'">87.4%</div>
      <div class="kpi-delta mono">+2.1% vs yesterday</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label mono">Active Delays</div>
      <div class="kpi-value mono" th:text="\${stats.activeDelays}">23</div>
      <div class="kpi-delta down mono">+5 vs yesterday</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label mono">Passengers Today</div>
      <div class="kpi-value mono" th:text="\${#numbers.formatInteger(stats.passengersToday, 1, 'COMMA')}">41,820</div>
      <div class="kpi-delta mono">+3,200 vs yesterday</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label mono">Critical Alerts</div>
      <div class="kpi-value mono" th:text="\${stats.criticalAlerts}">1</div>
      <div class="kpi-delta down mono" th:text="\${stats.pendingAlerts} + ' pending'">4 pending</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label mono">ATC Comm Quality</div>
      <div class="kpi-value mono" th:text="\${stats.atcCommQuality} + '%'">98.7%</div>
      <div class="kpi-delta mono">Stable</div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-header">Live Flight Board</div>
    <table>
      <thead>
        <tr>
          <th class="mono">Flight</th><th class="mono">Route</th><th class="mono">Status</th>
          <th class="mono">Gate</th><th class="mono">Departure</th><th class="mono">Arrival</th><th class="mono">Aircraft</th>
        </tr>
      </thead>
      <tbody>
        <tr th:each="flight : \${flights}">
          <td class="text-sky mono" th:text="\${flight.flightId}">AA-2341</td>
          <td class="mono" th:text="\${flight.origin} + ' → ' + \${flight.destination}">JFK → LAX</td>
          <td>
            <span class="badge mono"
              th:classappend="\${flight.status.name() == 'ON_TIME' ? 'badge-on-time' :
                               flight.status.name() == 'DELAYED'  ? 'badge-delayed' :
                               flight.status.name() == 'BOARDING' ? 'badge-boarding' :
                               flight.status.name() == 'CANCELLED'? 'badge-cancelled' :
                               flight.status.name() == 'LANDED'   ? 'badge-landed' : 'badge-in-flight'}"
              th:text="\${flight.status.displayName}">On Time</span>
          </td>
          <td class="mono" th:text="\${flight.gate}">A12</td>
          <td class="mono" th:text="\${flight.scheduledDeparture}">14:30</td>
          <td class="mono text-muted" th:text="\${flight.scheduledArrival}">18:45</td>
          <td class="mono text-muted" th:text="\${flight.aircraftType}">B737-800</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="panel">
    <div class="panel-header">Active Alerts &amp; Incidents</div>
    <table>
      <thead>
        <tr>
          <th class="mono">Alert ID</th><th class="mono">Severity</th><th class="mono">Category</th>
          <th class="mono">Title</th><th class="mono">Location</th><th class="mono">Assignee</th><th class="mono">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr th:each="alert : \${alerts}" class="alert-row"
            th:classappend="\${alert.severity.name() == 'CRITICAL' ? 'critical' :
                             alert.severity.name() == 'HIGH' ? 'high' : 'medium'}">
          <td class="text-sky mono" th:text="\${alert.alertId}">ALT-0041</td>
          <td>
            <span class="badge mono"
              th:classappend="\${alert.severity.name() == 'CRITICAL' ? 'badge-critical' :
                               alert.severity.name() == 'HIGH' ? 'badge-high' : 'badge-medium'}"
              th:text="\${alert.severity}">CRITICAL</span>
          </td>
          <td class="text-sky mono" th:text="\${alert.category}">SECURITY</td>
          <td th:text="\${alert.title}">Unattended bag</td>
          <td class="text-muted mono" th:text="\${alert.location}">Concourse B</td>
          <td class="text-muted mono" th:text="\${alert.assignee != null ? alert.assignee : '—'}">Officer Diaz</td>
          <td>
            <span class="badge mono badge-on-time" th:if="\${alert.acknowledged}">ACK</span>
            <span class="badge mono badge-delayed" th:unless="\${alert.acknowledged}">PENDING</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</main>
<footer>
  <div class="mono"><span style="color:#34d399">● Systems Nominal</span> &nbsp;·&nbsp; 284 flights today · 41,820 passengers</div>
  <div class="mono">ATIS: Info KILO &nbsp;·&nbsp; Active runway: 28L / 10R &nbsp;·&nbsp; v1.0.0 · AOCC</div>
</footer>
<script>
  function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('date-display').textContent =
      now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' · Local';
  }
  updateClock();
  setInterval(updateClock, 1000);
</script>
</body>
</html>`;

export const JAVA_FILES: JavaFile[] = [
  { path: "pom.xml", language: "xml", content: POM },
  { path: "src/main/resources/application.properties", language: "properties", content: APP_PROPERTIES },
  { path: "src/main/java/com/airport/dashboard/AirportDashboardApplication.java", language: "java", content: MAIN_CLASS },
  { path: "src/main/java/com/airport/dashboard/model/FlightStatus.java", language: "java", content: FLIGHT_STATUS_ENUM },
  { path: "src/main/java/com/airport/dashboard/model/Flight.java", language: "java", content: FLIGHT_MODEL },
  { path: "src/main/java/com/airport/dashboard/model/GateStatus.java", language: "java", content: GATE_STATUS_ENUM },
  { path: "src/main/java/com/airport/dashboard/model/Gate.java", language: "java", content: GATE_MODEL },
  { path: "src/main/java/com/airport/dashboard/model/AlertSeverity.java", language: "java", content: ALERT_SEVERITY_ENUM },
  { path: "src/main/java/com/airport/dashboard/model/Alert.java", language: "java", content: ALERT_MODEL },
  { path: "src/main/java/com/airport/dashboard/model/DashboardStats.java", language: "java", content: DASHBOARD_STATS_MODEL },
  { path: "src/main/java/com/airport/dashboard/service/FlightService.java", language: "java", content: FLIGHT_SERVICE },
  { path: "src/main/java/com/airport/dashboard/service/GateService.java", language: "java", content: GATE_SERVICE },
  { path: "src/main/java/com/airport/dashboard/service/AlertService.java", language: "java", content: ALERT_SERVICE },
  { path: "src/main/java/com/airport/dashboard/service/DashboardStatsService.java", language: "java", content: STATS_SERVICE },
  { path: "src/main/java/com/airport/dashboard/controller/DashboardController.java", language: "java", content: DASHBOARD_CONTROLLER },
  { path: "src/main/java/com/airport/dashboard/controller/FlightApiController.java", language: "java", content: FLIGHT_API_CONTROLLER },
  { path: "src/main/java/com/airport/dashboard/controller/GateApiController.java", language: "java", content: GATE_API_CONTROLLER },
  { path: "src/main/java/com/airport/dashboard/controller/AlertApiController.java", language: "java", content: ALERT_API_CONTROLLER },
  { path: "src/main/resources/templates/dashboard.html", language: "html", content: DASHBOARD_HTML },
];
