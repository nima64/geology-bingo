import { Link } from 'react-router-dom';
import Orbit from './components/Orbit';

export function PlayerList() {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <Orbit />
        <h2 className="text-3xl font-semibold italic tracking-widest p-8" >GEO BINGO!</h2>
      </div>
      {/* <div>
        players:
        <ul>
          <li>nyima</li>
          <li>hein</li>
          <li>sam</li>
        </ul>
      </div> */}
      <div className='grid grid-cols-1 gap-y-2 '>
        <div>
          <input className='text-lg mb-4 font-semibold border-gray-300 border-solid border-2 rounded-md' style={{ textAlign: 'center' }}
            placeholder='name' type="text" />
        </div>
        <div>
          <Link to={'game'}>
            <button className="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900"> Join Game </button>
          </Link>
        </div>

      </div>
    </>
  );
}