import React, { useEffect, useState, useRef } from "react";
import { ListView } from "@progress/kendo-react-listview";
import { Popup } from "@progress/kendo-react-popup";

const MyItemRender = (props) => {
  let item = props.dataItem;

  return (
    <div
      className="k-listview-item"
      style={{
        padding: 10,
        borderBottom: "1px solid lightgrey",
      }}
    >
      <p>
        <b>assigner: </b>
        {item.assigner.email}
      </p>
      <p>
        <b>board name: </b>
        {item.board.name}
      </p>
      <p>
        <b>date: </b>
        {item.date}
      </p>
      <p>
        <b>type: </b>
        {item.notificationType}
      </p>
    </div>
  );
};

const NotificationList = ({ ref }) => {
  const [notifications, setNotification] = useState([]);

  useEffect(() => {
    fetch(
      "http://localhost:8080/api/v1/user/userNotification",
      requestOptionsGet
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            setNotification(result.data);
          });
        }
      })
      .catch((error) => console.log("error", error));
  }, []);

  let requestOptionsGet = {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
  };

  return (
    <div>
      <Popup anchor={ref} show={true} popupClass={"popup-content"}>
        <ListView
          data={notifications}
          item={MyItemRender}
          style={{
            width: "100%",
            height: 600,
          }}
        />
      </Popup>
    </div>
  );
};

export default NotificationList;
