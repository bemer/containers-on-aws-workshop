import React, { Component } from "react";
import Chicken from 'components/Chicken'
import Pasta from 'components/Pasta'
import Title from 'components/Title'
import axios from 'axios'
import { API_URL } from '../api-config';
import './Vote.css'

export default class VoteContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChicken: true,
      isPasta: true,
      isVote: false,
      voteCount: 0
    }

  }

  handleVote = (text, event) => {
    if (text === 'Chicken') {
      axios.post(`${API_URL}/api/votes/chicken`)
      .then(response => {
        axios.get(`${API_URL}/api/votes/chicken`)
        .then(data => {
          this.setState({ voteCount: data.data.Count })
          console.log(data.data);
        });
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      this.setState({ isPasta: !this.state.isPasta })
      this.setState({ isVote: !this.state.isVote })
    }
    if (text === 'Pasta') {
      axios.post(`${API_URL}/api/votes/pasta`)
      .then(response => {
        axios.get(`${API_URL}/api/votes/pasta`)
        .then(data => {
          this.setState({ voteCount: data.data.Count })
          console.log(data.data);
        });
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      this.setState({ isChicken: !this.state.isChicken })
      this.setState({ isVote: !this.state.isVote })
    }
    event.preventDefault()
  }

  render() {
    return (
      <section>
        <Title/>
        <div className="options">
          {this.state.isChicken && <Chicken handleVote={this.handleVote}
                                            isVote={this.state.isVote}
                                            voteCount={this.state.voteCount}/>}
          {this.state.isPasta && <Pasta handleVote={this.handleVote}
                                        isVote={this.state.isVote}
                                        voteCount={this.state.voteCount}/>}
        </div>
      </section>
    )
  }
}
