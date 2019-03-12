import { SET_PLACES, REMOVE_PLACE, PLACE_ADDED, START_ADD_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';

export const startAddPlace =()=>{
    return {
        type: START_ADD_PLACE
    };
};

export const addPlace = (placeName,location, image) => {

    return (dispatch) =>{
        let authToken;
        dispatch(authGetToken())
        .catch(err=>{
            console.log("No valid token found!");
        })
        .then(token=>{
            authToken=token;
            dispatch(uiStartLoading());
            return fetch("https://us-central1-auth-f0824.cloudfunctions.net/storeImage",{
                method: 'POST',
                body: JSON.stringify({
                    image: image.base64
                }),
                headers: {
                    "Authorization": "Bearer "+token
                }
            });
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result);
            const placeData={
                name: placeName,
                location: location,
                image: result.imageUrl,
                imagePath: result.imagePath
            };
            return fetch("https://auth-f0824.firebaseio.com/places.json?auth="+authToken,{
                method: 'POST',
                body: JSON.stringify(placeData)
            })
        })
        .then(response=>{
            if(response.ok){
                response.json()
            }else{
                throw(new Error())
            }
        })
        .then(result=>{
            console.log(result);
            dispatch(uiStopLoading());
            dispatch(placeAdded());
        })
        .catch(err=>{
            dispatch(uiStopLoading());
            console.log(err);
        });

        
    };
};

export const placeAdded=()=>{
    return {
        type: PLACE_ADDED
    };
};

export const getPlaces=()=>{
    return (dispatch) => {
        dispatch(authGetToken())
            .then(token=>{
                // console.log("getPlaces()=>Token: ",token);
                return fetch("https://auth-f0824.firebaseio.com/places.json?auth="+token);
            })
            .catch(err=>console.log(err))
            .then(res=>{
                // console.log(res);
                if(res.ok){
                    return res.json()
                }else{
                    throw(new Error())
                }
            })
            .then(result=>{
                if(result.error){
                    alert(result.error);
                    console.log(result.error);
                }
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
            .catch(err=>{
                console.log(err);
            });
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
        dispatch(authGetToken())
        .catch(err=>{
            console.log("No valid token found!");
        })
        .then(token=>{
            dispatch(removePlace(key));
            return fetch("https://auth-f0824.firebaseio.com/places/"+key+".json?auth="+token,{
                method: 'DELETE'
            });
        })
        .then(res=>res.json())
        .then(result=>{
            console.log('Done !');
        })
        .catch(err=>{
            console.log(err);
        });
    };
};

export const removePlace = key => {
    return {
      type: REMOVE_PLACE,
      key: key
    };
};

