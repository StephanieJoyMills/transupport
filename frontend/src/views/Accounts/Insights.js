import React, { Component } from 'react';
import { Card, CardBody, Button, Col, Row, Table } from 'reactstrap';
import Status from "./Status";

//import account from '../../sampledata';
import {getETA} from '../../math/getETA';
import {getSuggestedDecisions} from "../../math/getSuggestion";
import {getStatus} from "../../math/getStatus";
import axios from 'axios';

class Insights extends Component {

  constructor(props){
    super(props);

    //this.getEndPoint = this.getEndPoint.bind(this);
    this.state = {
      rtETA: 0,
      rtStatus: 'NA',
      rttm1: "-",
      rttm2: '-',
      rtd1: '',
      rtd2: '',
      showD1: true,
      showD2: false,
      showB: true,
      rtDaysBetween: 0,
      rtd: 'medium',
      rto: 'medium',
    }
  }

  componentDidMount(){
    if (this.props.account.dsm === "TRUE"){
        this.setState({ showD1: false });
        this.setState({ showD2: false });
        this.setState({ showB: false });
    } else if (this.props.account.p != '-'){
        console.log(this.props.account.tm1);
        this.setState({ showD1: false });
        this.setState({ showD2: true });
        this.setState({ rttm1: this.props.account.tm1 });
    }
  }

  formatDate(date) {
    if (date == '' || date == null){
      return 'Unknown';
    } else {
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: '2-digit' 
      }).format(new Date(date));
    }
  }

  getRealtimeETA = () => {
    let account = JSON.parse(JSON.stringify(this.props.account));
    console.log(this.state.rttm1);
    account.tm1 = this.state.rttm1;
    account.tm2 = this.state.rttm2;
    console.log(account);
    let eta = getETA(account, this.state.rtd,this.state.rto);
    let suggestions = getSuggestedDecisions(account, eta, account.cpriority, account.apriority, this.state.rtd, this.state.rto);
    this.setState({ rtStatus: getStatus(account, eta, 14)})
    this.setState({ rtETA: this.formatDate(eta.date.toString()) });
    this.setState({ rtDaysBetween: eta.daysBetween});
    this.setState({ rtd1 : suggestions.d1 });
    this.setState({ rtd2 : suggestions.d2 });
  };

  handleD1Change = (event) => {
    this.setState({ rttm1: event.target.value });
    if (event.target.value != "NONE"){
        this.setState({ showD2: true });
    } else {
        this.setState({ rttm2: "NONE" });
        this.setState({ showD2: false });
    }
  };

  handleD2Change = (event) => {
    this.setState({ rttm2: event.target.value });
  };

  handleOptionRiskChange = (event) => {
    this.setState({ rto: event.target.value });
  };

  handleDefaultRiskChange = (event) => {
    this.setState({ rtd: event.target.value });
  };

  render() {
    const account = this.props.account;

    return (
      <Row>
          <Col>
                <div className="mb-4 border-bottom">
                    <div>
                        <strong>Risk Tolerance</strong>
                    </div>
                    <div className="mb-2">
                    Configure transport times
                    </div>    
                    <div className="mb-4">
                    <select onChange={this.handleDefaultRiskChange} className="mb-2">
                        <option value="low">Low Default Transport Risk Tolerance</option>
                        <option selected="selected" value="medium">Medium Default Transport Risk Tolerance</option>
                        <option value="high">High Default Transport Risk Tolerance</option>
                    </select>
                    <select onChange={this.handleOptionRiskChange}>
                        <option value="low">Low Optional Transport Risk Tolerance</option>
                        <option selected="selected" value="medium">Medium Optional Transport Risk Tolerance</option>
                        <option value="high">High Optional Transport Risk Tolerance</option>
                    </select>
                    </div>
                </div>
                <div className="mb-4 border-bottom">
                    <div>
                        <strong>Transport Options</strong>
                    </div>
                    <div className="mb-2">
                    Select transportation options
                    </div>    
                    <div className="mb-2">
                        <SelectD1 show={this.state.showD1} option={this.handleD1Change} key={account.id}/>
                    </div>
                    <div className="mb-4">
                        <SelectD2 show={this.state.showD2} option={this.handleD2Change}/>
                    </div>
                </div>
                <div>
                    <div className="mb-4">
                        <SubmitButton submit={this.getRealtimeETA} show={this.state.showB} />
                    </div>
                    <div>
                        <Table>
                            <tr><td>ETA</td><td>{this.state.rtETA}</td></tr>
                            <tr><td>Status</td><td><strong><Status status={this.state.rtStatus} /></strong></td></tr>
                            <tr><td>Safety Margin</td><td>{this.state.rtDaysBetween}</td></tr>
                            <tr><td>Transport 1:</td><td>{this.state.rtd1}</td></tr>
                            <tr><td>Transport 2:</td><td>{this.state.rtd2}</td></tr>

                        </Table>
                    </div>
                </div>
          </Col>
      </Row>
    );
  }
}

class SelectD1 extends Component {
    constructor() {
        super();

        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange = event => {
        this.props.option(event);
      }

    render() {
        if (this.props.show){
            return (
                <div>
                    <select onChange={this.handleChange}>
                        <option value="-">Unselected</option>
                        <option value="BOAT">Boat</option>
                        <option value="AIR">Air</option>
                    </select>
                </div>
            );
        } else {
            return (
                <div>
                    <select disabled onChange={this.handleChange}>
                        <option value="-">Unselected</option>
                    </select>
                </div>
            );
        }
    }
}

class SelectD2 extends Component {
    constructor() {
        super();

        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange = event => {
        this.props.option(event);
      }

    render() {
        if (this.props.show){
            return (
                <div>
                    <select onChange={this.handleChange}>
                        <option value="-">Unselected</option>
                        <option value="RAIL">Rail</option>
                        <option value="TRUCK">Truck</option>
                        <option value="AIR">Air</option>
                    </select>
                </div>
            );
        } else {
            return (
                <div>
                    <select disabled onChange={this.handleChange}>
                        <option value="-">Unselected</option>
                    </select>
                </div>
            );
        }
    }
}

class SubmitButton extends Component {
    constructor() {
        super();

        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange = event => {
        this.props.submit(true);
      }

    render() {
        if (this.props.show){
            return (
                <div>
                    <Button block color="primary" onClick={this.handleChange}>Calculate Outcome</Button>
                </div>
            );
        } else {
            return (
                <div>
                    <Button disabled block color="primary" onClick={this.handleChange}>Calculate Outcome</Button>
                </div>
            );
        }
    }
}

export default Insights;
