<template>
  <div class="privacy-policy-container">

    <h1>Privacy Policy for YourDocsAI</h1>
    <p><strong>Effective Date:</strong> 7 July 2025</p>

    <p>
      Welcome to YourDocsAI ("we," "us," or "our"). We provide a Software-as-a-Service (SaaS) application that allows our customers ("Customers") to add a web widget to their websites. This widget enables their visitors and customers ("End-Users") to interact with documents and content provided by our Customers.
    </p>

    <p>
      This Privacy Policy explains how we collect, use, and protect information in relation to our services. It applies to our website, www.yourdocsai.app, and the services we provide, including the web widget.
    </p>

    <h2>1. Information We Collect</h2>
    <p>We collect information in two distinct ways: information from our Customers and information processed on behalf of our Customers.</p>

    <h4>a) Information We Collect from Our Customers</h4>
    <p>
      When you, as our Customer, create an account and use our services, we collect information necessary to provide you with access to your account and manage our business relationship. This information includes:
    </p>
    <ul>
      <li><strong>Account Information:</strong> Your name, email address, company name, and password. This is used to create and secure your account.</li>
      <li><strong>Billing Information:</strong> To process payments for our service, we may collect billing details. This information is securely handled by our third-party payment processors (e.g., Stripe, PayPal), and we do not store your full credit card information on our servers.</li>
      <li><strong>Customer-Provided Content:</strong> The documents, text, and other data you upload to your account for our service to process and make available to your End-Users through the web widget.</li>
    </ul>

    <h4>b) Information We Process on Behalf of Our Customers (End-User Data)</h4>
    <p>
      Our core principle is to protect the privacy of your End-Users. We are a data processor for the interactions that happen within the web widget on your website.
    </p>
    <ul>
      <li><strong>We DO NOT store personal details of your End-Users.</strong></li>
      <li>
        <strong>Transient Processing of Queries:</strong> When an End-User types a question into the widget, that query is sent to our back-end RAG (Retrieval-Augmented Generation) application. We process this query in real-time to retrieve relevant information from your uploaded documents and generate a response.
      </li>
      <li>
        <strong>Long-Term Storage:</strong> The queries from End-Users and the generated responses are processed anonymously. We store these conversations in an anonymous format, without associating them with an IP address, or creating profiles of your End-Users. The information exists only in order for you to access inside your account, in order to review chat history.
      </li>
    </ul>

    <h2>2. How We Use Your Information</h2>
    <p>We use the information we collect for the following purposes:</p>
    <ul>
      <li>To provide, operate, and maintain our services.</li>
      <li>To manage your Customer account, including processing payments and sending you service-related communications.</li>
      <li>To respond to your inquiries, support requests, and comments.</li>
      <li>To monitor the performance and security of our systems to prevent fraudulent activity and ensure service availability.</li>
      <li>To comply with legal obligations and enforce our terms of service.</li>
    </ul>
    
    <h2>3. Cookies and Tracking Technologies</h2>
    <p>
      We believe in a privacy-focused experience. We do not use cookies or other tracking technologies to track our Customers' actions on our website for advertising or analytics purposes.
    </p>
    <p>
      We may use essential session cookies which are strictly necessary for the functionality of our service, for example, to keep you logged into your account. These cookies are not used for tracking and are deleted when you log out.
    </p>

    <h2>4. How We Share Information</h2>
    <p>We do not sell, rent, or trade your personal information. We may share information with third-party service providers only for the purposes of operating our business, under strict confidentiality agreements. These include:</p>
    <ul>
      <li><strong>Cloud Hosting Providers:</strong> Our application and data (including the documents you upload) are hosted on secure cloud infrastructure (e.g., Amazon Web Services, Google Cloud).</li>
      <li><strong>AI Model Providers:</strong> To provide the RAG functionality, End-User queries and relevant segments of your documents are sent to third-party AI service providers (e.g., OpenAI, Anthropic) for processing. We have data processing agreements with these providers to ensure data is handled securely and is not used to train their models.</li>
      <li><strong>Payment Processors:</strong> To handle payments for our services.</li>
    </ul>
    <p>We may also disclose information if required by law, subpoena, or other legal process.</p>

    <h2>5. Data Security</h2>
    <p>
      We implement a variety of security measures to maintain the safety of your personal information and the content you upload. We use industry-standard encryption for data in transit and at rest. However, no electronic transmission or storage method is 100% secure, and we cannot guarantee its absolute security.
    </p>

    <h2>6. Data Retention</h2>
    <p>We retain your Customer account information as long as your account is active or as needed to provide you with services. We will delete your account information and uploaded documents upon your request or after a period of inactivity as defined in our terms of service.</p>
    <p>As stated above, we do not retain any personal information or queries from your End-Users.</p>

    <h2>7. Your Data Rights</h2>
    <p>As our Customer, you have certain rights regarding your personal information. You can:</p>
    <ul>
      <li>Access, update, or correct your account information through your account settings.</li>
      <li>Request the deletion of your account and all associated data.</li>
    </ul>
    <p>To exercise these rights, please contact us at info@yourdocsai.app</p>

    <h2>8. Children's Privacy</h2>
    <p>Our services are not directed to individuals under the age of 13, and we do not knowingly collect personal information from children under 13.</p>

    <h2>9. Changes to This Privacy Policy</h2>
    <p>
      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. We encourage you to review this Privacy Policy periodically for any changes.
    </p>

    <h2>10. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us at:</p>
    <p>
      YourDocsAI<br>
      Email: info@yourdocsai.app
    </p>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
};
</script>