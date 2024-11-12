import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@mui/material';
import { fetchFlights } from '../../api/flights';
import {buyTicket, fetchBookedTickets} from '../../api/tickets';

const FlightDetailPage = () => {
    const { id } = useParams();
    const [flight, setFlight] = useState(null);
    const [bookedTickets, setBookedTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [passengerName, setPassengerName] = useState()

    useEffect(() => {
        const loadFlightAndTickets = async () => {
            try {
                const [flights, tickets] = await Promise.all([
                    fetchFlights(),
                    fetchBookedTickets(),
                ]);

                const flightDetail = flights.find((flight) => flight.id === parseInt(id));
                setFlight(flightDetail);

                // Фільтруємо заброньовані квитки для конкретного рейсу
                const bookedForThisFlight = tickets.filter(
                    (ticket) => ticket.flight.id === parseInt(id)
                );
                setBookedTickets(bookedForThisFlight);
            } catch (err) {
                setError(err.message || 'Error loading flight details or tickets');
            } finally {
                setLoading(false);
            }
        };

        loadFlightAndTickets();
    }, [id]);

    const isSeatBooked = (seatId) =>
        bookedTickets.some((ticket) => ticket.seat.id === seatId);

    const handleBuyTicket = async (seat) => {
        if (isSeatBooked(seat.id)) {
            alert('This seat is already booked. Please choose another.');
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('User is not logged in. Please log in to purchase tickets.');
                return;
            }

            const result = await buyTicket({
                flightId: flight.id,
                seatId: seat.id,
                userId: parseInt(userId, 10),
                passengerName,
            });

            alert(`Ticket purchased successfully for seat ${seat.seatNumber}!`);

            setBookedTickets([
                ...bookedTickets,
                {
                    flight,
                    seat,
                    user: { id: userId, passengerName },
                },
            ]);
        } catch (error) {
            alert(`Error purchasing ticket: ${error.message || 'Something went wrong'}`);
        }
    };



    if (loading) {
        return (
            <Container>
                <Box textAlign="center" mt={5}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || !flight) {
        return (
            <Container>
                <Alert severity="error">{error || 'Flight not found'}</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Flight #{flight.id} Details
            </Typography>
            <Typography variant="h6">Aircraft: {flight.aircraft.name}</Typography>
            <Typography variant="subtitle1">From: {flight.fromAirport.city} ({flight.fromAirport.code})</Typography>
            <Typography variant="subtitle1">To: {flight.toAirport.city} ({flight.toAirport.code})</Typography>
            <Typography variant="subtitle1">
                Departure: {new Date(flight.departureTime).toLocaleString()}
            </Typography>
            <Typography variant="subtitle1">
                Arrival: {new Date(flight.arrivalTime).toLocaleString()}
            </Typography>

            <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                    Available Tickets
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Seat Number</TableCell>
                                <TableCell>Seat Class</TableCell>
                                <TableCell>Near Window</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {flight.aircraft.seats.map((seat) => {
                                const booked = isSeatBooked(seat.id);
                                return (
                                    <TableRow key={seat.id}>
                                        <TableCell>{seat.seatNumber}</TableCell>
                                        <TableCell>{seat.seatClass}</TableCell>
                                        <TableCell>{seat.nearWindow ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>{booked ? 'Booked' : 'Available'}</TableCell>
                                        <TableCell>
                                            {!booked && (
                                                <Box display="flex" gap={1} alignItems="center">
                                                    <input
                                                        type="text"
                                                        placeholder="Passenger Name"
                                                        onChange={(e) => setPassengerName(e.target.value)}
                                                        style={{
                                                            padding: '5px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                        }}
                                                    />
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleBuyTicket(seat)}
                                                    >
                                                        Buy Ticket
                                                    </Button>
                                                </Box>
                                            )}
                                            {booked && (
                                                <Button variant="contained" color="secondary" disabled>
                                                    Unavailable
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default FlightDetailPage;
