import React, { Component } from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";

class BasicUniforms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_initialized: false,
      number_width: null,
      number_height: null,
      shader: null,
      number_mouseX: null,
      number_mouseY: null,
      number_elapsedTime: null,
      number_timeIncrement: null
    };
    this.timer = null;
    this._event_mouseListener = this._event_mouseListener.bind(this);
  }

  _set_initialData(initialData, callback) {
    console.log("CALLED: _set_initialized");
    this.setState(
      () => {
        return {
          number_width: initialData.width,
          number_height: initialData.height,
          number_mouseX: initialData.x,
          number_mousY: initialData.y,
          number_elapsedTime: initialData.elapsedTime,
          number_timeIncrement: initialData.timeIncrement
        };
      },
      () => {
        console.log("FINISHED: _set_initialized");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_initialized(bool_initialized, callback) {
    console.log("CALLED: _set_initialized");
    this.setState(
      () => {
        return {
          bool_initialized
        };
      },
      () => {
        console.log("FINISHED: _set_initialized");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_shader(shader, callback) {
    console.log("CALLED: _set_shader");
    this.setState(
      () => {
        return {
          shader
        };
      },
      () => {
        console.log("FINISHED: _set_shader");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_mousePosition(mousePosition, callback) {
    // console.log("CALLED: _set_mousePosition");
    this.setState(
      () => {
        return {
          number_mouseX: mousePosition.x,
          number_mouseY: mousePosition.y
        };
      },
      () => {
        // console.log("FINISHED: _set_mousePosition");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_updates(callback) {
    this.timer = setInterval(() => {
      // console.log("CALLED: _set_updates");
      this.setState(
        prevState => {
          return {
            number_elapsedTime:
              prevState.number_elapsedTime + this.state.number_timeIncrement
          };
        },
        () => {
          // console.log("FINISHED: _set_updates");
        }
      );
    }, 30);
    callback();
  }

  /////////////////////////////////

  _create_shader() {
    return Shaders.create({
      shader: {
        frag: GLSL/* GLSL */ `
        precision highp float;
        
        uniform float u_time;
        uniform float u_width;
        uniform float u_height;
        uniform float u_mouseX;
        uniform float u_mouseY;
        varying vec2 uv;
        
        void main() {
            gl_FragColor = vec4(abs(sin(u_time)),abs(uv.x-u_mouseX/u_width),abs(uv.y-u_mouseY/u_height),1.0);
        }`
      }
    });
  }

  /////////////////////////////////

  _event_mouseListener(event) {
    var mousePosition = {
      x: event.clientX,
      y: event.clientY
    };
    this._set_mousePosition(mousePosition);
  }

  /////////////////////////////////

  componentDidMount() {
    var initialData = {
      width: 1000,
      height: 1000,
      x: 0,
      y: 0,
      elapsedTime: 0,
      timeIncrement: 0.1
    };
    this._set_initialData(initialData, () => {
      this._set_shader(this._create_shader(), () => {
        this._set_updates(() => {
          this._set_initialized(true);
        });
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  /////////////////////////////////

  render() {
    // console.log("~~~RENDER~~~");
    return (
      <div>
        <div>
          <p onClick={this.props._action_closeCanvas} className="button">
            close
          </p>
        </div>
        {this.state.bool_initialized ? (
          <Surface
            width={this.state.number_width}
            height={this.state.number_height}
            onMouseMove={this._event_mouseListener}
          >
            <Node
              shader={this.state.shader.shader}
              uniforms={{
                u_time: this.state.number_elapsedTime,
                u_width: this.state.number_width,
                u_height: this.state.number_height,
                u_mouseX: this.state.number_mouseX,
                u_mouseY: this.state.number_mouseY
              }}
            />
          </Surface>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default BasicUniforms;
