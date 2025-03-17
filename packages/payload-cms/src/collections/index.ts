/**
 * Collection exports from payload-cms package
 *
 * This allows importing collections directly:
 * import { Media, Categories, Posts, Pages, Users } from '@acme/payload-cms/collections'
 */

// Export individual collections
export { Media } from "./Media";
export { Categories } from "./Categories";

// Export collections from subdirectories
export { Posts } from "./Posts";
export { Pages } from "./Pages";
export { Users, createUsersCollection } from "./Users/index";
export { Courses } from "./Courses";
export { Divisions } from "./Divisions";
