import { getAccount } from 'api/account';
import { auth, firebaseApp } from 'api/firebase';
import { setCurrentAccount } from 'containers/App/actions';
import { selectCurrentAccount } from 'containers/App/selectors';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';
import { createStructuredSelector } from 'reselect';
import { IUser } from 'types/user';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from 'components/Loading';

const stateSelector = createStructuredSelector({
  currentAccount: selectCurrentAccount(),
});

// interface PrivateRouteProps extends RouteProps {
//   path: string;
//   element: JSX.Element;
// }

const PrivateRoute = () => {
  const [user, loading, error] = useAuthState(auth);

  return !loading ? user ? <Outlet /> : <Navigate to="/login" /> : <Loading />;
};

export default PrivateRoute;

// const dispatch = useDispatch();
// const { currentAccount } = useSelector(stateSelector);
// const [checkLogin, setCheckLogin] = useState(false);
// const [isLoggedIn, setIsLoggedIn] = useState(false);

// useEffect(() => {
//   setIsLoggedIn(true);
//   onAuthStateChanged(auth, async user => {
//     if (user && !user.isAnonymous && user.uid) {
//       const answer = await getAccount(user.uid);
//       console.log(answer);
//       if (answer.isComplete) {
//         dispatch(setCurrentAccount(answer.answer as IUser));
//         setIsLoggedIn(true);
//       }
//     } else setIsLoggedIn(true);

//     setCheckLogin(true);
//   });
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []);

// useEffect(() => {
//   console.log(isLoggedIn);
// }, [currentAccount]);
