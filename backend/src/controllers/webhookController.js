const deliveryUpdate = async (req, res) => {
  console.log("Incoming webhook:", JSON.stringify(req.body, null, 2));
  res.status(200).json({ message: "Webhook received - implementation needed" });
};

module.exports = {
  deliveryUpdate,
};
