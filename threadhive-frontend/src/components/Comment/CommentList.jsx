import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Button } from "react-bootstrap";
import {
  upvoteCommentThunk,
  downvoteCommentThunk,
} from "../../reducers/commentSlice.js";
import { selectComments } from "../../reducers/commentSlice.js";
import "./CommentList.css";

export default function CommentList() {
  const dispatch = useDispatch();
  const comments = useSelector(selectComments);

  const handleUpvote = (commentId) => {
    dispatch(upvoteCommentThunk(commentId));
  };

  const handleDownvote = (commentId) => {
    dispatch(downvoteCommentThunk(commentId));
  };

  return (
    <div className="d-flex flex-column gap-3">
      {comments.map((comment) => {
        return (
          <article key={comment._id} className="comment-card">
            <Card.Body>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="comment-avatar" aria-hidden="true">
                    {(comment.user?.name ?? "U")[0].toUpperCase()}
                  </div>
                  <span className="comment-author">
                    {comment.user?.name ?? "Unknown"}
                  </span>
                </div>
                <span className="badge comment-badge" aria-label="Comment">
                  <i className="bi bi-chat-left-text me-1" aria-hidden="true"></i>
                  Comment
                </span>
              </div>

              {/* Content */}
              <p className="comment-content">{comment.content}</p>

              {/* Voting */}
              <div className="d-flex align-items-center gap-2" role="group" aria-label="Vote buttons">
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => handleUpvote(comment._id)}
                  aria-label={`Upvote comment by ${comment.user?.name ?? "Unknown"}`}
                  className="comment-vote-btn"
                  type="button"
                >
                  <i className="bi bi-arrow-up" aria-hidden="true"></i>
                </Button>
                <span className="comment-vote-count" aria-label={`${comment.voteCount ?? 0} votes`}>
                  {comment.voteCount ?? 0}
                </span>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => handleDownvote(comment._id)}
                  aria-label={`Downvote comment by ${comment.user?.name ?? "Unknown"}`}
                  className="comment-vote-btn"
                  type="button"
                >
                  <i className="bi bi-arrow-down" aria-hidden="true"></i>
                </Button>
              </div>
            </Card.Body>
          </article>
        );
      })}
    </div>
  );
}
