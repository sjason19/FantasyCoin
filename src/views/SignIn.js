import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from '../views/SignUp';
import { PasswordForgetLink } from '../views/PasswordForget';
import { updateCoinData } from '../utility/CoinMarketCapAPI'
import { auth } from '../firebase';
import {
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap"
import "../components/styles/Signup.css"
import LoaderButton from '../components/LoaderButton'
import { Grid, Row, Col } from 'react-bootstrap'
import { gridStyle } from '../variables/CoreVariables.jsx'

import * as routes from '../constants/routes';

const SignInPage = ({ history }) =>
  <Grid fluid style={gridStyle}>
    <Row>
      <Col>
        <div>
          <h1>Sign In</h1>
          <SignInForm history={history} />
          <PasswordForgetLink />
          <SignUpLink />
        </div>
      </Col>
    </Row>
  </Grid>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  isLoading: false,
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    this.setState({ isLoading: true })
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        updateCoinData();
        history.push(routes.DASHBOARD);
        this.setState({ isLoading: false })
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

      this.setState({ isLoading: false })
    event.preventDefault();
  }

  /**
  * Validates whether or not values were entered into the text fields
  *
  * @return {boolean} - true if meets criteria
  */
  isValidForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0
    );
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    return (
      <Grid fluid>
        <Row>
          <Col>
            <form onSubmit={this.onSubmit}>
              <FormGroup controlId="email" bsSize="large">
                <ControlLabel>Email</ControlLabel>
                <FormControl
                  autoFocus
                  type="email"
                  value={email}
                  onChange={event => this.setState(byPropKey('email', event.target.value))}
                />
              </FormGroup>
              <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  value={password}
                  onChange={event => this.setState(byPropKey('password', event.target.value))}
                  type="password"
                />
              </FormGroup>
              <LoaderButton
                block
                bsSize="large"
                disabled={!this.isValidForm()}
                type="submit"
                isLoading={this.state.isLoading}
                text="Sign In"
                loadingText="Signing in…"
              />
              { error && <p>{error.message}</p> }
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};