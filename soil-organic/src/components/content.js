/**
 * Content.js
 *
 * This component serves as a main content container for the application. It imports and displays
 * the 'About' and 'TopProducts' components. This layout structure is typically used in a React application
 * to organize sections of the application that might be part of a larger page or layout. The 'About'
 * component provides information about the application or business, while 'TopProducts' displays
 * a list of highlighted products.
 *
 * This component is usually used in the main part of the page layout where primary content is displayed.
 */
import React from "react";
import Products from "./content/TopProducts";
import About from "./content/about";

function Content() {
  return (
    <div>
      <About />
      <Products />
    </div>
  );
}

export default Content;
