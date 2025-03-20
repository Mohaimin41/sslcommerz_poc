const express = require("express");
const bodyparser = require("body-parser");
const app = express();

const SSLCommerzPayment = require("sslcommerz-lts");
require("dotenv").config();
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASWD;
const is_live = false; //true for live, false for sandbox

const port = 3030;
app.use(bodyparser.json())
//sslcommerz init
app.get("/init", (req, res) => {
    const data = {
        total_amount: 100,
        currency: "BDT",
        tran_id: "REF123", // use unique tran_id for each api call
        success_url: "http://localhost:3030/success",
        fail_url: "http://localhost:3030/fail",
        cancel_url: "http://localhost:3030/cancel",
        ipn_url: "http://localhost:3030/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: "customer@example.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
        console.log("Printing init response from sslcommerz:\n");
        console.log(apiResponse);
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        res.redirect(GatewayPageURL);
        console.log("\nRedirecting to: ", GatewayPageURL);
    });
});

//sslcommerz validation

app.get("/validate", (req, res) => {
    const data = {
        val_id: 'ADGAHHGDAKJ456454', //that you go from sslcommerz response
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.validate(data).then((data) => {
        //process the response that got from sslcommerz
        // https://developer.sslcommerz.com/doc/v4/#order-validation-api
        console.log("Printing validation reply from sslcommerz:\n");
        console.log(data);
    });
});

app.post("/ipn", (req, res) => {
    console.log("Printing ipn request from sslcommerz:\n");
    console.log(req.body);
    const data = {
        val_id: 'ADGAHHGDAKJ456454', //that you go from sslcommerz response
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.validate(data).then((data) => {
        //process the response that got from sslcommerz
        // https://developer.sslcommerz.com/doc/v4/#order-validation-api
        console.log("Printing validation reply from sslcommerz:\n");
        console.log(data);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
