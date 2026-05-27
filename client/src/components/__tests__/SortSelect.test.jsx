import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SortSelect from '../SortSelect';

describe('SortSelect', () => {
  it('renders all four sort options', () => {
    render(<SortSelect value="newest" onChange={() => {}} />);
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  it('calls onChange with the selected value', () => {
    const onChange = vi.fn();
    render(<SortSelect value="newest" onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'rating' } });
    expect(onChange).toHaveBeenCalledWith('rating');
  });
});
