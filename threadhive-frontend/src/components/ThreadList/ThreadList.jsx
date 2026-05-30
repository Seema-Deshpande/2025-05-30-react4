import { useDispatch } from "react-redux";
import {
  upvoteThreadThunk,
  downvoteThreadThunk,
} from "../../reducers/threadListSlice";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import VoteButtons from "../Shared/VoteButtons";
import "./ThreadList.css";

export default function ThreadList({ threadsToDisplay }) {
  const dispatch = useDispatch();

  const handleUpvote = (threadId) => {
    dispatch(upvoteThreadThunk(threadId));
  };

  const handleDownvote = (threadId) => {
    dispatch(downvoteThreadThunk(threadId));
  };

  return (
    <Container fluid className="px-0">
      <div role="list">
        {threadsToDisplay.map((thread) => (
          <article key={thread._id} className="thread-card" role="listitem">
            <div className="thread-card-body">
              {/* Voting Section */}
              <div className="vote-section" role="group" aria-label="Thread voting controls">
                <VoteButtons
                  count={thread.voteCount}
                  onUpvote={() => handleUpvote(thread._id)}
                  onDownvote={() => handleDownvote(thread._id)}
                  ariaLabel={thread.title}
                />
              </div>

              {/* Thread Info */}
              <div className="thread-content-section">
                <div className="thread-header">
                  <h3 className="thread-title">{thread.title}</h3>
                  <span className="subreddit-badge" aria-label={`Community: r/${thread.subreddit?.name || "unknown"}`}>
                    r/{thread.subreddit?.name || "unknown"}
                  </span>
                </div>
                <p className="thread-text">{thread.content}</p>
                <Link to={`/thread/${thread._id}`} className="view-thread-btn" aria-label={`View comments for thread: ${thread.title}`}>
                  <span aria-hidden="true">💬</span> View Comments
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}
