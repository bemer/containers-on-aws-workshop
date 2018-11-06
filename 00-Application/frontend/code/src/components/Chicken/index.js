import React from 'react'
import './Chicken.css'
import ChickenGif from '../../images/chicken.gif'

const Chicken = ({ handleVote }) => (
  <section className="wrapper chicken">
    <div className="hovereffect chicken">
      <img className="img-responsive chicken" src={ChickenGif} alt=""/>
      <div className="overlay chicken">
        <h2>Chicken</h2>
        <p><a href="#" onClick={handleVote.bind(this, 'Chicken')}>VOTE</a></p> 
      </div>
    </div>
  </section>
)

export default Chicken