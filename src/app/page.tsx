"use client"

import CheckoutForm from "@/components/checkout-form";
import PaymentForm from "@/components/paymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Home() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(async (result) => {
      var { clientSecret } = await result.json();
      setClientSecret(clientSecret);
    });
  }, []);

  return (
    <>
      <Elements stripe={stripePromise} options={{ clientSecret: "pi_3PjcMOP3vuBuq1wS0ti9Bkih_secret_cwebGdPr8lWUsbcQnZXqnxSET" }}>
        <CheckoutForm />
      </Elements>

    </>
  );
}
