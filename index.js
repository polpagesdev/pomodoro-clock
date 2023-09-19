let countDown;

class PomodoroClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakTime: 5,
      sessionTime: 25,
      sessionMinutes: 25,
      sessionSeconds: 0,
      timerIsOn: false,
      pause: false,
      session: "Session",
    };
  }

  // Handle incrementing the break time
  incrementBreakTime = () => {
    if (!this.state.timerIsOn && this.state.breakTime < 60) {
      this.setState(prevState => ({
        breakTime: prevState.breakTime + 1,
      }));
    }
  };

  // Handle decrementing the break time
  decrementBreakTime = () => {
    if (!this.state.timerIsOn && this.state.breakTime > 1) {
      this.setState(prevState => ({
        breakTime: prevState.breakTime - 1,
      }));
    }
  };

  // Handle incrementing the session time and update minutes and seconds accordingly
  incrementSession = () => {
    if (this.state.sessionTime < 60 && !this.state.timerIsOn) {
      this.setState(prevState => {
        const newSessionTime = prevState.sessionTime + 1;
        return {
          sessionTime: newSessionTime,
          sessionMinutes: newSessionTime,
          sessionSeconds: 0,
        };
      });
    }
  };

  // Handle decrementing the session time and update minutes and seconds accordingly
  decrementSession = () => {
    if (this.state.sessionTime > 1 && !this.state.timerIsOn) {
      this.setState(prevState => {
        const newSessionTime = prevState.sessionTime - 1;
        return {
          sessionTime: newSessionTime,
          sessionMinutes: newSessionTime,
          sessionSeconds: 0,
        };
      });
    }
  };

  // Start, pause or resume the timer
  timer = () => {
    // If timer is not running, start it
    if (!this.state.timerIsOn) {
      this.setState({ timerIsOn: true });
      
      // Convert minutes and seconds to total seconds
      let seconds = this.state.sessionMinutes * 60 + this.state.sessionSeconds;

      const now = Date.now();
      const then = now + seconds * 1000;

      // Set up the countdown
      countDown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);

        // Play beep sound when time reaches zero
        if (this.state.sessionMinutes === 0 && this.state.sessionSeconds === 0) {
          document.getElementById("beep").play();
        }

        // Stop timer if time runs out and switch to break or session
        if (secondsLeft <= 0) {
          clearInterval(countDown);
          this.break();
          return;
        }

        this.displayTimeLeft(secondsLeft);
      }, 1000);
    } else {
      // Pause the timer
      clearInterval(countDown);
      this.setState({
        timerIsOn: false
      });
    }
  };

  // Update minutes and seconds state from total seconds
  displayTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    this.setState({
      sessionMinutes: minutes,
      sessionSeconds: this.formatSeconds(remainderSeconds),
    });
  };

  // Switch between session and break
  break = () => {
    if (!this.state.pause) {
      this.setState({
        session: "Break",
        sessionMinutes: this.state.breakTime,
        sessionSeconds: 0,
        timerIsOn: false,
        pause: true,
      }, this.timer);
    } else {
      this.setState({
        session: "Session",
        sessionMinutes: this.state.sessionTime,
        sessionSeconds: 0,
        timerIsOn: false,
        pause: false,
      }, this.timer);
    }
  };

  // Reset the timer and all settings to their initial values
  resetTime = () => {
    clearInterval(countDown);
    this.setState({
      session: "Session",
      breakTime: 5,
      sessionTime: 25,
      sessionMinutes: 25,
      sessionSeconds: 0,
      timerIsOn: false,
      pause: false,
    });

    // Reset beep sound
    const beep = document.getElementById("beep");
    beep.currentTime = 0;
    beep.pause();
  };
 
  // Helper function to format seconds
  formatSeconds = (seconds) => {
    return seconds < 10 ? `0${seconds}` : `${seconds}`;
  };

  render() {
    return (
      <div id="container">
        <div id="clock">
          <div id="title">
            <h4>POMODORO CLOCK</h4>
          </div>
          <div id="buttons">
            <div id="break-label">
              BREAK LENGTH
              <div id="break">
                <div
                  id="break-decrement"
                  className="material-icons"
                  onClick={() => this.decrementBreakTime()}
                >
                  remove_circle
                </div>
                <div id="break-length">{this.state.breakTime}</div>
                <div
                  id="break-increment"
                  className="material-icons"
                  onClick={() => this.incrementBreakTime()}
                >
                  add_circle
                </div>
              </div>
            </div>
            <div id="session-label">
              SESSION LENGTH
              <div id="session">
                <div
                  id="session-decrement"
                  className="material-icons"
                  onClick={() => this.decrementSession()}
                >
                  remove_circle
                </div>
                <div id="session-length">{this.state.sessionTime}</div>
                <div
                  id="session-increment"
                  className="material-icons"
                  onClick={() => this.incrementSession()}
                >
                  add_circle
                </div>
              </div>
            </div>
          </div>
          <div id="timer-label">
            <h3>{this.state.session}</h3>
            <div id="time-left">
              <audio id="beep" src="https://www.pacdv.com/sounds/interface_sound_effects/sound10.mp3" type="audio/mp3"></audio>
              {this.state.sessionMinutes}:{this.formatSeconds(this.state.sessionSeconds)}
            </div>
            <div id="button-timer">
              <div
                id="start_stop"
                className="material-icons"
                onClick={() => this.timer()}
              >
                play_circle_filled
              </div>
              <div
                id="reset"
                className="material-icons"
                onClick={() => this.resetTime()}
              >
                replay
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<PomodoroClock />, document.getElementById("root"));
