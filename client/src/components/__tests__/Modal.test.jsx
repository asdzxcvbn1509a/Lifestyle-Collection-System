import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}} title="T">
        body
      </Modal>
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders as an accessible dialog labelled by its title', () => {
    render(
      <Modal open onClose={() => {}} title="My Title">
        <button>Inside</button>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('dialog', { name: 'My Title' })).toBeInTheDocument();
  });

  it('moves focus into the dialog when opened', () => {
    render(
      <Modal open onClose={() => {}} title="T">
        <button>Inside</button>
      </Modal>
    );
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="T">
        <button>Inside</button>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
