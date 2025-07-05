<template>
  <div class="app-container flex bg-gray-50">
    <!-- Fixed Sidebar -->
    <div class="fixed left-0 top-0 w-64 h-full bg-white shadow-xl border-r border-gray-200 z-10 hidden lg:block">
      <div class="h-full flex flex-col">
        <div class="p-6">
          <div class="flex items-center space-x-3 mb-8">
            <img
              src="/logo.jpg"
              alt="MailBot Logo"
              class="w-10 h-10 rounded-lg object-cover shadow-sm"
            />
            <h1 class="text-xl font-bold text-gray-800">Mail Bot</h1>
          </div>

          <nav class="space-y-2">
            <button
              @click="activeComponent = 'MailStatus'"
              :class="[
                'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
                activeComponent === 'MailStatus'
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <span class="text-lg">📋</span>
              <span class="font-medium">Email List</span>
            </button>

            <button
              @click="activeComponent = 'SendMail'"
              :class="[
                'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
                activeComponent === 'SendMail'
                  ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <span class="text-lg">📤</span>
              <span class="font-medium">Send Mail</span>
            </button>

            <button
              @click="activeComponent = 'AddTemplate'"
              :class="[
                'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
                activeComponent === 'AddTemplate'
                  ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <span class="text-lg">➕</span>
              <span class="font-medium">Add Template</span>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-20">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center space-x-3">
          <img
            src="/logo.jpg"
            alt="MailBot Logo"
            class="w-8 h-8 rounded-lg object-cover shadow-sm"
          />
          <h1 class="text-lg font-bold text-gray-800">Mail Bot</h1>
        </div>
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 text-gray-600 hover:text-gray-900">
          <span class="text-xl">☰</span>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="border-t border-gray-200 bg-white">
        <nav class="p-4 space-y-2">
          <button
            @click="activeComponent = 'MailStatus'; mobileMenuOpen = false"
            :class="[
              'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
              activeComponent === 'MailStatus'
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <span class="text-lg">📋</span>
            <span class="font-medium">Email List</span>
          </button>

          <button
            @click="activeComponent = 'SendMail'; mobileMenuOpen = false"
            :class="[
              'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
              activeComponent === 'SendMail'
                ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <span class="text-lg">📤</span>
            <span class="font-medium">Send Mail</span>
          </button>

          <button
            @click="activeComponent = 'AddTemplate'; mobileMenuOpen = false"
            :class="[
              'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
              activeComponent === 'AddTemplate'
                ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <span class="text-lg">➕</span>
            <span class="font-medium">Add Template</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content with left margin to account for fixed sidebar -->
    <div class="flex-1 lg:ml-64 min-h-screen">
      <div class="p-4 lg:p-8 w-full pt-20 lg:pt-8">
        <component :is="activeComponent" />
      </div>
    </div>
  </div>
</template>

<script>
import AddTemplate from './components/AddTemplate.vue';
import SendMail from './components/SendMail.vue';
import MailStatus from './components/MailStatus.vue';

export default {
  components: {
    AddTemplate,
    SendMail,
    MailStatus
  },
  data() {
    return {
      activeComponent: 'MailStatus', // Default to Email List
      mobileMenuOpen: false
    };
  }
};
</script>
