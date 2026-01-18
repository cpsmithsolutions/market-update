Market Update is a web based application for tracking stock prices, data, charts, and news on your favorite stocks. The homepage gives users updates on index prices and big news stories in the markets. By creating a user profile, you can keep track of your favorite stocks in a watchlist which allows the user a quick glance at price movements along with an expanded view for each stock that shows chart data for various time periods, stock metrics, and stock news. User passwords are hashed using Bcrypt encryption and stored as encrypted data.

You can view the deployed application at 
<http://marketupdate.surge.sh/>

**Note**
YahooFinance Api only accepts ticker symbols, so searching by company name will not return any results.


**Front End Tech Stack**
(React, Redux, useSWR, Bootstrap)

**Back End Tech Stack**

Node.js, Express, PostgreSQL

**API's**

**Yahoo Finance Api**

(Api Key Required)

Create and account to get your Api Key

<https://rapidapi.com/apidojo/api/yahoo-finance1>
<https://finnhub.io/>

**Important Notes on Setup**

 **Backend**
 
1. Setup PostgreSQL Database (make sure psql is installed on your machine, then open psql) 

2. Run the market-update sql file to create a SQL database and create the users data tables

 psql < market-update.sql
 
3. Install dependencies (npm install)
4. Start backend server (npm start)

**Front End**

1. add an .env file and add the api keys for the finance API's REACT_APP_YAHOO_FINANCE_API_KEY, REACT_APP_FINNHUB_API_KEY 
1. Install dependencies (npm install)
2. Start front end server (npm start)



