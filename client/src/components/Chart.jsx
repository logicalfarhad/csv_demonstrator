import React, { useEffect, useRef } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import L from 'leaflet'; // Import Leaflet

/* eslint-disable import/first */
let backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';
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

  let bearer = 'Bearer ' + window.localStorage.getItem("token");
  try {
    const response = await fetch(backend + '/misc/getCoordinates', {
      method: 'POST',
      body: JSON.stringify({ cityName: cityName }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': bearer
      }
    });
    let data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.log(error);
  }
}

const Chart = ({ data }) => {
  const mapContainerRef = useRef(null);

  const renderMap = () => {

    if (!data || data.length === 0 || !data.some(item => item.location || item.Location)) {
      return null; // Don't render the map if there's no data or no 'location' property
    }

    return (
      <div className='location'>
        <h3>Location Map</h3>
        <div ref={mapContainerRef} id="leaflet-map" style={{ height: '400px', width: '100%' }}></div>
        <p></p>
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
    if (mapContainerRef.current && data.some(item => item.location || item.Location)) {
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
            if (item.location || item.Location) {
              // Get latitude and longitude using the getCityCoordinates function
              const { latitude, longitude } = await getCityCoordinates(item.location || item.Location);

              // Add a marker for the city with its latitude and longitude
              if (latitude && longitude) {
                const cityMarker = L.marker([latitude, longitude]).addTo(map);
                cityMarker.bindPopup(item.location || item.Location);
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
      if (property !== "location" || property !== "Location") {
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
      <div key={property}  className={property}>
        <h3>{property} Chart</h3>
        <ChartComponent data={chartData} options={chartOptions} className={property} />
        <p>{property}</p>
      </div>
    );
  };

  return (
    <>
      {/* Render the charts */}
      {renderCharts()}
      {renderMap()}
    </>
  );
};

export default Chart;
