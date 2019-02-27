import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const listItem = (props) => (
  <TouchableOpacity onPress={props.onItemPressed}>
    <View style={styles.listItem} >
      <Image resizeMode='cover' source={props.imageUrl} style={styles.imageStyle} />
      <Text>{props.placeName}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
    listItem: {
      width: "100%",
      marginBottom: 5,
      padding: 10,
      backgroundColor: "#eee",
      flexDirection: "row",
      alignItems: 'center'
    },
  imageStyle: {
    marginRight:8,
    width: 30,
    height: 30
  }
});

export default listItem;
