import React from 'react';
import { css } from 'emotion';
import { TextField } from '@material-ui/core';
import { Test } from '../types';

const rootStyles = css``;

const inputStyles = css`
  width: 100%;
  margin: 0 0 12px 0;
`;

type Props = {
  test: Test;
  isEditing: boolean;
  onTestUpdated: Function;
};

export const TabBasic = ({ test, isEditing, onTestUpdated }: Props) => {
  return (
    <div className={rootStyles}>
      <TextField
        label="Test Name"
        variant="outlined"
        className={inputStyles}
        value={test.name}
        disabled={!isEditing}
        onChange={(e) => onTestUpdated({ ...test, name: e.currentTarget.value })}
      />
      <TextField
        label="Description"
        variant="outlined"
        className={inputStyles}
        value={test.description}
        disabled={!isEditing}
        onChange={(e) => onTestUpdated({ ...test, description: e.currentTarget.value })}
        multiline
        rows={4}
      />
    </div>
  );
};
