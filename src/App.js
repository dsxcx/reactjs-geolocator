import React from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';
import axios from 'axios';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      current_location: 'placeholder',
      target_location: '25 ADB Ave, Ortigas Center, Pasig, 1600 Metro Manila, Philippines',
      timestamp: null,
      device_id: 'placeholder',
    };
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
  }

  getLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCoordinates);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  handleLocationError(error){
    switch(error.code) {
        case error.PERMISSION_DENIED:
          alert("User denied the request for Geolocation.")
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.")
          break;
        case error.TIMEOUT:
          alert("The request to get user location timed out.")
          break;
        case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.")
          break;
        default:
          alert("An unknown error occurred.")
      }
  }

  getCoordinates(position){
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
    })
    
    console.log(this.state)
    axios.post('https://us-central1-ti-tids-demo.cloudfunctions.net/http_maps_bq',this.state )
    .then(response=>{
      console.log(response)
    })
    .catch(error=>{
      console.log(error.message)
    })
  }


  render() {
    return (
      <div className="App">
  
      <button onClick={this.getLocation}>Get coordinates</button>
      <p>Latitude: {this.state.latitude}</p>
      <p>Longitude: {this.state.longitude}</p>
      <p>Timestamp: {this.state.timestamp}</p>  
      </div>
    );
  }

}

export default App;
