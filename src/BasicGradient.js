import React, { Component } from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";

class BasicGradient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_initialized: false,
      number_width: null,
      number_height: null,
      shader: null
    };
  }

  _set_initialData(initialData, callback) {
    console.log("CALLED: _set_initialized");
    this.setState(
      () => {
        return {
          number_width: initialData.width,
          number_height: initialData.height
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

  /////////////////////////////////

  _create_shader() {
    return Shaders.create({
      shader: {
        frag: GLSL/* GLSL */ `
        precision lowp float;
  
        varying vec2 uv;
  
        void main() {
            gl_FragColor = vec4(uv.x,uv.y,0.5,1.0);
        }`
      }
    });
  }

  /////////////////////////////////

  componentDidMount() {
    var initialData = {
      width: 300,
      height: 300
    };
    this._set_initialData(initialData, () => {
      this._set_shader(this._create_shader(), () => {
        this._set_initialized(true);
      });
    });
  }

  render() {
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
          >
            <Node shader={this.state.shader.shader} />
          </Surface>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default BasicGradient;
