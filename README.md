#### sslcommerz local run proof of concept

sslcommerz transaction works in 3 steps:
- first the backend starts a session from calling sslcommerz using the library. Here it will pass a lot of information and get a session id in response, and also a redirection to sslcommerz hosted payment page(we can also redirect to own hosted payment page with sslcommerz widget)
- then sslcommerz will call a POST api(/ipn route) of backend and give all the information for second check and also the validation_id
- finally the validation_id is sent back from backend to sslcommerz and the transaction is validated

Here, `GET localhost:3030/init` will start session. Now, a local server cannot have its /ipn route open for sslcommerz to call. So we simulate the call using `curl -X POST -H 'Content-Type':'application/json'  --data @ipn_post.json localhost:3030/ipn`. 
This will do the third step also, but since we do not have a valid validation id from sslcommerz, transaction fails. Next step would be putting the code in a server to test the /ipn route.

##### Render Hosted Version(CURRENT):

Here a `GET https://sslcommerz-poc.onrender.com/init` request will simulate the whole process. First backend will POST sslcommerz server to start a session. SSLCommerz will give a response and POST on the backend /ipn route. Now we should match the transaction details we sent in first POST and the details sslcommerz sent back in /ipn route. If they match we validate using a val_id field from the data sslcommerz sent, POSTing this field and other data to sslcommerz. A successful transaction will redirect to https://sslcommerz-poc.onrender.com/success page, cancel will redirect to https://sslcommerz-poc.onrender.com/cancel page and failed transactions will redirect to https://sslcommerz-poc.onrender.com/fail page. 

**Testing Credit Cards, OTPs**
- VISA
Card Number: 4111111111111111
Exp: 12/25
CVV: 111
- Mastercard
Card Number: 5111111111111111
Exp: 12/25
CVV: 111
- American Express
Card Number: 371111111111111
Exp: 12/25
CVV: 111
- Mobile OTP: 111111 or 123456
  
**Note** we are simulating the sslcommerz hosted pages method for convenience. It can also be embedded in our own UI.
