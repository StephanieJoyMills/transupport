import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';
import SelectDecision from "./SelectDecision";
import Insights from "./Insights";
import Status from "./Status";
import EmailView from "../Emails/EmailView";

//import account from '../../sampledata';
import {getETA} from '../../math/getETA';
import {getSuggestedDecisions} from "../../math/getSuggestion";
import {getStatus} from "../../math/getStatus";
import axios from 'axios';


function CustomerPriority(props){
  if (props.p === "TRUE"){
    return (
      <Row>
        <strong><i className="icon-flag pr-1"></i>This is a priority customer!</strong>
      </Row>
    );
  }
  return null;
}

function IsInfeasible(props){
if (props.dsm == "TRUE"){
  return (
    <div style={{color: "red"}} className="mt-2 mb-2">
      <strong><i className="icon-ban pr-1"></i>This account is cancelled!</strong>
    </div>
  );
} else if (props.s1 === "INFEASIBLE" || props.s2 === "INFEASIBLE"){
    return (
      <div style={{color: "red"}} className="mt-2 mb-2">
        <strong><i className="icon-flag pr-1"></i>This account requires special accomodations!</strong>
      </div>
    );
  }
  return null;
}

function AccountPriority(props){
  if (props.p === "TRUE"){
    return (
      <Row>
        <strong><i className="icon-flag pr-1"></i>This is a priority account!</strong>
      </Row>
    );
  }
  return null;
}

class Account extends Component {

  constructor(props){
    super(props);

    this.handleEmailChangeClicked = this.handleEmailChangeClicked.bind(this);
    this.handleEmailSendClicked = this.handleEmailSendClicked.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleDecisionMade = this.handleDecisionMade.bind(this);

    this.state = {
      account: '',
      eta: '',
      status: '',
      currentSuggestions: '',
      tm1: '',
      tm2: '',
      d1: '',
      d2: '',
      daysBetween: 0,
      rtd: 'medium',
      rto: 'medium',
      show: false,
      showEmail: false,
      message: '',
    }

    //currentSuggestions: getSuggestedDecisions(account, account.eta, account.cpriority, account.apriority, this.state.rtd,this.state.rto)
  }

  componentDidMount() {
    console.log(this.props.match.params.id);
    axios.get(`http://0.0.0.0:8080/api/acount/` + this.props.match.params.id)
      .then(res => {
        const account = res.data;
        const accountCopy = JSON.parse(JSON.stringify(account));
        this.setState({ account: account });
        let eta = getETA(accountCopy, 'medium','medium');
        this.setState({ eta: eta });
        this.setState({ status: getStatus(accountCopy, eta, 14) });
        this.setState({ currentSuggestions: getSuggestedDecisions(accountCopy, eta, account.cpriority, account.apriority, 'medium', 'medium')});
        this.setState({ tm1: account.tm1});
        this.setState({ tm2: account.tm2});
        this.setState({ show: true });
      })
  }

  formatDate(date) {
    if (date == '-' || date == null){
      return 'Unknown';
    } else {
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: '2-digit' 
      }).format(new Date(date));
    }
  }

  handleEmailSendClicked(){
    this.setState({ show: false });
    this.setState({ showEmail: true });
  }

  handleEmailChangeClicked(){
    this.setState({ showEmail: false });
    this.setState({ show: true });
  }

  handleMessage(e){
    this.setState({ message: e });
  }

  handleDecisionMade(name, number){
    if (number === 1){
      this.setState({ d1: name });
    } else if (number === 2){
      this.setState({ d2: name });
    }
  }

  render() {
    
    if (this.state.show) {
    const account = this.state.account;

    console.log("SHOWING")
    console.log(account.tm1)
    console.log(account.ogac)

    let number = 0;
    if (account.tm1 == '-' && account.ogac != '-'){
      number = 1;
    } else if (account.p != '-' && account.tm2 == '-'){
      number = 2;
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={5}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Account Details</strong>
              </CardHeader>
              <CardBody>
                <Table>
                  <tbody>
                  <tr><td>Customer</td><td>{account.cust}</td></tr>
                  <tr><td>Style Number</td><td>{account.stylnum}</td></tr>
                  <tr><td>Product Code</td><td>{account.prodcode}</td></tr>
                  <tr><td>Quantity</td><td>{account.q} units</td></tr>
                  </tbody>
                </Table>
                  <CustomerPriority p = {account.cpriority}/>
                  <AccountPriority p = {account.apriority}/>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
              <strong>Schedule</strong>
              </CardHeader>
              <CardBody>
                <Table>
                  <tbody>
                    <tr><td>Arrived at Consolidator</td><td>{this.formatDate(account.gac)}</td></tr>
                    <tr><td>Leaving Consolidator</td><td>{this.formatDate(account.ogac)}</td></tr>
                    <tr><td>Arrived at Port</td><td>{this.formatDate(account.p)}</td></tr>
                    <tr><td>Launch Date</td><td>{this.formatDate(account.lnch)}</td></tr>
                    <tr><td>ETA</td><td><strong>{this.formatDate(this.state.eta.date)}</strong></td></tr>
                    <tr><td>Status</td><td><strong><Status status={this.state.status} /></strong></td></tr>
                  </tbody>
                </Table>
                <IsInfeasible s1={this.state.currentSuggestions.d1} s2={this.state.currentSuggestions.d2} dsm={account.dsm}/>
                <Table>
                  
                  <thead><strong>Decisions</strong></thead>
                <tbody>
                    <tr><td>Transport 1: {this.state.tm1}</td><td>Transport 2: {this.state.tm2}</td></tr>
                  </tbody>
                </Table>
                <Table style={{color:"blue"}}>
                  
                  <thead><strong>Recommendations</strong></thead>
                <tbody>
                    <tr><td>Transport 1: {this.state.currentSuggestions.d1}</td><td>Transport 2: {this.state.currentSuggestions.d2}</td></tr>
                  </tbody>
                </Table>
              </CardBody>

            </Card>
          </Col>
          <Col lg={5}>
            <Card className="text-white bg-info">
                <CardHeader>
                <strong>Insights</strong>
                </CardHeader>
                <CardBody>
                  <Insights 
                    account={account}
                    eta={this.state.eta}
                  />
                </CardBody>
              </Card>
          </Col>
          <Col lg={10}>
            <Card>
              <CardHeader>
                <strong>Decision</strong>
              </CardHeader>
              <CardBody>
                <Row>
                <Col>
                  <SelectDecision number={number} id={account.id} dsm={account.dsm} submitted={this.handleDecisionMade} d1={this.state.d1} d2={this.state.d2}/>
                </Col>
                <Col>
                  <div>
                  <Button block onClick={this.handleEmailSendClicked}><i className="icon-envelope pr-1"></i> Send Email</Button>
                  </div>
                  <div>
                    {this.state.message}
                  </div>
                </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
    } else if (this.state.showEmail) {
      return (
        <EmailView 
          account={this.state.account} 
          show={this.handleEmailChangeClicked}
          eta={this.state.eta}
          status={this.state.status}
          d1={this.state.d1}
          d2={this.state.d2}
          message={this.handleMessage}
        />
      );
    } else {
      return (
      <div>
        Loading account details...
      </div>
      );
    }
  }
}

export default Account;
