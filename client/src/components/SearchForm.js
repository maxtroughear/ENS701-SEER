import React, { useState } from 'react';
import { Accordion, Card, Dimmer, Form, Grid, Header, Icon, Loader } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

import Platform from './Platform';
import { useLazyAPI } from '../useAPI';

import style from './SearchForm.module.css';

function DateFields(props) {
  const { onFromDateChange, onToDateChange, fromDateValue, toDateValue } = props;

  function handleChangeFrom(date) {
    onFromDateChange(date)
  }

  function handleChangeTo(date) {
    onToDateChange(date);
  }

  return (
    <Form.Group>
      <Form.Field>
        <label>From</label>
        <DatePicker
          selected={fromDateValue}
          onChange={handleChangeFrom}
          dateFormat="d/MM/yyyy"
        />
      </Form.Field>
      <Form.Field>
        <label>To</label>
        <DatePicker
          selected={toDateValue}
          onChange={handleChangeTo}
          dateFormat="d/MM/yyyy"
        />
      </Form.Field>
    </Form.Group>
  );
}

function SearchForm() {
  const [activeIndex, setActiveIndex] = useState(-1);

  const [title, setTitle] = useState('');
  const [fromDate, setFromDate] = useState(new Date(0));
  const [toDate, setToDate] = useState(new Date());

  const [makeRequest, { data: results, loading }] = useLazyAPI();

  function handleClick(e, titleProps) {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index

    setActiveIndex(newIndex);
  }

  function handleSearch(e) {
    e.preventDefault();
    makeRequest(`/search?title=${title}`)
  }

  function clearSearch() {
    setTitle('');
    setFromDate(new Date(0));
    setToDate(new Date());
  }

  function ResultsComponent() {
    if (loading) {
      return (
        <Dimmer active inverted>
          <Loader>Searching</Loader>
        </Dimmer>
      )
    }
    if (results == null) {
      return null;
    }
    return results.map((r, index) => {
      return (
        <Card fluid key={"search-results-" + index}>
          <Card.Content header={r.title} />
          <Card.Content description={<p>Result description</p>} />
          <Card.Content extra>
            <Icon name='user' />
            Author: 'Someone'
          </Card.Content>
        </Card>
      );
    });
  }

  return (
    <>
      <Platform>
        <Grid.Row>
          <Grid.Column>
            <Header as="h1" textAlign="center">Search</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form onSubmit={handleSearch}>
              <Form.Field>
                <Form.Input
                  fluid
                  icon="search"
                  placeholder="Search..."
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </Form.Field>
              <Accordion exclusive={false}>
                <Accordion.Title
                  active={activeIndex === 0}
                  content='Filter by Date'
                  index={0}
                  onClick={handleClick}
                />
                <Accordion.Content
                  active={activeIndex === 0}
                  content={
                    <DateFields
                      onFromDateChange={setFromDate}
                      onToDateChange={setToDate}
                      fromDateValue={fromDate}
                      toDateValue={toDate}
                    />
                  }
                />
              </Accordion>
              <Form.Group>
                <Form.Button type="submit">Search</Form.Button>
                <Form.Button type="button" onClick={clearSearch}>Clear</Form.Button>
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Platform>
      {/* results */}
      <Platform>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" textAlign="center">Results</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card.Group centered className={style.results}>
              <ResultsComponent />
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Platform>
    </>
  );
}

export default SearchForm;
