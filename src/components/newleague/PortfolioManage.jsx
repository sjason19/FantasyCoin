import React, { Component } from 'react'
import {Card} from '../../components/Card.jsx'
import {
  Table,
  Grid,
  Row,
  Col,
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap'

import { firebase, db } from '../../firebase'

const INITIAL_STATE = {
  coin1: '',
  users: [],
  currentUser: ''
}

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
})

class PortfolioManage extends Component {
  constructor (props) {
    super(props)

    this.state = { ...INITIAL_STATE }
  }

  componentDidMount () {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState(() => ({ currentUser: authUser }))
        : this.setState(() => ({ currentUser: null }))
    })

    db.onceGetUsers().then(snapshot =>
      this.setState(() => ({ users: snapshot.val() }))
    )
  }

  render () {
    const {
      coin1,
      users,
      currentUser
    } = this.state

    // var currentPortfolio = []

    // var index = 0
    // for (var coin in portfolio) {
    //   index++
    //   currentPortfolio.push(
    //     <FormGroup controlId={'coin' + index} bsSize='large'>
    //       <ControlLabel>{coin.name + '(' + coin.symbol + ')'}</ControlLabel>
    //       <FormControl
    //         autoFocus
    //         type='username'
    //         value={coin1}
    //         onChange={event => this.setState(byPropKey('username', event.target.value))}
    //       />
    //     </FormGroup>
    //   )
    // }
    if (users[currentUser.uid].portfolio) {
      console.log(users[currentUser.uid])
    }
    return (
      <div className='content'>
        <Grid fluid>
          <Row>
            <Col md={8} mdOffset={2}>
              <Card
                hCenter
                title='Manage your portfolio'
                category='Please specify the amount of each coin for your portfolio'
                ctTableResponsive ctTableFullWidth ctTableLeague
                content={
                  <Table>
                    {/* <tbody>
                      {<tr><td>Unable to load data</td></tr>}
                    </tbody> */}
                    <FormGroup controlId={'coin1'} bsSize='large'>
                      <ControlLabel>{users[currentUser.uid] + ')'}</ControlLabel>
                      <FormControl
                        autoFocus
                        type='coin1'
                        value={coin1}
                        onChange={event => this.setState(byPropKey('coin1', event.target.value))}
                      />
                    </FormGroup>
                  </Table>
                }
              />
              <form onSubmit={this.onSubmit}>
                <button type='submit'>Done</button>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default PortfolioManage
