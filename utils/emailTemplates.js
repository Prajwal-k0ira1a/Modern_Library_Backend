export function generateVerificationCodeMessage(otpCode) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; margin: 0; line-height: 1.2;">
          Verification Code
        </h1>
      </div>
      
      <div style="margin-bottom: 32px;">
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5; margin: 0;">
          Use this code to complete your verification:
        </p>
      </div>
      
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px 32px;">
          <span style="font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; font-size: 32px; font-weight: 600; color: #1a1a1a; letter-spacing: 4px;">
            ${otpCode}
          </span>
        </div>
      </div>
      
      <div style="margin-bottom: 40px;">
        <p style="color: #6b7280; font-size: 14px; line-height: 1.4; margin: 0;">
          This code expires in 10 minutes. Keep it confidential.
        </p>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} Librey Inc.
        </p>
      </div>
    </div>
  `;
}