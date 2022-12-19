import React from 'react'
import { Loader } from "@progress/kendo-react-indicators";

const Loading = props => {
  return (
    <div className='loading' >
       <Loader type='infinite-spinner' />
    </div>
  )
}

export default Loading