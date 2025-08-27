import { generateAccessToken } from "../lib/paypal";
import paypal from "../lib/paypal";

// Test to generate access token
test("should generate access token from paypal", async () => {
    const accessToken = await generateAccessToken();
    console.log(accessToken, "accessToken");
    expect(accessToken).toBeDefined();
    expect(typeof accessToken).toBe('string');
    expect(accessToken.length).toBeGreaterThan(0);
});

// Test to create a paypal order
test("should create a paypal order", async () => {
    const price = 100.00;
    const orderResponse = await paypal.createOrder(price);

    console.log(orderResponse, "orderResponse");
    expect(orderResponse).toHaveProperty('id');
    expect(orderResponse).toHaveProperty('status', 'CREATED');
    expect(orderResponse.status).toBe('CREATED');
});

// Test to capture payment with mock order
test("simulate capturing a payment from an order", async () => {
    const orderId = "1234567890";
    const mockCapturePayment = jest
        .spyOn(paypal, 'captureOrder')
        .mockResolvedValue({
            status: "COMPLETED",
        });

    
    const captureResponse = await paypal.captureOrder(orderId);
    expect(captureResponse).toHaveProperty('status', 'COMPLETED');

    mockCapturePayment.mockRestore();
});