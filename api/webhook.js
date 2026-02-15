export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Log the incoming request body to Vercel console
        console.log('Webhook Received:', req.body);

        // Return success response
        return res.status(200).json({ success: true });
    } else {
        // Handle any non-POST requests
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
