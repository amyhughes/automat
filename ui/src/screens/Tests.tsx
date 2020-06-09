import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { css, cx } from 'emotion';
import isEqual from 'lodash.isequal';
import { Card, Grid, Button } from '@material-ui/core';
import { AddCircleOutline as AddCircleOutlineIcon, ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { Heading } from '../components/Heading';
import { TestsList } from '../components/TestsList';
import { useApi } from '../lib/useApi';
import { Spinner } from '../components/Spinner';
import { Test, Slot } from '../types';
import { TestEditor } from '../components/TestEditor';
import { ModeToggler } from '../components/ModeToggler';
import { Notification } from '../components/Notification';
import { createTest } from '../utils/createTest';
import { goToTestByIndex } from '../utils/redirects';
import { colors } from '../utils/theme';

const rootStyles = css`
  width: 100%;
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
  border: 5px solid ${isEditing ? colors.yellow : colors.white};
`;

type Props = {
  slots: Slot[];
};

export const Tests = ({ slots }: Props) => {
  const history = useHistory();
  const { slotId, testId } = useParams();
  const { data, loading, error } = useApi<any>(`/tests`);

  const [isEditing, setIsEditing] = useState(false);
  const [workingTests, setWorkingTests] = useState([] as Test[]);
  const [savedTests, setSavedTests] = useState([] as Test[]);
  const [workingTest, setWorkingTest] = useState(undefined as Test | undefined);
  const [testName, setTestName] = useState('');
  const [slotName, setSlotName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const hasChanges = !isEqual(workingTests, savedTests);
    setHasChanges(hasChanges);
  }, [workingTests, savedTests]);

  useEffect(() => {
    if (data) {
      setSavedTests(data);
      setWorkingTests(data);
    }
  }, [data]);

  useEffect(() => {
    const slot = slots.find((slot) => slotId === slot.id);
    if (slot) {
      setSlotName(slot.name);
    }
  }, [slots, slotId]);

  useEffect(() => {
    const workingTest = workingTests.find((test: Test) => testId === test.id);
    if (workingTest) {
      setWorkingTest(workingTest);
    }
  }, [testId, workingTests]);

  useEffect(() => {
    const savedTest = savedTests.find((test: Test) => testId === test.id);
    const testName = savedTest?.name || 'Untitled Test';
    setTestName(testName);
  }, [testId, savedTests, workingTests]);

  const handleCreateTest = () => {
    const testIndex = 0;
    const newTest = createTest({});
    const updatedTests = [newTest, ...workingTests];
    setWorkingTests(updatedTests);
    goToTestByIndex(updatedTests, testIndex, slotId, history);
  };

  const handleUpdateTest = (updatedTest: Test) => {
    const updatedTests = workingTests.map((test: Test) => (updatedTest.id === test.id ? updatedTest : test));
    setWorkingTests([...updatedTests]);
  };

  const handleDeleteTest = (deletedTestId: string) => {
    const testIndex = workingTests.findIndex((test: Test) => deletedTestId === test.id);
    const updatedTests = workingTests.filter((test: Test, index: number) => index !== testIndex);
    setWorkingTests([...updatedTests]);
    goToTestByIndex(updatedTests, testIndex, slotId, history);
  };

  const handleSaveChanges = () => {
    setSavedTests(workingTests);
    setIsEditing(false);
  };

  const handleRevertChanges = () => {
    setWorkingTests(savedTests);
    setIsEditing(false);
  };

  return (
    <div className={rootStyles}>
      {slotName && (
        <>
          <Helmet>
            <title>Automat UI | {slotName} Slot</title>
          </Helmet>
          <Heading>{`${slotName} Slot`}</Heading>
        </>
      )}

      <div className={marginBottom}>
        <ModeToggler
          isEditing={isEditing}
          hasChanges={hasChanges}
          onUnlock={() => setIsEditing(true)}
          onSaveChanges={handleSaveChanges}
          onRevertChanges={handleRevertChanges}
        />
      </div>

      {loading && <Spinner />}

      <Card className={cx(getWorktopStyles(isEditing))}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Button
              className={marginBottom}
              disabled={!isEditing}
              startIcon={<AddCircleOutlineIcon />}
              color="primary"
              variant="contained"
              onClick={handleCreateTest}
            >
              Create Test
            </Button>
            {slotName && workingTests && <TestsList workingTests={workingTests} savedTests={savedTests} slotId={slotId} selectedTestId={testId} />}
          </Grid>
          <Grid item xs>
            {slotName && workingTest && testId && (
              <TestEditor
                workingTest={workingTest}
                testName={testName}
                onTestUpdated={handleUpdateTest}
                onTestDeleted={handleDeleteTest}
                isEditing={isEditing}
              />
            )}
          </Grid>
        </Grid>
      </Card>

      <Button className={cx(marginTop)} startIcon={<ArrowBackIcon />} color="primary" onClick={() => history.push(`/`)}>
        Back to Slots
      </Button>

      {error && <Notification severity="error" keep message="Error fetching list of tests. Please check your connection." />}
    </div>
  );
};
