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
    const signInn = await signIn(dispatch, login, password);
    signInn.isComplete && window.location.assign('/courses');
  };

  return (
    <div className="flex m-auto justify-center items-center h-screen">
      <form className="min-w-80">
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Адрес электронной почты
          </label>
          <input
            type="email"
            data-tooltip-target="tooltip-email"
            data-tooltip-placement="right"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@mail.com"
            onChange={e => {
              setLogin(e.target.value);
            }}
            required
          />
          <div
            id="tooltip-email"
            role="tooltip"
            className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-blue-700"
          >
            Почта должна быть стандартного формата
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Пароль
          </label>
          <input
            type="password"
            data-tooltip-target="tooltip-password"
            data-tooltip-placement="right"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={e => {
              setPassword(e.target.value);
            }}
            required
          />
          <div
            id="tooltip-password"
            role="tooltip"
            className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-blue-700"
          >
            Пароль должен содержать больше 7 символов!
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="remember"
              className="font-medium text-gray-900 dark:text-gray-300"
            >
              Запомнить
            </label>
          </div>
        </div>
        <button
          disabled={!isValid}
          onClick={loginHandler}
          type="submit"
          className="text-white bg-blue-700 disabled:bg-gray-500 dark:disabled:bg-gray-500  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Вход
        </button>
        <a
          href="/register"
          className="ml-5 font-normal text-sm dark:hover:text-blue-700 text-gray-900 dark:text-gray-300"
        >
          <label className="ml-5 hover:cursor-pointer font-normal text-sm hover:text-blue-700 dark:hover:text-blue-700 text-gray-900 dark:text-gray-300">
            Нет аккаунта? Зарегистрируйтесь
          </label>
        </a>
      </form>
    </div>
  );
};

export default Main;
