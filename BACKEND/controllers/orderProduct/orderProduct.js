import Order from "../../models/Customer/order.model.js";

const orderProduct = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }  
}; 

module.exports = orderProduct;
