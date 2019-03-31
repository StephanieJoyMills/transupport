import React, { Component } from 'react';
import { Button } from 'reactstrap';

import axios from 'axios';

class Status extends Component {

  render() {
    const status = this.props.status;
    if (status === "at risk"){
        return (<div style={{color:"orange"}}>At Risk</div>); 
    } else if (status === "late"){
        return (<div style={{color:"red"}}>Late</div>);     
    } else if (status === "on time"){
        return (<div style={{color:"yellow"}}>On Time</div>);     
    } else if (status === "early"){
        return (<div style={{color:"green"}}>Early</div>);     
    } else {
        return (<div>{status}</div>);  
    }
  }
}

export default Status;