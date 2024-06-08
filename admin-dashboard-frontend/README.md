# Admin Dashboard Frontend

The Admin Dashboard Frontend for the SOIL Organic website serves as the management interface for administrators. It provides functionalities such as user management, product management, review moderation, and metric visualization.

## Features

### Dashboard Components
- **Review Management**: Allows administrators to monitor and manage product reviews. Reviews containing profanities are flagged automatically using a predefined list of inappropriate words. Administrators can hide these reviews to ensure they are not visible to other users, while the reviewers receive feedback that their review has been moderated.

#### Categories of Words Considered: 
1. Slurs and Derogatory Language:
    * Racial, ethnic, gender, or sexuality-based slurs that aren't always covered by general lists.
    * Disability-related derogatory terms.
2. Regional Slang:
    * Profanities and slurs specific to certain regions or cultures that might not be universally recognized.
    * Consider terms that are benign in one dialect but offensive in another.
3. Newly Coined Phrases:
    * Internet slang that can evolve to have derogatory meanings.
    * Memes or phrases that have taken on offensive contexts.
4. Double Entendres and Euphemisms:
    * Words or phrases with dual meanings where one is innocuous and the other is offensive.
    * Euphemisms that are used to covertly convey offensive language.
5. Common Misspellings of Profanities:
    * Often people intentionally misspell swear words to bypass filters.
    * Variations of swear words where letters are replaced or added.
6. Abbreviations and Acronyms:
    * Some acronyms can stand for offensive phrases.
    * Common abbreviations used in texting or online communications that imply profanity.

#### Examples for these categories:
- Slurs and Derogatory Language
* Review: "I can't believe you would sell something this shoddy to slur1."
* Review: "Absolutely horrible service, and the manager was a real slur2 to us."
- Regional Slang
* Review: "This product is total regionalProfanity1, I want a refund!"
* Review: "I've heard good things, but my experience was just regionalProfanity2."
- Newly Coined Phrases
* Review: "The advertisement was a total internetSlang1, nothing like the real product."
* Review: "Feels like I got memed, this is just memePhrase1 quality."
- Double Entendres and Euphemisms
* Review: "It’s a doubleMeaning1 if I've ever seen one, completely misleading."
* Review: "Don’t waste your money on this euphemism1, it’s not worth it."
- Common Misspellings of Profanities
* Review: "This fuc*ing product broke the first day I got it!"
* Review: "What a piece of sh*t, it stopped working within a week!"
- Abbreviations and Acronyms
* Review: "OMFG, I can't handle how bad this is!"
* Review: "STFU about how good this is, it’s the worst purchase I’ve ever made."

- **User Management**: Enables the administration team to block or unblock users, preventing or allowing access to the application as necessary.
  
- **Product Management**: Admins can add new products, edit existing product details, and delete products from the inventory.
  
- **Metrics Display**: Visualizes key metrics through graphs:
  - **Recent Reviews Widget**: Displays the latest three reviews as a widget on the dashboard's home page, using a subscription to fetch real-time data.
  - **Product Engagement**: Bar graphs show the engagement level of products based on review counts and average ratings. This metric can show which products are receiving the most engagement. This would allow the admin to quickly see which products are popular among users and possibly which products are polarizing.
  - **Stock Updates**: Line graphs track stock levels, highlighting changes and trends over time. Tracking stock updates of products indeed offers valuable insights into user-product engagement, particularly in understanding which products are in high demand. This type of metric can help to identify trends in product popularity and stock depletion rates, which could inform inventory management decisions and marketing strategies.

### GraphQL Operations

#### Queries
- **FetchProductList**: Retrieves a list of all products with their details.
- **FetchReviewList**: Fetches all reviews, including user and product information.
- **FetchUserList**: Lists all users and their statuses (admin, blocked).

#### Mutations
- **AddProduct**: Allows adding a new product to the database.
- **EditProduct**: Facilitates editing details of an existing product.
- **DeleteProduct**: Enables product deletion.
- **BlockUser/UnblockUser**: Used to block or unblock a user.
- **UpdateReviewVisibility**: Admins can toggle the visibility of a review.

#### Subscriptions
- **LatestReviewsFetched**: Subscribes to updates of the latest reviews, used in the Recent Reviews widget.
- **ProductEngagementUpdated**: Tracks changes in product engagement metrics.
- **ProductStockUpdated**: Monitors updates in product stock levels.

## Setup and Installation

To set up the admin dashboard frontend, follow these steps:

1. **Clone the repository**: Obtain the code by cloning the admin dashboard repository: https://github.com/rmit-fsd-2024-s1/s3977487-s3987749-a2
2. **Install dependencies**: Navigate to the admin-dashboard-frontend directory and run `npm install` to install the required dependencies.
3. **Start the application**: Execute `npm start` to run the frontend. Ensure the backend server is also running to connect successfully.

## Technologies Used

- **React**: Utilized for building the user interface.
- **Apollo Client**: Manages both local and remote data with GraphQL.
- **Chart.js**: Used for rendering line and bar charts in the Metrics Display.
- **GraphQL**: Facilitates data fetching, subscriptions, and manipulations.
