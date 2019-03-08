import React, { Component } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import {DefaultInput} from '../ui';

const placeInput = props => (
    <DefaultInput 
      placeholder="Place Name"
      value={props.placeName}
      onChangeText={props.onChangeText} />
);

const styles = StyleSheet.create({
  inputContainer: {
    // flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  placeInput: {
    width: "70%"
  },
  placeButton: {
    width: "30%"
  }
});

export default placeInput;
