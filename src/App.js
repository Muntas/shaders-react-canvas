import React, { Component } from "react";
import "./App.scss";

import BasicGradient from "./BasicGradient";
import BasicVectors from "./BasicVectors";
import BasicUniforms from "./BasicUniforms";

var canvasDict = {
  BasicGradient,
  BasicVectors,
  BasicUniforms
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_loadHub: true,
      string_currentCanvas: null
    };

    this._action_closeCanvas = this._action_closeCanvas.bind(this);
  }

  _set_loadHub(bool_loadHub, callback) {
    console.log("CALLED: _set_loadHub");
    this.setState(
      () => {
        return { bool_loadHub };
      },
      () => {
        console.log("FINISHED: _set_loadHub");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_currentCanvas(string_currentCanvas, callback) {
    console.log("CALLED: _set_currentCanvas");
    this.setState(
      () => {
        return { string_currentCanvas };
      },
      () => {
        console.log("FINISHED: _set_currentCanvas");
        if (callback) {
          callback();
        }
      }
    );
  }

  //////////////////////////////////////////////////

  _render_hub() {
    return Object.keys(canvasDict).map(name => {
      return (
        <div key={name}>
          <div className="button" onClick={() => this._action_openCanvas(name)}>
            {name}
          </div>
        </div>
      );
    });
  }

  _render_canvas() {
    var Comp = canvasDict[this.state.string_currentCanvas];
    return <Comp _action_closeCanvas={this._action_closeCanvas} />;
  }

  //////////////////////////////////////////////////

  _action_openCanvas(name) {
    this._set_currentCanvas(name, () => {
      this._set_loadHub(false);
    });
  }

  _action_closeCanvas() {
    this._set_loadHub(true);
  }

  //////////////////////////////////////////////////

  render() {
    return (
      <div className="body">
        {this.state.bool_loadHub ? this._render_hub() : this._render_canvas()}
      </div>
    );
  }
}

export default App;
