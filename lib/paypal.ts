const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

const paypal = {
    createOrder: async (price: number) => {
        const accessToken = await generateAccessToken();
        const response = await fetch(`${base}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{
                    amount: {
                        currency_code: "USD",
                        value: price,
                    },
                }],
            }),
        });
        return handleResponse(response);
    },
    getOrder: async (orderId: string) => {
        const accessToken = await generateAccessToken();
        const response = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return handleResponse(response);
    },
    captureOrder: async (orderId: string) => {
        const accessToken = await generateAccessToken();
        const response = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return handleResponse(response);
    },
}

async function generateAccessToken() {
    const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
    if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET) {
        throw new Error("Missing PayPal credentials");
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString("base64"); // base64 encode the client id and secret

    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${auth}`,
        },
        body: "grant_type=client_credentials",
    });
    const jsonData = await handleResponse(response);
    return jsonData.access_token;
}

export default paypal;
export { generateAccessToken };

 async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    return response.json();
}