import React from 'react'
import './Chicken.css'
import ChickenGif from '../../images/chicken.gif'

const Chicken = ({ handleVote, isVote, voteCount }) => (
  <section className="wrapper chicken">
    {!isVote ?
      <div className="hovereffect chicken"> 
        <img className="img-responsive chicken" src={ChickenGif} alt=""/>
        <div className="overlay chicken">
          <h2>Chicken</h2>
          <p><a href="#" onClick={handleVote.bind(this, 'Chicken')}>VOTE</a></p> 
        </div>
      </div>
      :
      <div className="hovereffect-vote chicken">
        <img className="img-responsive-vote chicken" src={ChickenGif} alt=""/>
        <div className="overlay-vote chicken">
          <h2>{voteCount} votes</h2>
        </div>
      </div>}
  </section>
)

export default Chicken