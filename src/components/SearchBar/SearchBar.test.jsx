import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import { test, expect, vi } from 'vitest';

test('pressing Enter triggers onSearch', async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  const onSearchTermChange = vi.fn();

  render(
    <SearchBar searchTerm="metalica" onSearchTermChange={onSearchTermChange} onSearch={onSearch} />
  );

  const input = screen.getByPlaceholderText(/search for a song or artist/i);
  await user.click(input);
  await user.keyboard('{Enter}');

  expect(onSearch).toHaveBeenCalledTimes(1);
});
