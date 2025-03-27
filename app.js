const express = require("express");
const bodyparser = require("body-parser");
const app = express();

const SSLCommerzPayment = require("sslcommerz-lts");
require("dotenv").config();
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASWD;
const is_live = false; //true for live, false for sandbox

const port = 3030;
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true })); // support encoded bodies

app.get("/", (req, res) => {
    res.json({
        "message": "welcome to sslcommerz testing server, server is still running."
    })
});

app.post("/success", (req, res) => {
    console.log("PRINTING IN /success ROUTE");
    console.log(req.body);
    res.json({ "Message": "got your success call, check logs" });
})
app.post("/cancel", (req, res) => {
    console.log("PRINTING IN /cancel ROUTE");
    console.log(req.body);
    res.json({ "Message": "got your cancel call, check logs" });
})
app.post("/fail", (req, res) => {
    console.log("PRINTING IN /fail ROUTE");
    console.log(req.body);
    res.json({ "Message": "got your failure call, check logs" });
})
//sslcommerz init
app.get("/init", (req, res) => {
    const data = {
        total_amount: 100,
        currency: "BDT",
        tran_id: "REF123", // use unique tran_id for each api call
        success_url: "https://sslcommerz-poc.onrender.com/success",
        fail_url: "https://sslcommerz-poc.onrender.com/fail",
        cancel_url: "https://sslcommerz-poc.onrender.com/cancel",
        ipn_url: "https://sslcommerz-poc.onrender.com/ipn",
        shipping_method: "NO",
        product_name: "brainlytic.",
        product_category: "Online_course",
        product_profile: "non-physical-goods",
        cus_name: "Customer Name",
        cus_email: "customer@example.com",
        cus_add1: "Dhaka",
        cus_phone: "01812345678",
        
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
    // console.log(req.method)
    // console.log(req.headers)
    console.log(req.body);
    const data = {
        val_id: req.body.val_id, //that you go from sslcommerz response
        store_id: store_id,
        store_passwd: store_passwd
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.validate(data).then((data) => {
        //process the response that got from sslcommerz
        // https://developer.sslcommerz.com/doc/v4/#order-validation-api
        console.log("Printing validation reply from sslcommerz:\n");
        console.log(data);
    });
    res.json({ "message": "got your info, check logs" });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
