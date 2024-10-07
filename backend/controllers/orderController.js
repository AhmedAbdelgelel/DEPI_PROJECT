import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

//placing orders using COD Method
const placeOrder = async (req,res) => {
    try {
        const {userId,items,amount,address} = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            PaymentMethod:"COD",
            payment:false,
            date:Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndDelete(userId, {cartData:{}})

        res.json({success:true, message:"Order Placed"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {

}

//placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {

}

//All orders date for Admin Panel

const allOrders = async (req,res) => {

}

//User Order Data for frontend
const userOrders = async (req,res) => {
    try {
        
        const{userId} = req.body
        const orders = await orderModel.find({ userId })
        res.json({success: true, orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }
}

//update order status from Admin Panel
const updateStatus = async (req,res) => {

}

export { allOrders, placeOrder, placeOrderRazorpay, placeOrderStripe, updateStatus, userOrders };

