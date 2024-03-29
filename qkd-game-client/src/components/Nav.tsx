import { NavLink } from 'react-router-dom';
import WidthLimiter from './WidthLimiter';
import logo from '../logo.gif';

function Nav() {
    const inactiveClasses =
        'block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0';
    const activeClasses =
        'block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0';

    function setNavLinkClasses(navData: { isActive: boolean }) {
        return navData.isActive ? activeClasses : inactiveClasses;
    }

    // TODO fix nav mobile not working correctly at the moment when switching to home page and trying to go back to lobbies. probably because of the way the routes are set up.
    return (
        <header className="sticky top-0 z-40 flex flex-none w-full py-3 mx-auto bg-white border-b border-gray-200 dark:border-gray-600 dark:bg-gray-800">
            <WidthLimiter>
                <nav className="w-full">
                    <div className="container flex flex-wrap justify-between items-center mx-auto">
                        <a href="/lobbies" className="flex items-center">
                            <img
                                src={logo}
                                className="mr-3 h-5"
                                alt="QKD-Game Logo"
                            />
                            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                                QKD-Game
                            </span>
                        </a>
                        <button
                            data-collapse-toggle="mobile-menu"
                            type="button"
                            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <svg
                                className="hidden w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                        {/* TODO Add loggout button which invalidates user. */}
                        <div
                            className="hidden w-full md:block md:w-auto"
                            id="mobile-menu"
                        >
                            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                                <li>
                                    <NavLink
                                        to="/lobbies"
                                        className={setNavLinkClasses}
                                        end
                                    >
                                        Lobbies
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </WidthLimiter>
        </header>
    );
}

export default Nav;
