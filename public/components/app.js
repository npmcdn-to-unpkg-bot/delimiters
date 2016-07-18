import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import _ from 'lodash';

import { getData } from '../actions/modelActions';

class App extends Component {
  componentDidMount() {
    this.props.getData()
  }

  onPropClick(){

  }

  renderList(property){
    let list;
    this.props.models ? list = this.props.models : list = null;
    // console.log(list)
       return list ?
        _.map(list,function(country, key){
          return (
            <tr key={key}>
              <td>{key}</td>
              <td>{country[0]}</td>
              <td>{country[1].quotationStart}</td>
              <td>{country[1].quotationEnd}</td>
              <td>{country[1].alternateQuotationStart}</td>
              <td>{country[1].alternateQuotationEnd}</td>
            </tr>)
            })
                :
            ""
    }

  render () {
    return (
      <div>
        <table className="table">
          <thead>
            <th>Number</th>
            <th>Country</th>
            <th>Open</th>
            <th>Close</th>
            <th>Alt Open</th>
            <th>Alt Close</th>
          </thead>
          <tbody>
            {this.renderList()}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    models:state.Models,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getData }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);