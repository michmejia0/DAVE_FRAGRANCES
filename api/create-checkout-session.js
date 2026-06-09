const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {

    const { items } = req.body;

    const line_items = items.map(item => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.qty
    }));

    const session =
      await stripe.checkout.sessions.create({

        payment_method_types: [
          'card'
        ],

        mode: 'payment',

        line_items,

        success_url:
          'https://dave-fragrances.vercel.app/',

        cancel_url:
          'https://dave-fragrances.vercel.app/'
      });

    res.json({
      id: session.id
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};
