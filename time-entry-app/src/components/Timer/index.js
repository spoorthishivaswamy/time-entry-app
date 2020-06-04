import React from 'react';
import ms from 'pretty-ms'

class Timer extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      time: 0,
      isOn: false,
      start: 0
    }
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
  }


  startTimer= event => {
    this.setState({
      isOn: true,
      time: this.state.time,
      start: Date.now() - this.state.time
    })
    this.timer = setInterval(() => this.setState({
      time: Date.now() - this.state.start
    }), 1);

    event.preventDefault();
  }
  stopTimer() {
    this.setState({ isOn: false })

    this.props.callbackFromParent(this.state.time)
    clearInterval(this.timer)
  }
  resetTimer() {
    this.setState({ time: 0, isOn: false })
  }
  render() {
    let start = (this.state.time === 0) ?
      <button className="start-btn" onClick={this.startTimer}>start</button> :
      null
    let stop = (this.state.time === 0 || !this.state.isOn) ?
      null :
      <button onClick={this.stopTimer}>stop</button>
    let resume = (this.state.time === 0 || this.state.isOn) ?
      null :
      <button onClick={this.startTimer}>resume</button>
    let reset = (this.state.time === 0 || this.state.isOn) ?
      null :
      <button onClick={this.resetTimer}>reset</button>
    return (
      <div>
        <h3>timer: {ms(this.state.time)}</h3>
        {start}
        {resume}
        {stop}
        {reset}
      </div>
    )
  }
}

export default Timer