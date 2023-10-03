import React, { useEffect, useRef } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import L from 'leaflet'; // Import Leaflet

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineController,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineController,
  ArcElement
);




const getCityCoordinates = async (cityName) => {
  // Define the DBpedia SPARQL endpoint and your SPARQL query
  const dbpediaEndpoint = 'https://dbpedia.org/sparql';
  const sparqlQuery = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>

    SELECT ?latitude ?longitude
    WHERE {
      ?city rdf:type dbo:City .
      ?city rdfs:label "${cityName}"@en .
      ?city geo:lat ?latitude .
      ?city geo:long ?longitude .
    }
  `;

  // Encode the SPARQL query
  const encodedQuery = encodeURIComponent(sparqlQuery);

  // Build the full URL for the SPARQL request
  const sparqlUrl = `${dbpediaEndpoint}?query=${encodedQuery}&format=json`;

  try {
    // Send the SPARQL request to DBpedia
    const response = await fetch(sparqlUrl);
    const data = await response.json();

    // Check if there are results and extract latitude and longitude
    if (data.results && data.results.bindings.length > 0) {
      const cityData = data.results.bindings[0];
      const latitude = parseFloat(cityData.latitude.value);
      const longitude = parseFloat(cityData.longitude.value);

      return { latitude, longitude };
    } else {
      return {

      }
    }
  } catch (error) {
    throw new Error(`Error fetching data from DBpedia: ${error.message}`);
  }
}

const Chart = ({ data }) => {
  const mapContainerRef = useRef(null);

  const renderMap = () => {
    if (!data || data.length === 0 || !data.some(item => item.location)) {
      return null; // Don't render the map if there's no data or no 'location' property
    }

    return (
      <div>
        <h3>Location Map</h3>
        <div ref={mapContainerRef} id="leaflet-map" style={{ height: '400px', width: '100%' }}></div>
      </div>
    );
  };
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    // Append the link element to the head of the document
    document.head.appendChild(link);
    // Initialize the Leaflet map once the map container is available in the DOM
    if (mapContainerRef.current && data.some(item => item.location)) {
      if (!mapContainerRef.current._leaflet_id) {
        // Create the Leaflet map
        const map = L.map(mapContainerRef.current).setView([48.8566, 2.3522], 3); // Set initial coordinates and zoom level

        // Add map tiles (you'll need to provide a tile layer URL)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        // Loop through your data and add markers for city names
        data.forEach(async (item) => {
          try {
            if (item.location) {
              // Get latitude and longitude using the getCityCoordinates function
              const { latitude, longitude } = await getCityCoordinates(item.location);

              // Add a marker for the city with its latitude and longitude
              if (latitude && longitude) {
                const cityMarker = L.marker([latitude, longitude]).addTo(map);
                cityMarker.bindPopup(item.location);
              }
            }
            // Display city name on marker click
          } catch (error) {
            console.error(`Error fetching coordinates for "${item.location}": ${error.message}`);
          }
        });
        mapContainerRef.current._leaflet_id = map._leaflet_id;
      }

    }
  }, [data]);

  const renderCharts = () => {
    if (!data || data.length === 0) {
      return <p>Loading data...</p>;
    }

    const chartComponents = [];

    // Generate charts for each property dynamically
    Object.keys(data[0]).forEach((property) => {
      if (property !== "location") {
        const chartData = generateChartData(property);

        const chartComponent = generateChartComponent(property, chartData);
        chartComponents.push(chartComponent);
      }
    });

    return chartComponents;
  };

  const generateChartData = (property) => {
    const values = data.map((item) => item[property]);
    const uniqueValues = [...new Set(values)];

    const chartData = {
      labels: uniqueValues,
      datasets: [
        {
          label: property,
          data: uniqueValues.map(() => 1),
          backgroundColor: generateRandomColors(uniqueValues.length),
        },
      ],
    };

    return chartData;
  };

  // Helper function to generate random colors
  const generateRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `rgba(${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)}, 0.8)`;
      colors.push(color);
    }
    return colors;
  };

  // Helper function to generate a random number between min and max (inclusive)
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateChartComponent = (property, chartData) => {
    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    let ChartComponent;
    if (typeof chartData.labels[0] === 'string') {
      ChartComponent = Pie;
    } else if (typeof chartData.labels[0] === 'number') {
      ChartComponent = Bar;
    } else {
      ChartComponent = Line;
    }

    return (
      <div key={property}>
        <h3>{property} Chart</h3>
        <ChartComponent data={chartData} options={chartOptions} />
      </div>
    );
  };

  return (
    <div>
      {/* Render the charts */}
      {renderCharts()}
      {renderMap()}
    </div>
  );
};

export default Chart;
