import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      userAddress: null
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
          timestamp: '2020-01-01 02:05:13',
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
      </div>
    );
  }

}

export default App;
