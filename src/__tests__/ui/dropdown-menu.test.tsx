import { render, screen} from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
} from '../../components/ui/dropdown-menu';
import userEvent from '@testing-library/user-event';
describe('DropdownMenu components with Portal', () => {
  const openMenu = () => {
    const trigger = screen.getByText('Open');
    userEvent.click(trigger);
  };

  

  test('DropdownMenuItem renders correctly inside DropdownMenu', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem data-testid="item">Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
  
    openMenu()
  
    const item = await screen.findByTestId('item');
    expect(item).toBeInTheDocument();
  });
  

  test('DropdownMenuCheckboxItem renders checked state',async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked data-testid="checkbox">
            Check Me
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    openMenu();

    const checkbox = await screen.findByTestId('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.getAttribute('data-state')).toBe('checked');
  });

  test('DropdownMenuRadioItem renders correctly', async() => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioItem value="value" data-testid="radio">
            Radio 1
          </DropdownMenuRadioItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    openMenu();

    const radio = await screen.findByTestId('radio');
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveTextContent('Radio 1');
  });

  test('DropdownMenuItem applies custom className', async() => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="custom-class" data-testid="item">
            Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    openMenu();

    const item = await screen.findByTestId('item');
    expect(item.className).toContain('custom-class');
  });

  test('multiple items render correctly', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem data-testid="item1">Item 1</DropdownMenuItem>
          <DropdownMenuItem data-testid="item2">Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    openMenu();

    expect(await screen.findByTestId('item1')).toBeInTheDocument();
    expect(await screen.findByTestId('item2')).toBeInTheDocument();
  });
});
