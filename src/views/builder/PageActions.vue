<template>
  <div class="container text-left">

    <legend id="headingOne" class="mt-xl-5">Custom Actions<button type="button" class="pull-right m-1 btn btn-primary" data-toggle="modal" data-target="#noteModal"><i class="fa fa-plus"></i> New</button>
    </legend>

    <table class="table table-hover">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Title</th>
        <th scope="col">Description</th>
        <th scope="col">Enabled</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Set `Has Facility``</td>
        <td>Set has_facility to true</td>
        <td><i class="fa fa-times"></i></td>
      </tr>
      </tbody>
    </table>

    <legend id="headingOne" class="mt-xl-5">Built-in Actions</legend>

    <table class="table table-hover">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Title</th>
        <th scope="col">Description</th>
        <th scope="col">Enabled</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Row Attribute Blue</td>
        <td>Adds a blue badge to the dashboard row</td>
        <td><i class="fa fa-check"></i></td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Email Administrator</td>
        <td>Sends an email to the workspace administrator</td>
        <td><i class="fa fa-check"></i></td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Send To Another Workspace</td>
        <td>Brings up the 'entry' dialog for the other workspace and has a send button. Can be transferred (remove from this workspace), or copied (keep in this workspace).</td>
        <td><i class="fa fa-check"></i></td>
      </tr>
      </tbody>
    </table>



  </div>
</template>

<script>
export default {
  name: "PageActions",
  components: {
  },
}
</script>

<style scoped>

</style>