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
import { Link, useMatchRoute } from "@tanstack/react-router";

import { User, Plus, ChartNoAxesCombined, Clock3, Cog } from 'lucide-react';


export default function Navbar() {
    const [ isOpen, setIsOpen ] = useState(false)
    console.log("Is open:", isOpen);

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
          <Menubar className='rounded-xl bg-yellow1 shadow-xl'>
              <h2 className='mt-5 text-orange2 font-monofett text-2xl'>Menu</h2>
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white'><User className='w-10 h-10'/></MenubarTrigger>
                  <MenubarContent className='ml-16 mt-[-60px] bg-white w-40'>
                    <MenubarItem className='font-monomaniac mt-2 ml-2'>
                      <Link to="#">Login/Signup</Link>
                    </MenubarItem>
                    <hr className='mx-2 mt-1'/>
                    <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>Assign user</MenubarItem>  
                  </MenubarContent>
              </MenubarMenu>
        
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl'><Plus className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-16 mt-[-60px] bg-white w-40'>
                    <MenubarItem className='font-monomaniac mt-2 ml-2'>
                     <Link to="/new/user">New user</Link>
                    </MenubarItem>
                    <hr className='mx-2 mt-1'/>
                    <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                      <Link to="/new/task">New task</Link>
                    </MenubarItem>  
                    <hr className='mx-2 mt-1'/>
                    <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                    <Link to="/new/log">New log</Link>
                    </MenubarItem> 
                  </MenubarContent>
              </MenubarMenu>
    
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl'><ChartNoAxesCombined className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-16 mt-[-60px] bg-white w-40'>
                    <MenubarItem className='font-monomaniac mt-2 ml-2'>
                      <Link to="/reports/daily">Daily report</Link>
                    </MenubarItem>
                    <hr className='mx-2 mt-1'/>
                    <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                      <Link to="/reports/weekly">Weekly report</Link>
                    </MenubarItem>  
                    <hr className='mx-2 mt-1'/>
                    <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                      <Link to="/reports/monthly">Monthly report</Link>
                    </MenubarItem>
                    <hr className='mx-2 mt-1'/>
                    <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                      <Link to="/reports/tpt">Total productive time</Link>
                    </MenubarItem>
                    <hr className='mx-2 mt-1'/>
                    <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                      <Link to="/reports/twt">Total wasted time</Link>
                    </MenubarItem> 
                    <hr className='mx-2 mt-1'/>
                    <MenubarItem className='font-monomaniac mt-2 ml-2 mb-2'>
                      <Link to="/reports/ttot">Total time on task</Link>
                    </MenubarItem> 
                  </MenubarContent>
              </MenubarMenu>
    
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl'><Clock3 className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-16 mt-[-60px] bg-white'>
                  <MenubarItem className='font-monomaniac mt-1 ml-1 mb-2'>
                    <Link to="/trackers/">Trackers</Link>
                  </MenubarItem> 
                </MenubarContent>
              </MenubarMenu>
    
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl mt-14'><Cog className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-16 mt-[-60px] bg-white'>
                <MenubarItem className='font-monomaniac mt-1 ml-1 mb-2'>
                    <Link to="/settings">Settings</Link>
                  </MenubarItem> 
                </MenubarContent>
              </MenubarMenu>
          </Menubar>

        )}
      </div>

    </div>
  )
}
