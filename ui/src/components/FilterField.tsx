import React from 'react';
import { css, cx } from 'emotion';
import { Card } from '@material-ui/core';
import { FilterOption, FilterControl } from '../types';
import { FieldCheckbox } from './FieldCheckbox';
import { FieldRadio } from './FieldRadio';
import { FieldSlider } from './FieldSlider';

const rootStyles = css`
  width: 100%;
  padding: 12px;
`;

type Props = {
  selectedOptionIds: string[];
  options: FilterOption[];
  allowMultiple: boolean;
  control: FilterControl;
  isEditing: boolean;
  onFilterUpdated: Function;
};

export const FilterField = ({ selectedOptionIds, options, allowMultiple, control, isEditing, onFilterUpdated }: Props) => {
  const handleFieldUpdate = (updatedOptions: string[]) => {
    onFilterUpdated(updatedOptions);
  };

  const renderFieldControl = () => {
    if (control === 'options') {
      if (allowMultiple) {
        return <FieldCheckbox options={options} selectedOptions={selectedOptionIds} isEditing={isEditing} onFieldUpdated={handleFieldUpdate} />;
      }
      return <FieldRadio options={options} selectedOptions={selectedOptionIds} isEditing={isEditing} onFieldUpdated={handleFieldUpdate} />;
    } else if (control === 'slider' && options.length === 2) {
      return <FieldSlider options={options} selectedOptions={selectedOptionIds} isEditing={isEditing} onFieldUpdated={handleFieldUpdate} />;
    }
  };

  return (
    <Card elevation={2} className={cx(rootStyles)}>
      {renderFieldControl()}
    </Card>
  );
};
