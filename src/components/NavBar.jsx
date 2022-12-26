import * as React from "react";

import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
} from "@progress/kendo-react-layout";

import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";
import DropDownNotification from "./DropDownNotificationList";

const NavBar = () => {
  const getUserNotification = async () => {
    fetch("http://localhost:8080/api/v1/user/userNotification", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
    })
      .then((response) => response.json())
      .then((result) => console.log(result))
      .then(showNotificationList())
      .catch((error) => console.log("error", error));
  };

  function showNotificationList() {
    document.getElementById("dropDownNotification").classList.toggle("show");
  }

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

        <AppBarSection className="actions">
          <div class="dropdown">
            <button
              className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base"
              onClick={getUserNotification}
            >
              <BadgeContainer>
                <span className="k-icon k-i-bell" />
                <Badge themeColor="info" size="small" position="inside" />
              </BadgeContainer>
            </button>
            <DropDownNotification />
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
