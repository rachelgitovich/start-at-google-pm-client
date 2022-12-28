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
  const currentRef = React.useRef();

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
          <div>
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
          </div>
        </AppBarSection>

        <AppBarSection className="actions">
          <div>
            <button
              className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base"
              onClick={() => {
                setNotificationVisible(!notificationVisible);
              }}
            >
              <BadgeContainer>
                <span className="k-icon k-i-bell" />
                <Badge themeColor="info" size="small" position="inside" />
              </BadgeContainer>
            </button>
          </div>
        </AppBarSection>
      </AppBar>
      {notificationVisible && <NotificationList ref={currentRef} />}
{/* 
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
                `}</style> */}
    </>
  );
};

export default NavBar;
