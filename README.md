#### sslcommerz local run proof of concept

sslcommerz transaction works in 3 steps:
- first the backend starts a session from calling sslcommerz using the library. Here it will pass a lot of information and get a session id in response, and also a redirection to sslcommerz hosted payment page(we can also redirect to own hosted payment page with sslcommerz widget)
- then sslcommerz will call a POST api(/ipn route) of backend and give all the information for second check and also the validation_id
- finally the validation_id is sent back from backend to sslcommerz and the transaction is validated

Here, `GET localhost:3030/init` will start session. Now, a local server cannot have its /ipn route open for sslcommerz to call. So we simulate the call using `curl -X POST -H 'Content-Type':'application/json'  --data @ipn_post.json localhost:3030/ipn`. 
This will do the third step also, but since we do not have a valid validation id from sslcommerz, transaction fails. Next step would be putting the code in a server to test the /ipn route.