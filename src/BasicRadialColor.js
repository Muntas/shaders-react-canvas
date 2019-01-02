import React, { Component } from "react";
import InputRange from "react-input-range";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";

import "react-input-range/lib/css/index.css";

class BasicRadialColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_initialized: false,
      number_width: null,
      number_height: null,
      number_fromColor: null,
      number_toColor: null,
      shader: null
    };
    this._action_change_fromColor = this._action_change_fromColor.bind(this);
    this._action_change_toColor = this._action_change_toColor.bind(this);
  }

  _set_initialData(initialData, callback) {
    console.log("CALLED: _set_initialized");
    this.setState(
      () => {
        return {
          number_width: initialData.width,
          number_height: initialData.height,
          number_fromColor: initialData.fromColor,
          number_toColor: initialData.toColor
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

  _set_fromColor(number_fromColor, callback) {
    console.log("CALLED: _set_fromColor");
    this.setState(
      () => {
        return {
          number_fromColor
        };
      },
      () => {
        console.log("FINISHED: _set_fromColor");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_toColor(number_toColor, callback) {
    console.log("CALLED: _set_toColor");
    this.setState(
      () => {
        return {
          number_toColor
        };
      },
      () => {
        console.log("FINISHED: _set_toColor");
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
        precision highp float;
        
        uniform float u_fromColor;
        uniform float u_toColor;
        varying vec2 uv;
        
        void main() {
          float PI = 3.141592653589793;
          vec2 center = vec2(0.5,0.5);
          float distance = distance(uv,center);
          if (distance > 0.5) {
            gl_FragColor = vec4(1.0,1.0,1.0,0.0);
          } else {
            gl_FragColor = mix(
              vec4(abs(sin(u_fromColor)),abs(sin(u_fromColor+PI/4.0)),abs(sin(u_fromColor+PI/2.0)),1.0),
              vec4(abs(sin(u_toColor)),abs(sin(u_toColor+PI/4.0)),abs(sin(u_toColor+PI/2.0)),1.0),
              distance
            );
          };
        }`
      }
    });
  }

  /////////////////////////////////

  _action_change_fromColor(fromColor) {
    this._set_fromColor(fromColor);
  }

  _action_change_toColor(toColor) {
    this._set_toColor(toColor);
  }

  /////////////////////////////////

  componentDidMount() {
    var initialData = {
      width: 1000,
      height: 1000,
      fromColor: 0,
      toColor: 2 * Math.PI
    };
    this._set_initialData(initialData, () => {
      this._set_shader(this._create_shader(), () => {
        this._set_initialized(true);
      });
    });
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
          <p>From color:</p>
          <InputRange
            step={0.01}
            maxValue={2 * Math.PI}
            minValue={0}
            value={this.state.number_fromColor}
            onChange={fromColor => this._action_change_fromColor(fromColor)}
          />
          <p>To color:</p>
          <InputRange
            step={0.01}
            maxValue={2 * Math.PI}
            minValue={0}
            value={this.state.number_toColor}
            onChange={toColor => this._action_change_toColor(toColor)}
          />
        </div>
        {this.state.bool_initialized ? (
          <Surface
            width={this.state.number_width}
            height={this.state.number_height}
          >
            <Node
              shader={this.state.shader.shader}
              uniforms={{
                u_fromColor: this.state.number_fromColor,
                u_toColor: this.state.number_toColor
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

export default BasicRadialColor;
