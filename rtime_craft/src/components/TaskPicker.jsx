import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "./Select";
  

function TaskPicker() {
  return (
    <div>
        <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a project..."/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="leetcode">Leetcode</SelectItem>
              <SelectItem value="job-searck">Job search</SelectItem>
            </SelectContent>
        </Select>

    </div>
  )
}

export default TaskPicker
