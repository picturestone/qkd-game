import { useEffect, useState } from 'react';
import Lobby from '../models/Lobby';
import LobbiesService from '../services/LobbiesService';

function LobbyTable() {
    const lobbiesService = new LobbiesService();
    const [lobbies, setLobbies] = useState(new Array<Lobby>());

    // Note: Empty dependency array means this will run once just like componentDidMount().
    // TODO check if any other useEffect() should run only once.
    useEffect(() => {
        lobbiesService.getAll().then(
            (res) => {
                setLobbies(res);
            },
            (err) => {
                console.error(err);
            }
        );
    }, []);

    return (
        <div className="relative">
            <div className="py-4 flex justify-between">
                <label htmlFor="table-search" className="sr-only">
                    Search
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="table-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5"
                        placeholder="Search for items"
                    />
                </div>
                <button
                    onClick={() => {
                        console.log('clicked');
                    }}
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                >
                    New Game
                </button>
            </div>
            <table className="w-full text-sm text-left text-gray-500 border">
                <thead className="text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lobbies.map((lobby, i) => {
                        return (
                            <tr
                                key={i}
                                className="bg-white border-b hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {lobby.name}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default LobbyTable;
