import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from '../components/ui/Avatar.js';

describe('Shared Avatar Component', () => {
  it('renders initial dynamically from display name when no picture exists', () => {
    render(<Avatar name="Jui Tawde" size="md" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders initial correctly for Rahul Sharma', () => {
    render(<Avatar name="Rahul Sharma" size="md" />);
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('renders image when src is valid and does not show initial simultaneously', () => {
    render(<Avatar name="Jui Tawde" src="https://example.com/avatar.jpg" size="md" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(screen.queryByText('J')).toBeNull();
  });

  it('falls back to initial gracefully when image fails to load (onError)', () => {
    render(<Avatar name="Jui Tawde" src="https://example.com/broken.jpg" size="md" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders online presence indicator when isOnline is true', () => {
    const { container } = render(<Avatar name="Alex" isOnline={true} size="md" />);
    const dot = container.querySelector('span[title="Online"]');
    expect(dot).toBeInTheDocument();
  });
});
