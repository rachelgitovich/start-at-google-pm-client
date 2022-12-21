import { Loader } from "@progress/kendo-react-indicators";
import React from 'react';

const Loading = props => {
  return (
    <div className='loading' >
       <Loader type='infinite-spinner' />
    </div>
  )
}

export default Loading