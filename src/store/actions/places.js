import { SET_PLACES, REMOVE_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';

export const addPlace = (placeName,location, image) => {

    return (dispatch) =>{
        dispatch(uiStartLoading());
        fetch("https://us-central1-auth-f0824.cloudfunctions.net/storeImage",{
            method: 'POST',
            body: JSON.stringify({
                    image: image.base64
                })
            }).catch(err=>{
                dispatch(uiStopLoading());
                console.log(err);
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result);
                const placeData={
                    name: placeName,
                    location: location,
                    image: result.imageUrl
                };
                return fetch("https://auth-f0824.firebaseio.com/places.json",{
                    method: 'POST',
                    body: JSON.stringify(placeData)
                })
            }).catch(error=>{
                console.log("Error",error);
                dispatch(uiStopLoading());
            })
            .then(response=>response.json())
            .then(result=>{
                console.log(result);
                dispatch(uiStopLoading());
            });

        
    };
};

export const getPlaces=()=>{
    return (dispatch) => {
        fetch("https://auth-f0824.firebaseio.com/places.json")
            .catch(err=>{
                console.log(err);
            })
            .then(res=>res.json())
            .then(result=>{
                const places=[];
                for(let key in result){
                    places.push({
                        ...result[key],
                        image:{
                            uri: result[key].image
                        },
                        key: key
                    });
                }
                dispatch(setPlaces(places))
            })
    };
};

export const setPlaces = (places) =>{
    return {
        type: SET_PLACES,
        places: places
    };
};

export const deletePlace = (key) => {
    return (dispatch) => {
        dispatch(removePlace(key));
        fetch("https://auth-f0824.firebaseio.com/places/"+key+".json",{
            method: 'DELETE'
        })
            .catch(err=>{
                console.log(err);
            })
            .then(res=>res.json())
            .then(result=>{
                console.log('Done !');
            })
    };
};

export const removePlace = key => {
    return {
      type: REMOVE_PLACE,
      key: key
    };
};

