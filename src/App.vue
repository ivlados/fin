<script setup>
import Proto from './components/Proto.vue'
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';

DataTable.use(DataTablesCore);
</script>

<template>
  <Proto></Proto>
</template>

<style>
@import 'bootstrap';
@import 'datatables.net-bs5';
</style>
