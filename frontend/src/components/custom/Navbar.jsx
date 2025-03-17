// Hooks
import React, { useState } from 'react';
import { Link, useNavigate } from "@tanstack/react-router";

// Components
import CloseMenu from '../custom/CloseMenu'; 
import OpenMenu from '../custom/OpenMenu';
import {
    Menubar, MenubarContent, MenubarItem,
    MenubarMenu, MenubarTrigger
} from "../shadcn/MenuBar";
import { User, Plus, ChartNoAxesCombined, Clock3, Cog } from 'lucide-react';

export default function Navbar() {
  const user = localStorage.getItem('user');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
 
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate({to: '/'});
  }

  return (
    <div className='mt-3'>
      <div className='ml-10' onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? <CloseMenu /> : <OpenMenu />}
      </div>

      <div className={`mt-2 ml-5 overflow-hidden transition-all duration-700 ease-in-out
        ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        {isOpen && (
          <Menubar className='rounded-xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700'>            
            <MenubarMenu>
              <MenubarTrigger className='py-5 text-gray-900 dark:text-gray-400  dark:hover:bg-gray-700 transition-colors duration-300'>
                <User className='w-8 h-8'/>
              </MenubarTrigger>
              <MenubarContent className='ml-16 mt-[-60px] bg-white dark:bg-gray-800 border dark:border-gray-700 w-40'>
                {user ? (
                  <>
                    <Link to="/user/profile">
                      <MenubarItem className='font-madimi mt-2 ml-2 text-gray-700 dark:text-gray-300 hover:text-orange1 dark:hover:text-orange1'>
                        My profile
                      </MenubarItem>
                    </Link>
                    <hr className='mx-2 mt-1 border-gray-200 dark:border-gray-700'/>
                    <MenubarItem 
                      className='font-madimi mt-2 mb-2 ml-2 text-gray-400 dark:hover:text-red-400'
                      onClick={handleLogout}
                    >
                      Logout
                    </MenubarItem>
                  </>
                ) : (
                  <Link to="/user/login">
                    <MenubarItem className='font-madimi mt-2 ml-2 mb-2 text-gray-700 dark:text-gray-300 hover:text-orange1'>
                      Login/Signup
                    </MenubarItem>
                  </Link>
                )}    
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className='py-5 text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-300'>
                <Plus className='w-8 h-8'/>
              </MenubarTrigger>
              <MenubarContent className='ml-16 mt-[-60px] bg-white dark:bg-gray-800 border dark:border-gray-700 w-40'>
                {!user && (
                  <Link to="/new/user">
                    <MenubarItem className='font-madimi mt-2 ml-2 text-gray-700 dark:text-gray-300 hover:text-orange1 dark:hover:text-orange1'>
                      New user
                    </MenubarItem>
                    <hr className='mx-2 mt-1 border-gray-200 dark:border-gray-700'/>
                  </Link>
                )}
                <Link to="/new/activity">
                  <MenubarItem className='font-madimi mt-2 ml-2 text-gray-700 dark:text-gray-300 hover:text-orange1 dark:hover:text-orange1'>
                    New activity
                  </MenubarItem>  
                </Link>
                <hr className='mx-2 mt-1 border-gray-200 dark:border-gray-700'/>
                <Link to="/new/log">
                  <MenubarItem className='font-madimi mt-2 ml-2 text-gray-700 dark:text-gray-300 hover:text-orange1 dark:hover:text-orange1'>
                    New log
                  </MenubarItem> 
                </Link>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className='py-5 text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-300'>
                <ChartNoAxesCombined className='w-8 h-8'/>
              </MenubarTrigger>
              <MenubarContent className='ml-16 mt-[-60px] bg-white dark:bg-gray-800 border dark:border-gray-700 w-40'>
                <Link to="/reports">
                  <MenubarItem className='font-madimi mt-2 ml-2 text-gray-700 dark:text-gray-300 hover:text-orange1 dark:hover:text-orange1'>
                    Reports
                  </MenubarItem>
                </Link>
                <hr className='mx-2 mt-1 border-gray-200 dark:border-gray-700'/>
                <Link to="/reports/ttot">
                  <MenubarItem className='font-madimi mt-2 ml-2 text-gray-700 dark:text-gray-300 hover:text-orange1 dark:hover:text-orange1'>
                    Total time on task
                  </MenubarItem>
                </Link>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className='py-5 text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-300'>
                <Clock3 className='w-8 h-8'/>
              </MenubarTrigger>
              <MenubarContent className='ml-16 mt-[-60px] bg-white dark:bg-gray-800 border dark:border-gray-700 w-40'>
                <Link to="/trackers/">
                  <MenubarItem className='font-madimi mt-1 ml-1 text-gray-700 dark:text-gray-300 hover:text-orange1 dark:hover:text-orange1'>
                    Trackers
                  </MenubarItem> 
                </Link>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className=' mt-10 py-5 text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-300'>
                <Cog className='w-8 h-8'/>
              </MenubarTrigger>
              <MenubarContent className='ml-16 mt-[-60px] bg-white dark:bg-gray-800 border dark:border-gray-700 w-40'>
                <Link to="/settings">
                  <MenubarItem className='font-madimi mt-1 ml-1 text-gray-700 dark:text-gray-300 hover:text-orange1 dark:hover:text-orange1'>
                    Settings
                  </MenubarItem>
                </Link>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
      </div>
    </div>
  )
}
