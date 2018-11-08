import React from 'react'
import './Pasta.css'
import PastaGif from '../../images/pasta.gif'

const Pasta = ({ handleVote, isVote, voteCount }) => (
  <section className="wrapper pasta">
    {!isVote ?
      <div className="hovereffect pasta">
        <img className="img-responsive pasta" src={PastaGif} alt=""/>
        <div className="overlay pasta">
          <h2>Pasta</h2>
          <p><a href="#" onClick={handleVote.bind(this, 'Pasta')}>VOTE</a></p> 
        </div>
      </div>
      :
      <div className="hovereffect-vote pasta">
        <img className="img-responsive-vote pasta" src={PastaGif} alt=""/>
        <div className="overlay-vote pasta">
          <h2>{voteCount} votes</h2>
        </div>
      </div>}
  </section>
)

export default Pasta