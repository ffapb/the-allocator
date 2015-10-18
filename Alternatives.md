Here I document related software that I researched.
Most of these are ''open-source'' , unless indicated otherwise.

## Summary
To summarize my findings below:
* mypersonalindex had a strategy-account-security hierarchy close to what we need
* mypersonalindex had online price retrieval
* rebalance had the rebalancing method desired
* Webo had the web interface + web backend + user management

## List
Webo
* http://wealthbot.io/
* source code is too complicated for what it accomplishes
* demo site available, but a little buggy
* close to idea of ''creating a virtual fund''
* written in php
* not out-of-date (last blog post in June 2015, now is July 2015)
* looked like it was saving on the server

mypersonalindex
* http://code.google.com/p/mypersonalindex
* written in qt and uses sqlite file
* saves to sqlite file that can be exported/imported
* fast
* can get prices from yahoo!
* can add multiple ''portfolios'', which in our case translate to ''strategies''
* can add multiple accounts to each portfolio
* can add classes and securities and trades
* last update March 2012
* suggests trades to rebalance in USD, but not specific quantities
* it defined target allocations based on asset classes, and not the constituent
* defining a security was linking it to the account. It also distributed it over multiple asset classes, which was wierd

stock-portfolio-manager
* http://code.google.com/p/stock-portfolio-manager/
* written in java
* looks like it can show distributions by class, add transactions, and search transactions
* doesn''t support account management
* I didn''t try it

rebalance
* http://plutus-prod.s3-website-us-east-1.amazonaws.com/rebalance/
* proposes trades when contributing more money or rebalancing
* Similar to http://optimalrebalancing.tk/
* calculates in browser + saves in browser

Gnucash
* http://www.gnucash.org/
* does accounting transactions and balancing (like bankflow)
* Uses libfinance-quote-perl to retrieve prices from a variety of sources

sage math
* https://cloud.sagemath.com
* used to have a subwebsite for this
* Mentioned here: http://money.stackexchange.com/q/7247
 * Sage Math`s stale Quantitative Finance Dev -branch.
 * GPLed, (very powerful beneath tools but not yet implemented to the finance part), 
 * some instructions [here](http://www.sagemath.org/doc/reference/finance.html)
* I didn''t try it

Fund manager
* https://www.fundmanagersoftware.com
* not open-source
* Their prices sources are listed [here](https://www.fundmanagersoftware.com/intrtv.html#Bloomberg%20%28Historical%29)
* Their transactions sources are listed [here](https://www.fundmanagersoftware.com/tintrtv.html)
 * This is interesting because they can get your portfolio from the custodian
 * I had seen "reconciliation" buttons in other software, but didn''t understand what it was for
 * It seems this is what it''s for
* single-user account is for 89USD
* I didn''t try it
