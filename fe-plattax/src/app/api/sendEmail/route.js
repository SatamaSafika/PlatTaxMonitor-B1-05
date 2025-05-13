import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { to, subject, message } = await req.json();

    // Kirim email menggunakan SendGrid
    await sendgrid.send({
      to,
      from: "plattax.monitor@gmail.com", // Email pengirim yang sudah diverifikasi
      subject,
      html: message,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
