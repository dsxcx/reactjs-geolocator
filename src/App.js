import React from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      userAddress: null,
      timestamp: null
    };
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.getUserAddress = this.getUserAddress.bind(this);
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
      timestamp: moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')
    })
    
    let result = fetch('https://us-central1-ti-tids-demo.cloudfunctions.net/http_maps_bq', {
      method: 'post',
      mode: 'no-cors',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          device_id: '343434',
          timestamp: this.state.timestamp,
          target_location: '23232323'
        
      })
    }).then(function(response){
      if(response.ok){
        return response.text();
      }
      throw new Error('Something went wrong');
    }).then(function(text){
      console.log('Request succ', text)
    }).catch(function(error){
      console.log('request failed', error);
    });
    console.log(result);
    
  }

  getUserAddress(){
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.state.latitude + ',' + this.state.longitude + '&key=AIzaSyAr3NZ68vfFJhMRFvK6TOGSkPkId6uXz0o')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => alert(error))
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
