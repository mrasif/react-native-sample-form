import { TRY_AUTH } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
import startMainTabs from '../../screens/MainTabs/startMainTabs'

export const tryAuth = (authData, authMode) => {
  return (dispatch) => {
    const API_KEY = "AIzaSyA0uboLyGBnVtpLm-w639MvJY5Vpq9unUg";

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
        console.error(err);
      })
      .then(res => res.json())
      .then(response => {
        dispatch(uiStopLoading());
        if (response.error) {
          alert('Invalid authentication !');
        }
        else {
          console.log(response);
          startMainTabs();
        }
      });
  };
};