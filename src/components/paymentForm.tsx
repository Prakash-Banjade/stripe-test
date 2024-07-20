"use client"

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYWthc2hiYW5qYWRlQGdtYWlsLmNvbSIsImFjY291bnRJZCI6ImFiOTM0YmJmLTdlZjQtNDU0Yy05Y2NiLWZmNjMwOTg3YWMwMiIsInVzZXJJZCI6Ijk0ZjU2OTA0LWMxOWQtNGRjZS04MzNkLWQ2Y2QxYzBmMDNlZSIsIm5hbWUiOiJQcmFrYXNoIEJhaGFkdXIgQmFuamFkZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIxNDY5NDAxLCJleHAiOjE3MjE1NTU4MDF9._QsPNyc7IrAoif06OxnZVK8Uw6C92zqNipy9Ml89J3o"

export default function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();

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
            });

            if (resposne.paymentIntent?.status !== 'succeeded') throw new Error('Payment failed');

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

        <form onSubmit={onSubmit}>
            <CardElement />
            <button type="submit">Submit</button>
        </form>
    )
}