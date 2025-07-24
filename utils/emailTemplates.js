export function generateVerificationCodeMessage(otpCode) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="padding: 30px;">
          <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
          <p style="font-size: 16px; color: #555;">
            Hello, thank you for using our service. Please use the verification code below to complete your login or transaction:
          </p>
          <div style="font-size: 24px; font-weight: bold; color: #2c3e50; background-color: #eaf4fc; padding: 15px; text-align: center; border-radius: 6px; letter-spacing: 2px;">
            ${otpCode}
          </div>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">
            This code is valid for the next 10 minutes. Do not share it with anyone.
          </p>
          <p style="font-size: 14px; color: #777;">
            If you didn’t request this code, please ignore this message or contact support.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            &copy; ${new Date().getFullYear()} Librey Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
}