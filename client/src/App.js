import logo from './logo.svg';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './Login' 
import { firebaseApp, db, signInWithEmailAndPassword, logout } from './firebase'
import './App.css';


function App() {
  return (
    <div className="app">
  <Router>
    <Switch>
      <Route exact path="/" component={Login} />
    </Switch>
  </Router>
</div>
  );
}

export default App;
