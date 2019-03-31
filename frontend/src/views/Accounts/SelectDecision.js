import React, { Component } from 'react';
import { Button } from 'reactstrap';

import axios from 'axios';

class SelectDecision extends Component {
    constructor(props){
        super(props);
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
          name: '',
          submitted: false,
          message: 'Submitting decision...',
        }
    }

  handleChange = event => {
    this.setState({ name: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();
    let name = this.state.name;
    let number = this.props.number;
    if (name == "" && number == 1){
        name = "BOAT";
    } else if (name == ""  && number == 2){
        name = "RAIL";
    }
    this.props.submitted(name, number);
    const method = {
      name: name,
      number: number,
    };
    console.log(method);

    let url = `http://0.0.0.0:8080/api/acount/` + this.props.id
    this.setState({ submitted: true });
    axios.put(url, method)
      .then(res => {
        this.setState({ message: res.data});
      })
  }

  render() {
    if (this.props.dsm === "TRUE"){
        return (
            <div>
                This account is cancelled.
            </div>
        );
    };
    if (this.props.number == 1 && !this.state.submitted && this.props.d1 === ""){
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
            <label for="dec">Select Transport Option 1: </label>
            <select id="dec" onChange={this.handleChange} className="ml-4 mr-4">
                <option value="BOAT">Boat</option>
                <option value="AIR">Air</option>
            </select>
            <Button color="danger" type="submit">Submit</Button>
            </form>
          </div>
        );
    } else if (this.props.number == 2 && !this.state.submitted && this.props.d2 === ""){
        return (
        <div>
        <form onSubmit={this.handleSubmit}>
        <label for="dec">Select Transport Option 2: </label>
        <select id="dec" onChange={this.handleChange} className="ml-4 mr-4">
            <option value="RAIL">Rail</option>
            <option value="TRUCK">Truck</option>
            <option value="AIR">Air</option>
        </select>
        <Button color="danger" type="submit">Submit</Button>
        </form>
      </div>
        );
    } else if (this.state.submitted) {
        return (
            <div>
                {this.state.message}
            </div>
        );
    } else {
      return (
        <div>
          No decisions to make at this time.
      </div>
    );
    }
  }
}

export default SelectDecision;