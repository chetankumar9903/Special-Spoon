# `Special-Spoon` - FoodieHub: Recipes and Profile Management


![FoodieHub](https://github.com/chetankumar9903/Special-Spoon/assets/126199153/43ddde98-ad16-480a-aba0-9a020f38afa7)

[Visit FoodieHub]()

## FoodieHub: A delectable platform for sharing recipes, connecting with fellow food lovers, and updating your culinary profile.

Savor diverse recipes, connect with food enthusiasts, and manage your culinary profile in one flavorful hub for food lovers.

A secure and user-friendly authentication and recipe submission system that allows users to register, log in, submit recipes, and update their profiles.

## Table of Contents

1. [Features](#features)
2. [Getting Started](#getting-started)
3. [Technologies Used](#technologies-used)
4. [User Registration and Login](#user-registration-and-login)
5. [Recipe Submission](#recipe-submission)
6. [Updating User Profile](#updating-user-profile)
7. [Contributing](#contributing)
8. [License](#license)

## Features

- User registration and login with secure password hashing using bcrypt.
- JWT-based authentication and cookie management for user sessions.
- Multi-device sign-out for enhanced security.
- Fine-grained authorization procedures.
- Recipe submission and viewing.
- User profile updates for managing personal information.

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/chetankumar9903/FoodieHub--Recipes-and-Profile-Management.git
   cd FoodieHub--Recipes-and-Profile-Management
2. Install dependencies:
   ```bash
       npm install 
3. Run the project:
    ```bash
      npm run dev / npm run start

# Technologies Used

The project was developed using the following technologies:

- **Front-end**: HTML, CSS, JavaScript.
- **Back-end**: Node.js with Express.js.
- **Database**: MongoDB Atlas.
- **Authentication**: bcrypt for secure password hashing, JWT for user sessions.
- **Cookie Management**: cookie-parser for handling cookies and user sessions.
- **User Interface**: EJS templates for dynamic content rendering.

# User Registration and Login

A user-centric authentication and registration system that prioritizes data security. It utilizes bcrypt for password hashing, implements JSON Web Tokens (JWT) for seamless user session management, and enhances security through OAuth tokens. Complete user control includes registration, login, multi-device sign-out, and fine-grained authorization procedures.

# Recipe Submission

Welcome to Kitchen Magic Recipes - Blog, your culinary destination for exploring a world of flavors! Our website is a hub for food enthusiasts, where you can discover, create, and share delicious recipes from various global cuisines, including American, Thai, Mexican, Indian, and Chinese.

**Key Features**:

- Diverse Recipe Categories: Explore a wide range of recipe categories, each offering a unique culinary experience.
- User Recipe Submissions: Share your favorite recipes with our community and watch your creations gain recognition.
- Cooking Tips and Techniques: Enhance your culinary skills with expert tips and tricks.
- Community Engagement: Connect with fellow food lovers, exchange ideas, and build connections with people who share your passion for food.

# Updating User Profile

The /update-profile route is a critical part of our application's functionality. It enables users to update their profile information, including modifying existing details and adding new information. Here's how it works:

1. **User Authentication**: To access the profile update feature, users must first log in to their accounts.

2. **Data Validation**: When users submit the profile update form, the server receives the data, including the username, age, phone number, and address. Before proceeding, the server validates that the provided username exists in our database.

3. **Profile Existence Check**: The server also checks if the user already has an existing profile. If a profile is found, it means the user is updating their existing information. If not, a new profile is created for the user.

4. **Updating Existing Profile**: If the user has an existing profile, the server updates the profile with the new information, including age, phone number, and address. This ensures that the user's profile remains up-to-date.

5. **Creating New Profile**: In case the user didn't have a profile previously, a new profile document is created, and the user's information is added to our database.

6. **Success Response**: After successfully updating or creating the profile, the server responds with a success message. The user is then redirected to a view, which in this case is the "secret" view, displaying their updated profile information.

7. **Error Handling**: If any errors occur during this process, such as a user not found or a server error, appropriate error messages are sent as responses to handle these scenarios.

This feature enhances the user experience by allowing them to manage their profile information conveniently. It ensures that their profiles are always accurate and up-to-date.

# Contributing

Contributions to this project are welcome! Feel free to submit pull requests for new features, bug fixes, or improvements.
