import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import ListItem from '../ListItem/ListItem';

const placeList = props => {

    return (
      <FlatList style={styles.listContainer}
        data={ props.places }
        renderItem={(info)=>{
          return(
            <ListItem
              placeName={info.item.name}
              onItemPressed={()=>props.onItemSelected(info.item.key)}
              imageUrl={ info.item.image }
            />
          );
        }}
      />
    );
};

const styles = StyleSheet.create({
    listContainer: {
      width: "100%"
    }
});

export default placeList;
