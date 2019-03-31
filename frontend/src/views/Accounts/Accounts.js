import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import AccountsTable from '../../components/Accounts/AccountsTable';

import axios from 'axios';

function isEmpty(obj) {
  console.log(obj);
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
  
}

class Accounts extends Component {

  state = {
    accounts: [],
    show: false,
  }

  getDerivedStateFromProps() {
    this.setState({ show: false });
    let status = this.props.match.params.status;
    if (status === ""){
      status = "un_resolved";
    }
    console.log(status);
    axios.get(`http://0.0.0.0:8080/api/accounts?include=` + status)
      .then(res => {
        const accounts = res.data;
        this.setState({ accounts: accounts });
        this.setState({ show: true });
    })
  }

  render() {
    if (this.state.show && this.state.accounts.length != 0){
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={10}>
            <Card>
              <CardHeader>
                Active Accounts
              </CardHeader>
              <CardBody>
                <AccountsTable accountsData = {this.state.accounts}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  } else if (this.state.accounts.length == 0 && this.state.show) {
    return (
      <div>
        No accounts with this status.
      </div>
    );
  } else if (!this.state.show) {
    return (
      <div>
        Loading accounts...
      </div>
    );
  }
} 
}

export default Accounts;
