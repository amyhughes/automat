import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { css, cx } from 'emotion';
import { Card, Grid, Typography, Button } from '@material-ui/core';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { ListTests } from '../components/ListTests';
import { useApi } from '../lib/useApi';
import { Spinner } from '../components/Spinner';
import { Test, SimpleTest, Slot } from '../types';
import { TestEditor } from '../components/TestEditor';
import { EditModeToggle } from '../components/EditModeToggle';
import { createTest } from '../lib/testFactory';

const rootStyles = css`
  width: 100%;
`;

const headingStyles = css`
  font-weight: bold;
  margin: 20px auto;
`;

const marginTop = css`
  margin-top: 16px;
`;

const marginBottom = css`
  margin-bottom: 16px;
`;

const getWorktopStyles = (isEditing: boolean) => css`
  padding: 12px;
  border-radius: 4px;
  border: 5px solid ${isEditing ? '#ffeb3b' : 'white'};
`;

type Props = {
  slots: Slot[];
};

const getDerivedSimpleTest = (tests: Test[]): SimpleTest[] => {
  return tests.map((test: Test) => {
    const { id, name, description, isEnabled } = test;
    return { id, name, description, isEnabled };
  });
};

export const Tests = ({ slots }: Props) => {
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);

  const { slotId, testId } = useParams();
  const slot = slots.find((slot) => slot.id === slotId);

  const { data, loading } = useApi<any>(`http://localhost:3004/tests`);
  const [tests, setTests] = useState([] as Test[]);
  const [originalTests, setOriginalTests] = useState([] as Test[]);
  const [simpleTests, setSimpleTests] = useState([] as SimpleTest[]);

  useEffect(() => {
    if (data) {
      setSimpleTests(getDerivedSimpleTest(data));
      setOriginalTests(data);
      setTests(data);
    }
  }, [data]);

  let test: Test | undefined;
  let simpleTest: SimpleTest | undefined;
  if (tests) {
    test = tests.find((test: Test) => test.id === testId);
    simpleTest = simpleTests.find((test: SimpleTest) => test.id === testId);
  }

  const onCreateTest = () => {
    const newTest = createTest({});
    const updatedTestList = [newTest, ...tests];
    setTests(updatedTestList);
    setSimpleTests(getDerivedSimpleTest(updatedTestList));
  };

  const onUpdateTest = (updatedTest: Test) => {
    const updatedTestWithDate = {
      ...updatedTest,
      update: new Date(),
    };
    const updatedTestList = tests.map((test: Test) => (updatedTest.id === test.id ? updatedTestWithDate : test));
    setTests([...updatedTestList]);
  };

  const onDeleteTest = (deletedTestId: string) => {
    const updatedTestList = tests.filter((test: Test) => deletedTestId !== test.id);
    setTests([...updatedTestList]);
  };

  const onSaveChanges = () => {
    // TODO: API WORK
    setSimpleTests(getDerivedSimpleTest(tests));
    setOriginalTests(tests);
    setIsEditing(false);
  };

  const onRevertChanges = () => {
    setTests(originalTests);
    setIsEditing(false);
  };

  return (
    <div className={rootStyles}>
      <Helmet>
        <title>Automat UI | {slot?.name} Slot</title>
      </Helmet>
      <Typography component="h1" variant="h4" color="inherit" className={cx(headingStyles)}>
        {slot?.name} Slot
      </Typography>

      <div className={marginBottom}>
        <EditModeToggle isEditing={isEditing} onUnlock={() => setIsEditing(true)} onSave={onSaveChanges} onRevert={onRevertChanges} />
      </div>

      {loading && <Spinner />}

      <Card className={cx(getWorktopStyles(isEditing))}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Button className={marginBottom} disabled={!isEditing} startIcon={<AddIcon />} color="primary" variant="contained" onClick={onCreateTest}>
              Create Test
            </Button>
            {slot && tests && <ListTests tests={tests} simpleTests={simpleTests} slot={slot} selectedTestId={test?.id} />}
          </Grid>
          <Grid item xs>
            {slot && tests && test && simpleTest && (
              <TestEditor test={test} simpleTest={simpleTest} onTestUpdated={onUpdateTest} onTestDeleted={onDeleteTest} isEditing={isEditing} />
            )}
          </Grid>
        </Grid>
      </Card>

      <Button className={cx(marginTop)} startIcon={<ArrowBackIcon />} color="primary" onClick={() => history.push(`/`)}>
        Back to Slots
      </Button>
    </div>
  );
};
