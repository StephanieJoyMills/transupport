import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Table, Button } from 'reactstrap';

function AccountRow(props) {
  const account = props.account
  const accountLink = `/accounts/view/${account.id}`

  const getBadge = (status) => {
    return status === 'resolved' ? 'success' :
      status === 'non_resolved' ? 'secondary' :
        status === 'at risk' ? 'warning' :
          status === 'cancelled' ? 'danger' :
            status === 'late' ? 'danger' :
              status === 'early' ? 'success' : 'secondary'
  }

  return (
    <tr key={account.id}>
      <th scope="row"><Link to={accountLink}>{account.transportation}</Link></th>
      <td>{account.customer}</td>
      <td>{account.product_code}</td>
      <td>{account.style_number}</td>
      <td>{account.quantity}</td>
      <td>{account.ETA}</td>
      <td><Badge color={getBadge(account.status)}>{account.status}</Badge></td>
      <td><Link to={accountLink}>View</Link></td>
    </tr>
  )
}

class AccountsTable extends Component {

  constructor(props){
    super(props);

    // this.state = {
    //   show: true,
    //   id: this.props.key
    // }
  }

  render() {

    const accountList = this.props.accountsData

    return (
      <Table responsive hover>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">customer</th>
            <th scope="col">product code</th>
            <th scope="col">style</th>
            <th scope="col">quantity</th>
            <th scope="col">eta</th>
            <th scope="col">status</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {accountList.map((account, index) =>
            <AccountRow key={index} account={account} />
          )}
        </tbody>
      </Table>
    )
  }
}

export default AccountsTable;
