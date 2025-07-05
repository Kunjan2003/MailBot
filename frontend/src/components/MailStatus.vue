
<template>
  <div class="w-full">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <span class="text-blue-500">📋</span>
          <span>Email List</span>
        </h1>
        <p class="text-gray-600 mt-2">Track all your sent emails and their status</p>
      </div>

      <button
        @click="refreshMails"
        :disabled="loading"
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="!loading" class="text-lg">🔄</span>
        <span v-else class="text-lg animate-spin">⏳</span>
        <span>{{ loading ? 'Loading...' : 'Refresh' }}</span>
      </button>
    </div>



    <!-- Email Statistics -->
    <div v-if="!loading && mails.length > 0" class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span class="text-blue-600 text-2xl">📧</span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Emails</p>
            <p class="text-2xl font-bold text-gray-900">{{ mails.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-600 text-lg">Loading emails...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="mails.length === 0" class="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
      <div class="text-6xl mb-6">📭</div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">No emails sent yet</h3>
      <p class="text-gray-600 mb-6">Start by creating a template and sending your first email!</p>
      <div class="flex justify-center space-x-4">
        <button
          @click="$parent.activeComponent = 'AddTemplate'"
          class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          ➕ Create Template
        </button>
        <button
          @click="$parent.activeComponent = 'SendMail'"
          class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          📤 Send Email
        </button>
      </div>
    </div>

    <!-- Email Table -->
    <div v-else class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-full">
          <thead class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <tr>
              <th class="px-3 lg:px-6 py-4 text-left text-sm font-semibold">Receiver</th>
              <th class="px-3 lg:px-6 py-4 text-left text-sm font-semibold">Subject</th>
              <th class="px-3 lg:px-6 py-4 text-left text-sm font-semibold">Attachments</th>
              <th class="px-3 lg:px-6 py-4 text-left text-sm font-semibold">Sent Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="mail in mails" :key="mail._id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-3 lg:px-6 py-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span class="text-blue-600 text-sm">📧</span>
                  </div>
                  <div class="font-medium text-gray-900 truncate">{{ mail.to }}</div>
                </div>
              </td>
              <td class="px-3 lg:px-6 py-4">
                <div class="text-gray-900 font-medium truncate">{{ mail.subject }}</div>
              </td>
              <td class="px-3 lg:px-6 py-4">
                <div v-if="mail.attachments && mail.attachments.length > 0" class="flex items-center space-x-1">
                  <span class="text-gray-600">📎</span>
                  <span class="text-xs text-gray-600">{{ mail.attachments.length }} file{{ mail.attachments.length > 1 ? 's' : '' }}</span>
                </div>
                <div v-else class="text-gray-400 text-xs">
                  No attachments
                </div>
              </td>
              <td class="px-3 lg:px-6 py-4 text-gray-500 text-xs lg:text-sm">
                {{ formatDate(mail.sentAt || mail.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer -->
      <div class="bg-gray-50 px-3 lg:px-6 py-3 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          Total: {{ mails.length }} email{{ mails.length !== 1 ? 's' : '' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      mails: [],
      loading: false,
      autoRefreshInterval: null
    };
  },
  async mounted() {
    await this.loadMails();
    // Auto-refresh every 30 seconds
    this.autoRefreshInterval = setInterval(() => {
      this.loadMails();
    }, 30000);
  },
  beforeDestroy() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  },
  methods: {
    async loadMails() {
      this.loading = true;
      try {
        const res = await axios.get('http://localhost:8000/status');
        this.mails = res.data;
      } catch (error) {
        console.error('Error loading mails:', error);
        alert('Failed to load emails. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    async refreshMails() {
      await this.loadMails();
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
};
</script>


