function loadDemo3() {
  return {
    "strategies" : {
      "Strat1": {
        "name": "Strat1",
        "allocations": {
          "SEC 1": { "id": "SEC 1", "allocation": 1 },
          "SEC 2"       : { "id": "SEC 2",        "allocation": 2 },
          "SEC 3"     : { "id": "SEC 3",      "allocation": 3 },
          "SEC 4"      : { "id": "SEC 4",       "allocation": 4 },
          "SEC 5"    : { "id": "SEC 5",     "allocation": 5 },
          "SEC 6"     : { "id": "SEC 6",      "allocation": 6 },
          "SEC 7"       : { "id": "SEC 7",        "allocation": 7 },
          "SEC 8": { "id": "SEC 8", "allocation": 8 },
          "SEC 9" : { "id": "SEC 9",  "allocation": 9 },
          "SEC 10"   : { "id": "SEC 10",    "allocation":10 },
          "SEC 11" : { "id": "SEC 11",  "allocation":11 },
          "SEC 12" : { "id": "SEC 12",  "allocation":12 },
          "SEC 13": { "id": "SEC 13", "allocation":13 },
          "SEC 14"  : { "id": "SEC 14",   "allocation": 9 }
       }
      },
      "Strat2": {
        "name": "Strat2",
        "allocations": {
          "SEC 1": { "id": "SEC 1", "allocation": 3 },
          "SEC 2"       : { "id": "SEC 2",        "allocation": 2 },
          "SEC 3"     : { "id": "SEC 3",      "allocation": 1 },
          "SEC 4"      : { "id": "SEC 4",       "allocation": 5 },
          "SEC 5"    : { "id": "SEC 5",     "allocation": 4 },
          "SEC 6"     : { "id": "SEC 6",      "allocation": 7 },
          "SEC 7"       : { "id": "SEC 7",        "allocation": 6 },
          "SEC 15": { "id": "SEC 15", "allocation": 8 },
          "SEC 8": { "id": "SEC 8", "allocation":10 },
          "SEC 9" : { "id": "SEC 9",  "allocation": 9 },
          "SEC 16"  : { "id": "SEC 16",   "allocation":11 },
          "SEC 17"   : { "id": "SEC 17",    "allocation":13 },
          "SEC 10"   : { "id": "SEC 10",    "allocation":12 },
          "SEC 18"    : { "id": "SEC 18",     "allocation": 9 }
        }
      }
    },
    "accounts" : {
      "ACC1": {
        "id":   "ACC1",
        "name": "Clint Eastwood",
        "inception": "2012-04-19",
        "initialInvestment": 564938,
        "rm": "Nathalie Portman",
        "navMonthStart": 612028,
        "navYearStart": 606551,
        "feesMan": 0.5,
        "feesOther": 0,
        "feesEntry": 0.95,
        "strategy": "Strat2",
        "cash": 3019,
        "fromEADS": false,
        "allocations": {
          "SEC 19": {
            "id": "SEC 19",
            "avgCost": 59.54,
            "numShares": 650,
          },
          "SEC 20"  : {
            "id": "SEC 20",
            "avgCost": 199.58,
            "numShares": 138,
           }
        }
      },
      "ACC2": {
        "id":   "ACC2",
        "name": "Cary Grant",
        "inception": "2012-10-05",
        "initialInvestment": 257452,
        "rm": "Neo",
        "navMonthStart": 287585,
        "navYearStart": 281706,
        "feesMan": 0.5,
        "feesOther": 300,
        "feesEntry": 0,
        "strategy": "Strat2",
        "cash": 220,
        "fromEADS": false,
        "allocations": {
          "SEC 15": {
            "id": "SEC 15",
            "avgCost": 896.40,
            "numShares": 18.6136,
          },
          "SEC 1"  : {
            "id": "SEC 1",
            "avgCost": 5063.16,
            "numShares": 2.663,
           },
          "SEC 21"  : {
            "id": "SEC 21",
            "avgCost": 60.21,
            "numShares": 195,
           },
          "SEC 22"  : {
            "id": "SEC 22",
            "avgCost": 30.20,
            "numShares": 195.95,
           },
          "SEC 23"  : {
            "id": "SEC 23",
            "avgCost": 146.80,
            "numShares": 45.24,
           },
          "SEC 2"  : {
            "id": "SEC 2",
            "avgCost": 39.92,
            "numShares": 360.722,
           },
          "SEC 16"  : {
            "id": "SEC 16",
            "avgCost": 1166.99,
            "numShares": 12.8536,
           },
          "SEC 17"  : {
            "id": "SEC 17",
            "avgCost": 1029.29,
            "numShares": 13.6015,
           },
          "SEC 4"  : {
            "id": "SEC 4",
            "avgCost": 27.48,
            "numShares": 247.45,
           },
          "SEC 5"  : {
            "id": "SEC 5",
            "avgCost": 64.00,
            "numShares": 208,
           },
          "SEC 3"  : {
            "id": "SEC 3",
            "avgCost": 647.10,
            "numShares": 10.817,
           },
          "SEC 24"  : {
            "id": "SEC 24",
            "avgCost": 34.72,
            "numShares": 201.61,
           },
          "SEC 6"  : {
            "id": "SEC 6",
            "avgCost": 11521.35,
            "numShares": 1.2,
           },
          "SEC 7"  : {
            "id": "SEC 7",
            "avgCost": 101.32,
            "numShares": 138.176,
           },
          "SEC 25"  : {
            "id": "SEC 25",
            "avgCost": 13.93,
            "numShares": 1026.81,
           },
          "SEC 18"  : {
            "id": "SEC 18",
            "avgCost": 0,
            "numShares": 0,
           },
          "SEC 9"  : {
            "id": "SEC 9",
            "avgCost": 1084.49,
            "numShares": 12.5275,
           },
          "SEC 10"  : {
            "id": "SEC 10",
            "avgCost": 1087.30,
            "numShares": 12.3252,
           },
          "SEC 11"  : {
            "id": "SEC 11",
            "avgCost": 29.42,
            "numShares": 237.933,
           },
          "SEC 12"  : {
            "id": "SEC 12",
            "avgCost": 28.93,
            "numShares": 241.963,
           },
          "SEC 13"  : {
            "id": "SEC 13",
            "avgCost": 201.46,
            "numShares": 68.004,
           },
          "GOLD"  : {
            "id": "GOLD",
            "avgCost": 124.02,
            "numShares": 59,
           },
          "OIL"  : {
            "id": "OIL",
            "avgCost": 31.57,
            "numShares": 180,
           },
          "MONEY MARKET"  : {
            "id": "MONEY MARKET",
            "avgCost": 1.1,
            "numShares": 19648.4358,
           }
        }
      }
    },
    "securities" : {
      "SEC 1":   {
        "id": "SEC 1",
        "name": "Security 1 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 2":  {
        "id": "SEC 2",
        "name": "Security 2 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 3":    {
        "id": "SEC 3",
        "name": "Security 3 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
       },
      "SEC 4": {
        "id": "SEC 4",
        "name": "Security 4 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 5":  {
        "id": "SEC 5",
        "name": "Security 5 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 6":  {
        "id": "SEC 6",
        "name": "Security 6 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "ALTERNATIVE FUNDS"
      },
      "SEC 7":  {
        "id": "SEC 7",
        "name": "Security 7 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "ALTERNATIVE FUNDS"
      },
      "SEC 15":  {
        "id": "SEC 15",
        "name": "Security 15 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 8":  {
        "id": "SEC 8",
        "name": "Security 8 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "Multi-Asset"
      },
      "SEC 9":  {
        "id": "SEC 9",
        "name": "Security 9 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "BOND FUNDS"
      },
      "SEC 16":  {
        "id": "SEC 16",
        "name": "Security 16 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 17":  {
        "id": "SEC 17",
        "name": "Security 17 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 10":  {
        "id": "SEC 10",
        "name": "Security 10 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "BOND FUNDS"
      },
      "SEC 25":  {
        "id": "SEC 25",
        "name": "Security 25 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "ALTERNATIVE FUNDS"
      },
      "SEC 18":  {
        "id": "SEC 18",
        "name": "SEC 18 fund",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "ALTERNATIVE FUNDS"
      },
      "SEC 11":  {
        "id": "SEC 11",
        "name": "Security 11 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "BOND FUNDS"
      },
      "SEC 12":  {
        "id": "SEC 12",
        "name": "Security 12 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "BOND FUNDS"
      },
      "SEC 13":  {
        "id": "SEC 13",
        "name": "Security 13 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "BOND FUNDS"
      },
      "SEC 14":  {
        "id": "SEC 14",
        "name": "Security 14 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "BOND FUNDS"
      },
      "SEC 26":  {
        "id": "SEC 26",
        "name": "Security 26 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "BOND FUNDS"
      },
      "SEC 27":  {
        "id": "SEC 27",
        "name": "Security 27 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "BOND FUNDS"
      },
      "GOLD":  {
        "id": "GOLD",
        "name": "Gold fund",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "Commodities"
      },
      "OIL":  {
        "id": "OIL",
        "name": "Oil fund",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "Commodities"
      },
      "SEC 28":  {
        "id": "SEC 28",
        "name": "Security 28 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "BOND FUNDS"
      },
      "SEC 29":  {
        "id": "SEC 29",
        "name": "Security 29 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "BOND FUNDS"
      },
      "MONEY MARKET":  {
        "id": "MONEY MARKET",
        "name": "Money Market",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "MONEY FUNDS"
      },
      "SEC 23":  {
        "id": "SEC 23",
        "name": "Security 23 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 24":  {
        "id": "SEC 24",
        "name": "Security 24 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 22":  {
        "id": "SEC 22",
        "name": "Security 22 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 21":  {
        "id": "SEC 21",
        "name": "Security 21 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 19":  {
        "id": "SEC 19",
        "name": "Security 19 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      },
      "SEC 20":  {
        "id": "SEC 20",
        "name": "Security 20 name",
        "isin": "bla isin",
        "pxDate": "2015-07-24",
        "class": "US EQUITIES"
      }
    },
    "prices": {
      "SEC 1":  {
        "id": "SEC 1",
        "history": {
          "2015-07-24": {
            "px": 5850.35,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 2":  {
        "id": "SEC 2",
        "history": {
          "2015-07-24": {
            "px": 47.57,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 3":    {
        "id": "SEC 3",
        "history": {
          "2015-07-24": {
            "px": 742.11,
            "pxDate": "2015-07-24"
          }
        }
       },
      "SEC 4": {
        "id": "SEC 4",
        "history": {
          "2015-07-24": {
            "px": 33.43,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 5":  {
        "id": "SEC 5",
        "history": {
          "2015-07-24": {
            "px": 63.72,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 6":  {
        "id": "SEC 6",
        "history": {
          "2015-07-24": {
            "px": 11825.52,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 7":  {
        "id": "SEC 7",
        "history": {
          "2015-07-24": {
            "px": 109.67,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 15":  {
        "id": "SEC 15",
        "history": {
          "2015-07-24": {
            "px": 1195.78,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 8":  {
        "id": "SEC 8",
        "history": {
          "2015-07-24": {
            "px": 1140.79,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 9":  {
        "id": "SEC 9",
        "history": {
          "2015-07-24": {
            "px": 1127.66,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 16":  {
        "id": "SEC 16",
        "history": {
          "2015-07-24": {
            "px": 1468.29,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 17":  {
        "id": "SEC 17",
        "history": {
          "2015-07-24": {
            "px": 1129.51,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 10":  {
        "id": "SEC 10",
        "history": {
          "2015-07-24": {
            "px": 1195.78,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 25":  {
        "id": "SEC 25",
        "history": {
          "2015-07-24": {
            "px": 13.028,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 18":  {
        "id": "SEC 18",
        "history": {
          "2015-07-24": {
            "px": 214.72,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 11":  {
        "id": "SEC 11",
        "history": {
          "2015-07-24": {
            "px": 28.75,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 12":  {
        "id": "SEC 12",
        "history": {
          "2015-07-24": {
            "px": 28.59,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 13":  {
        "id": "SEC 13",
        "history": {
          "2015-07-24": {
            "px": 216.57,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 14":  {
        "id": "SEC 14",
        "history": {
          "2015-07-24": {
            "px": 10.21,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 26":  {
        "id": "SEC 26",
        "history": {
          "2015-07-24": {
            "px": 28.42,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 27":  {
        "id": "SEC 27",
        "history": {
          "2015-07-24": {
            "px": 21.61,
            "pxDate": "2015-07-24"
          }
        }
      },
      "GOLD":  {
        "id": "GOLD",
        "history": {
          "2015-07-24": {
            "px": 105.35,
            "pxDate": "2015-07-24"
          }
        }
      },
      "OIL":  {
        "id": "OIL",
        "history": {
          "2015-07-24": {
            "px": 16.03,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 28":  {
        "id": "SEC 28",
        "history": {
          "2015-07-24": {
            "px": 25.03,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 29":  {
        "id": "SEC 29",
        "history": {
          "2015-07-24": {
            "px": 26.25,
            "pxDate": "2015-07-24"
          }
        }
      },
      "MONEY MARKET":  {
        "id": "MONEY MARKET",
        "history": {
          "2015-07-24": {
            "px": 1.16,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 23":  {
        "id": "SEC 23",
        "history": {
          "2015-07-24": {
            "px": 184.30,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 24":  {
        "id": "SEC 24",
        "history": {
          "2015-07-24": {
            "px": 39.73,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 22":  {
        "id": "SEC 22",
        "history": {
          "2015-07-24": {
            "px": 36.44,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 21":  {
        "id": "SEC 21",
        "history": {
          "2015-07-24": {
            "px": 56.64,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 19":  {
        "id": "SEC 19",
        "history": {
          "2015-07-24": {
            "px": 59.38,
            "pxDate": "2015-07-24"
          }
        }
      },
      "SEC 20":  {
        "id": "SEC 20",
        "history": {
          "2015-07-24": {
            "px": 208.00,
            "pxDate": "2015-07-24"
          }
        }
      }

    }
  }; // end return
} // end function
