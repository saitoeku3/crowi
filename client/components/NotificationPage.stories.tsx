import React from 'react'
import Crowi from 'client/util/Crowi'
import NotificationPage from './NotificationPage'

export default { title: 'NotificationPage' }

const crowi = new Crowi({ user: {}, csrfToken: '' }, window)

export const Default = () => <NotificationPage crowi={crowi} />
