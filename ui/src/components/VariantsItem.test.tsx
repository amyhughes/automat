import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { VariantsItem } from '../components/VariantsItem';
import { mockVariants } from '../fixtures/variants';

const defaultProps = {
  index: 0,
  variant: { ...mockVariants[0] },
  variants: [...mockVariants],
  isEditing: false,
  onVariantDeleted: jest.fn(),
  onVariantUpdated: jest.fn(),
};

describe('VariantsItem', () => {
  it('should render a variant name and description', () => {
    const { getByText } = render(<VariantsItem {...defaultProps} />);

    const name = getByText('Subscriptions Banner');
    expect(name).toBeInTheDocument();

    const description = getByText('A Guardian subscriptions advert in banner format');
    expect(description).toBeInTheDocument();
  });

  it('should render two buttons', () => {
    const { getAllByRole } = render(<VariantsItem {...defaultProps} />);

    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  it('should render a Confirmation dialog and call the appropriate handler', () => {
    const onVariantDeleted = jest.fn();

    const { getByText, getByLabelText } = render(<VariantsItem {...defaultProps} isEditing={true} onVariantDeleted={onVariantDeleted} />);

    fireEvent.click(getByLabelText('Delete Variant'));
    expect(getByText('Delete variant?')).toBeInTheDocument();

    fireEvent.click(getByLabelText('Confirm delete Variant'));
    expect(onVariantDeleted).toHaveBeenCalled();
  });

  it('should render a Variants dialog when Update button is clicked', () => {
    const { getByText, getByLabelText } = render(<VariantsItem {...defaultProps} isEditing={true} />);

    fireEvent.click(getByLabelText('Update Variant'));
    expect(getByText('Select Component')).toBeInTheDocument();
  });
});
