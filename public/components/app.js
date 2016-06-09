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
       return list ?
              _.map(list,function(country){
              return <div  key={country[0]}className='results'>{country[0]}:{country[1][property]}</div>
            })    :
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
        <Select
            name="Properties"
            value="quotationStart"
            options={options}
            onChange={this.selectChange.bind(this)}
        />
        
        <ul>
            {this.renderList(this.props.activeProp)}
        </ul>
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