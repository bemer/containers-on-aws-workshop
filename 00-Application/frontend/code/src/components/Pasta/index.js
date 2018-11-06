import React from 'react'
import './Pasta.css'
import PastaGif from '../../images/pasta.gif'

const Pasta = ({ handleVote, style }) => (
  <section className="wrapper pasta" style={style}>
    <div className="hovereffect pasta">
      <img className="img-responsive pasta" src={PastaGif} alt=""/>
      <div className="overlay pasta">
        <h2>Chicken</h2>
        <p><a href="#" onClick={handleVote.bind(this, 'Pasta')}>VOTE</a></p> 
      </div>
    </div>
  </section>
)

export default Pasta