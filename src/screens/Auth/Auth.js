import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  View,
  StyleSheet, 
  ImageBackground,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import {DefaultInput, HeadingText, MainText, ButtonWithBackground} from '../../components/ui';
import backgroundImage from '../../assets/background.jpg';
import validate from '../../utility/validation';
import { connect } from 'react-redux';
import { tryAuth, authAutoSignIn } from '../../store/actions/index';

class AuthScreen extends Component {

  state={
    viewMode: Dimensions.get('window').height>500?'portrait':'landscape',
    authMode: 'login',
    controls: {
      email: {
        value: "",
        valid: false,
        validationRules: {
          isEmail: true
        },
        touched: false
      },
      password: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 6
        },
        touched: false
      },
      confirmPassword: {
        value: "",
        valid: false,
        validationRules: {
          equalTo: 'password'
        },
        touched: false
      }
    }
  };

  constructor(props){
    super(props);
    Dimensions.addEventListener("change", this.updateStyles);
  }

  componentWillUnmount(){
    Dimensions.removeEventListener("change", this.updateStyles); 
  }

  componentDidMount(){
    this.props.onAuthAutoSignIn();
  }

  switchAuthModeHandler = () =>{
    this.setState(prevState => {
      return {
        authMode: prevState.authMode==='login'?'signup':'login'
      };
    });
  }

  updateStyles = (dims) => {
    this.setState({
      viewMode: Dimensions.get('window').height>500?'portrait':'landscape'
    });
  }

  authHandler = () => {
    const authData={
      email: this.state.controls.email.value,
      password: this.state.controls.password.value
    };
    this.props.onTryAuth(authData, this.state.authMode);
  }

  updateInputState = (key, value) => {
    let connectedValue = {};
    if(this.state.controls[key].validationRules.equalTo){
      const equalControl = this.state.controls[key].validationRules.equalTo;
      const equalValue = this.state.controls[equalControl].value;
      connectedValue = {
        ...connectedValue,
        equalTo: equalValue
      };
    }
    if(key==='password'){
      connectedValue = {
        ...connectedValue,
        equalTo: value
      };
    }

    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          confirmPassword: {
            ...prevState.controls.confirmPassword,
            valid:
              key === 'password'
                ? validate(
                  prevState.controls.confirmPassword.value,
                  prevState.controls.confirmPassword.validationRules,
                  connectedValue
                ): prevState.controls.confirmPassword.valid
          },
          [key]: {
            ...prevState.controls[key],
            value: value,
            valid: validate(value,prevState.controls[key].validationRules, connectedValue),
            touched: true
          }
        }
      };
    });
  }

  render () {
    let headingText=null;
    let confirmPasswordControl=null;
    let submitButton=(<ButtonWithBackground
        onPress={this.authHandler}
        style={{backgroundColor: 'transparent'}}
        color="#29AAF4"
        disabled={
          !this.state.controls.email.valid ||
          !this.state.controls.password.valid ||
          !this.state.controls.confirmPassword.valid && this.state.authMode==='signup'
        }
      >
      Submit
    </ButtonWithBackground>);
    if(this.props.isLoading){
      submitButton=<ActivityIndicator size="large" color="#000" />;
    }

    if(this.state.viewMode==='portrait'){
      headingText=(<MainText>
        <HeadingText >Please Log In</HeadingText>
      </MainText>);
    }

    if(this.state.authMode==='signup'){
      confirmPasswordControl=(
        <View style={
          this.state.viewMode==='portrait' || this.state.authMode==='login'
            ? styles.portraitPasswordWrapper: styles.landscapePasswordWrapper
          } >
          <DefaultInput
            placeholder="Confirm password"
            style={styles.input}
            value={this.state.controls.confirmPassword.value}
            onChangeText={(val) => this.updateInputState('confirmPassword',val)}
            valid={this.state.controls.confirmPassword.valid}
            touched={this.state.controls.confirmPassword.touched}
            secureTextEntry
            />
        </View>
      );
    }

    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <KeyboardAvoidingView style={ styles.container } behavior="padding">
          {headingText}
          <ButtonWithBackground color="#29AAF4"
            onPress={this.switchAuthModeHandler} >
              Switch to {this.state.authMode==='login'?'Sign Up':'Log In'}
            </ButtonWithBackground>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inputContainer}>
              <DefaultInput
                placeholder="Your email address"
                style={styles.input}
                value={this.state.controls.email.value}
                onChangeText={(val) => this.updateInputState('email',val)}
                valid={this.state.controls.email.valid}
                touched={this.state.controls.email.touched}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                />
              <View style={this.state.viewMode==='portrait' || this.state.authMode==='login' ?styles.portraitPasswordContainer:styles.landscapePasswordContainer}>
                <View style={this.state.viewMode==='portrait' || this.state.authMode==='login' ? styles.portraitPasswordWrapper: styles.landscapePasswordWrapper} >
                  <DefaultInput
                    placeholder="Password"
                    style={styles.input}
                    value={this.state.controls.password.value}
                    onChangeText={(val) => this.updateInputState('password',val)}
                    valid={this.state.controls.password.valid}
                    touched={this.state.controls.password.touched}
                    secureTextEntry
                    />
                </View>
                {confirmPasswordControl}
              </View>
            </View>
          </TouchableWithoutFeedback>
          {submitButton}
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundImage: {
    width: '100%',
    flex: 1
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: '#EEE',
    borderColor: '#BBB'
  },
  landscapePasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  portraitPasswordContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  landscapePasswordWrapper: {
    width: '45%'
  },
  portraitPasswordWrapper: {
    width: '100%'
  }
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
    onAuthAutoSignIn: () => dispatch(authAutoSignIn())
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(AuthScreen);
