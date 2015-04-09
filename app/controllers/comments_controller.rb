class CommentsController < ApplicationController

  def index
    @comments = Comment.all
    respond_to do |wants|
      wants.json  { render json: @comments }
    end
  end

  def create
    @comment = Comment.create(comment_params)
    respond_to do |wants|
      wants.json  { render json: @comment }
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:author, :comment)
  end

end
