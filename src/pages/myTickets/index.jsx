import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchMyTickets } from '../../api/tickets';

const MyTicketsPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTickets = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('You must be logged in to view your tickets.');
                setLoading(false);
                return;
            }

            try {
                const data = await fetchMyTickets(userId);
                setTickets(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch tickets.');
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, []);

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                My Tickets
            </Typography>
            {tickets.length === 0 ? (
                <Typography>No tickets found.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Flight ID</TableCell>
                                <TableCell>Seat Number</TableCell>
                                <TableCell>From</TableCell>
                                <TableCell>To</TableCell>
                                <TableCell>Departure</TableCell>
                                <TableCell>Arrival</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell>{ticket.flight.id}</TableCell>
                                    <TableCell>{ticket.seat.seatNumber}</TableCell>
                                    <TableCell>{ticket.flight.fromAirport.city}</TableCell>
                                    <TableCell>{ticket.flight.toAirport.city}</TableCell>
                                    <TableCell>{new Date(ticket.flight.departureTime).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(ticket.flight.arrivalTime).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default MyTicketsPage;
