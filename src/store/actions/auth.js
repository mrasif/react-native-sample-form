import { AsyncStorage } from 'react-native';
import { TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
import startMainTabs from '../../screens/MainTabs/startMainTabs'
import App from '../../../App';

const API_KEY = "AIzaSyA0uboLyGBnVtpLm-w639MvJY5Vpq9unUg";

export const tryAuth = (authData, authMode) => {
  return (dispatch) => {
    dispatch(uiStartLoading());
    let url="https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + API_KEY;
    if(authMode==='signup'){
      url="https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + API_KEY;
    }
    
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        ContentType: 'application/json'
      }
    })
      .catch(err => {
        dispatch(uiStopLoading());
        console.log(err);
      })
      .then(res => res.json())
      .then(response => {
        dispatch(uiStopLoading());
        if (!response.idToken) {
          alert('Invalid authentication !');
        }
        else {
          console.log(response);
          dispatch(authStoreToken(response.idToken, response.expiresIn, response.refreshToken));
          startMainTabs();
        }
      });
  };
};

export const authStoreToken = (token, expiresIn, refreshToken) => {
  return dispatch=>{
    dispatch(authSetToken(token));
    const now=new Date();
    const expiryDate=now.getTime() + expiryDate*1000;
    // console.log(now, new Date(expiryDate));
    AsyncStorage.setItem("ap:auth:token",token);
    AsyncStorage.setItem("ap:auth:expiryDate",expiryDate.toString());
    AsyncStorage.setItem("ap:auth:refreshToken",refreshToken);
  };
};

export const authSetToken = token => {
  return {
    type: AUTH_SET_TOKEN,
    token: token
  };
};

export const authGetToken = () =>{
  return (dispatch, getState)=>{
    const promise = new Promise((resolve, reject)=>{
      const token=getState().auth.token;
      if(!token){
        let fetchedToken;
        AsyncStorage.getItem('ap:auth:token')
          .catch(err=>{
            console.log(err);
            reject();
          })
          .then(tokenFromStorage=>{
            if(!tokenFromStorage){
              reject();
              return;
            }
            fetchedToken=tokenFromStorage;
            return AsyncStorage.getItem('ap:auth:expiryDate');
          })
          .then(expiryDate=>{
            if(!expiryDate){
              reject();
              // return;
            }
            const parseExpireDate=new Date(parseInt(expiryDate));
            const now=new Date();
            if(parseExpireDate>now){
              dispatch(authSetToken(fetchedToken));
              resolve(fetchedToken);
            }
            else{
              reject();
            }
          })
          .catch(err=>reject());
      }
      else{
        resolve(token);
      }
    });

    return promise.catch(err=>{
      return AsyncStorage.getItem("ap:auth:refreshToken")
        .then(refreshToken=>{
          return fetch("https://securetoken.googleapis.com/v1/token?key="+API_KEY,{
            method: 'POST',
            headers:{
              'Content-Type':'application/x-www-form-urlencoded'
            },
            body: "grant_type=refresh_token&refresh_token="+refreshToken
          });
        })
        .then(res=>res.json())
        .then(parsedRes=>{
          if(parsedRes.id_token){
            console.log('Refresh token worked!');
            dispatch(authStoreToken(parsedRes.id_token,parsedRes.expires_in,parsedRes.refresh_token));
            return parsedRes.id_token;
          }
          else{
            dispatch(authClearStorage());
          }
        });
    })
    .then(token=>{
      if(!token){
        throw new Error();
      }
      else{
        return token;
      }
    });
  };
};

export const authAutoSignIn=()=>{
  return dispatch=>{
    dispatch(authGetToken())
      .then(token=>{
        if(token){
          startMainTabs();
        }
      })
      .catch(err=>console.log(err));
  };
};

export const authClearStorage= () =>{
  return dispatch=>{
    AsyncStorage.removeItem('api:auth:token');
    AsyncStorage.removeItem('api:auth:expiryDate');
    return AsyncStorage.removeItem('api:auth:refreshToken');
  };
};

export const authLogout = () => {
  return (dispatch,getState)=>{
    dispatch(authClearStorage())
      .then(()=>{
        App();
      });
      dispatch(authRemoveToken());    
  };
};

export const authRemoveToken = () =>{
  console.log('authRemoveToken() executed.');
  return{
    type: AUTH_REMOVE_TOKEN
  };
};