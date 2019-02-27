import {
  ADD_PLACE,
  DELETE_PLACE,
  SELECT_PLACE,
  DESELECT_PLACE
} from '../actions/actionTypes';

const initialState={
  places: [],
  selectedPlace: null
};

const reducer = ( state=initialState, action ) => {
  switch(action.type){
    case ADD_PLACE:
      return {
        ...state,
        places: state.places.concat(
          {
            key: Math.random().toString(),
            name: action.placeName,
            image: { uri: 'https://res.cloudinary.com/prestige-gifting/image/fetch/fl_progressive,q_95,e_sharpen:50,w_480/e_saturation:05/https://www.prestigeflowers.co.uk/images/NF1018.jpg' } 
          }
        )
      };
    case DELETE_PLACE:
      return { 
        ...state,
        places: state.places.filter( place => place.key!==state.selectedPlace.key ),
        selectedPlace: null
      };

    case SELECT_PLACE:
      return {
        ...state,
        selectedPlace: state.places.find(place=>{
          return place.key===action.placeKey;
        })
      };

    case DESELECT_PLACE:
      return {
        ...state,
        selectedPlace: null
      };

    default:
      return state;
  }
};

export default reducer;
