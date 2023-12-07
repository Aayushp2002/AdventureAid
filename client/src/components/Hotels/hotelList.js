import React, { useState } from 'react';
import axios from 'axios';
import HotelCard from './hotelCard'; 
import { Container, TextField, Button, Grid, Typography, Paper } from '@mui/material';

function HotelSearch() {
    const [searchParams, setSearchParams] = useState({
        cityCode: '',
        latitude: '',
        longitude: '',
        radius: '',
        radiusUnit: 'KM',
        chainCodes: '',
        amenities: '',
        ratings: '',
        hotelSource: 'ALL',
        hotelId: '',
    });
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = async (endpoint) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/hotelList/hotels/${endpoint}`, {
                params: searchParams
            });
            setResults(response.data);
        } catch (err) {
            setError('Failed to fetch data');
        }
    };

    return (
    <Container maxWidth="md" className="hotel-search-container">
      <Paper elevation={6} style={{ padding: '20px', marginTop: '20px' }}>
        <Grid container spacing={2}>
          {/* Input fields for each parameter */}
          {Object.keys(searchParams).map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label
                  htmlFor={key}
                  style={{
                    color:
                      key === 'hotelId' ||
                      key === 'cityCode' ||
                      key === 'latitude' ||
                      key === 'longitude'
                        ? 'red'
                        : 'inherit',
                    marginRight: '5px',
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}{' '}
                  {key === 'hotelId' ||
                  key === 'cityCode' ||
                  key === 'latitude' ||
                  key === 'longitude'
                    ? '*'
                    : ''}
                </label>
                <TextField
                  fullWidth
                  id={key}
                  name={key}
                  value={searchParams[key]}
                  onChange={handleInputChange}
                  placeholder={
                    key === 'hotelId' ||
                    key === 'cityCode' ||
                    key === 'latitude' ||
                    key === 'longitude'
                      ? `${key.charAt(0).toUpperCase() + key.slice(1)} *`
                      : key.charAt(0).toUpperCase() + key.slice(1)
                  }
                />
              </div>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          {/* Buttons for different search types */}
          <Grid item xs={4}>
            <Button variant="contained" onClick={() => handleSearch('by-city')}>
              Search by City
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" onClick={() => handleSearch('by-geocode')}>
              Search by Geocode
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" onClick={() => handleSearch('by-hotels')}>
              Search by Hotel ID
            </Button>
          </Grid>
        </Grid>

        {/* Display results and errors */}
        {error && (
          <Typography color="error" style={{ marginTop: '20px' }}>
            {error}
          </Typography>
        )}
          {results && results.data.slice(0, 10).map(hotel => (
            <HotelCard key={hotel.hotelId} hotel={hotel} />
          ))}
      </Paper>
    </Container>
  );
}

export default HotelSearch;