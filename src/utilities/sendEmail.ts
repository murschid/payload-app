import * as Brevo from '@getbrevo/brevo'

export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  const apiInstance = new Brevo.TransactionalEmailsApi()
  
  // Configure API key authorization: apiKey
  apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '')

  const sendSmtpEmail = new Brevo.SendSmtpEmail()

  sendSmtpEmail.subject = subject
  sendSmtpEmail.htmlContent = htmlContent
  sendSmtpEmail.sender = { 
    name: process.env.MAIL_SENDER_NAME || 'Payload CMS', 
    email: process.env.MAIL_SENDER_ADDRESS || 'rajcsediu@gmail.com' 
  }
  sendSmtpEmail.to = [{ email: to }]

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('Email sent successfully. Returned data: ' + JSON.stringify(data))
    return data
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
