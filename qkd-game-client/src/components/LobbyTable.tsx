import Lobby from '../models/Lobby';

interface IProps {
    lobbies: Lobby[];
}

function LobbyTable(props: IProps) {
    return (
        <table className="w-full text-sm text-left text-gray-500 border">
            <thead className="text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Owner
                    </th>
                </tr>
            </thead>
            <tbody>
                {props.lobbies.map((lobby, i) => {
                    return (
                        <tr
                            key={i}
                            className="bg-white border-b hover:bg-gray-50"
                        >
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {lobby.name}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {lobby.owner.name}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default LobbyTable;
