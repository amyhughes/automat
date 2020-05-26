import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { useApi } from './lib/useApi';
import { Spinner } from './components/Spinner';
import { FeedbackMessage } from './components/FeedbackMessage';

import { Shell } from './Shell';
import { Slots } from './screens/Slots';
import { Tests } from './screens/Tests';

export const App = () => {
  const { data, loading, error } = useApi<any>(`http://localhost:9000/admin/slots`);

  return (
    <Shell>
      <Grid container spacing={3}>
        {loading && <Spinner />}
        {data && data.slots && (
          <Switch>
            <Route exact path="/">
              <Slots slots={data.slots} />
            </Route>
            <Route exact path="/slots/:slotId">
              <Tests slots={data.slots} />
            </Route>
          </Switch>
        )}
        {error && <FeedbackMessage severity="error" keep message="Error fetching list of slots. Please check your connection." />}
      </Grid>
    </Shell>
  );
};
