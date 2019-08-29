import React, { Component } from 'react';
import Header from '../components/Header';
import Meta from '../components/Meta';

class Page extends Component {

  render() {
    const { Component } =  this.props;

    return (
      <div>
        <Meta />
        <p>Heey I'm the page component</p>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default Page;