import * as React from "react";

import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
} from "@progress/kendo-react-layout";

import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";

const NavBar = () => {
  const token = localStorage.getItem("token");
  const getUserNotification = async () => {
    fetch("http://localhost:8080/api/v1/user/userNotification", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((result) => console.log(result.body()))
      .catch((error) => console.log("error", error));
  };

  function showNotificationList() {
    document.getElementById("dropDownNotification").classList.toggle("show");
  }

  const updateNotifyByEmail = async (choice) => {
    fetch("http://localhost:8080/api/v1/user/notify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        notify: choice,
      },
    });
  };

  const submitNotify = () => {
    let emailNotify = document.getElementById("emailNotify").value;
    //TODO: create endpoint check popup notification setting.
    //let popupNotify = document.getElementById("popupNotify").value;

    if (!isNaN(parseInt(emailNotify))) updateNotifyByEmail(true);
    else updateNotifyByEmail(false);
  };

  // document.getElementById("dropDownNotification").kendoDropDownButton({
  //   //icon: "paste",
  //   items: [
  //     {
  //       text: "notification 1",
  //     },
  //     {
  //       text: "notification 2",
  //     },
  //   ],
  // });

  return (
    <>
      <AppBar>
        <AppBarSection>
          <h1 className="title">Task management</h1>
        </AppBarSection>

        <AppBarSpacer />

        <AppBarSection>
          <input type="checkbox" id="emailNotify" value="emailNotify"></input>
          <label for="emailNotify"> get email notification </label>

          <input type="checkbox" id="popupNotify" value="popupNotify"></input>
          <label for="popupNotify">get popup notification</label>

          <button onclick={submitNotify}>Submit</button>
        </AppBarSection>

        <AppBarSection className="actions">
          <div class="dropdown">
            <button
              className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base"
              //onClick={getUserNotification}
              onClick={showNotificationList}
            >
              <BadgeContainer>
                <span className="k-icon k-i-bell" />
                <Badge
                  shape="dot"
                  themeColor="info"
                  size="small"
                  position="inside"
                />
              </BadgeContainer>
            </button>
            <div id="dropDownNotification" class="dropdown-notification">
              <p>notification 1</p>
              <p>notification 2</p>
            </div>
          </div>
        </AppBarSection>
      </AppBar>
      <style>{`
                body {
                    background: #dfdfdf;
                }
                .title {
                    font-size: 18px;
                    margin: 0;
                }
                ul {
                    font-size: 14px;
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                }
                li {
                    margin: 0 10px;
                }
                li:hover {
                    cursor: pointer;
                    color: #84cef1;
                }
                .k-button k-button-md k-rounded-md k-button-solid k-button-solid-base {
                    padding: 0;
                }
                .k-badge-container {
                    margin-right: 8px;
                }
                .dropdown{
                   position: relative;
                   display: inline-block;
                }
                .dropdown-notification{
                  display: none;
                  position: absolute;
                  background-color: #f1f1f1;
                  min-width: 160px;
                  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                  z-index: 1;
                }
                .dropdown-content p {
                color: black;
                padding: 12px 16px;
                text-decoration: none;
                display: block;
                }
                .show {display:block;}

            `}</style>
    </>
  );
};

export default NavBar;
