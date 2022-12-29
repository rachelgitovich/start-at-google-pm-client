import React, { useEffect, useState } from "react";
import { Checkbox } from "@progress/kendo-react-inputs";

const NotificationSetting = () => {
  /**Email notification type */
  const [checkedAssignToMeEmail, setCheckedAssignToMeEmail] = useState(true);
  const [checkedStatusChangedEmail, setStatusChangedEmail] = useState(true);
  const [checkedCommentAddedEmail, setCheckedCommentAddedEmail] =
    useState(true);
  const [checkedDeletedEmail, setCheckedDeletedEmail] = useState(true);
  const [checkedDataChangedEmail, setCheckedDataChangedEmail] = useState(true);
  const [
    checkedUserAddedToTheSystemEmail,
    setCheckedUserAddedToTheSystemEmail,
  ] = useState(true);

  /**Popup notification type */
  const [checkedAssignToMePopup, setCheckedAssignToMePopup] = useState(true);
  const [checkedStatusChangedPopup, setStatusChangedPopup] = useState(true);
  const [checkedCommentAddedPopup, setCheckedCommentAddedPopup] =
    useState(true);
  const [checkedDeletedPopup, setCheckedDeletedPopup] = useState(true);
  const [checkedDataChangedPopup, setCheckedDataChangedPopup] = useState(true);
  const [
    checkedUserAddedToTheSystemPopup,
    setCheckedUserAddedToTheSystemPopup,
  ] = useState(true);

  /** set the state (email setting) on db when the page loaded */
  useEffect(() => {
    fetch(
      "http://localhost:8080/api/v1/user/getUserNotificationTypeEmail",
      requestOptionsGet
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            console.log(result);
            setCheckedAssignToMeEmail(result.data["ASSIGN_TO_ME"]);
            setStatusChangedEmail(result.data["STATUS_CHANGED"]);
            setCheckedCommentAddedEmail(result.data["COMMENT_ADDED"]);
            setCheckedDeletedEmail(result.data["DELETED"]);
            setCheckedDataChangedEmail(result.data["DATA_CHANGED"]);
            setCheckedUserAddedToTheSystemEmail(
              result.data["USER_ADDED_TO_THE_SYSTEM"]
            );
          });
        }
      })
      .catch((error) => console.log("error", error));
  }, []);

  /** set the state (popup setting) on db when the page loaded */

  useEffect(() => {
    fetch(
      "http://localhost:8080/api/v1/user/getUserNotificationTypePopup",
      requestOptionsGet
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            console.log(result);
            setCheckedAssignToMePopup(result.data["ASSIGN_TO_ME"]);
            setStatusChangedPopup(result.data["STATUS_CHANGED"]);
            setCheckedCommentAddedPopup(result.data["COMMENT_ADDED"]);
            setCheckedDeletedPopup(result.data["DELETED"]);
            setCheckedDataChangedPopup(result.data["DATA_CHANGED"]);
            setCheckedUserAddedToTheSystemPopup(
              result.data["USER_ADDED_TO_THE_SYSTEM"]
            );
          });
        }
      })
      .catch((error) => console.log("error", error));
  }, []);

  let requestOptionsPatch = {
    method: "PATCH",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
  };

  let requestOptionsGet = {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
  };

  const handleEmailTypeChange = (event) => {
    console.log("The checkbox was toggled");
    console.log(event);
    changeStateEventEmail(event.target.name);
    updateEmailNotifyTypeSetting(event.target.name, event.target.value);
  };

  const handlePopupTypeChange = (event) => {
    console.log("The checkbox was toggled");
    console.log(event);
    changeStateEventPopup(event.target.name);
    updatePopupNotifyTypeSetting(event.target.name, event.target.value);
  };

  /**Email State */
  const changeStateEventEmail = (name) => {
    switch (name) {
      case "ASSIGN_TO_ME":
        setCheckedAssignToMeEmail(!checkedAssignToMeEmail);
        break;
      case "STATUS_CHANGED":
        setStatusChangedEmail(!checkedStatusChangedEmail);
        break;
      case "COMMENT_ADDED":
        setCheckedCommentAddedEmail(!checkedCommentAddedEmail);
        break;
      case "DELETED":
        setCheckedDeletedEmail(!checkedDeletedEmail);
        break;
      case "DATA_CHANGED":
        setCheckedDataChangedEmail(!checkedDataChangedEmail);
        break;
      case "USER_ADDED_TO_THE_SYSTEM":
        setCheckedUserAddedToTheSystemEmail(!checkedUserAddedToTheSystemEmail);
        break;
      default:
        break;
    }
  };

  /**Popup State */
  const changeStateEventPopup = (name) => {
    switch (name) {
      case "ASSIGN_TO_ME":
        setCheckedAssignToMePopup(!checkedAssignToMePopup);
        break;
      case "STATUS_CHANGED":
        setStatusChangedPopup(!checkedStatusChangedPopup);
        break;
      case "COMMENT_ADDED":
        setCheckedCommentAddedPopup(!checkedCommentAddedPopup);
        break;
      case "DELETED":
        setCheckedDeletedPopup(!checkedDeletedPopup);
        break;
      case "DATA_CHANGED":
        setCheckedDataChangedPopup(!checkedDataChangedPopup);
        break;
      case "USER_ADDED_TO_THE_SYSTEM":
        setCheckedUserAddedToTheSystemPopup(!checkedUserAddedToTheSystemPopup);
        break;
      default:
        break;
    }
  };

  const updateEmailNotifyTypeSetting = async (type, choice) => {
    fetch(
      "http://localhost:8080/api/v1/user/updateEmailNotificationType?notificationType=" +
        type +
        "&update=" +
        choice,
      requestOptionsPatch
    )
      .then((response) => {
        response.json();
      })
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  const updatePopupNotifyTypeSetting = async (type, choice) => {
    fetch(
      "http://localhost:8080/api/v1/user/updatePopupNotificationType?notificationType=" +
        type +
        "&update=" +
        choice,
      requestOptionsPatch
    )
      .then((response) => {
        response.json();
      })
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };
  return (
    <>
      <div>
        <h2 style={{ fontSize: "24px", color: "green" }}>
          Email notifications
        </h2>
        <h3>
          Please select which of the type notifications you would like to
          receive an Email update :
        </h3>
        <Checkbox
          label={"item assign to me"}
          name={"ASSIGN_TO_ME"}
          value={checkedAssignToMeEmail}
          onChange={handleEmailTypeChange}
        />
        <br />
        <Checkbox
          label={"status changed"}
          name={"STATUS_CHANGED"}
          value={checkedStatusChangedEmail}
          onChange={handleEmailTypeChange}
        />
        <br />
        <Checkbox
          label={"comment added"}
          name={"COMMENT_ADDED"}
          value={checkedCommentAddedEmail}
          onChange={handleEmailTypeChange}
        />
        <br />
        <Checkbox
          label={"item deleted"}
          name={"DELETED"}
          value={checkedDeletedEmail}
          onChange={handleEmailTypeChange}
        />
        <br />
        <Checkbox
          label={"data item changed"}
          name={"DATA_CHANGED"}
          value={checkedDataChangedEmail}
          onChange={handleEmailTypeChange}
        />
        <br />
        <Checkbox
          label={"user added to the system"}
          name={"USER_ADDED_TO_THE_SYSTEM"}
          value={checkedUserAddedToTheSystemEmail}
          onChange={handleEmailTypeChange}
        />
      </div>
      <br />

      <div>
        <h2 style={{ fontSize: "24px", color: "green" }}>
          Popup notifications
        </h2>
        <h3>
          Please select which of the type notifications you would like to
          receive an Popup update:
        </h3>
        <Checkbox
          label={"item assign to me"}
          name={"ASSIGN_TO_ME"}
          value={checkedAssignToMePopup}
          onChange={handlePopupTypeChange}
        />
        <br />
        <Checkbox
          label={"status changed"}
          name={"STATUS_CHANGED"}
          value={checkedStatusChangedPopup}
          onChange={handlePopupTypeChange}
        />
        <br />
        <Checkbox
          label={"comment added"}
          name={"COMMENT_ADDED"}
          value={checkedCommentAddedPopup}
          onChange={handlePopupTypeChange}
        />
        <br />
        <Checkbox
          label={"item deleted"}
          name={"DELETED"}
          value={checkedDeletedPopup}
          onChange={handlePopupTypeChange}
        />
        <br />
        <Checkbox
          label={"data item changed"}
          name={"DATA_CHANGED"}
          value={checkedDataChangedPopup}
          onChange={handlePopupTypeChange}
        />
        <br />
        <Checkbox
          label={"user added to the system"}
          name={"USER_ADDED_TO_THE_SYSTEM"}
          value={checkedUserAddedToTheSystemPopup}
          onChange={handlePopupTypeChange}
        />
      </div>
    </>
  );
};
export default NotificationSetting;
