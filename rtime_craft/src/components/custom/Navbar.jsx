import React, { useState } from 'react';
import CloseMenu from '../custom/CloseMenu'; 
import  OpenMenu  from '../custom/OpenMenu';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../shadcn/MenuBar";
import { Link, useNavigate } from "@tanstack/react-router";

import { User, Plus, ChartNoAxesCombined, Clock3, Cog } from 'lucide-react';


export default function Navbar() {
  const user = localStorage.getItem('user');
  const [ isOpen, setIsOpen ] = useState(false);
  const navigate = useNavigate();
    // console.log("Is open:", isOpen);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate({to: '/'});
  }
  return (
    <div className='mt-3'>
      <div className='ml-10 left-0 absolute top-3 ' onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? (
          <CloseMenu />
        ) :  (
          <OpenMenu />)
        }
      </div>

      <div className={`absolute top-14 mt-2 ml-5 overflow-hidden transition-all duration-700 ease-in-out
        ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        {isOpen && (
          <Menubar className='rounded-xl bg-yellow1 dark:bg-transparent shadow-xl'>
              <h2 className='mt-5 text-orange2 font-monofett text-2xl dark:text-yellow1'>Menu</h2>
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white'><User className='w-10 h-10'/></MenubarTrigger>
                  <MenubarContent className='ml-16 mt-[-60px] bg-white w-40 dark:bg-black'>
                    {user ? (
                      <>
                        <Link to="/user/profile" className='text-lg hover'>
                          <MenubarItem className='font-monomaniac mt-2 ml-2'>
                            My profile
                          </MenubarItem>
                        </Link>
                        <hr className='mx-2 mt-1'/>
                        <MenubarItem 
                          className='font-monomaniac mt-2 mb-2 ml-2 hover:text-red-500'
                          onClick={handleLogout}
                        >
                          Logout
                        </MenubarItem>
                      </>
                    ) : (
                      <Link to="/user/login" className='text-lg hover'>
                        <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                          Login/Signup
                        </MenubarItem>
                      </Link>

                    )}    
                  </MenubarContent>
              </MenubarMenu>
        
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl'><Plus className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-16 mt-[-60px] bg-white w-40 dark:bg-black'>
                    {!user && (
                      <Link to="/new/user">
                        <MenubarItem className='font-monomaniac mt-2 ml-2'>
                          New user
                        </MenubarItem>
                        <hr className='mx-2 mt-1'/>
                      </Link>
                    )}
                    <Link to="/new/task">
                      <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                        New task
                      </MenubarItem>  
                    </Link>
                    <hr className='mx-2 mt-1'/>
                    <Link to="/new/log">
                      <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                        New log
                      </MenubarItem> 
                    </Link>
                  </MenubarContent>
              </MenubarMenu>
    
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl'><ChartNoAxesCombined className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-16 mt-[-60px] bg-white w-40 dark:bg-black'>
                  <Link to="/reports/daily">
                    <MenubarItem className='font-monomaniac mt-2 ml-2'>
                      Daily report
                    </MenubarItem>
                  </Link>
                    <hr className='mx-2 mt-1'/>
                    <Link to="/reports/weekly">
                      <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                        Weekly report
                      </MenubarItem>  
                    </Link>
                    <hr className='mx-2 mt-1'/>
                    <Link to="/reports/monthly">
                      <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                        Monthly report
                      </MenubarItem>
                    </Link>
                    <hr className='mx-2 mt-1'/>
                    <Link to="/reports/tpt">
                      <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                        Total productive time
                      </MenubarItem>
                    </Link>
                    <hr className='mx-2 mt-1'/>
                    <Link to="/reports/twt">
                      <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                        Total wasted time
                      </MenubarItem> 
                    </Link>

                    <hr className='mx-2 mt-1'/>
                    <Link to="/reports/ttot">
                      <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                        Total time on task
                      </MenubarItem>
                    </Link>
                  </MenubarContent>
              </MenubarMenu>
    
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl'><Clock3 className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-16 mt-[-60px] bg-white dark:bg-black'>
                  <Link to="/trackers/">
                    <MenubarItem className='font-monomaniac mt-1 ml-1 mb-2'>
                      Trackers
                    </MenubarItem> 
                  </Link>
                </MenubarContent>
              </MenubarMenu>
    
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl mt-14'><Cog className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-16 mt-[-60px] bg-white dark:bg-black'>
                  <Link to="/settings">
                    <MenubarItem className='font-monomaniac mt-1 ml-1 mb-2'>
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
