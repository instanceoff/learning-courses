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
    signInn.isComplete && window.open('courses');
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
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@flowbite.com"
            onChange={e => {
              setLogin(e.target.value);
            }}
            required
          />
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
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={e => {
              setPassword(e.target.value);
            }}
            required
          />
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
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Вход
        </button>
        <a
          href="/registration"
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
