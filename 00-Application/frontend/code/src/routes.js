import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "./containers/NotFound";
import Vote from "./pages/Vote";
import AppLayout from 'layouts/AppLayout'

const Layout = ({ component: Component, ...props }) => {
  return (
    <AppLayout {...props}>
      <Component {...props}/>
    </AppLayout>
  );
}

export default ({ childProps }) => {
  return (
    <Switch>
      <Route path="/" exact component={(props) => <Layout {...props} {...childProps} component={Vote} />} />
      <Route component={NotFound} />
    </Switch>
    );
}