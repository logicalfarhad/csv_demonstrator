import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

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
  ArcElement
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



const Chart = ({data}) => {


  const renderCharts = () => {
    if (!data || data.length === 0) {
      return <p>Loading data...</p>;
    }

    const chartComponents = [];

    // Generate charts for each property dynamically
    Object.keys(data[0]).forEach((property) => {
      const chartData = generateChartData(property);
      const chartComponent = generateChartComponent(property, chartData);
      chartComponents.push(chartComponent);
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
    </div>
  );
};

export default Chart;
