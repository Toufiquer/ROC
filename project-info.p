Help me to generate a proper prompt in details. and you can add features if I forgot some.

I will working in NextJS with typescript and also working with PWA. 
I want working with following instruction. 
1. look at the csv 
    ```
    "Date","Price","Open","High","Low","Vol.","Change %"
    "12/31/2021","0.8299","0.8387","0.8535","0.8029","457.62M","-1.04%"
    "12/30/2021","0.8387","0.8168","0.8586","0.8042","502.92M","2.72%"
    "12/29/2021","0.8165","0.8516","0.8644","0.8118","574.42M","-4.07%"
    "12/28/2021","0.8511","0.9266","0.9268","0.8457","604.16M","-8.11%"
    "12/27/2021","0.9262","0.9197","0.9550","0.9152","442.48M","0.70%"
    "12/26/2021","0.9198","0.9252","0.9331","0.9057","313.23M","-0.59%"
    "12/25/2021","0.9252","0.9106","0.9334","0.8992","464.59M","1.61%"
    "12/24/2021","0.9106","0.9939","0.9959","0.8938","998.32M","-8.39%"
    "12/23/2021","0.9940","0.9537","1.0161","0.9387","967.00M","4.21%"
    "12/22/2021","0.9538","0.9468","0.9723","0.9243","772.54M","0.73%"
    "12/21/2021","0.9469","0.8796","0.9604","0.8531","888.15M","7.78%"
    "12/20/2021","0.8786","0.8351","0.9136","0.8250","1.05B","5.21%"
    "12/19/2021","0.8351","0.8264","0.8479","0.8197","326.03M","1.05%"
    "12/18/2021","0.8264","0.7975","0.8341","0.7912","333.85M","3.63%"
    ```
2. The main focus of our app
    - Get research on data in the difference in percent for (high-low) price.
    - get a summary of daily, weekly, monthly, and yearly summaries (High, low, and difference between high and low)
    - toggle between daily, weekly, monthly, yearly summary 
    - tab for each item.
    - I will implement more currencies in CSV, like BTC, ETH, and more. 
    - Need a tab for currency and an import button for CSV with that data.

    - mobile-friendly. 
        - four buttons at the bottom, and those do the four tasks.

        a. home: path='/'
            - Write details for the project. and how to use it. with a pop-up button named documentation.
            - summary of all data. (total data, total currency, data size)

        a. finance: path='/finance'
        - There is a button at the top of the page named Add New.
        - I can add, edit, view, and delete all data.
        - the list will show currency name, leverage, grid, amount, upper limit, lower limit,

        a. summary: path='/summary'
        - tab for each currency 
        - and there only show a summary of data. like (total days, start date, end date)
        - get data from zustand.
        - I can select research date range 
        - Can see the difference in percent for (high-low)


        a. settings: path='/settings'
        - tab for each currency
        - Each currency has a button for uploading data (CSV). 
        - and there only show a summary of data. like (total days, start date, end date)
        - Take those data and save it to local storage with Zustand. We will use this data in other tabs.