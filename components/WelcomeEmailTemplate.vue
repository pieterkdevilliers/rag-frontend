<template>
  <!-- This is the root element we will grab -->
  <div class="email-container">
    <h1 style="color: #333;">Welcome to Our Service, {{ organisationName }}!</h1>
    <p style="font-family: Arial, sans-serif; font-size: 16px;">
      Thank you for creating an account with us. We're excited to have you on board.
    </p>
    <p>This is a demonstration of sending an HTML email directly from a Vue component.</p>
    <a 
      href="https://yourdocsai.app/login" 
      style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;"
    >
      Login to Your Account
    </a>
    <br><br>
    <p>Best regards,</p>
    <p><strong>The Team</strong></p>
  </div>
</template>

<script setup>
// This component accepts the dynamic data as props
defineProps({
  organisationName: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
/* Scoped styles won't be included in the final HTML. 
   Therefore, all styling for emails MUST be inline CSS. */
.email-container {
  /* This style is just for viewing in the browser, it won't be in the email */
  border: 1px dashed grey;
  padding: 20px;
  display: none; /* Hide the component from the user's view */
}
</style>