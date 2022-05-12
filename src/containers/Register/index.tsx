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
  const [secondPassword, setSecondPassword] = useState('');

  useEffect(() => {
    window.document.dispatchEvent(new Event('DOMContentLoaded'));
  }, []);

  useEffect(() => {
    setIsValid(
      regular.test(login) && password.length > 8 && password === secondPassword,
    );
  }, [login, password, secondPassword]);

  const loginHandler = async event => {
    event.preventDefault();
    const loginAuth = await signIn(dispatch, login, password);
    loginAuth.isComplete && window.location.assign('/login');
  };

  const registerHandler = async event => {
    event.preventDefault();
    const register = await createAuth(dispatch, login, password);
    register.isComplete && loginHandler(event);
  };

  const signOut = async event => {
    event.preventDefault();
    await signOutUser();
  };

  return (
    <div className="flex m-auto justify-center items-center w-screen h-screen">
      <form className="min-w-80">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Адрес электронной почты
          </label>
          <input
            type="email"
            data-tooltip-target="tooltip-email"
            data-tooltip-placement="right"
            id="email"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="name@mail.com"
            required
            onChange={e => setLogin(e.target.value)}
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
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Пароль
          </label>
          <input
            type="password"
            data-tooltip-target="tooltip-password"
            data-tooltip-placement="right"
            id="password"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            onChange={e => setPassword(e.target.value)}
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
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Повторите пароль
          </label>
          <input
            type="password"
            data-tooltip-target="tooltip-secondpassword"
            data-tooltip-placement="right"
            id="repeat-password"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            onChange={e => setSecondPassword(e.target.value)}
          />
          <div
            id="tooltip-secondpassword"
            role="tooltip"
            className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-blue-700"
          >
            Данное поле должно совпадать с паролем введенным выше
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="terms"
              aria-describedby="terms"
              type="checkbox"
              className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label className="font-medium text-gray-900 dark:text-gray-300">
              Я согласен с{' '}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                условиями использования
              </a>
            </label>
          </div>
        </div>
        <button
          disabled={!isValid}
          onClick={registerHandler}
          type="submit"
          className="text-white bg-blue-700 disabled:bg-gray-500 dark:disabled:bg-gray-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600  dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          title={!isValid ? 'Убедитесь в правильности заполненных данных' : ''}
        >
          Регистрация
        </button>
        <a
          href="/login"
          className="ml-5 font-normal text-sm dark:hover:text-blue-700 text-gray-900 dark:text-gray-300"
        >
          <label className="ml-5 hover:cursor-pointer font-normal text-sm hover:text-blue-700 dark:hover:text-blue-700 text-gray-900 dark:text-gray-300">
            Уже есть аккаунт? Войдите
          </label>
        </a>
      </form>
    </div>
  );
};

export default Main;
