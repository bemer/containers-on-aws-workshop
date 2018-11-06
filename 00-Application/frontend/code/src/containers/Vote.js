import React, { Component } from "react";
import Chicken from 'components/Chicken'
import Pasta from 'components/Pasta'
import Title from 'components/Title'

export default class VoteContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChicken: true,
      isPasta: true,
    }

  }

  handleVote = (text, event) => {
    if (text === 'Chicken') {
      this.setState({ isPasta: !this.state.isPasta })  
    }
    if (text === 'Pasta') {
      this.setState({ isChicken: !this.state.isChicken })
    }
    console.log(this.state.isChicken)
    console.log(this.state.isPasta)
    console.log(text)
    event.preventDefault()
  }

  render() {
    return (
      <section>
        <Title/>
        <div className="options">
          {this.state.isChicken && <Chicken handleVote={this.handleVote}/>}
          {this.state.isPasta && <Pasta handleVote={this.handleVote}/>}
        </div>
      </section>
    )
  }
}
