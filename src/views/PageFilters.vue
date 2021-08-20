<template>
  <div class="container text-left">
    <FilterTree></FilterTree>

    <legend id="headingOne" class="mt-xl-5">
      Custom Filters<button
        type="button"
        class="pull-right m-1 btn btn-primary"
        data-toggle="modal"
        data-target="#noteModal"
      >
        <i class="fa fa-plus"></i> New
      </button>
    </legend>

    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Type</th>
          <th scope="col">Enabled</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Triage</td>
          <td>Main Dashboard</td>
          <td><i class="fa fa-check"></i></td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>CET</td>
          <td>Dashboard</td>
          <td><i class="fa fa-check"></i></td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Cigna</td>
          <td>Dashboard</td>
          <td><i class="fa fa-times"></i></td>
        </tr>
      </tbody>
    </table>

    <legend id="headingOne" class="mt-xl-5">Built-in Filters</legend>

    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">In Use By</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Is High Utilizer?</td>
          <td>If the client passes high-utilizer criteria</td>
          <td><i class="fa fa-check"></i></td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>DUP Check</td>
          <td>
            Check if the entry is a potential duplicate give fname, lname and
            DOB
          </td>
          <td><i class="fa fa-check"></i></td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Attrition</td>
          <td>How old the entry is</td>
          <td><i class="fa fa-times"></i></td>
        </tr>
      </tbody>
    </table>

    <div class="row">
      <div class="col-8">
        <FilterBuilder></FilterBuilder>
      </div>
      <div class="col">
        <form>
          <div class="form-group">
            <label for="inputEmail3">Title</label>
            <input
              type="email"
              class="form-control"
              id="inputEmail3"
              placeholder="Email"
            />
          </div>
          <div class="form-group">
            <label for="inputPassword3">Property</label>
            <input
              type="password"
              class="form-control"
              id="inputPassword3"
              placeholder="Password"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import FilterBuilder from "@/components/FilterBuilder";
import FilterTree from "@/components/FilterTree";

export default {
  name: "PageFilters",
  components: {
    FilterTree,
    FilterBuilder,
  },
};
</script>

<style scoped></style>
