import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from '../Avatar';

describe('Avatar', () => {
  it('shows the first initial when there is no avatar image', () => {
    render(<Avatar user={{ displayName: 'Neo' }} />);
    expect(screen.getByText('N')).toBeInTheDocument();
  });

  it('renders an img element when avatarUrl is present', () => {
    const { container } = render(
      <Avatar user={{ username: 'x', avatarUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' }} />
    );
    expect(container.querySelector('img')).not.toBeNull();
  });
});
