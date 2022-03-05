import React, { useEffect } from 'react';

import { createStructuredSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

import { selectLoading } from 'containers/App/selectors';
import { setLoading } from 'containers/App/actions';
import { clear } from 'console';

const stateSelector = createStructuredSelector({
  loading: selectLoading(),
});

const Loader = () => {
  const dispatch = useDispatch();

  const { loading } = useSelector(stateSelector);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading === 100) dispatch(setLoading(null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch, loading]);

  return loading ? (
    <div className="absolute bottom-0 w-full bg-gray-200 h-2">
      <div
        className="bg-purple-500 h-2 duration-1000"
        style={{ width: `${loading}%` }}
      ></div>
    </div>
  ) : (
    <></>
  );
};

export default Loader;
