// Hooks

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import GetReport from '../components/custom/modals/GetReport';

export default function Reports() {
    return (
        <div className='flex flex-col items-center mt-20'>
            <Header />
            <div className="flex min-h-full">
                <div className="flex-1 flex justify-center items-start p-4 sm:p-6">
                    <div className="relative max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
                        <div className="flex">
                            {/* Navbar section */}
                            <div className="">
                                <Navbar />
                            </div>
                            
                            {/* Content section */}
                            <div className="flex-1">
                                <h2 className='font-monomaniac text-2xl sm:text-3xl md:text-4xl text-center mb-4 sm:mb-6 dark:text-gray-200'>
                                    Reports
                                </h2>
                                
                                <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 sm:py-6 my-4">
                                    <p className='font-monomaniac text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed px-2 sm:px-8'>
                                        Get detailed reports about how you spend your time over different periods.
                                        <br /><br />
                                        Choose from today, this week, this month, or select a custom date range.
                                        <br /><br />
                                        Your report will show a breakdown by task, total productive time, and wasted time 
                                        for the selected period.
                                    </p>
                                </div>
                                
                                <div className='flex justify-center mt-6 sm:mt-8'>
                                    <GetReport />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 