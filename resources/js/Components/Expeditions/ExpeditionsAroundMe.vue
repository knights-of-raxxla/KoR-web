<template>
    <div class="container">
        <div class="card" style="width: 100%; margin-top: 30px;">
            <div class="card-header">
                Expeditions around me
            </div>
            <loader :loaded="states.ready"></loader>
            <div class="card-body" v-show="states.ready">
                <div class="row">
                    <div class="col">

                        <form @prevent.default>
                            <div class="form-group">
                                <label>Reference system (my current system)</label>
                                <model-list-select
                                    :list="options.systems"
                                    option-value="id"
                                    option-text="name"
                                    v-model="form.ref_system_id"
                                    placeholder="search a system"
                                    @searchchange="searchSystem"
                                ></model-list-select>
                            </div>
                            <input type="button"
                            value="Search"
                            v-on:click="submit"
                            :disabled="!form.ref_system || !form.ref_system.id"
                            class="btn btn-primary" />
                        </form>
                    </div>
                </div>
                <div class="row" v-show="results.length && states.ready">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>
                                    Distance
                                </th>
                                <th>
                                    System
                                </th>
                                <th>
                                    Expedition
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in results">
                                <td>
                                    {{row.distance.toFixed()}} Ly
                                </td>
                                <td>
                                    {{row.system_name}}
                                </td>
                                <td>
                                    <a :href="'/expeditions/' + row.expedition_id + '?filter=' + row.system_id">
                                        {{row.expedition_name}}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import ExpeditionsApi from '../../API/ExpeditionsApi.js';
    import InputChange from '../../Components/Utils/InputChange.js';
    const expeApi = new ExpeditionsApi();
    let searchSystemChange = new InputChange();
    export default {
        data() {
            return {
                form: {
                    ref_system_id: null,
                    ref_system: {}
                },
                results: [],
                states: {
                    ready: true,
                },
                options: {
                    systems: []
                }
            }
        },
        watch: {
            'form.ref_system_id': {
                handler(id) {
                    let system = _.find(this.options.systems, {id}) || {};
                    this.form.ref_system = system;
                }
            }
        },
        methods: {
            searchSystem(text) {
                if (!text || text.length < 2) return;
                searchSystemChange.watch().then(() => {
                    expeApi.searchSystem(text)
                    .then(systems => {
                        this.options.systems = systems;
                    });
                });
            },
            submit() {
                let data = this.form.ref_system;
                this.states.ready = false;
                expeApi.findExpeditionsAroundMe(data)
                    .then(res => {
                        this.results = res;
                        this.states.ready = true;
                    });
            }
        }
    }
</script>
