"use client"

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { Button } from "./ui/button";
import { useState } from "react";

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYWthc2hiYW5qYWRlQGdtYWlsLmNvbSIsImFjY291bnRJZCI6ImFiOTM0YmJmLTdlZjQtNDU0Yy05Y2NiLWZmNjMwOTg3YWMwMiIsInVzZXJJZCI6Ijk0ZjU2OTA0LWMxOWQtNGRjZS04MzNkLWQ2Y2QxYzBmMDNlZSIsIm5hbWUiOiJQcmFrYXNoIEJhaGFkdXIgQmFuamFkZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIxNDY5NDAxLCJleHAiOjE3MjE1NTU4MDF9._QsPNyc7IrAoif06OxnZVK8Uw6C92zqNipy9Ml89J3o"

export default function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        const cardElement = elements?.getElement("card");

        try {
            if (!stripe || !cardElement) return null;

            const { data } = await axios.post("http://localhost:8001/api/orders", {
                paymentMethod: "stripe"
            }, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
            });

            const clientSecret = data?.client_secret;

            if (!clientSecret) throw new Error("Client secret not found");

            const resposne = await stripe?.confirmCardPayment(data.client_secret, {
                payment_method: { card: cardElement },
                receipt_email: "rKp8Z@example.com",
                shipping: {
                    name: "John Doe",
                    address: {
                        country: "US",
                        line1: "123 Main St",
                        city: "San Francisco",
                        postal_code: "94105",
                        line2: "Apt 1",
                        state: "CA",
                    }
                }
            });

            if (resposne.paymentIntent?.status !== 'succeeded') {
                setErr("Payment failed");
                return;
            };

            const { id, payment_method } = resposne.paymentIntent

            const { data: confirmResponseData } = await axios.post("http://localhost:8001/api/payments/confirm", {
                paymentIntentId: id,
                paymentMethod: payment_method,
            }, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
            });

            console.log(confirmResponseData);

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <section className="container my-20 flex flex-col items-center justify-center gap-4">
            {
                err ? <p className="text-red-500">{err}</p> : null
            }
            <form
                onSubmit={onSubmit}
                className="w-[400px] flex flex-col gap-4"
            >
                <CardElement
                />
                <Button disabled={!stripe}>Pay Now</Button>
            </form>
        </section>
    )
}