import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, Button} from 'react-native';
import MapView from 'react-native-maps';

class PickLocation extends Component {

  state = {
    focusedLocation: {
      latitude: 22.5705757,
      longitude: 88.4355419,
      latitudeDelta: 0.0122,
      longitudeDelta: Dimensions.get('window').width/Dimensions.get('window').height * 0.0122
    },
    locationChosen: false
  };

  pickLocationHandler = event => {
    const coords = event.nativeEvent.coordinate;
    this.map.animateToRegion({
      ...this.state.focusedLocation,
      latitude: coords.latitude,
      longitude: coords.longitude
    });
    this.setState(prevState=>{
      return {
        focusedLocation: {
          ...prevState.focusedLocation,
          latitude: coords.latitude,
          longitude: coords.longitude
        },
        locationChosen: true
      };
    });
    this.props.onLocationPick({
      latitude: coords.latitude,
      longitude: coords.longitude
    });
  }

  getLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(position=>{
      console.log(position);
      const coordEvent = {
        nativeEvent: {
          coordinate: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }
      };
      this.pickLocationHandler(coordEvent);
    }, error=>{
      console.log(error);
      alert("Fetching the location failed, please pick one manually!");
    })
  }

  render() {

    let marker=null;
    if(this.state.locationChosen){
      marker=(
        <MapView.Marker
        coordinate={this.state.focusedLocation}
      />);
    }

    return(
      <View style={styles.container}>
        <MapView 
          initialRegion={this.state.focusedLocation}
          style={styles.map}
          onPress={(e)=>this.pickLocationHandler(e)}
          ref={ ref=>this.map = ref } >
          {marker}
        </MapView>
        <View style={styles.button}>
          <Button title="Locate me"
            onPress={this.getLocationHandler}
            />
        </View>
      </View>
    );
  }
}

const styles=StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center'
  },
  map: {
    width: '80%',
    height: 250
  },
  button: {
    margin: 8
  }
});

export default PickLocation;