import { Button } from '@progress/kendo-react-buttons'
import React from 'react'
import { useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate()
  
    const createBoard = async () => {
   
    }
  
    return (
      <div className='home'>
        <Button
        fillMode={"outline"}
        themeColor={"success"}
          onClick={createBoard}
        >
          Click here to create your first board
        </Button>
      </div>
    )
}
