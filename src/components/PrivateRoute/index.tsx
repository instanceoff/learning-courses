import { getAccount } from 'api/account';
import { auth } from 'api/firebase';
import { setCurrentAccount } from 'containers/App/actions';
import { selectCurrentAccount } from 'containers/App/selectors';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, Route, RouteProps } from 'react-router';
import { createStructuredSelector } from 'reselect';
import { IUser } from 'types/user';

const stateSelector = createStructuredSelector({
  currentAccount: selectCurrentAccount(),
});

// interface PrivateRouteProps extends RouteProps {
//   path: string;
//   element: JSX.Element;
// }

const PrivateRoute = () => {
  const dispatch = useDispatch();

  const { currentAccount } = useSelector(stateSelector);
  const [checkLogin, setCheckLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (user && !user.isAnonymous && user.uid) {
        const answer = await getAccount(user.uid);
        if (answer.isComplete) {
          dispatch(setCurrentAccount(answer.answer as IUser));
          setIsLoggedIn(true);
        }
      } else setIsLoggedIn(false);

      setCheckLogin(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(currentAccount);
  }, [currentAccount]);

  return true ? <Outlet /> : <Navigate to="/Login" />;
};

export default PrivateRoute;
