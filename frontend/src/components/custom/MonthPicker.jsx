import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../shadcn/Select";


function MonthPicker({ onSelect }) {
  return (
    <div>
        <Select onValueChange={onSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a month..."/>
            </SelectTrigger>
            <SelectContent className='dark:bg-black'>
              <SelectItem value={'January'}>January</SelectItem>
              <SelectItem value={'February'}>February</SelectItem>
              <SelectItem value={'March'}>March</SelectItem>
              <SelectItem value={'April'}>April</SelectItem>
              <SelectItem value={'May'}>May</SelectItem>
              <SelectItem value={'June'}>June</SelectItem>
              <SelectItem value={'July'}>July</SelectItem>
              <SelectItem value={'August'}>August</SelectItem>
              <SelectItem value={'September'}>September</SelectItem>
              <SelectItem value={'October'}>October</SelectItem>
              <SelectItem value={'November'}>November</SelectItem>
              <SelectItem value={'December'}>December</SelectItem>
            </SelectContent>
        </Select>

    </div>
  )
}

export default MonthPicker
