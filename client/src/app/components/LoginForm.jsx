'use client';

import React, { useState } from "react";



export default function LoginForm() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);


    function handleSubmit(e) {
        e.preventDefault();

        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password})
        }).then((resp) => {

            if (resp.ok) {
                resp.json().then((user) => onLogin(user));
            } else {
                resp.json().then((err) => setErrors(err.errors));
            }
        })
    }

console.log(email, password)

    return (
        <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-sm space-y-10">
            <div>
              <img
                alt="Auto Tracker"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="mx-auto h-10 w-auto"
              />
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
                Sign in to your account
              </h2>
            </div>
            <form action="#" method="POST" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="col-span-2">
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email address"
                    autoComplete="email"
                    aria-label="Email address"
                    className="block w-full rounded-t-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:relative focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
                <div className="-mt-px">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="User Password"
                    autoComplete="current-password"
                    aria-label="Password"
                    className="block w-full rounded-b-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:relative focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 checked:border-indigo-600 checked:bg-indigo-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 dark:indeterminate:bg-indigo-500 dark:indeterminate:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:checked:bg-gray-100 dark:disabled:checked:bg-gray-900 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white dark:stroke-gray-900 group-has-[:disabled]:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:checked]:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:indeterminate]:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <label htmlFor="remember-me" className="block text-sm/6 text-gray-900 dark:text-white">
                    Remember me
                  </label>
                </div>
  
                <div className="text-sm/6">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
  
            <p className="text-center text-sm/6 text-gray-500 dark:text-gray-400">
              Not a member?{' '}
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Start a 14-day free trial
              </a>
            </p>
          </div>
            {errors.length > 0 && (
                <ul className="text-red-500 text-sm list-disc pl-5">
                {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
                </ul>
            )}
        </div>
    )
  }
  