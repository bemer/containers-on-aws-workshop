import React from 'react'
import Vote from 'containers/Vote'
import './Vote.css'

const VotePage = (props) => {
  return (
    <section>
      <Vote {...props}/>
    </section>
  );
}

export default VotePage