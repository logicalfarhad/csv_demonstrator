import React, { useEffect, useRef, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import L from 'leaflet';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useKeycloak } from "@react-keycloak/web";
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
  LineElement
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
  ArcElement,
  LineElement
);

let backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';


const getCityCoordinates = async (cityName, accessToken) => {
  // let bearer = 'Bearer ' + window.localStorage.getItem("token");
  try {
    const response = await fetch(backend + '/misc/getCoordinates', {
      method: 'POST',
      body: JSON.stringify({ cityName: cityName }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
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
  const { keycloak } = useKeycloak();
  const mapContainerRef = useRef(null);
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('bar');
  const [description, setDescription] = useState('');

  const handleXAxisChange = (event) => {
    setSelectedXAxis(event.target.value);
  };

  const handleYAxisChange = (event) => {
    setSelectedYAxis(event.target.value);
  };

  const handleChartTypeChange = (event) => {
    setSelectedChartType(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      // let bearer = 'Bearer ' + window.localStorage.getItem("token");
      // const { keycloak } = useKeycloak();
      // let bearer = 'Bearer ' + window.localStorage.getItem("token");
      if (!keycloak || !keycloak.authenticated) {
        // Handle unauthenticated user
        return;
      }
      const accessToken = keycloak.token;
      const model = localStorage.getItem('selectedModel') || '';
      try {
        // Check if both X and Y axes are selected
        if (selectedXAxis !== '' && selectedYAxis !== '' && data) {
          const response = await fetch(backend + '/openai/provide-desc', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}`,
              'X-Model': model
            },
            body: JSON.stringify({
              xAxis: selectedXAxis,
              yAxis: selectedYAxis,
              chartType: selectedChartType,
              data: data.slice(0, 2),
              locale: window.localStorage.getItem('language')
            }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const desc = await response.json();
          // Handle the API response data as needed
          console.log(desc);
          setDescription(desc.description)
        }
      } catch (error) {
        // Handle errors
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, [selectedXAxis, selectedYAxis, selectedChartType]);



  useEffect(() => {
    const properties = Object.keys(data[0]);

    // Only proceed if there are more than 1 properties
    if (properties.length > 1) {
      // Example: Automatically select the first and second properties
      setSelectedXAxis(properties[0]);
      setSelectedYAxis(properties[1]);
    }
  }, []);


  const renderChartOptions = () => {
    const properties = Object.keys(data[0] || {});

    return (
      <div className="chart-options">
        <Form as={Row} className='mx-0'>
          <Form.Group as={Col} controlId="xAxisSelect">
            <Form.Label>X Axis:</Form.Label>
            <Form.Control as="select" value={selectedXAxis} onChange={handleXAxisChange}>
              <option value="" disabled>Select X Axis</option>
              {properties.map((property) => (
                <option key={property} value={property}>
                  {property}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="yAxisSelect">
            <Form.Label>Y Axis:</Form.Label>
            <Form.Control as="select" value={selectedYAxis} onChange={handleYAxisChange}>
              <option value="" disabled>Select Y Axis</option>
              {properties.map((property) => (
                <option key={property} value={property}>
                  {property}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="chartTypeSelect">
            <Form.Label>Chart Type:</Form.Label>
            <Form.Control as="select" value={selectedChartType} onChange={handleChartTypeChange}>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </div>
    );
  };

  const generateChartData = () => {
    const xValues = data.map((item) => item[selectedXAxis]);
    const yValues = data.map((item) => item[selectedYAxis]);

    const chartData = {
      labels: xValues,
      datasets: [
        {
          label: selectedYAxis,
          data: yValues,
          backgroundColor: generateRandomColors(yValues.length),
        },
      ],
    };

    return chartData;
  };

  const generateRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `rgba(${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)}, 0.8)`;
      colors.push(color);
    }
    return colors;
  };

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const renderCharts = () => {
    if (!data || data.length === 0) {
      return <p>Loading data...</p>;
    }

    const chartData = generateChartData();
    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    let ChartComponent;
    if (selectedChartType === 'pie') {
      ChartComponent = Pie;
    } else if (selectedChartType === 'bar') {
      ChartComponent = Bar;
    } else if (selectedChartType === 'line') {
      ChartComponent = Line;
    }

    return (
      <div className="chart">
        {renderChartOptions()}

        {selectedXAxis && selectedYAxis && selectedChartType && <h3>{`${selectedXAxis} vs ${selectedYAxis} (${selectedChartType.toUpperCase()} Chart)`}</h3>
        }
        {/* <h3>{`${selectedXAxis} vs ${selectedYAxis} (${selectedChartType.toUpperCase()} Chart)`}</h3> */}
        <ChartComponent data={chartData} options={chartOptions} />
        {description && <p>{description}</p>}
        {/* <p>Description</p> */}
      </div>
    );
  };

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
    document.head.appendChild(link);

    if (mapContainerRef.current && data.some(item => item.location || item.Location)) {
      if (!mapContainerRef.current._leaflet_id) {
        const map = L.map(mapContainerRef.current).setView([48.8566, 2.3522], 3);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        data.forEach(async (item) => {
          try {
            if (item.location || item.Location) {
              if (!keycloak || !keycloak.authenticated) {
                // Handle unauthenticated user
                return;
              }
              const accessToken = keycloak.token;
              const { latitude, longitude } = await getCityCoordinates(item.location || item.Location, accessToken);

              if (latitude && longitude) {
                const cityMarker = L.marker([latitude, longitude]).addTo(map);
                cityMarker.bindPopup(item.location || item.Location);
              }
            }
          } catch (error) {
            console.error(`Error fetching coordinates for "${item.location}": ${error.message}`);
          }
        });
        mapContainerRef.current._leaflet_id = map._leaflet_id;
      }
    }
  }, [data]);

  return (
    <>
      {renderCharts()}
      {renderMap()}
    </>
  );
};

export default Chart;
