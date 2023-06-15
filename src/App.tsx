import { AppBar, Toolbar, Typography } from "@mui/material";
import HeaderTabs from "./components/HeaderTabs";

function App() {
  return (
    <>
      <AppBar position="absolute">
        <Toolbar variant={"regular"}>
          <Typography variant="h4" color="inherit" component="div">
            Your Data
          </Typography>
        </Toolbar>
      </AppBar>
      <HeaderTabs />
    </>
  );
}

export default App;
