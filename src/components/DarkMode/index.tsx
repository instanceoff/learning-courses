import { selectDarkMode } from 'containers/App/selectors';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

const stateSelector = createStructuredSelector({
  darkMode: selectDarkMode(),
});

type darkMode = {
  children: JSX.Element;
};

const Header: React.FC<darkMode> = props => {
  useEffect(() => {
    window.document.dispatchEvent(new Event('DOMContentLoaded'));
  }, []);

  const { darkMode } = useSelector(stateSelector);
  return (
    <>
      <div className={`${darkMode && 'dark'}`}>
        <div className="h-screen w-screen  dark:bg-slate-700">
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Header;
