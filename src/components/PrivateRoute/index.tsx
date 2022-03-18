import { getAccount } from 'api/account';
import { auth } from 'api/firebase';
import { setCurrentAccount } from 'containers/App/actions';
import { selectCurrentAccount } from 'containers/App/selectors';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, RouteProps } from 'react-router';
import { createStructuredSelector } from 'reselect';
import { IUser } from 'types/user';

const stateSelector = createStructuredSelector({
  currentAccount: selectCurrentAccount(),
});

interface PrivateRouteProps extends RouteProps {
  path: string;
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ path, element }) => {
  const { currentAccount } = useSelector(stateSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (user && !user.isAnonymous && user.uid) {
        const answer = await getAccount(user.uid);
        if (answer.isComplete)
          dispatch(setCurrentAccount(answer.answer as IUser));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(currentAccount);
  }, [currentAccount]);
  // <Route path={path} element={element} />
  return currentAccount ? element : <Navigate to={path} />;
};

export default PrivateRoute;
