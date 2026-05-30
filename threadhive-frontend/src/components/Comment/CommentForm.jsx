import { Card, Form, Button } from "react-bootstrap";
import './CommentForm.css';

export default function CommentForm({ commentText, onCommentChange, onPostComment, disabled }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onPostComment) {
      onPostComment();
    }
  };

  return (
    <Card className="add-comment-section mb-4 border-0">
      <Card.Body>
        <h5 className="add-comment-title">Add a Comment</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="commentTextarea" className="mb-3">
            <Form.Label htmlFor="comment-input">Comment Text</Form.Label>
            <Form.Control
              id="comment-input"
              as="textarea"
              rows={4}
              placeholder="Write a comment..."
              value={commentText}
              onChange={onCommentChange}
              required
              className="comment-textarea"
              aria-required="true"
              aria-describedby="comment-hint"
            />
            <small id="comment-hint" className="form-text text-muted">Share your thoughts on this thread. Be respectful and constructive.</small>
          </Form.Group>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={disabled || !commentText?.trim()}
            className="post-comment-btn"
            aria-label="Post comment"
          >
            <span aria-hidden="true">📝</span> Post Comment
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
