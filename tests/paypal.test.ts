import {generateAccessToken} from "@/lib/paypal";

test('generate paypal paypal', async () => {
    const tokenResponse = await generateAccessToken();
    console.log(tokenResponse);
    expect(typeof tokenResponse).toBe('string');
    expect(tokenResponse.length).toBeGreaterThan(0);
});