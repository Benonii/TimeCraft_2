// Hooks

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import GetReport from '../components/custom/modals/GetReport';
import { Link } from '@tanstack/react-router';

export default function Reports() {
    // Get user from local storage
    const user = localStorage.getItem('user');

    return (
        <div className=''>
            <Header />
            <div className="relative flex items-center mt-10 min-h-[900px]">
                <Navbar className=''/>
                <div className='absolute top-3 left-24'>
                    <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl dark:text-gray-200'>
                        Reports
                    </h2>
                    {!user && (
                        <p className='ml-4 mt-2 font-monomaniac text-sm text-gray-500'>
                            Note: <Link to='/user/signup' className='hover:underline'>Sign up </Link>
                            for the best experience
                        </p>
                    )}
                    <p className='ml-3 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl dark:text-gray-400'>
                        Get detailed reports about how you spend your time over different periods. <br /><br />
                        Choose from today, this week, this month, or select a custom date range. <br /><br />
                        Your report will show a breakdown by task, total productive time, and wasted time for the selected period.
                    </p>
                </div>
                <div className='flex justify-center absolute left-24 md:mt-0 w-[73%] ml-1 max-w-[700px]'>
                    <GetReport />
                </div>
            </div>
        </div>
    );
} 