import React from "react";
import Navigator from "../components/NavigationBar";

function Specials() {
  return (
    <div style={{ margin: "20px 5%" }}>
      <Navigator />
      <h1>Weekly Specials</h1>
      <p>
        Check out this week's special deals on our premium organic products!
      </p>
      {/* Special deals content will go here */}
    </div>
  );
}

export default Specials;
