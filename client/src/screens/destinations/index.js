import { Box, Container, Grid } from '@mui/material';


import Navbar from '../../components/navbar';
import WeatherComponent from '../../components/weather';
import Map from "../../components/maps/googlemaps.js"
import SimpleSearchBar from '../../components/autocomplete/autocomplete.js';
import "./index.scss";
import React, { useState, useEffect } from 'react';
import MapComponent from '../../components/maps/googlemaps.js';
import { vacationOperations } from '../../components/middleware-apis/vacationOperations.js';
import Calendar from '../../components/calendar/index.js';


function Destinations() {
    // Share user place search between the SimpleSearchBar and MapComponent components for combined functionality
    const [vacationName, setVacationName] = useState('');
    const [searchPlaceInput, setPlaceSearchInput] = useState('');
    const [searchLocationInput, setLocationSearchInput] = useState('');
    const handlePlaceSearch = (input) => {
      setPlaceSearchInput(input);
    };
    const handleLocationSearch = (input) => {
      setLocationSearchInput(input);
    };

    const [topAttractions, setTopAttractions] = useState([]); // State to store attractions

    const handleAttractionsUpdate = (attractions) => {
        setTopAttractions(attractions);
    };

    useEffect(() => {
      const fetchVacationName = async () => {
        try {
          const name = await vacationOperations.getName();
          console.log('display',name);
          setVacationName(name);
        } catch (error) {
          console.log(error);
        }
      }
      const fetchPlacesName = async () => {
        try {
          console.log(vacationName,'>>>>>>>>>>>>>>>>>>>')

          const name = await vacationOperations.getPlace('jaipur');// need to add dynamic city
          console.log('display2',name);
          
        } catch (error) {
          console.error('Error fetching vacation name:', error);
        }
      }; 

      fetchVacationName();
      fetchPlacesName();
    }, []);

  return (
    <>
      <Container maxWidth={false} className='container'>
        <Grid container
          direction="column"
          spacing={4}
        >
          <Grid item mt="1rem">
            <Navbar />
          </Grid>
        </Grid>
        <Grid container
          direction="row"
        >
          <Grid className="planning-filter-container" item xs={6}> {/* Left side for UI */}
            <h1><center>{vacationName}</center></h1>
            <Calendar />
            <SimpleSearchBar onPlaceSearch={handlePlaceSearch} onLocationSearch={handleLocationSearch} />
          </Grid>
          <Grid item xs={6}> {/* Right side for map */}
            <MapComponent searchPlaceInput={searchPlaceInput} searchLocationInput={searchLocationInput} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Destinations;
