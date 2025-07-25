import express from "express";
import Stripe from "stripe";
const router = express.Router();
const stripe = new Stripe(
  "sk_test_51RooWw24lTC9QJi5GwJ6aHUUBLeSYz5tlr78HwU87KSqm3GPXsSuAE3kidVaISc50kVAH6hirss1ryKfgL5zeLwx00VQLLRneX"
);

// Replace with your actual Stripe price IDs
const priceIds = {
  Pro: "price_1RoooG24lTC9QJi5gnfW8Ux5",
  Premium: "price_1Rooln24lTC9QJi5Xb56pvo0",
};

router.post("/create-checkout-session", async (req, res) => {
  const { plan } = req.body;
  const priceId = priceIds[plan];
  if (!priceId) return res.status(400).json({ error: "Invalid plan" });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/plans",
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
