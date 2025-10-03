// /lib/chartjs-register.js
import {
  Chart as ChartJS,
  ArcElement,        // Doughnut / Pie
  BarElement,        // Bar
  LineElement,       // Line
  PointElement,      // Line/Scatter
  CategoryScale,     // eje 'category'
  LinearScale,       // eje 'linear'
  TimeScale,         // si usás series de tiempo
  Tooltip,
  Legend,
  Title
} from 'chart.js';

// (OPCIONAL) adaptador para ejes de tiempo:
 // npm i chartjs-adapter-date-fns
// import 'chartjs-adapter-date-fns';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title
);

// (Opcional) defaults globales:
ChartJS.defaults.plugins.legend.position = 'top';
ChartJS.defaults.plugins.title.display = false;