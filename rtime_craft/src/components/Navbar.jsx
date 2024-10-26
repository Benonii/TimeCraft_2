import React, { useState } from 'react';
import CloseMenu from './CloseMenu'; 
import  OpenMenu  from './OpenMenu';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./MenuBar";

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
                  <MenubarContent className='ml-20 mt-[-60px]'>
                    <MenubarItem>
                      New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>New Window</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Share</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Print</MenubarItem>
                  </MenubarContent>
              </MenubarMenu>
        
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl'><Plus className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-20 mt-[-60px]'>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>New Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
    
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl'><ChartNoAxesCombined className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-20 mt-[-60px]'>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>New Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
    
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl'><Clock3 className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-20 mt-[-60px]'>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>New Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
    
              <MenubarMenu>
                <MenubarTrigger className='py-5 text-white font-monomaniac text-2xl mt-20'><Cog className='w-10 h-10'/></MenubarTrigger>
                <MenubarContent className='ml-20 mt-[-60px]'>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>New Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
          </Menubar>

        )}
      </div>

    </div>
  )
}
