package com.airport.dashboard.service;

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
}