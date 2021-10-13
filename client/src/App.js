import logo from './logo.svg';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './Login' 
import Dashboard from './Dashboard'
import './App.css';


function App() {
  return (
    <div className="app">
  <Router>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
    </Switch>
  </Router>
</div>
  );
}

export default App;
