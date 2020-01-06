import React from 'react';
import { Button, ButtonGroup, Typography } from '@material-ui/core';

import Header from '../../../components/Header/Header';

describe('Header', () => {
  it('should render without crashing', () => {
    global.mount(<Header />);
  });

  it('should contain a title and two buttons', () => {
    const header = global.mount(<Header />);

    expect(header.exists()).toBeTruthy();

    const title = header.find(Typography);
    expect(title.exists()).toBeTruthy();
    expect(title.text()).toBe('Header.title');

    const buttonGroup = header.find(ButtonGroup);
    expect(buttonGroup.exists()).toBeTruthy();
    const buttons = buttonGroup.find(Button);
    expect(buttons).toHaveLength(2);
  });
});
