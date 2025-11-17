<script setup></script>

 <template>
  <div class="min-h-screen flex flex-col">
    <header class="h-10 bg-gray-800 text-white flex items-center justify-between px-4">
      <h1 class="text-sm font-semibold">Header</h1>
      <button class="text-xs bg-blue-600 px-2 py-1 rounded">Button</button>
    </header>

    <main class="flex-1 p-4 bg-gray-100">
       <router-view />
    </main>

    <footer class="h-10 bg-gray-800 text-white text-center text-xs flex items-center justify-center">
      Footer
    </footer>
  </div>

</template>

<style scoped></style>
