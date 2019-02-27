/* eslint  react/no-did-update-set-state : 0 */
/* eslint  react/no-set-state : 0 */
import React, {Component} from 'react';
import ReactPlayer from 'react-player';


export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startAt: 0,
      playerReady: false
    };
  }

  componentWillMount() {
    this.updateStartAt(this.props);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url) {
      this.updateStartAt(nextProps);
    }
  }

  componentDidUpdate () {
    if (this.player && this.state.playerReady && this.state.startAt !== undefined) {
      // console.log('seek to', this.state.startAt);
      this.player.seekTo(this.state.startAt);
      this.setState({
        startAt: undefined
      });
    }
  }

  onPlayerReady = () => {
    // console.log('on player ready');
    this.setState({
      playerReady: true
    });
  }

  updateStartAt = props => {
    const {url} = props;
    const vimeoRegex = /#t=([\d]+)s/;
    // console.log('url', url);
    if (url.indexOf('vimeo') > -1 && vimeoRegex.exec(url)) {
      const match = vimeoRegex.exec(url);
      const startAt = +match[1];
      // console.log('start at', startAt);
      this.setState({
        startAt
      });
    }
  }


  render() {

    const {
      props: {
        url
      },
      onPlayerReady
    } = this;

    const bindRef = player => {
      this.player = player;
    };

    return (
      <ReactPlayer
        ref={bindRef}
        url={url}
        onReady={onPlayerReady}
        playing />
    );
  }
}
