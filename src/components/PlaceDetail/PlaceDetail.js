import React from 'react';
import { StyleSheet, Modal, View, Image, Text, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const placeDetail = props => {
  let modalContent=null;
  if(props.selectedPlace){
    modalContent = (
      <View>
        <Image source={ props.selectedPlace.image } style={styles.imageStyle} />
        <Text style={styles.textStyle}>{props.selectedPlace.name}</Text>
      </View>
    );
  }
  return (
    <Modal onRequestClose={props.onModalClosed} visible={ props.selectedPlace!=null } animationType="slide" >
      <View style={ styles.modalContainer }>
        { modalContent }
        <View>
          <TouchableOpacity onPress={ props.onItemDeleted }>
            <View style={styles.deleteButton} >
              <Icon size={ 30 } color="red" name="ios-trash" />
            </View>
          </TouchableOpacity>
          <Button title="Close" onPress={ props.onModalClosed } />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
   modalContainer: {
     margin: 26,
     marginTop: 50,
     flex: 1,
     flexDirection: 'column'
   },
  imageStyle: {
    width: '100%',
    height: 200
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28
  },
  deleteButton: {
    alignItems: 'center'
  }
});

export default placeDetail;
