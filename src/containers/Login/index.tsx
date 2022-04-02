import { createAuth, signIn, signOutUser } from 'api/auth';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/firebase';

const regular =
  /^[_a-zA-Z0-9-]+(.[_a-zA-Z0-9-]+)@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)(.[a-zA-Z]{2,6})$/;

const Main = () => {
  const dispatch = useDispatch();

  const [isValid, setIsValid] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    window.document.dispatchEvent(new Event('DOMContentLoaded'));
  }, []);

  useEffect(() => {
    setIsValid(regular.test(login) && password.length > 8);
  }, [login, password]);

  const loginHandler = async event => {
    event.preventDefault();
    await signIn(dispatch, login, password);
  };

  const registerHandler = async event => {
    event.preventDefault();
    await createAuth(dispatch, login, password);
  };
  const signOut = async event => {
    event.preventDefault();
    await signOutUser();
  };

  return (
    <main>
      <img
        className="absolute min-h-screen h-full w-full object-cover"
        src="https://picsum.photos/id/1018/1920/1080"
        alt="bg"
      ></img>
      <div className="relative md:flex">
        <div className="md:w-full">
          <div className="min-h-screen h-full flex flex-col">
            <div className="max-w-full md:max-w-xl bg-gray-200 mx-auto my-auto h-auto justify-center items-center py-7 px-9 md:py-14 md:px-20 shadow-2xl rounded-3xl bg-opacity-60 bg-clip-padding backdrop-filter backdrop-blur-min">
              <form className="flex w-full flex-col">
                <div className="flex flex-col space-y-4">
                  <input
                    data-tooltip-target="tooltip-animation"
                    type="email"
                    className="flex m-auto w-full border-0 rounded-xl"
                    placeholder="Логин"
                    onChange={e => {
                      setLogin(e.target.value);
                    }}
                    required
                  />
                  <div
                    id="tooltip-animation"
                    role="tooltip"
                    className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700"
                  >
                    Введите свою электронную почту
                    <div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                  <input
                    type="password"
                    className="flex m-auto w-full border-0 rounded-xl"
                    placeholder="Пароль"
                    onChange={e => {
                      setPassword(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="flex items-center justify-between mt-5 space-x-10">
                  <button
                    disabled={!isValid}
                    onClick={loginHandler}
                    className={`duration-300 bg-white text-gray-600 w-auto px-4 py-1 rounded-xl font-mont md:text-xl ${
                      !isValid && 'cursor-not-allowed bg-gray-300'
                    }`}
                  >
                    Авторизация
                  </button>
                  <button
                    disabled={!isValid}
                    onClick={registerHandler}
                    className={`duration-300 bg-white text-gray-600 w-auto px-4 py-1 rounded-xl font-mont md:text-xl ${
                      !isValid && 'cursor-not-allowed bg-gray-300'
                    }`}
                  >
                    Регистрация
                  </button>
                  <button
                    disabled={!auth.currentUser}
                    onClick={signOut}
                    className={`duration-300 bg-white text-gray-600 w-auto px-4 py-1 rounded-xl font-mont md:text-xl ${
                      !isValid && 'cursor-not-allowed bg-gray-300'
                    }`}
                  >
                    Выход
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
