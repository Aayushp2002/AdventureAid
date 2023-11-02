const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

const router = express.Router();
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

// Function to retrieve the Amadeus API token
async function getAmadeusToken() {
    const authData = querystring.stringify({
        client_id: AMADEUS_API_KEY,
        client_secret: AMADEUS_API_SECRET,
        grant_type: 'client_credentials'
    });

    try {
        const tokenResponse = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', authData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return tokenResponse.data.access_token;
    } catch (error) {
        console.error("Error fetching Amadeus token:", error);
        throw error;
    }
}

router.get('/flight-offers', async (req, res) => {
    const {
        origin, destination, departureDate, adults, returnDate, children, infants,
        travelClass, includedAirlineCodes, excludedAirlineCodes,  nonStop, currencyCode, maxPrice, max
    } = req.query;

    if (!origin || !destination || !departureDate || !adults) {
        return res.status(400).send({ message: 'Required parameters: origin, destination, departureDate.' });
    }

    let token;
    try {
        token = await getAmadeusToken();
    } catch (error) {
        return res.status(500).send({ message: 'Failed to authenticate with Amadeus', error: error.message });
    }

    let url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}`;

    if (returnDate) url += `&returnDate=${returnDate}`;
    if (children) url += `&children=${children}`;
    if (infants) url += `&infants=${infants}`;
    if (travelClass) url += `&travelClass=${travelClass.toUpperCase()}`;
    if (includedAirlineCodes) url += `&includedAirlineCodes=${includedAirlineCodes}`; // This option ensures that the system will only consider these airlines
    if(excludedAirlineCodes) url += `&excludedAirlineCodes=${excludedAirlineCodes}`; // This option ensures that the system will not consider these airlines.
    if (nonStop) url += `&nonStop=${nonStop}`; // This option ensures that the system will only consider direct flights.
    if (currencyCode) url += `&currencyCode=${currencyCode}`; // the preferred currency for the flight offers
    if (maxPrice) url += `&maxPrice=${maxPrice}`; // the maximum price for the flight offers
    if (max) url += `&max=${max}`; // the maximum number of flight offers to return

    try {
        const flightOffersResponse = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        res.send(flightOffersResponse.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).send({ message: 'Error retrieving flight offers', error: error.response.data });
        } else {
            return res.status(500).send({ message: 'Unknown error', error: error.message });
        }
    }
});

// to test this endpoint, use the following URL: http://localhost:3001/api/flightSearch/flight-offers?origin=NYC&destination=LAX&departureDate=2023-10-25&adults=1


module.exports = router;