
<template>
  <div class="max-w-4xl w-full">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 flex items-center space-x-3">
        <span class="text-purple-500">➕</span>
        <span>Add New Template</span>
      </h1>
      <p class="text-gray-600 mt-2">Create a new email template for future use</p>
    </div>

    <!-- Form Card -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <form @submit.prevent="addTemplate" class="space-y-6">
        <!-- Subject Input -->
        <div>
          <label for="subject-input" class="block text-sm font-semibold text-gray-700 mb-2">
            Email Subject
          </label>
          <input
            id="subject-input"
            v-model="subject"
            type="text"
            placeholder="Enter email subject line"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
            required
          />
        </div>

        <!-- Body Textarea -->
        <div>
          <label for="body-textarea" class="block text-sm font-semibold text-gray-700 mb-2">
            Email Body
          </label>
          <textarea
            id="body-textarea"
            v-model="body"
            placeholder="Enter your email content here...

Example:
Dear Customer,

Thank you for your interest in our services.

Best regards,
Your Team"
            rows="10"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-y"
            required
          />
          <!-- <div class="text-sm text-gray-500 mt-2 space-y-1">
            <p>✨ <strong>Formatting tips:</strong></p>
            <ul class="ml-4 space-y-1">
              <li>• Use line breaks for new lines</li>
              <li>• Double line breaks create new paragraphs</li>
              <li>• HTML tags are also supported for advanced formatting</li>
            </ul>
          </div> -->
        </div>

        <!-- File Attachments -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Attachments (Optional)
          </label>

          <!-- File Upload Area -->
          <div
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            @dragleave="isDragging = false"
            @dragenter="isDragging = true"
            :class="[
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
              isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
            ]"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
              @change="handleFileSelect"
              class="hidden"
            />

            <div class="space-y-2">
              <div class="text-4xl">📎</div>
              <div class="text-gray-600">
                <p class="font-medium">Drop files here or click to browse</p>
                <p class="text-sm">Supports: Images, PDFs, Office docs, Text files, ZIP (Max 10MB each)</p>
              </div>
              <button
                type="button"
                @click="$refs.fileInput.click()"
                class="inline-flex items-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Choose Files
              </button>
            </div>
          </div>

          <!-- Selected Files List -->
          <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
            <h4 class="text-sm font-medium text-gray-700">Selected Files:</h4>
            <div class="space-y-2">
              <div
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div class="flex items-center space-x-3">
                  <span class="text-2xl">{{ getFileIcon(file.type) }}</span>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="removeFile(index)"
                  class="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <span class="text-lg">🗑️</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="!subject || !body || saving"
            class="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span v-if="!saving" class="text-lg">💾</span>
            <span v-else class="text-lg animate-spin">⏳</span>
            <span>{{ saving ? 'Saving...' : 'Save Template' }}</span>
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
      <span v-else>❌</span>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      subject: '',
      body: '',
      selectedFiles: [],
      isDragging: false,
      saving: false,
      message: '',
      messageType: 'success'
    };
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

    async addTemplate() {
      if (!this.subject || !this.body) return;

      this.saving = true;
      this.message = '';

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('subject', this.subject);
        formData.append('body', this.body);

        // Add files to FormData
        this.selectedFiles.forEach(file => {
          formData.append('attachments', file);
        });

        await axios.post('http://localhost:8000/templates', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.message = 'Template saved successfully!';
        this.messageType = 'success';
        this.subject = '';
        this.body = '';
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
        console.error('Error saving template:', error);
        this.messageType = 'error';
        this.message = 'Failed to save template. Please try again.';
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>


