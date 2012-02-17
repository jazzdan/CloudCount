# CloudCount

## Contributors
* Carley Keefe
* Colby Rabideau
* Dan Miller

## The Project
CloudCount is an straight forward, multi-user, opensource bookkeeping system, targetted to organizations in developing countries around the world. Bookkeeping software is expensive and many of the features in commerical software fall outside the scope of the use case for said organizations.

## Design Concerns

1. **Connectivity** - The developing world does not have the robust network infrastructure found in Europe and the United States. A web base application must be light on its feet, reducing network overhead and also be able to gracefully handle and potential network interruptions.

2. **Auditing** - as a multi-user system dealing with potentially sensitive, auditing updates to the state of the system is a must. Administrators should be able to track user activity and changes to the budgets. Additionally, as users work in the system, they should be updated (in somewhat real-time) as to the activity of other users and administrators as they alter the system.

3. **Change Tracking** - Client-side changes will *not* be saved in realtime. Admins/Users will be free to change the budget locally without necessarily commiting changes until they are ready. This necessitates a robust method for actively informing users of their changes to the system as well as informing them of changes made by other users.

## The Stack

### Presentation (HTML)
* Twitter Bootstrap: responsive UI frame work & utilities

### Client Logic (JavaScript)
* require.js: js dependency management
* jQuery: DOM manipulation & cross browser normalization
* Backbone: client side data modeling, view management and REST
* Handlebars: compiled, logic-less html templates

### Server (Java)
* Play! Framework: Java web framework (for the API)

### Data Persistence
* MongoDB: Object-Oriented Data Store
* JackRabbit: Content Repository

## Specification Deviations
Obviously, venturing away from a Java Applet and undertaking a browser based solution necessitates some potentially drastic UI changes.

### Single Window
In most practical situations, browser based apps should limited to a single unified window. However, that window presents a larger canvas than the smaller panels in the spec, meaning there is more space to present more information in a useful and logically juxtaposed arrangement.

### Change Tracking