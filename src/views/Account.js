import React from 'react'

import AuthUserContext from '../components/AuthUserContext'
import { PasswordForgetForm } from '../views/PasswordForget'
import PasswordChangeForm from '../components/PasswordChange'
import withAuthorization from '../components/withAuthorization'

const AccountPage = () =>
  <AuthUserContext.Consumer>
    {authUser =>
      <div>
        <h1>Account: {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(AccountPage)
