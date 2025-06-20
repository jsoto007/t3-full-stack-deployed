import { Outlet, Link } from "react-router-dom"
import Logout from "./authentication/Logout"
import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo  from '/logo.png'



export default function NavBar() {

  return (
    <>
      <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 shadow-md">
        {({ open }) => (
          <>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link
                  to="/home"
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  <img src={logo} alt="Logo" className="h-8 w-auto rounded-lg" />
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-8 text-gray-700 dark:text-gray-200">
                <Link to="/home" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
                <Link to="/inventory" className="hover:text-indigo-600 dark:hover:text-indigo-400">Inventory</Link>
                <Link to="/client_outreach" className="hover:text-indigo-600 dark:hover:text-indigo-400">Client Outreach</Link>
                <Link to="/master_inventory" className="hover:text-indigo-600 dark:hover:text-indigo-400">Master Inventory</Link>
              </div>

              {/* Logout Button */}
              <div className="hidden md:flex flex-shrink-0">
                <Logout />
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </div>

            {/* Mobile menu */}
            <DisclosurePanel className="md:hidden">
              <div className="space-y-1 pb-3 pt-2 px-2">
                <DisclosureButton as={Link} to="/home" className="block rounded-md py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  Home
                </DisclosureButton>
                <DisclosureButton as={Link} to="/inventory" className="block rounded-md py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  Inventory
                </DisclosureButton>
                <DisclosureButton as={Link} to="/client_outreach" className="block rounded-md py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  Client Outreach
                </DisclosureButton>
                <DisclosureButton as={Link} to="/master_inventory" className="block rounded-md py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  Master Inventory
                </DisclosureButton>
                <div className="border-t border-gray-200 dark:border-gray-700 pb-3 pt-4">
                  <div className="px-4">
                    <Logout />
                  </div>
                </div>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
      <Outlet />
    </>
  )
}
