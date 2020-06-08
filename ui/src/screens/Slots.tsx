import React from 'react';
import { Helmet } from 'react-helmet';
import { css } from 'emotion';
import { Heading } from '../components/Heading';
import { ListSlots } from '../components/ListSlots';
import { Slot } from '../types';

const rootStyles = css`
  width: 100%;
`;

type Props = {
  slots: Slot[];
};

export const Slots = ({ slots }: Props) => {
  return (
    <div className={rootStyles}>
      <Helmet>
        <title>Automat UI | Slots</title>
      </Helmet>
      <Heading>Slots</Heading>
      {slots && <ListSlots slots={slots} />}
    </div>
  );
};
