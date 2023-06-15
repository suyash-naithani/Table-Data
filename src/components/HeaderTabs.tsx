import { useState } from "react";
import * as React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import ApplicationsTab from "./ApplicationsTab";

const HeaderTabs: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const onTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    index: number
  ) => {
    setTabIndex(index);
  };

  const tabContent = () => {
    if (tabIndex === 0) return <ApplicationsTab />;
    else return "TODO";
  };
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          onChange={onTabChange}
          value={tabIndex}
          aria-label="basic tabs example"
        >
          <Tab label="Applications" />

          <Tab label="Resources" />
        </Tabs>
      </Box>
      <Box
        overflow="auto"
        sx={{ width: "100%", height: "100%", backgroundColor: "lightgray" }}
        position="absolute"
      >
        {tabContent()}
      </Box>
    </>
  );
};

export default HeaderTabs;
