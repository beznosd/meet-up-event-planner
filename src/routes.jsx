import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import Login from './components/Login';
import SignUp from './components/SignUp';
import EventsList from './components/EventsList';
import CreateEvent from './components/CreateEvent';
import Event from './components/Event';
import NotFound from './components/NotFound';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={SignUp} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={SignUp} />
    <Route path="/events">
      <IndexRoute component={EventsList} />
      <Route path=":eventId" component={Event} />
    </Route>
    <Route path="/create-event" component={CreateEvent} />
    <Route path="*" component={NotFound} />
  </Route>
);