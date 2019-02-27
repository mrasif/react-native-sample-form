import React from 'react';
import { StyleSheet, Modal, View, Image, Text, Button } from 'react-native';

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
          <Button title="Delete" color="red" onPress={ props.onItemDeleted } />
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
  }
});

export default placeDetail;
