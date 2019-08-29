import React, { Component } from 'react';
import Header from '../components/Header';
import Meta from '../components/Meta';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';

const theme = {
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
};

const StylePage = styled.div`
  background: white;
  color:  ${props => props.theme.black};
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  background: ${props => props.theme.red};
  margin: 0 auto;
  padding: 2rem;
`;

class Page extends Component {

  render() {
    const { Component } =  this.props;

    return (
      <ThemeProvider theme={theme}>
        <StylePage>
          <Meta />
          <p>Heey I'm the page component</p>
          <Header />
          <Inner>{this.props.children}</Inner>
        </StylePage>
        </ThemeProvider>
    );
  }
}

export default Page;