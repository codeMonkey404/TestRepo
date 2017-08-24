var APIMixin = {
    componentWillMount: function () {
        this.api = new APIClient();
        this.api.subscribe(this);
    },
    componentWillUnmount: function () {
        this.api.unsubscribe(this);
    },
};


var Board = React.createClass({
    mixins: [APIMixin],
    getInitialState: function () {
        let likes = $("#app").data('likes');
        let message = $("#app").data('message');
        return { likes, message };
    },
    _onLikeClick: function () {
      this.api.addLike();
    },
    onmessage: function (data) {
      if (data == 'like') {
        const { message, likes } = this.state;
        this.setState({ message, likes: likes + 1})
      }
      console.log('onmessage', data);
    },
    render: function () {
        return  <div>
                  <h1>{this.state.message}</h1>
                  <iframe width="420" height="315" src="https://www.youtube.com/embed/et281UHNoOU"></iframe>
                  <br/>
                  <button onClick={this._onLikeClick}>Like</button>
                  <div id="counter">{this.state.likes}</div>
                </div>
    }
});


window.board = ReactDOM.render(React.createElement(Board), $("#app")[0]);
