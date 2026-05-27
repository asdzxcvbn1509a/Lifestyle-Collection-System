import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RatingStars from '../RatingStars';

describe('RatingStars', () => {
  it('renders 5 star buttons', () => {
    render(<RatingStars value={3} readOnly />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('calls onChange with the clicked star value', () => {
    const onChange = vi.fn();
    render(<RatingStars value={0} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole('button')[2]); // 3rd star
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('toggles off when clicking the current value', () => {
    const onChange = vi.fn();
    render(<RatingStars value={3} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole('button')[2]); // click star 3 again
    expect(onChange).toHaveBeenCalledWith(0);
  });
});
