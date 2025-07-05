const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function testTemplates() {
  try {
    console.log('🧪 Testing Template System\n');

    // Test 1: Get existing templates
    console.log('1. Fetching existing templates...');
    try {
      const response = await axios.get(`${BASE_URL}/templates`);
      console.log(`✅ Templates API working`);
      console.log(`📊 Found ${response.data.length} templates:`);
      
      if (response.data.length === 0) {
        console.log('   No templates found in database\n');
      } else {
        response.data.forEach((template, index) => {
          console.log(`   ${index + 1}. ${template.subject} (ID: ${template._id})`);
        });
        console.log('');
      }
    } catch (error) {
      console.log(`❌ Error fetching templates: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data)}`);
      }
      if (error.code) {
        console.log(`   Error Code: ${error.code}`);
      }
      console.log('');
      return;
    }

    // Test 2: Create a sample template
    console.log('2. Creating a sample template...');
    try {
      const newTemplate = {
        subject: 'Welcome to Our Service',
        body: `Dear Customer,

Welcome to our amazing service! We're excited to have you on board.

Here's what you can expect:
- 24/7 customer support
- Regular updates and new features
- A community of like-minded users

If you have any questions, feel free to reach out to us.

Best regards,
The Team`
      };

      const createResponse = await axios.post(`${BASE_URL}/templates`, newTemplate);
      console.log(`✅ Template created successfully!`);
      console.log(`   ID: ${createResponse.data._id}`);
      console.log(`   Subject: ${createResponse.data.subject}\n`);
    } catch (error) {
      console.log(`❌ Error creating template: ${error.message}\n`);
    }

    // Test 3: Fetch templates again to verify
    console.log('3. Fetching templates again to verify...');
    try {
      const response = await axios.get(`${BASE_URL}/templates`);
      console.log(`✅ Templates API working`);
      console.log(`📊 Now found ${response.data.length} templates:`);
      
      response.data.forEach((template, index) => {
        console.log(`   ${index + 1}. ${template.subject} (ID: ${template._id})`);
      });
      console.log('');
    } catch (error) {
      console.log(`❌ Error fetching templates: ${error.message}\n`);
    }

    console.log('🎯 Template system test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Refresh your frontend application');
    console.log('2. Go to "Send Mail" section');
    console.log('3. Templates should now appear in the dropdown');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTemplates();
