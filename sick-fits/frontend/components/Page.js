import React, { Component } from 'react';
import Header from '../components/Header';

class Page extends Component {

  render() {
    const { Component } =  this.props;

    return (
      <div>
        <p>Heey I'm the page component</p>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default Page;