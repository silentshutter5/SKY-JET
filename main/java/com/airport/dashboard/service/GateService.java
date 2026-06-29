package com.airport.dashboard.service;

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
}