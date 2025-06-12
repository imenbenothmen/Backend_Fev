const Order = require('../models/orderSchema');
const Cart = require('../models/cartSchema');
const Product = require('../models/productSchema');


exports.getAllOrders = async (req, res) => {
  console.log("📦 [getAllOrders] Route appelée"); // ✅ Vérifie si on entre ici

  try {
    const orders = await Order.find()
      .populate('client', 'email')
      .populate('products.product', 'price');

    console.log("✅ Commandes récupérées :", orders.length); // Affiche le nombre de commandes
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Erreur dans getAllOrders :", error); // Affiche l'erreur dans le terminal
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes",
      error: error.message,
    });
  }
};




exports.addOrder = async (req, res) => {
  try {
    const { client, products, total } = req.body;

    if (!client || !products || !Array.isArray(products) || products.length === 0 || !total) {
      return res.status(400).json({ message: "Champs manquants ou invalides" });
    }

    const newOrder = new Order({
      client,
      products,
      total,
      status: 'En attente'
    });

    await newOrder.save();
    res.status(201).json({ message: 'Commande ajoutée avec succès', order: newOrder });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de la commande", error: error.message });
  }
};




// Create order from user's cart
exports.createOrder = async (req, res) => {
  try {
    const { clientId } = req.body;

    const cart = await Cart.findOne({ client: clientId }).populate('products.product');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    const products = cart.products.map(p => ({
      product: p.product._id,
      quantity: p.quantity,
      price: p.product.price,
    }));

    const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

    const order = new Order({
      client: clientId,
      products,
      total,
    });

    await order.save();

    cart.products = [];
    await cart.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error while creating the order', error });
  }
};

// Get all orders by client
exports.getOrdersByClient = async (req, res) => {
  try {
    const orders = await Order.find({ client: req.params.clientId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this client' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error while retrieving orders', error });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const validStatuses = ['En attente', 'traitée', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = Date.now();

    await order.save();
    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error while updating order status', error });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel shipped or delivered order' });
    }

    order.status = 'cancelled';
    order.updatedAt = Date.now();

    await order.save();
    res.status(200).json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: 'Error while cancelling the order', error });
  }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('products.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching order details', error });
  }
};

// Track order status
exports.trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Error while tracking order', error });
  }
};

// Notify status change (email/SMS)
// ⚠️ You must implement your own mail and SMS service here
exports.notifyStatusChange = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const user = await User.findById(order.userId);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password-or-app-password',
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Your order status has been updated',
      text: `Order ${orderId} status changed to ${order.status}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Email sending error', error });
      }
    });

    smsService.sendSMS(user.phone, `Order ${orderId} status changed to ${order.status}`);

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending notification', error });
  }
};

// Modify an order before shipment
exports.modifyOrderBeforeShipment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { products } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot modify shipped or delivered order' });
    }

    order.products = products;
    await order.save();

    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating the order', error });
  }
};

// User's order history
exports.getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history', error });
  }
};

// Get a specific order's details
exports.getOrderDetailsById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error });
  }
};
