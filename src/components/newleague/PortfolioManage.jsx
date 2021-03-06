import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  PageHeader,
  Alert
} from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import LoaderButton from '../LoaderButton'
import { gridStyle } from '../../variables/NewLeagueVariables.jsx'

import { firebase, db } from '../../firebase'

const INITIAL_STATE = {
  coin0: '',
  coin1: '',
  coin2: '',
  coin3: '',
  coin4: '',
  users: null,
  currentUser: null,
  redirectToNewPage: false,
  error: '',
  show: false
}

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
})

class PortfolioManage extends Component {
  constructor (props) {
    super(props)

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShow = this.handleShow.bind(this);

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = (event) => {
    var finalBalance = this.state.users[this.state.currentUser.uid].statistics.usd
    var total = parseInt(this.state.coin0) + parseInt(this.state.coin1) + parseInt(this.state.coin2) + parseInt(this.state.coin3) + parseInt(this.state.coin4)
    var coins = {"coin0": this.state.coin0, "coin1": this.state.coin1, "coin2": this.state.coin2, "coin3": this.state.coin3, "coin4": this.state.coin4}

    const {
      history
    } = this.props;

    // Setup portfolio and update db
    if (!(total > finalBalance) && this.isValidForm()) {
      for (var coin in coins) {
        if (coins[coin] > finalBalance) {
          this.setState(byPropKey('error', 'You do not have enough balance'))
        } else {
          try {
            db.doSetAmountInPortfolio (this.state.currentUser.uid, coin, coins[coin])
            finalBalance -= coins[coin]
            } catch (error) {
              this.setState(byPropKey('error', error))
            }
        }
      }

      // Redirect back to dashboard after balance has been deducted
      this.setState({
        redirectToNewPage: true
      })
              
      try {
        db.doDeductBalance (this.state.currentUser.uid, finalBalance)
        } catch (error) {
          this.setState(byPropKey('error', error))
        }
      } else {
        // Show not enough balance error if the user doesn't have enough balance 
        this.handleShow()
      }
  }

  /**
   * Fetch firebase db snapshots and authenticated user
   */
  componentDidMount () {
    // Get all users
    try {
      db.onceGetUsers().then(snapshot =>
        this.setState(() => ({ users: snapshot.val() }))
      )
    } catch (error) {
      console.log('there was an error')
    }

    // Get current user
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState(() => ({ currentUser: authUser }))
        : this.setState(() => ({ currentUser: null }))
    })
  }

  /**
  * Helper function for validate form that checks if the value passed into coin textbox is numeric
  *
  * @param {String} coin
  *
  * @return {boolean} - true if meets criteria
  */
  isValidFormat(coin) {
      return (/^\d+$/.test(coin) && coin.length > 0)
  }

  /**
  * Helper function for validate form that checks if the value passed into coin textbox is numeric
  *
  * @param {String} coin
  *
  * @return {boolean} - true if meets criteria
  */
  isValidForm() {
    return (
      this.isValidFormat(this.state.coin0) &&
      this.isValidFormat(this.state.coin1) &&
      this.isValidFormat(this.state.coin2) &&
      this.isValidFormat(this.state.coin3) &&
      this.isValidFormat(this.state.coin4)
    );
  }

  // Dismiss error message if valid coin amount
  handleDismiss() {
    this.setState({ show: false });
  }

  // Show error message if invalid coin amount
  handleShow() {
    this.setState({ show: true });
  }

  render () {
    const {
      users,
      coin0,
      coin1,
      coin2,
      coin3,
      coin4,
      error
    } = this.state
    
    if (this.state.redirectToNewPage) {
      return (
      <Redirect to="/dashboard"/>
      )
    }

    return (
      <Grid fluid style={gridStyle}>
      <Row>
        <Col>
        <PageHeader><small>Balance: ${!!users && <Balance users={users} currentUser={this.state.currentUser} />}</small></PageHeader>
          <form onSubmit={this.onSubmit}>
            <FormGroup controlId="coin0" bsSize="large">
              <ControlLabel>{!!users && <CoinSymbol users={users} currentUser={this.state.currentUser} coin={'coin0'} />}</ControlLabel>
              <FormControl
                autoFocus
                type="coin0"
                value={coin0}
                onChange={event => this.setState(byPropKey('coin0', event.target.value))}
              />
            </FormGroup>
            <FormGroup controlId="coin1" bsSize="large">
              <ControlLabel>{!!users && <CoinSymbol users={users} currentUser={this.state.currentUser} coin={'coin1'} />}</ControlLabel>
              <FormControl
                autoFocus
                type="coin1"
                value={coin1}
                onChange={event => this.setState(byPropKey('coin1', event.target.value))}
              />
            </FormGroup>
            <FormGroup controlId="coin2" bsSize="large">
              <ControlLabel>{!!users && <CoinSymbol users={users} currentUser={this.state.currentUser} coin={'coin2'} />}</ControlLabel>
              <FormControl
                value={coin2}
                onChange={event => this.setState(byPropKey('coin2', event.target.value))}
                type="coin2"
              />
            </FormGroup>
            <FormGroup controlId="coin3" bsSize="large">
              <ControlLabel>{!!users && <CoinSymbol users={users} currentUser={this.state.currentUser} coin={'coin3'} />}</ControlLabel>
              <FormControl
                value={coin3}
                onChange={event => this.setState(byPropKey('coin3', event.target.value))}
                type="coin3"
              />
            </FormGroup>
            <FormGroup controlId="coin4" bsSize="large">
              <ControlLabel>{!!users && <CoinSymbol users={users} currentUser={this.state.currentUser} coin={'coin4'} />}</ControlLabel>
              <FormControl
                value={coin4}
                onChange={event => this.setState(byPropKey('coin4', event.target.value))}
                type="coin4"
              />
            </FormGroup>
            <LoaderButton
              block
              bsSize="large"
              disabled={!this.isValidForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Done"
              loadingText="Loading..."
            />
            { error && <p>{error.message}</p> }
          </form>
        </Col>
      </Row>
      </Grid>
    )
  }
}

/**
* Return a given coin that exist in a portfolio in this format: 'BTC ($100)'
*
* @param {JSON} users
* @param {JSON} currentUser
* @param {String} coin
*
* @return {String} data - ticker and price of coin
*/
const CoinSymbol = ({ users, currentUser, coin }) => {
  return (users[currentUser.uid].portfolio[coin].symbol + ' ($' + users[currentUser.uid].portfolio[coin].price_usd + ')')
}

/**
* Return a given coin that exist in a portfolio in this format: 'BTC ($100)'
*
* @param {JSON} users
* @param {JSON} currentUser
*
* @return {number} data - the balance left in your wallet
*/
const Balance = ({ users, currentUser }) => {
  return (users[currentUser.uid].statistics.usd)
}

export default PortfolioManage
