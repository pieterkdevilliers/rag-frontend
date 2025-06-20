////////////////////////////////////////////////////////
// New Account Welcome Email
////////////////////////////////////////////////////////

// Define an interface for the data our template needs
interface WelcomeEmailData {
  organisationName: string;
}

/**
 * Generates the HTML content for the welcome email.
 * @param data - The data to inject into the template.
 * @returns The full HTML string for the email body.
 */
export function getWelcomeEmailHtml(data: WelcomeEmailData): string {
  // Use a template literal to build the HTML string.
  // All styles MUST be inline for email client compatibility.
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
      <h1 style="color: #333;">Welcome to YourDocsAI for ${data.organisationName}!</h1>
      <p style="font-size: 16px; color: black">
        Thank you for creating an account with us. We're excited to have you on board.
      </p>
      <p style="font-size: 16px; color: black">
        You can now start uploading your documents and interacting with your AI assistant.
        Then simply add the web-widget to your website in order to prove support to your visitors.
      </p>
      <a 
        href="https://yourdocsai.app/login" 
        style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #ec4899; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"
      >
        Your Account Login
      </a>
      <br><br>
      <p style="font-size: 16px; color: black">If you have any question, please reply to this email and I'll get back to you.</p>
      <br><br>
      <td align="left" width="560" class="esd-container-frame es-m-p15b">
          <table cellpadding="3" cellspacing="0" width="100%" class="es-table-not-adapt">
            <tbody>
              <tr>
                <td width="86" align="left" valign="top" class="esd-block-image" style="font-size: 0px">
                  <a target="_blank" href="">
                    <img src="https://d31env5c5sjhq3.cloudfront.net/static/profile.jpg" width="100" alt="" class="adapt-img">
                  </a>
                </td>
                <td align="left">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tbody>
                      <tr>
                        <td align="left" class="esd-block-text es-text-5114">
                          <h2 class="es-text-mobile-size-20 es-override-size" style="color: black;">
                            Pieter K de Villiers
                          </h2>
                          <p style="font-size: 16px; color: black">
                            Creator of YourDocsAI
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
    </div>
  `;
}



////////////////////////////////////////////////////////
// New User Welcome Email
////////////////////////////////////////////////////////

// Define an interface for the data our template needs
interface UserWelcomeEmailData {
  organisationName: string;
}

/**
 * Generates the HTML content for the welcome email.
 * @param data - The data to inject into the template.
 * @returns The full HTML string for the email body.
 */
export function getUserWelcomeEmailHtml(data: UserWelcomeEmailData): string {
  // Use a template literal to build the HTML string.
  // All styles MUST be inline for email client compatibility.
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
      <h1 style="color: #333;">You've been invited to YourDocsAI for ${data.organisationName}!</h1>
      <p style="font-size: 16px; color: black">
        Someone at ${data.organisationName} just added you to the YourDocsAI account.
      </p>
      <p style="font-size: 16px; color: black">
        You can now start uploading documents, interacting with the AI assistant, as well as configure the web-chat widget for the account.
      </p>
      <a 
        href="https://yourdocsai.app/login" 
        style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #ec4899; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"
      >
        Your Account Login
      </a>
      <br><br>
      <p style="font-size: 16px; color: black">If you have any question, please reply to this email and I'll get back to you.</p>
      <br><br>
      <td align="left" width="560" class="esd-container-frame es-m-p15b">
          <table cellpadding="3" cellspacing="0" width="100%" class="es-table-not-adapt">
            <tbody>
              <tr>
                <td width="86" align="left" valign="top" class="esd-block-image" style="font-size: 0px">
                  <a target="_blank" href="">
                    <img src="https://d31env5c5sjhq3.cloudfront.net/static/profile.jpg" width="100" alt="" class="adapt-img">
                  </a>
                </td>
                <td align="left">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tbody>
                      <tr>
                        <td align="left" class="esd-block-text es-text-5114">
                          <h2 class="es-text-mobile-size-20 es-override-size" style="color: black;">
                            Pieter K de Villiers
                          </h2>
                          <p style="font-size: 16px; color: black">
                            Creator of YourDocsAI
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
    </div>
  `;
}