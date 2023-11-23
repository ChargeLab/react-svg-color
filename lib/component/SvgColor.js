import React, { Component } from 'react';
import SvgParser from '../functions/SvgParser';
import isSvg from 'is-svg';

export default class SvgColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      svg: null,
    };
    this.getSvgData = this.getSvgData.bind(this);
    this.unMounted = false;
  }

  componentDidMount() {
    this.getSvgData();
  }

  componentDidUpdate(prevProps) {
    // Check if svg prop has changed
    if (this.props.svg !== prevProps.svg) {
      this.getSvgData();
    }
  }

  componentWillUnmount() {
    this.unMounted = true;
  }

  async getSvgData() {
    let { svg } = this.props;

    let data = await fetch(svg).then((res) => {
      let reader = res.body.getReader();
      let decoder = new TextDecoder('utf-8');

      return reader.read().then((result) => {
        return decoder.decode(result.value);
      });
    });

    if (!this.unMounted) {
      this.setState({ svg: data });
    }
  }

  render() {
    let { svg } = this.state;
    let { colors, width, rotate } = this.props;

    if (svg != null && isSvg(svg)) {
      svg = SvgParser.decode(svg);
      svg =
        colors != null && Array.isArray(colors)
          ? SvgParser.changeColors(svg, colors)
          : svg;
      svg =
        rotate != null && !isNaN(rotate)
          ? SvgParser.changeRotate(svg, rotate)
          : svg;
      svg = SvgParser.encode(svg);

      let style = width != null && !isNaN(width) ? { width: width } : {};

      return React.createElement(
        'div',
        null,
        React.createElement('img', { src: svg, style: style })
      );
    } else {
      return React.createElement('div', null);
    }
  }
}
