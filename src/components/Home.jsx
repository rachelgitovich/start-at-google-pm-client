import { Button } from '@progress/kendo-react-buttons'
import { useNavigate } from "react-router-dom"
//import { useDispatch } from "react-redux"
import React from 'react'

export default function Home() {
    const navigate = useNavigate()
   // const dispatch = useDispatch()
  
    const createBoard = async () => {
    //   try {
    //     const res = await boardApi.create()
    //     dispatch(setBoards([res]))
    //     navigate(`/boards/${res.id}`)
    //   } catch (err) {
    //     alert(err)
    //   } 
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
