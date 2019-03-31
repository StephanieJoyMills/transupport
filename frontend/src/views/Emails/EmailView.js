import React, { Component } from 'react';
import { Card, Input, FormText, FormGroup, Label, CardBody, CardHeader, CardFooter, Col, Row, Table, Button } from 'reactstrap';
import axios from 'axios';

class EmailView extends Component {

  constructor(props){
    super(props);

    //this.getEndPoint = this.getEndPoint.bind(this);
    this.state = {
      account: '',
      recipient: '',
      subject: '',
      body: "",
      show: true,
      mainBody: "",
    }
  }

  handleChangeRecipient = event => {
    this.setState({ recipient: event.target.value });
  }

  handleChangeSubject = event => {
    this.setState({ subject: event.target.value });
  }

  handleChangeBody = event => {
    this.setState({ body: event.target.value });
  }

  handleCancel = event => {
    this.props.show(false);
  }

  handleSubmit = event => {
    event.preventDefault();
    const method = {
      body: this.state.body + this.state.mainBody,
      recipient: this.state.recipient,
      subject: this.state.subject,
    };
    console.log(method);

    axios.post(`http://0.0.0.0:8080/api/accounts`, method)
      .then(res => {
        this.setState({ sent: true });
        this.setState({ message: res.data});
        this.props.message(res.data);
        this.props.show(false);
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

  componentDidMount(){
    let a = this.props.account;  
    let subject = this.props.status.toUpperCase() + ": " + this.props.account.cust + " - Order #" + a.id;
    let body = "\n\n ----- ACCOUNT DETAILS -----\n"
    + "\nCustomer: " + a.cust
    + "\nStyle Number: " + a.stylnum
    + "\nProduct Code: " + a.prodcode
    + "\nOrder Quantity: " + a.q + " units"
    + "\nSTATUS: " + this.props.status.toUpperCase()
    + "\n\nTRANSPORT DETAILS:";

    if (a.tm1 != "-"){
        body = body + "\n Transport 1 Method: " + a.tm1;
    } else if (this.props.d1 != "") {
        body = body + "\nTRANSPORT 1 DECISION: " + this.props.d1;
    } else {
        body = body + "\n Transport 1 Method: UNSELECTED";
    }
    if (a.tm2 != "-"){
        body = body + "\n Transport 2 Method: " + a.tm2;
    } else if (this.props.d2 != ""){
        body = body + "\nTRANSPORT 2 DECISION: " + this.props.d2;
    } else {
        body = body + "\nTransport 2 Method: UNSELECTED";
    }
    body = body + "\n\nThank you, \n John Marlow";
    this.setState({ subject: subject });
    this.setState({ mainBody: body });
  }

  render() {
    
    if (this.state.show) {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={10}>
            <Card>
              <CardHeader>
                <strong><i className="icon-envelope pr-1"></i>Send Email</strong>
              </CardHeader>
              <form onSubmit={this.handleSubmit}>
              <CardBody>
                <div>
                    <FormGroup>
                    <Label htmlFor="recipient">Recipient</Label>
                    <Input onChange={this.handleChangeRecipient} type="email" id="recipient" name="email-input" placeholder="Recipient email" autoComplete="email"/>
                    </FormGroup>
                    <FormGroup>
                    <Label htmlFor="subject">Subject</Label>
                    <Input onChange={this.handleChangeSubject} type="text" id="subject" placeholder="Subject" />
                    </FormGroup>
                    <FormGroup>
                    <Label htmlFor="subject">Custom Introduction</Label>
                    <Input onChange={this.handleChangeBody} type="text" id="subject" placeholder="Custom message" />
                    </FormGroup>
                </div>
                <div>
                    <div>
                        <strong>Email Preview</strong>
                    </div>
                    <div className="border mt-2 p-4">
                    <div className="mb-2">
                        <strong>Subject: {this.state.subject}</strong>
                    </div>
                    <div>
                        {this.state.body}
                        {this.state.mainBody.split ('\n').map ((item, i) => <p key={i}>{item}</p>)}
                    </div>
                    </div>
                </div>
              </CardBody>
              <CardFooter>
                    <Button onClick={this.handleCancel}>Cancel</Button>
                    <Button color="danger" className="ml-4" type="submit">Send</Button>
                    <div>{this.state.message}</div>
                </CardFooter>
                </form>
            </Card>
        </Col>
        </Row>
        </div>
    );
    } else {
      return (
          ''
      );
    }
  }
}

export default EmailView;


{/* <div>
<tbody>
<tr><td>Arrived at Consolidator</td><td>{this.formatDate(account.gac)}</td></tr>
<tr><td>Left Consolidator</td><td>{this.formatDate(account.ogac)}</td></tr>
<tr><td>Arrived at Port</td><td>{this.formatDate(account.p)}</td></tr>
<tr><td>Launch Date</td><td>{this.formatDate(account.lnch)}</td></tr>
<tr><td>ETA</td><td><strong>{this.formatDate(this.props.eta.date)}</strong></td></tr>
<tr><td>Status</td><td>{this.props.status}</td></tr>
</tbody>
</div> */}