/**
 * Creates and exports a React context for user data.
 *
 * UserContext is a React context object that can be used to provide and consume
 * user-related data throughout the component tree without having to prop-drill.
 * It enables components to subscribe to user context changes and re-render only
 * when the user data they depend on has changed.
 *
 * This context is especially useful in applications where user authentication state
 * or user-specific data needs to be accessible by many components at different nesting
 * levels of the application.
 *
 * Usage:
 * 1. Wrap a component tree with UserContext.Provider and pass the user data as value.
 * 2. Consume the user data in child components using useContext(UserContext).
 *
 * @module UserContext
 */
import { createContext } from "react";

// Initialize the UserContext with `null` as the default value.
// `null` typically indicates that no user is logged in or that user data is not available.
const UserContext = createContext(null);

export default UserContext;
