import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import _ from 'lodash';
import Select from 'react-select';

import {getData} from '../actions/modelActions';
import {changeProperty} from '../actions/activeProp';



class App extends Component {
  componentDidMount() {
    this.props.getData().then(function(data){
    });
  }

  onPropClick(){

  }

  selectChange(val) {
      this.props.changeProperty(val);
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

    let options = [
      { value: 'quotationStart', label: 'quotationStart' },
      { value: 'quotationEnd', label: 'quotationEnd' },
      { value: 'alternateQuotationStart', label: 'alternateQuotationStart' },
      { value: 'alternateQuotationEnd', label: 'alternateQuotationEnd' }
  ];
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
    activeProp:state.ActiveProp
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getData, changeProperty}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);