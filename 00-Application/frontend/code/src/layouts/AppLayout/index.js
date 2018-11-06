import React from 'react'
import './AppLayout.css'

const AppLayout = ({ children, ...props }) => (
  <main>
    {children}
  </main>
)

export default AppLayout