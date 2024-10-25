import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

export const POST = async (request: NextRequest) => {
  try {
    const { title, amountInCents, customerId , Email} = await request.json();

    if (!title || !amountInCents || !customerId ) {
      throw new Error("Missing required fields: title, amountInCents, or customerId.");
    }

    const customer = await stripe.customers.create({
        email: Email,
      });

    const checkOutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      mode: "payment",
      success_url: "http://localhost:3000/success?token=" + customer.id, // URL de succès
      cancel_url: "http://localhost:3000/cancel?token=" + customer.id, 
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "EUR",
            unit_amount: amountInCents,
            product_data: {
              name: title,
            },
          },
        },
      ],
    });

    console.log("Checkout session created:", checkOutSession.url);
    return NextResponse.json({ msg: "Session created", url: checkOutSession.url }, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
