import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TempGraph = ({ weatherData, isCelsius }) => {
  if (!weatherData) return null;

  const hourlyData = weatherData.forecast.forecastday[0].hour.slice(0, 8);
  const labels = hourlyData.map((hour, index) => (index === 0 ? 'Now' : new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })));
  const temps = hourlyData.map(hour => Math.round(isCelsius ? hour.temp_c : hour.temp_f));

  const data = {
    labels,
    datasets: [{
      label: 'Temperature',
      data: temps,
      borderColor: 'rgba(0, 123, 255, 1)',
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: 'rgba(0, 123, 255, 1)',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (context) => `Temperature: ${context.parsed.y}°${isCelsius ? 'C' : 'F'}` },
      },
    },
    scales: {
      x: { ticks: { color: '#666' } },
      y: { ticks: { callback: (value) => `${value}°`, color: '#666' } },
    },
  };

  return (
    <div className="temp-graph border border-gray-300 rounded-lg shadow-md mb-4 h-64">
      <Line data={data} options={options} />
    </div>
  );
};

export default TempGraph;