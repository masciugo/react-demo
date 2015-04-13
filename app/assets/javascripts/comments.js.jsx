/** @jsx React.DOM */
var Comment = React.createClass({
  render: function () {
    console.debug('Comment render');
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
          {this.props.comment}
      </div>
      );
  }
});


var CommentList = React.createClass({
  render: function () {
    console.debug('CommentList render');
    var commentNodes = this.props.comments.map(function (comment, index) {
      return (
        <Comment author={comment.author} comment={comment.comment} key={index} />
        );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
      );
  }
});

var CommentBox = React.createClass({
  getInitialState: function () {
    console.debug('CommentBox getInitialState');
    return {comments: []};
    // return {comments: [{author: 'corrado', comment: 'yo'}]};
  },
  componentDidMount: function () {
    console.debug('CommentBox componentDidMount');
    this.loadCommentsFromServer();
  },
  loadCommentsFromServer: function () {
    console.debug('CommentBox loadCommentsFromServer');
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function (comments) {
        this.setState({comments: comments});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    console.debug('CommentBox handleCommentSubmit');
    var comments = this.state.comments;
    var newComments = comments.concat([comment]);
    this.setState({comments: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: {"comment": comment},
      success: function(data) {
        this.loadCommentsFromServer();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    console.debug('CommentBox render');
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList comments={this.state.comments} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
      );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function() {
    console.debug('CommentForm handleSubmit');
    var author = this.refs.author.getDOMNode().value.trim();
    var comment = this.refs.comment.getDOMNode().value.trim();
    this.props.onCommentSubmit({author: author, comment: comment});
    this.refs.author.getDOMNode().value = '';
    this.refs.comment.getDOMNode().value = '';
    return false;
  },
  render: function() {
    console.debug('CommentForm render');
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="comment" />
        <input type="submit" value="Post" />
      </form>
      );
  }
});


var ready = function () {
  React.render(
    <CommentBox url="/comments.json" />,
    document.getElementById('comments')
  );
};

$(document).ready(ready);