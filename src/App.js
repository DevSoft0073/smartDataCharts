import logo from './logo.svg';
import './App.css';
import Dashboard from './components/Dashboard';
import { TelemetryProvider } from './context/TelemetryContext';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <TelemetryProvider src='https://smartdatanodeservernew.vercel.app/api/getChartJson'>
      <Dashboard />
    </TelemetryProvider>

  );
}

export default App;
