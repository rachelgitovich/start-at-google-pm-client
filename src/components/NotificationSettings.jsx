import { Button } from "@progress/kendo-react-buttons";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotificationSetting= () =>{
  const navigate = useNavigate();


  return (
    <div className="home">
      <Button fillMode={"outline"} themeColor={"success"} onClick={createBoard}>
        Click here to create your first board
      </Button>
    </div>>
  );
};
export default NotificationSetting; 