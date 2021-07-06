import React, { useEffect } from 'react';
import { MainLayout } from 'layout';
import { Route, Switch } from 'react-router-dom';
import {
  CompanyManager,
  ConsumptionMonitoring,
  FleetMonitoring,
  Summary,
  VesselParticular,
  DataMonitoring,
} from './pages';

import { CompanyAPI } from 'api';
import { batch, useDispatch } from 'react-redux';
import actionCreator, {
  selectCompanyFacadeAction,
} from 'redux/reducer/actionCreator';

const { companyActions } = actionCreator;

const Main = () => {
  const dispatch = useDispatch();
  const getBusinessCompanies = async () => {
    try {
      const { info, rows } = await CompanyAPI.getBusinessCompanies();

      batch(() => {
        dispatch(companyActions.setCompanies(rows));
        dispatch(companyActions.setServiceData(info));
        selectCompanyFacadeAction(dispatch, rows[0]);
      });
    } catch (error) {}
  };

  useEffect(() => {
    getBusinessCompanies();
  }, []);

  return (
    <MainLayout>
      <Switch>
        <Route path="/m/particular" component={VesselParticular} />
        <Route
          path="/m/consumptionMonitoring"
          component={ConsumptionMonitoring}
        />
        <Route path="/m/fleetMonitoring" component={FleetMonitoring} />
        <Route path="/m/summary" component={Summary} />
        <Route path="/m/companyManager" component={CompanyManager} />
        <Route path="/m/dataMonitoring" component={DataMonitoring} />
      </Switch>
    </MainLayout>
  );
};

export default Main;
