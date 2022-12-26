import React, { useEffect, useState} from "react";
import { Switch } from "@progress/kendo-react-inputs";
import { Checkbox } from "@progress/kendo-react-inputs";

const NotificationSetting = () => {
  const [checkedEmailNotify, setCheckedEmailNotify] = useState(true);
  const [checkedPopupNotify, setCheckedPopupNotify] = useState(true);

  const [checkedAssignToMe, setCheckedAssignToMe] = useState(true);
  const [checkedStatusChanged, setStatusChanged] = useState(true);
  const [checkedCommentAdded, setCheckedCommentAdded] = useState(true);
  const [checkedDeleted, setCheckedDeleted] = useState(true);
  const [checkedDataChanged, setCheckedDataChanged] = useState(true);
  const [checkedUserAddedToTheSystem, setCheckedUserAddedToTheSystem] =
    useState(true);

  useEffect(() => {
    fetch(
      "http://localhost:8080/api/v1/user/getUserNotificationType",
      requestOptionsGet
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            console.log(result);
            setCheckedAssignToMe(result.data["ASSIGN_TO_ME"]);
            setStatusChanged(result.data["STATUS_CHANGED"]);
            setCheckedCommentAdded(result.data["COMMENT_ADDED"]);
            setCheckedDeleted(result.data["DELETED"]);
            setCheckedDataChanged(result.data["DATA_CHANGED"]);
            setCheckedUserAddedToTheSystem(
              result.data["USER_ADDED_TO_THE_SYSTEM"]
            );
          });
        }
      })
      .catch((error) => console.log("error", error));
  }, []);

  const handleNotificationSetting = (event) => {
    console.log("The switch was toggled");
    console.log(event);
    if (event.target.name === "email") {
      setCheckedEmailNotify(!checkedEmailNotify);
    } else if (event.target.name === "popup") {
      setCheckedPopupNotify(!checkedPopupNotify);
    }
    updateNotifyBy(event.target.value, event.target.name);
  };

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
  const updateNotifyBy = async (choice, type) => {
    fetch(
      "http://localhost:8080/api/v1/user/updateNotifyBy?notify=" +
        choice +
        "&type=" +
        type,
      requestOptionsPatch
    )
      .then((response) => {
        console.log(response);
        response.json().then((result) => console.log(result));
      })
      .catch((error) => console.log("error", error));
  };

  const handleTypeChange = (event) => {
    console.log("The checkbox was toggled");
    console.log(event);
    changeStateEvent(event.target.name);
    updateNotifyTypeSetting(event.target.name, event.target.value);
  };

  const changeStateEvent = (name) => {
    switch (name) {
      case "ASSIGN_TO_ME":
        setCheckedAssignToMe(!checkedAssignToMe);
        break;
      case "STATUS_CHANGED":
        setStatusChanged(!checkedStatusChanged);
        break;
      case "COMMENT_ADDED":
        setCheckedCommentAdded(!checkedCommentAdded);
        break;
      case "DELETED":
        setCheckedDeleted(!checkedDeleted);
        break;
      case "DATA_CHANGED":
        setCheckedDataChanged(!checkedDataChanged);
        break;
      case "USER_ADDED_TO_THE_SYSTEM":
        setCheckedUserAddedToTheSystem(!checkedUserAddedToTheSystem);
        break;
      default:
        break;
    }
  };

  const updateNotifyTypeSetting = async (type, choice) => {
    fetch(
      "http://localhost:8080/api/v1/user/updateNotificationType?notificationType=" +
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
        <h3>
          Please select which of the type notifications you would like to
          receive an update
        </h3>
        <Checkbox
          label={"item assign to me"}
          name={"ASSIGN_TO_ME"}
          value={checkedAssignToMe}
          onChange={handleTypeChange}
        />
        <br />
        <Checkbox
          label={"status changed"}
          name={"STATUS_CHANGED"}
          value={checkedStatusChanged}
          onChange={handleTypeChange}
        />
        <br />
        <Checkbox
          label={"comment added"}
          name={"COMMENT_ADDED"}
          value={checkedCommentAdded}
          onChange={handleTypeChange}
        />
        <br />
        <Checkbox
          label={"item deleted"}
          name={"DELETED"}
          value={checkedDeleted}
          onChange={handleTypeChange}
        />
        <br />
        <Checkbox
          label={"data item changed"}
          name={"DATA_CHANGED"}
          value={checkedDataChanged}
          onChange={handleTypeChange}
        />
        <br />
        <Checkbox
          label={"user added to the system"}
          name={"USER_ADDED_TO_THE_SYSTEM"}
          value={checkedUserAddedToTheSystem}
          onChange={handleTypeChange}
        />
      </div>
      <br />
      <div className="notification">
        <Switch
          id="emailNotify"
          name="email"
          value={checkedEmailNotify}
          onChange={handleNotificationSetting}
        />
        <label for="emailNotify"> get email notification </label>

        <Switch
          id="popupNotify"
          name="popup"
          value={checkedPopupNotify}
          onChange={handleNotificationSetting}
        />
        <label for="popupNotify">get popup notification</label>
      </div>
    </>
  );
};
export default NotificationSetting;
