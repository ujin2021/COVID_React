import logo from './logo.svg';
import './App.css';
import Header from './component/Header'
import Contents from './component/Contents'

function App() {
  return (
    <div className="App">
      <Header className="header" />
      <Contents />
    </div>
  );
}

export default App;
