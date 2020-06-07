import React from 'react';
import PaginationStyles from './styles/PaginationStyles';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';

import Error from './ErrorMessage';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = (props) => {
  return (
    <Query query={PAGINATION_QUERY}>
      {({ data, loading, error }) => {
        if (error) return <Error error={error} />;
        if (loading) return <p>Loading...</p>;
        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);

        return (
          <PaginationStyles>
            <Head>
              <title>
                Sick Ficks! - Page {props.page} of {pages}
              </title>
            </Head>
            <Link
              prefetch
              href={{
                pathname: 'items',
                query: { page: props.page - 1 },
              }}>
              <a className="prev" aria-disabled={props.page <= 1}>← Prev</a>
            </Link>
            <p>
              Page {props.page} of {pages}!
            </p>
            <p>{count} Items Total</p>
            <Link
              prefetch
              href={{
                pathname: 'items',
                query: { page: props.page + 1 },
              }}>
              <a className="next" aria-disabled={props.page >= pages}>→ Next</a>
            </Link>

          </PaginationStyles>
        );
      }}
    </Query>
  );
};

export default Pagination;
