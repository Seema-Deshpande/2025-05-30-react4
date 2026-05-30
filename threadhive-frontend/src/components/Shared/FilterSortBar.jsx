import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';

export default function FilterSortBar({ sortBy, onSortChange }) {
  return (
    <Row className="mb-3">
      <Col>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="sort-select" className="small fw-semibold" style={{ color: 'var(--text-muted)' }}>Sort by:</label>
          <fieldset>
            <legend className="visually-hidden">Sort options</legend>
            <ButtonGroup size="sm" role="group" aria-labelledby="sort-label">
              <Button
                id="sort-select"
                variant={sortBy === 'newest' ? 'primary' : 'outline-secondary'}
                onClick={() => onSortChange('newest')}
                className={sortBy === 'newest' ? 'sort-btn-active' : 'sort-btn'}
                aria-pressed={sortBy === 'newest'}
              >
                <span aria-hidden="true">🆕</span> Newest
              </Button>
              <Button
                variant={sortBy === 'most-upvoted' ? 'primary' : 'outline-secondary'}
                onClick={() => onSortChange('most-upvoted')}
                className={sortBy === 'most-upvoted' ? 'sort-btn-active' : 'sort-btn'}
                aria-pressed={sortBy === 'most-upvoted'}
              >
                <span aria-hidden="true">🔥</span> Most Upvoted
              </Button>
            </ButtonGroup>
          </fieldset>
        </div>
      </Col>
    </Row>
  );
}
