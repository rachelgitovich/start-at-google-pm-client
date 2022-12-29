import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
} from "@progress/kendo-react-layout";

import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";
import NotificationList from "./NotificationList";

const NavBar = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const navigate = useNavigate();
  const anchor = React.useRef(null)

  return (
    <>
      <AppBar  className="navbar">
        <AppBarSection>
          <h1

            className="title"
            onClick={() => {
              navigate("/home");
            }}
          >
            Task management
          </h1>
        </AppBarSection>

        <AppBarSpacer />
        <AppBarSection>
            <button
              onClick={() => {
                navigate("/notify");
              }}
              className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base"
            >
              <BadgeContainer>
                <span className="k-icon k-i-gear" />
              </BadgeContainer>
            </button>
        </AppBarSection>

        <AppBarSection >
            <button
ref={anchor}
              className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base"
              onClick={(e) => {
                debugger
                setNotificationVisible(!notificationVisible);
              }}
            >
              <BadgeContainer>
                <span  className="k-icon k-i-bell" />
                <Badge themeColor="info" size="small" position="inside" />
              </BadgeContainer>
            </button>
        </AppBarSection>
      </AppBar>
      {notificationVisible && <NotificationList anchor={anchor} />}

    </>
  );
};

export default NavBar;
