<template>
  <div class="max-w-4xl w-full">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 flex items-center space-x-3">
        <span class="text-green-500">📤</span>
        <span>Send Email</span>
      </h1>
      <p class="text-gray-600 mt-2">Send an email using one of your saved templates</p>
    </div>

    <!-- Form Card -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <form @submit.prevent="sendMail" class="space-y-6">
        <!-- Receiver Email -->
        <div>
          <label for="receiver-email" class="block text-sm font-semibold text-gray-700 mb-2">
            Receiver Email Address
          </label>
          <input
            id="receiver-email"
            v-model="to"
            type="email"
            placeholder="Enter recipient's email address"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            required
          />
        </div>

        <!-- Template Selection -->
        <div>
          <label for="template-select" class="block text-sm font-semibold text-gray-700 mb-2">
            Email Template
          </label>
          <select
            id="template-select"
            v-model="selectedTemplate"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            required
          >
            <option disabled value="">Choose a template</option>
            <option v-for="t in templates" :key="t._id" :value="t._id">
              {{ t.subject }}{{ t.attachments && t.attachments.length > 0 ? ` (${t.attachments.length} file${t.attachments.length > 1 ? 's' : ''})` : '' }}
            </option>
          </select>

          <!-- Template Attachments Preview -->
          <div v-if="selectedTemplateData && selectedTemplateData.attachments && selectedTemplateData.attachments.length > 0" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 class="text-sm font-medium text-green-800 mb-2">📎 Template includes {{ selectedTemplateData.attachments.length }} attachment{{ selectedTemplateData.attachments.length > 1 ? 's' : '' }}:</h4>
            <div class="space-y-1">
              <div v-for="attachment in selectedTemplateData.attachments" :key="attachment.filename" class="text-xs text-green-700 flex items-center space-x-2">
                <span>{{ getFileIcon(attachment.mimetype) }}</span>
                <span>{{ attachment.originalName }}</span>
                <span class="text-green-600">({{ formatFileSize(attachment.size) }})</span>
              </div>
            </div>
          </div>
          <p v-if="templates.length === 0" class="text-sm text-amber-600 mt-2 flex items-center space-x-1">
            <span>⚠️</span>
            <span>No templates available. Create one first!</span>
          </p>
        </div>

        

        <!-- Send Button -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="!to || !selectedTemplate || sending"
            class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span v-if="!sending" class="text-lg">📤</span>
            <span v-else class="text-lg animate-spin">⏳</span>
            <span>{{ sending ? 'Sending...' : 'Send Email' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" :class="[
      'mt-6 p-4 rounded-lg flex items-center space-x-2',
      messageType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
    ]">
      <span v-if="messageType === 'success'">✅</span>
      <!-- <span v-else">❌</span> -->
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      to: '',
      templates: [],
      selectedTemplate: '',
      selectedFiles: [],
      isDragging: false,
      sending: false,
      message: '',
      messageType: 'success'
    };
  },
  async mounted() {
    const res = await axios.get('http://localhost:8000/templates');
    this.templates = res.data;
  },
  computed: {
    selectedTemplateData() {
      return this.templates.find(t => t._id === this.selectedTemplate);
    }
  },
  methods: {
    handleFileSelect(event) {
      const files = Array.from(event.target.files);
      this.addFiles(files);
    },

    handleDrop(event) {
      event.preventDefault();
      this.isDragging = false;
      const files = Array.from(event.dataTransfer.files);
      this.addFiles(files);
    },

    addFiles(files) {
      const validFiles = files.filter(file => {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
          return false;
        }

        // Check file type
        const allowedTypes = [
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
          'application/pdf',
          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain', 'text/csv',
          'application/zip', 'application/x-zip-compressed'
        ];

        if (!allowedTypes.includes(file.type)) {
          alert(`File type "${file.type}" is not supported.`);
          return false;
        }

        return true;
      });

      // Add valid files to selection (avoid duplicates)
      validFiles.forEach(file => {
        if (!this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
          this.selectedFiles.push(file);
        }
      });

      // Limit to 5 files total
      if (this.selectedFiles.length > 5) {
        this.selectedFiles = this.selectedFiles.slice(0, 5);
        alert('Maximum 5 files allowed. Only the first 5 files were selected.');
      }
    },

    removeFile(index) {
      this.selectedFiles.splice(index, 1);
    },

    getFileIcon(mimeType) {
      if (mimeType.startsWith('image/')) return '🖼️';
      if (mimeType === 'application/pdf') return '📄';
      if (mimeType.includes('word')) return '📝';
      if (mimeType.includes('excel') || mimeType.includes('sheet')) return '📊';
      if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️';
      if (mimeType.startsWith('text/')) return '📃';
      if (mimeType.includes('zip')) return '🗜️';
      return '📎';
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    async sendMail() {
      if (!this.to || !this.selectedTemplate) return;

      this.sending = true;
      this.message = '';

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('to', this.to);
        formData.append('templateId', this.selectedTemplate);

        // Add additional files to FormData
        this.selectedFiles.forEach(file => {
          formData.append('attachments', file);
        });

        await axios.post('http://localhost:8000/send', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.message = 'Email sent successfully!';
        this.messageType = 'success';
        this.to = '';
        this.selectedTemplate = '';
        this.selectedFiles = [];

        // Clear file input
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }

        // Clear message after 5 seconds
        setTimeout(() => {
          this.message = '';
        }, 5000);

      } catch (error) {
        console.error('Error sending email:', error);
        this.messageType = 'error';

        if (error.response && error.response.data && error.response.data.message) {
          this.message = `Error: ${error.response.data.message}`;
        } else {
          this.message = 'Failed to send email. Please try again.';
        }
      } finally {
        this.sending = false;
      }
    }
  }
};
</script>


