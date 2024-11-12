import React, { useEffect, useState } from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    TableSortLabel,
    Typography,
    Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchFlights } from '../../api/flights';

const HomePage = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const navigate = useNavigate();

    useEffect(() => {
        const loadFlights = async () => {
            try {
                const data = await fetchFlights();
                setFlights(data);
            } catch (err) {
                setError(err.message || 'Error loading flights');
            } finally {
                setLoading(false);
            }
        };

        loadFlights();
    }, []);

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });

        const sortedFlights = [...flights].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setFlights(sortedFlights);
    };

    const handleRowClick = (id) => {
        navigate(`/flight/${id}`); // Перехід на сторінку детального перегляду рейсу
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

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Flight Information
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
                Click on a flight to see detailed information.
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'id'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('id')}
                                >
                                    Flight Number
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                Aircraft
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'fromAirport.city'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('fromAirport.city')}
                                >
                                    From (City, Code)
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'toAirport.city'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('toAirport.city')}
                                >
                                    To (City, Code)
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'departureTime'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('departureTime')}
                                >
                                    Departure Time
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'arrivalTime'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('arrivalTime')}
                                >
                                    Arrival Time
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flights.map((flight) => (
                            <TableRow
                                key={flight.id}
                                hover
                                onClick={() => handleRowClick(flight.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell>{`Flight #${flight.id}`}</TableCell>
                                <TableCell>{flight.aircraft.name}</TableCell>
                                <TableCell>
                                    {flight.fromAirport.city} ({flight.fromAirport.code})
                                </TableCell>
                                <TableCell>
                                    {flight.toAirport.city} ({flight.toAirport.code})
                                </TableCell>
                                <TableCell>
                                    {new Date(flight.departureTime).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(flight.arrivalTime).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default HomePage;
