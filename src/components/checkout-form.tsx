"use client"

import { PaymentElement } from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "./ui/button";
import axios from "axios";

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYWthc2hiYW5qYWRlQGdtYWlsLmNvbSIsImFjY291bnRJZCI6ImFiOTM0YmJmLTdlZjQtNDU0Yy05Y2NiLWZmNjMwOTg3YWMwMiIsInVzZXJJZCI6Ijk0ZjU2OTA0LWMxOWQtNGRjZS04MzNkLWQ2Y2QxYzBmMDNlZSIsIm5hbWUiOiJQcmFrYXNoIEJhaGFkdXIgQmFuamFkZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIxNDY5NDAxLCJleHAiOjE3MjE1NTU4MDF9._QsPNyc7IrAoif06OxnZVK8Uw6C92zqNipy9Ml89J3o"

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null | undefined>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsProcessing(true);

        const response = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: ``,
            },
        });

        console.log(response)

        if (response.error?.type === "card_error" || response.error?.type === "validation_error") {
            setMessage(response.error?.message);
        } else {
            setMessage("An unexpected error occured.");
        }

        setIsProcessing(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="max-w-[400px] mx-auto my-20">
            <PaymentElement id="payment-element" />
            <Button disabled={isProcessing || !stripe || !elements} id="submit" className="mt-5 w-full">
                <span id="button-text">
                    {isProcessing ? "Processing ... " : "Pay now"}
                </span>
            </Button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}