const countryCoordinates = {
    'Austria': { lat: 47.5162, lng: 14.5501 },
    'Belgium': { lat: 50.8503, lng: 4.3517 },
    'Croatia': { lat: 45.1000, lng: 15.2000 },
    'Czechia': { lat: 49.8175, lng: 15.4730 },
    'Estonia': { lat: 58.5953, lng: 25.0136 },
    'Finland': { lat: 61.9241, lng: 25.7482 },
    'France': { lat: 46.2276, lng: 2.2137 },
    'Germany': { lat: 51.1657, lng: 10.4515 },
    'Greece': { lat: 39.0742, lng: 21.8243 },
    'Hungary': { lat: 47.1625, lng: 19.5033 },
    'Italy': { lat: 41.8719, lng: 12.5674 },
    'Norway': { lat: 60.4720, lng: 8.4689 },
    'Poland': { lat: 51.9194, lng: 19.1451 },
    'Portugal': { lat: 39.3999, lng: -8.2245 },
    'Serbia': { lat: 44.0165, lng: 21.0059 },
    'Slovakia': { lat: 48.6690, lng: 19.6990 },
    'Slovenia': { lat: 46.1512, lng: 14.9955 },
    'Spain': { lat: 40.4637, lng: -3.7492 },
    'Sweden': { lat: 60.1282, lng: 18.6435 },
    'Ukraine': { lat: 48.3794, lng: 31.1656 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 },
    'Brazil': { lat: -14.2350, lng: -51.9253 },
    'Canada': { lat: 56.1304, lng: -106.3468 },
    'Puerto Rico': { lat: 18.2208, lng: -66.5901 },
    'United States': { lat: 37.0902, lng: -95.7129 },
    'South Africa': { lat: -30.5595, lng: 22.9375 },
    'China': { lat: 35.8617, lng: 104.1954 },
    'Hong Kong': { lat: 22.3193, lng: 114.1694 },
    'India': { lat: 20.5937, lng: 78.9629 },
    'Japan': { lat: 36.2048, lng: 138.2529 },
    'Korea (Republic of)': { lat: 35.9078, lng: 127.7669 },
    'Saudi Arabia': { lat: 23.8859, lng: 45.0792 },
    'Taiwan': { lat: 23.6978, lng: 120.9605 },
    'Turkey': { lat: 38.9637, lng: 35.2433 },
    'Australia': { lat: -25.2744, lng: 133.7751 }
};

export const getCountryCoordinates = (country) => {
  return countryCoordinates[country] || null;
};

export default countryCoordinates;
