import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import {MainText, HeadingText} from '../../components/ui';
import PickImage from '../../components/PickImage/PickImage';
import PickLocation from '../../components/PickLocation/PickLocation';

import { addPlace, startAddPlace } from '../../store/actions/index';
import validate from '../../utility/validation';

class SharePlaceScreen extends Component {

  static navigatorStyle = {
    navBarButtonColor: 'orange'
  }

  constructor(props){
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentWillMount(){
    this.reset();
  }

  reset = () =>{
    this.setState({
      controls: {
        placeName: {
          value:"",
          valid: false,
          touched: false,
          validationRules: {
            notEmpty:true
          }
        },
        location:{
          value: null,
          valid: false
        },
        image: {
          value: null,
          valid: false
        }
      }
    });
  }

  componentDidUpdate(){
    if(this.props.placeAdded){
      this.props.navigator.switchToTab({
        tabIndex: 0
      });
    }
  }

  onNavigatorEvent = event => {
    // console.log(event);
    if(event.type==='ScreenChangedEvent'){
      if(event.id==='willAppear'){
        this.props.onStartAddPlace();
      }
    }
    if(event.type==='NavBarButtonPress'){
      if(event.id==='sideDrawerToggle'){
        this.props.navigator.toggleDrawer({
          side: 'left',
          animation: true
        })
      }
    }
  }

  placeNameChangedHandler = val =>{
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          placeName: {
            ...prevState.controls.placeName,
            value: val,
            valid: validate(val,prevState.controls.placeName.validationRules),
            touched: true
          }
        }
      };
    });
  }

  locationPickHandler = (location) => {
    this.setState(prevState=>{
      return{
        controls: {
          ...prevState.controls,
          location: {
            value: location,
            valid: true
          }
        }
      };
    });
  }

  placeAddedHandler = () => {
    this.props.onAddPlace(
      this.state.controls.placeName.value,
      this.state.controls.location.value,
      this.state.controls.image.value
    );
    this.reset();
    this.imagePicker.reset();
    this.locationPicker.reset();
    // this.props.navigator.switchToTab({ tabIndex: 0 });
  }

  imagePickedHandler=(image)=>{
    this.setState(prevState=>{
      return {
        controls: {
          ...prevState.controls,
          image: {
            value: image,
            valid: true
          }
        }
      };
    });
  }

  render () {

    let submitButton=<Button
    title="Share the place"
    onPress={this.placeAddedHandler}
    disabled={
      !this.state.controls.placeName.valid ||
      !this.state.controls.location.valid ||
      !this.state.controls.image.valid
      } />;
    if(this.props.isLoading){
      submitButton=<ActivityIndicator/>;
    }

    return (
      <ScrollView>
        <View style={styles.container}>
          <MainText>
            <HeadingText>Share a place with us!</HeadingText>
          </MainText>
          <PickImage
            onImagePicked={this.imagePickedHandler}
            ref={ref=>(this.imagePicker=ref)} />
          <PickLocation
            onLocationPick={this.locationPickHandler}
            ref={ref=>(this.locationPicker=ref)}
            />
          <PlaceInput
            placeData={this.state.controls.placeName}
            onChangeText={this.placeNameChangedHandler}/>
          <View style={styles.button}>
            {submitButton}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  placeholder: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#EEE',
    width: '80%',
    height: 150
  },
  button: {
    margin: 8
  },
  previewImage: {
    width: '100%',
    height: '100%'
  }
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    placeAdded: state.places.placeAdded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddPlace: (placeName,location, image) => dispatch(addPlace(placeName,location,image)),
    onStartAddPlace: () => dispatch(startAddPlace())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);
